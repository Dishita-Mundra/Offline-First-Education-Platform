import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  deleteLocalBookmark,
  deleteLocalNote,
  getAllOfflinePackages,
  getLocalBookmarksForUser,
  getLocalNotesForUser,
  getLocalProgressForUser,
  getLocalQuizAttemptsForUser,
  getUserSyncQueue,
  removeOfflinePackage,
  saveLocalBookmark,
  saveLocalNote,
  saveLocalProgress,
  saveLocalQuizAttempt,
  saveOfflinePackage,
  type DownloadedPackage,
} from '../offline/offlineDb';
import { enqueueSyncOperation, generateOperationId, runSyncQueue, type SyncRunResult } from '../offline/syncEngine';
import type {
  BookmarkRecord,
  CBSEChapter,
  LessonProgressRecord,
  PersonalNoteRecord,
  QuizAttemptRecord,
} from '../types/curriculum';
import { useAuth } from './AuthContext';

interface OfflineContextValue {
  isOnline: boolean;
  isSyncing: boolean;
  pendingSyncCount: number;
  lastSyncResult: SyncRunResult | null;
  downloadedPackages: DownloadedPackage[];
  progressList: LessonProgressRecord[];
  quizAttempts: QuizAttemptRecord[];
  notes: PersonalNoteRecord[];
  bookmarks: BookmarkRecord[];
  downloadChapter: (chapter: CBSEChapter) => Promise<void>;
  removeChapterDownload: (chapterId: string) => Promise<void>;
  recordLessonComplete: (params: {
    lessonId: string;
    classNumber: number;
    subjectName: string;
    chapterTitle?: string;
    timeSpentMinutes?: number;
  }) => Promise<void>;
  submitQuizAttempt: (params: {
    quizId: string;
    quizTitle: string;
    classNumber: number;
    subjectName: string;
    chapterId?: string;
    score: number;
    totalQuestions: number;
    passingScore?: number;
  }) => Promise<QuizAttemptRecord>;
  upsertNote: (params: {
    id?: string;
    classNumber: number;
    subjectName: string;
    chapterTitle?: string;
    title: string;
    content: string;
  }) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  toggleBookmark: (params: {
    lessonId: string;
    title: string;
    classNumber: number;
    subjectName: string;
  }) => Promise<boolean>;
  triggerManualSync: () => Promise<void>;
}

const OfflineContext = createContext<OfflineContextValue | null>(null);

