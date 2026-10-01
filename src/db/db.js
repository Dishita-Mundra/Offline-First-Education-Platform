import { openDB } from 'idb';

const DB_NAME = 'iasOfflineLearning';
const DB_VERSION = 1;

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('courses')) {
        db.createObjectStore('courses', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('lessons')) {
        const lessonStore = db.createObjectStore('lessons', { keyPath: 'id' });
        lessonStore.createIndex('courseId', 'courseId');
      }
      if (!db.objectStoreNames.contains('downloads')) {
        db.createObjectStore('downloads', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('progress')) {
        db.createObjectStore('progress', { keyPath: 'lessonId' });
      }
      if (!db.objectStoreNames.contains('quizAttempts')) {
        const quizStore = db.createObjectStore('quizAttempts', { keyPath: 'id', autoIncrement: true });
        quizStore.createIndex('lessonId', 'lessonId');
      }
      if (!db.objectStoreNames.contains('syncQueue')) {
        db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    },
  });
};

export const saveCourse = async (course) => {
  const db = await initDB();
  return db.put('courses', course);
};

export const getCourse = async (id) => {
  const db = await initDB();
  return db.get('courses', id);
};

export const getAllCourses = async () => {
  const db = await initDB();
  return db.getAll('courses');
};

export const saveLesson = async (lesson) => {
  const db = await initDB();
  return db.put('lessons', lesson);
};

export const getLesson = async (id) => {
  const db = await initDB();
  return db.get('lessons', id);
};

export const getLessonsByCourse = async (courseId) => {
  const db = await initDB();
  return db.getAllFromIndex('lessons', 'courseId', courseId);
};

export const markDownloaded = async (item) => {
  const db = await initDB();
  return db.put('downloads', { ...item, downloadedAt: Date.now() });
};

export const removeDownload = async (id) => {
  const db = await initDB();
  return db.delete('downloads', id);
};

export const getDownloads = async () => {
  const db = await initDB();
  return db.getAll('downloads');
};

export const isDownloaded = async (id) => {
  const db = await initDB();
  const res = await db.get('downloads', id);
  return !!res;
};

export const saveProgress = async (lessonId, progressPercent) => {
  const db = await initDB();
  return db.put('progress', { lessonId, progressPercent, timestamp: Date.now() });
};

export const getProgress = async (lessonId) => {
  const db = await initDB();
  return db.get('progress', lessonId);
};

export const getAllProgress = async () => {
  const db = await initDB();
  return db.getAll('progress');
};

export const saveQuizAttempt = async (attempt) => {
  const db = await initDB();
  return db.add('quizAttempts', { ...attempt, timestamp: Date.now() });
};

export const getQuizAttempts = async (lessonId) => {
  const db = await initDB();
  return db.getAllFromIndex('quizAttempts', 'lessonId', lessonId);
};

export const addToSyncQueue = async (action, data) => {
  const db = await initDB();
  return db.add('syncQueue', { action, data, timestamp: Date.now() });
};

export const getPendingSync = async () => {
  const db = await initDB();
  return db.getAll('syncQueue');
};

export const markSynced = async (id) => {
  const db = await initDB();
  return db.delete('syncQueue', id);
};

export const clearSyncQueue = async () => {
  const db = await initDB();
  return db.clear('syncQueue');
};

export const clearDB = async () => {
  const db = await initDB();
  await db.clear('courses');
  await db.clear('lessons');
  await db.clear('downloads');
  await db.clear('progress');
  await db.clear('quizAttempts');
  await db.clear('syncQueue');
  await db.clear('settings');
};
