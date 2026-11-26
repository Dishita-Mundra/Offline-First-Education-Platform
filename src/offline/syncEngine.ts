import { deleteDoc, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  addToSyncQueue,
  getLocalProgressForUser,
  getLocalQuizAttemptsForUser,
  getOfflineDb,
  getUserSyncQueue,
  saveLocalProgress,
  saveLocalQuizAttempt,
  type SyncOpType,
  type SyncQueueItem,
} from './offlineDb';
import type { LessonProgressRecord, QuizAttemptRecord } from '../types/curriculum';

export function generateOperationId(prefix = 'op'): string {
  const rand = Math.random().toString(36).slice(2, 9);
  return `${prefix}_${Date.now()}_${rand}`;
}

export async function enqueueSyncOperation(
  userId: string,
  type: SyncOpType,
  payload: Record<string, unknown>,
  customOpId?: string
): Promise<SyncQueueItem> {
  const item: SyncQueueItem = {
    operationId: customOpId ?? generateOperationId(type.toLowerCase()),
    userId,
    type,
    payload,
    timestamp: Date.now(),
    status: 'pending',
    retryCount: 0,
  };
  await addToSyncQueue(item);
  return item;
}

export interface SyncRunResult {
  syncedCount: number;
  failedCount: number;
  pendingCount: number;
  errors: string[];
}

export async function runSyncQueue(userId: string): Promise<SyncRunResult> {
  if (!navigator.onLine || !auth.currentUser || auth.currentUser.uid !== userId) {
    const queue = await getUserSyncQueue(userId);
    const pending = queue.filter((q) => q.status !== 'synced').length;
    return { syncedCount: 0, failedCount: 0, pendingCount: pending, errors: [] };
  }

  const queue = await getUserSyncQueue(userId);
  const toProcess = queue
    .filter((item) => item.status === 'pending' || (item.status === 'failed' && item.retryCount < 4))
    .sort((a, b) => a.timestamp - b.timestamp);

  let syncedCount = 0;
  let failedCount = 0;
  const errors: string[] = [];
  const idb = await getOfflineDb();

  for (const op of toProcess) {
    try {
      await executeSingleSyncOp(op);
      const updatedOp: SyncQueueItem = { ...op, status: 'synced', lastError: undefined };
      await idb.put('syncQueue', updatedOp);
      syncedCount++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const updatedOp: SyncQueueItem = {
        ...op,
        status: 'failed',
        retryCount: op.retryCount + 1,
        lastError: msg,
      };
      await idb.put('syncQueue', updatedOp);
      failedCount++;
      errors.push(msg);
    }
  }

  // Update local records syncStatus
  if (syncedCount > 0) {
    const localProg = await getLocalProgressForUser(userId);
    for (const p of localProg) {
      if (p.syncStatus === 'pending') {
        await saveLocalProgress({ ...p, syncStatus: 'synced' });
      }
    }
    const localQuizzes = await getLocalQuizAttemptsForUser(userId);
    for (const q of localQuizzes) {
      if (q.syncStatus === 'pending') {
        await saveLocalQuizAttempt({ ...q, syncStatus: 'synced' });
      }
    }
  }

  const latestQueue = await getUserSyncQueue(userId);
  const pendingCount = latestQueue.filter((q) => q.status !== 'synced').length;

  return { syncedCount, failedCount, pendingCount, errors };
}