export function OfflineProvider({ children }: { children: ReactNode }) {
  const { firebaseUser, profile, studentProfile, refreshProfile } = useAuth();
  const uid = firebaseUser?.uid ?? null;

  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [lastSyncResult, setLastSyncResult] = useState<SyncRunResult | null>(null);
  const [downloadedPackages, setDownloadedPackages] = useState<DownloadedPackage[]>([]);
  const [progressList, setProgressList] = useState<LessonProgressRecord[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttemptRecord[]>([]);
  const [notes, setNotes] = useState<PersonalNoteRecord[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkRecord[]>([]);

  const reloadLocalStores = useCallback(async (userId: string | null) => {
    const pkgs = await getAllOfflinePackages();
    setDownloadedPackages(pkgs);

    if (!userId) {
      setProgressList([]);
      setQuizAttempts([]);
      setNotes([]);
      setBookmarks([]);
      setPendingSyncCount(0);
      return;
    }

    const [prog, quizzes, userNotes, userBookmarks, queue] = await Promise.all([
      getLocalProgressForUser(userId),
      getLocalQuizAttemptsForUser(userId),
      getLocalNotesForUser(userId),
      getLocalBookmarksForUser(userId),
      getUserSyncQueue(userId),
    ]);

    setProgressList(prog);
    setQuizAttempts(quizzes.sort((a, b) => (b.localTimestamp ?? 0) - (a.localTimestamp ?? 0)));
    setNotes(userNotes.sort((a, b) => (b.localTimestamp ?? 0) - (a.localTimestamp ?? 0)));
    setBookmarks(userBookmarks);
    setPendingSyncCount(queue.filter((q) => q.status !== 'synced').length);
  }, []);

  const hydrateFromFirestore = useCallback(async (userId: string) => {
    if (!navigator.onLine) return;
    try {
      const [progSnap, quizSnap, notesSnap, bmSnap] = await Promise.all([
        getDocs(query(collection(db, 'lessonProgress'), where('userId', '==', userId))),
        getDocs(query(collection(db, 'quizAttempts'), where('userId', '==', userId))),
        getDocs(query(collection(db, 'personalNotes'), where('userId', '==', userId))),
        getDocs(query(collection(db, 'bookmarks'), where('userId', '==', userId))),
      ]);

      for (const d of progSnap.docs) {
        const data = d.data() as LessonProgressRecord;
        await saveLocalProgress({ ...data, syncStatus: 'synced', localTimestamp: Date.now() });
      }
      for (const d of quizSnap.docs) {
        const data = d.data() as QuizAttemptRecord;
        await saveLocalQuizAttempt({ ...data, syncStatus: 'synced', localTimestamp: Date.now() });
      }
      for (const d of notesSnap.docs) {
        const data = d.data() as PersonalNoteRecord;
        await saveLocalNote({ ...data, syncStatus: 'synced', localTimestamp: Date.now() });
      }
      for (const d of bmSnap.docs) {
        const data = d.data() as BookmarkRecord;
        await saveLocalBookmark(data);
      }
    } catch (err) {
      console.warn('Firestore hydration skipped or partial:', err);
    }
  }, []);

  const syncStudentStatsToFirestore = useCallback(
    async (userId: string, updatedProg: LessonProgressRecord[], updatedQuizzes: QuizAttemptRecord[]) => {
      if (!navigator.onLine || profile?.role !== 'student') return;
      const lessonsCompleted = updatedProg.filter((p) => p.completed).length;
      const avgQuizScore =
        updatedQuizzes.length > 0
          ? Math.round(updatedQuizzes.reduce((acc, q) => acc + q.percentage, 0) / updatedQuizzes.length)
          : 0;
      const passedCount = updatedQuizzes.filter((q) => q.passed).length;
      const xp = 50 + lessonsCompleted * 25 + updatedQuizzes.length * 15 + passedCount * 20;
      const badges: string[] = ['First Step'];
      if (lessonsCompleted >= 1) badges.push('Lesson Starter');
      if (lessonsCompleted >= 5) badges.push('Consistent Learner');
      if (passedCount >= 1) badges.push('Quiz Achiever');
      if (passedCount >= 5) badges.push('CBSE Master');
      if (downloadedPackages.length >= 1) badges.push('Offline Ready');

      try {
        await updateDoc(doc(db, 'studentProfiles', userId), {
          lessonsCompleted,
          avgQuizScore,
          xp,
          streakDays: Math.max(1, studentProfile?.streakDays ?? 1),
          badges,
          updatedAt: serverTimestamp(),
        });
        await refreshProfile();
      } catch (err) {
        console.warn('Could not sync student profile stats:', err);
      }
    },
    [downloadedPackages.length, profile?.role, refreshProfile, studentProfile?.streakDays]
  );

  const performSync = useCallback(async () => {
    if (!uid || !navigator.onLine) return;
    setIsSyncing(true);
    try {
      const result = await runSyncQueue(uid);
      setLastSyncResult(result);
      await hydrateFromFirestore(uid);
      await reloadLocalStores(uid);
      if (result.syncedCount > 0) {
        const [prog, quizzes] = await Promise.all([
          getLocalProgressForUser(uid),
          getLocalQuizAttemptsForUser(uid),
        ]);
        await syncStudentStatsToFirestore(uid, prog, quizzes);
      }
    } finally {
      setIsSyncing(false);
    }
  }, [hydrateFromFirestore, reloadLocalStores, syncStudentStatsToFirestore, uid]);

  useEffect(() => {
    void reloadLocalStores(uid);
    if (uid && navigator.onLine) {
      void performSync();
    }
  }, [uid, performSync, reloadLocalStores]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (uid) void performSync();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [performSync, uid]);

  const downloadChapter = async (chapter: CBSEChapter) => {
    await saveOfflinePackage(chapter);
    await reloadLocalStores(uid);
  };

  const removeChapterDownload = async (chapterId: string) => {
    await removeOfflinePackage(chapterId);
    await reloadLocalStores(uid);
  };

  const recordLessonComplete = async ({
    lessonId,
    classNumber,
    subjectName,
    chapterTitle,
    timeSpentMinutes = 15,
  }: {
    lessonId: string;
    classNumber: number;
    subjectName: string;
    chapterTitle?: string;
    timeSpentMinutes?: number;
  }) => {
    if (!uid) return;
    const progressId = `${uid}_${lessonId}`.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 150);
    const existing = progressList.find((p) => p.id === progressId);
    const record: LessonProgressRecord = {
      id: progressId,
      userId: uid,
      lessonId,
      classNumber,
      subjectName,
      chapterTitle: chapterTitle ?? '',
      completed: true,
      timeSpentMinutes: Math.max(existing?.timeSpentMinutes ?? 0, timeSpentMinutes),
      localTimestamp: Date.now(),
      syncStatus: 'pending',
    };

    await saveLocalProgress(record);
    await enqueueSyncOperation(uid, 'LESSON_PROGRESS', { ...record }, `prog_${progressId}`);
    await reloadLocalStores(uid);

    if (navigator.onLine) {
      await performSync();
    }
  };

  const submitQuizAttempt = async ({
    quizId,
    quizTitle,
    classNumber,
    subjectName,
    chapterId,
    score,
    totalQuestions,
    passingScore = 60,
  }: {
    quizId: string;
    quizTitle: string;
    classNumber: number;
    subjectName: string;
    chapterId?: string;
    score: number;
    totalQuestions: number;
    passingScore?: number;
  }): Promise<QuizAttemptRecord> => {
    const userId = uid ?? 'guest_offline';
    const operationId = generateOperationId('quiz');
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const attempt: QuizAttemptRecord = {
      id: operationId,
      operationId,
      userId,
      quizId,
      quizTitle,
      classNumber,
      subjectName,
      chapterId: chapterId ?? '',
      score,
      totalQuestions,
      percentage,
      passed: percentage >= passingScore,
      attemptedOffline: !navigator.onLine,
      localTimestamp: Date.now(),
      syncStatus: uid ? 'pending' : 'synced',
    };

    if (uid) {
      await saveLocalQuizAttempt(attempt);
      await enqueueSyncOperation(uid, 'QUIZ_ATTEMPT', { ...attempt }, operationId);
      await reloadLocalStores(uid);
      if (navigator.onLine) {
        await performSync();
      }
    }

    return attempt;
  };

  const upsertNote = async ({
    id,
    classNumber,
    subjectName,
    chapterTitle,
    title,
    content,
  }: {
    id?: string;
    classNumber: number;
    subjectName: string;
    chapterTitle?: string;
    title: string;
    content: string;
  }) => {
    if (!uid) return;
    const noteId = id ?? generateOperationId('note');
    const note: PersonalNoteRecord = {
      id: noteId,
      userId: uid,
      classNumber,
      subjectName,
      chapterTitle: chapterTitle ?? '',
      title,
      content,
      localTimestamp: Date.now(),
      syncStatus: 'pending',
    };
    await saveLocalNote(note);
    await enqueueSyncOperation(uid, 'NOTE_UPSERT', { ...note });
    await reloadLocalStores(uid);
    if (navigator.onLine) {
      await performSync();
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!uid) return;
    await deleteLocalNote(noteId);
    await enqueueSyncOperation(uid, 'NOTE_DELETE', { id: noteId });
    await reloadLocalStores(uid);
    if (navigator.onLine) {
      await performSync();
    }
  };

  const toggleBookmark = async ({
    lessonId,
    title,
    classNumber,
    subjectName,
  }: {
    lessonId: string;
    title: string;
    classNumber: number;
    subjectName: string;
  }): Promise<boolean> => {
    if (!uid) return false;
    const bmId = `${uid}_${lessonId}`.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 150);
    const exists = bookmarks.some((b) => b.id === bmId);

    if (exists) {
      await deleteLocalBookmark(bmId);
      await enqueueSyncOperation(uid, 'BOOKMARK_REMOVE', { id: bmId });
      await reloadLocalStores(uid);
      if (navigator.onLine) await performSync();
      return false;
    } else {
      const bm: BookmarkRecord = {
        id: bmId,
        userId: uid,
        lessonId,
        title,
        classNumber,
        subjectName,
      };
      await saveLocalBookmark(bm);
      await enqueueSyncOperation(uid, 'BOOKMARK_ADD', { ...bm });
      await reloadLocalStores(uid);
      if (navigator.onLine) await performSync();
      return true;
    }
  };

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        isSyncing,
        pendingSyncCount,
        lastSyncResult,
        downloadedPackages,
        progressList,
        quizAttempts,
        notes,
        bookmarks,
        downloadChapter,
        removeChapterDownload,
        recordLessonComplete,
        submitQuizAttempt,
        upsertNote,
        deleteNote,
        toggleBookmark,
        triggerManualSync: performSync,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const ctx = useContext(OfflineContext);
  if (!ctx) throw new Error('useOffline must be used inside OfflineProvider');
  return ctx;
}
