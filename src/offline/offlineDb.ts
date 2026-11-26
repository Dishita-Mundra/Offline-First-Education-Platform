import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type {
  BookmarkRecord,
  CBSEChapter,
  LessonProgressRecord,
  PersonalNoteRecord,
  QuizAttemptRecord,
} from '../types/curriculum';

export interface DownloadedPackage {
  id: string; // chapterId
  classNumber: number;
  subjectId: string;
  subjectName: string;
  title: string;
  chapter: CBSEChapter;
  downloadedAt: number;
  sizeBytes: number;
  videoCached: boolean;
}

export type SyncOpType =
  | 'LESSON_PROGRESS'
  | 'QUIZ_ATTEMPT'
  | 'NOTE_UPSERT'
  | 'NOTE_DELETE'
  | 'BOOKMARK_ADD'
  | 'BOOKMARK_REMOVE';

export interface SyncQueueItem {
  operationId: string;
  userId: string;
  type: SyncOpType;
  payload: Record<string, unknown>;
  timestamp: number;
  status: 'pending' | 'synced' | 'failed';
  retryCount: number;
  lastError?: string;
}

interface IndoAmericanSchoolDB extends DBSchema {
  packages: {
    key: string;
    value: DownloadedPackage;
    indexes: { 'by-class': number; 'by-subject': string };
  };
  progress: {
    key: string;
    value: LessonProgressRecord;
    indexes: { 'by-user': string };
  };
  quizAttempts: {
    key: string;
    value: QuizAttemptRecord;
    indexes: { 'by-user': string };
  };
  notes: {
    key: string;
    value: PersonalNoteRecord;
    indexes: { 'by-user': string };
  };
  bookmarks: {
    key: string;
    value: BookmarkRecord;
    indexes: { 'by-user': string };
  };
  syncQueue: {
    key: string;
    value: SyncQueueItem;
    indexes: { 'by-user': string; 'by-status': string };
  };
}

let dbPromise: Promise<IDBPDatabase<IndoAmericanSchoolDB>> | null = null;

export function getOfflineDb(): Promise<IDBPDatabase<IndoAmericanSchoolDB>> {
  if (!dbPromise) {
    dbPromise = openDB<IndoAmericanSchoolDB>('ias_offline_v1', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('packages')) {
          const pkgStore = db.createObjectStore('packages', { keyPath: 'id' });
          pkgStore.createIndex('by-class', 'classNumber');
          pkgStore.createIndex('by-subject', 'subjectId');
        }
        if (!db.objectStoreNames.contains('progress')) {
          const progStore = db.createObjectStore('progress', { keyPath: 'id' });
          progStore.createIndex('by-user', 'userId');
        }
        if (!db.objectStoreNames.contains('quizAttempts')) {
          const quizStore = db.createObjectStore('quizAttempts', { keyPath: 'operationId' });
          quizStore.createIndex('by-user', 'userId');
        }
        if (!db.objectStoreNames.contains('notes')) {
          const notesStore = db.createObjectStore('notes', { keyPath: 'id' });
          notesStore.createIndex('by-user', 'userId');
        }
        if (!db.objectStoreNames.contains('bookmarks')) {
          const bmStore = db.createObjectStore('bookmarks', { keyPath: 'id' });
          bmStore.createIndex('by-user', 'userId');
        }
        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { keyPath: 'operationId' });
          syncStore.createIndex('by-user', 'userId');
          syncStore.createIndex('by-status', 'status');
        }
      },
    });
  }
  return dbPromise;
}

export async function saveOfflinePackage(chapter: CBSEChapter): Promise<DownloadedPackage> {
  const db = await getOfflineDb();
  const jsonStr = JSON.stringify(chapter);
  const pkg: DownloadedPackage = {
    id: chapter.id,
    classNumber: chapter.classNumber,
    subjectId: chapter.subjectId,
    subjectName: chapter.subjectName,
    title: chapter.title,
    chapter,
    downloadedAt: Date.now(),
    sizeBytes: new Blob([jsonStr]).size,
    videoCached: true,
  };
  await db.put('packages', pkg);
  return pkg;
}

export async function removeOfflinePackage(chapterId: string): Promise<void> {
  const db = await getOfflineDb();
  await db.delete('packages', chapterId);
}

export async function getAllOfflinePackages(): Promise<DownloadedPackage[]> {
  const db = await getOfflineDb();
  return db.getAll('packages');
}

export async function getOfflinePackage(chapterId: string): Promise<DownloadedPackage | undefined> {
  const db = await getOfflineDb();
  return db.get('packages', chapterId);
}

export async function saveLocalProgress(record: LessonProgressRecord): Promise<void> {
  const db = await getOfflineDb();
  await db.put('progress', record);
}

export async function getLocalProgressForUser(userId: string): Promise<LessonProgressRecord[]> {
  const db = await getOfflineDb();
  return db.getAllFromIndex('progress', 'by-user', userId);
}

export async function saveLocalQuizAttempt(attempt: QuizAttemptRecord): Promise<void> {
  const db = await getOfflineDb();
  await db.put('quizAttempts', attempt);
}

export async function getLocalQuizAttemptsForUser(userId: string): Promise<QuizAttemptRecord[]> {
  const db = await getOfflineDb();
  return db.getAllFromIndex('quizAttempts', 'by-user', userId);
}

export async function saveLocalNote(note: PersonalNoteRecord): Promise<void> {
  const db = await getOfflineDb();
  await db.put('notes', note);
}

export async function deleteLocalNote(noteId: string): Promise<void> {
  const db = await getOfflineDb();
  await db.delete('notes', noteId);
}

export async function getLocalNotesForUser(userId: string): Promise<PersonalNoteRecord[]> {
  const db = await getOfflineDb();
  return db.getAllFromIndex('notes', 'by-user', userId);
}

export async function saveLocalBookmark(bookmark: BookmarkRecord): Promise<void> {
  const db = await getOfflineDb();
  await db.put('bookmarks', bookmark);
}

export async function deleteLocalBookmark(bookmarkId: string): Promise<void> {
  const db = await getOfflineDb();
  await db.delete('bookmarks', bookmarkId);
}

export async function getLocalBookmarksForUser(userId: string): Promise<BookmarkRecord[]> {
  const db = await getOfflineDb();
  return db.getAllFromIndex('bookmarks', 'by-user', userId);
}

export async function addToSyncQueue(item: SyncQueueItem): Promise<void> {
  const db = await getOfflineDb();
  await db.put('syncQueue', item);
}

export async function getUserSyncQueue(userId: string): Promise<SyncQueueItem[]> {
  const db = await getOfflineDb();
  return db.getAllFromIndex('syncQueue', 'by-user', userId);
}

export async function clearSyncedQueueItems(userId: string): Promise<void> {
  const db = await getOfflineDb();
  const items = await db.getAllFromIndex('syncQueue', 'by-user', userId);
  const tx = db.transaction('syncQueue', 'readwrite');
  for (const item of items) {
    if (item.status === 'synced') {
      await tx.store.delete(item.operationId);
    }
  }
  await tx.done;
}