async function executeSingleSyncOp(op: SyncQueueItem): Promise<void> {
  const p = op.payload;

  switch (op.type) {
    case 'LESSON_PROGRESS': {
      const progressId = String(p.id);
      const path = `lessonProgress/${progressId}`;
      const ref = doc(db, 'lessonProgress', progressId);
      try {
        const existingSnap = await getDoc(ref);
        if (existingSnap.exists()) {
          const serverData = existingSnap.data() as LessonProgressRecord;
          const mergedCompleted = Boolean(serverData.completed || p.completed);
          const mergedMinutes = Math.max(Number(serverData.timeSpentMinutes || 0), Number(p.timeSpentMinutes || 0));
          await updateDoc(ref, {
            completed: mergedCompleted,
            timeSpentMinutes: mergedMinutes,
            updatedAt: serverTimestamp(),
          });
        } else {
          await setDoc(ref, {
            id: progressId,
            userId: op.userId,
            lessonId: String(p.lessonId),
            classNumber: Number(p.classNumber),
            subjectName: String(p.subjectName),
            chapterTitle: String(p.chapterTitle ?? ''),
            completed: Boolean(p.completed),
            timeSpentMinutes: Number(p.timeSpentMinutes ?? 15),
            updatedAt: serverTimestamp(),
          });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, path);
      }
      break;
    }

    case 'QUIZ_ATTEMPT': {
      const attemptId = String(p.operationId || op.operationId);
      const path = `quizAttempts/${attemptId}`;
      const ref = doc(db, 'quizAttempts', attemptId);
      try {
        // Idempotent check prevents duplicate quiz attempts across retries
        const existingSnap = await getDoc(ref);
        if (!existingSnap.exists()) {
          await setDoc(ref, {
            id: attemptId,
            operationId: attemptId,
            userId: op.userId,
            quizId: String(p.quizId).slice(0, 120),
            quizTitle: String(p.quizTitle).slice(0, 190),
            classNumber: Math.max(1, Math.min(10, Math.round(Number(p.classNumber) || 1))),
            subjectName: String(p.subjectName).slice(0, 75),
            chapterId: String(p.chapterId ?? '').slice(0, 120),
            score: Math.max(0, Math.min(100, Math.round(Number(p.score) || 0))),
            totalQuestions: Math.max(1, Math.min(100, Math.round(Number(p.totalQuestions) || 1))),
            percentage: Math.max(0, Math.min(100, Number(p.percentage) || 0)),
            passed: Boolean(p.passed),
            attemptedOffline: Boolean(p.attemptedOffline),
            createdAt: serverTimestamp(),
          } satisfies Omit<QuizAttemptRecord, 'localTimestamp' | 'syncStatus'>);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, path);
      }
      break;
    }

    case 'NOTE_UPSERT': {
      const noteId = String(p.id);
      const path = `personalNotes/${noteId}`;
      const ref = doc(db, 'personalNotes', noteId);
      try {
        const snap = await getDoc(ref);
        if (snap.exists()) {
          await updateDoc(ref, {
            classNumber: Number(p.classNumber),
            subjectName: String(p.subjectName),
            chapterTitle: String(p.chapterTitle ?? ''),
            title: String(p.title),
            content: String(p.content),
            updatedAt: serverTimestamp(),
          });
        } else {
          await setDoc(ref, {
            id: noteId,
            userId: op.userId,
            classNumber: Number(p.classNumber),
            subjectName: String(p.subjectName),
            chapterTitle: String(p.chapterTitle ?? ''),
            title: String(p.title),
            content: String(p.content),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, path);
      }
      break;
    }

    case 'NOTE_DELETE': {
      const noteId = String(p.id);
      const path = `personalNotes/${noteId}`;
      try {
        await deleteDoc(doc(db, 'personalNotes', noteId));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, path);
      }
      break;
    }

    case 'BOOKMARK_ADD': {
      const bmId = String(p.id);
      const path = `bookmarks/${bmId}`;
      const ref = doc(db, 'bookmarks', bmId);
      try {
        const existingSnap = await getDoc(ref);
        if (!existingSnap.exists()) {
          await setDoc(ref, {
            id: bmId,
            userId: op.userId,
            lessonId: String(p.lessonId),
            title: String(p.title),
            classNumber: Number(p.classNumber),
            subjectName: String(p.subjectName),
            createdAt: serverTimestamp(),
          });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, path);
      }
      break;
    }

    case 'BOOKMARK_REMOVE': {
      const bmId = String(p.id);
      const path = `bookmarks/${bmId}`;
      try {
        await deleteDoc(doc(db, 'bookmarks', bmId));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, path);
      }
      break;
    }
  }
}
