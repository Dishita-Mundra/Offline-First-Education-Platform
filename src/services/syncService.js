import { getPendingSync, markSynced } from '../db/db';
import { syncData } from './api';

export const processSyncQueue = async () => {
  const queue = await getPendingSync();
  if (queue.length === 0) {
    return { syncedCount: 0 };
  }

  try {
    // Call the real backend API
    const result = await syncData(queue);
    
    // Only delete from local IndexedDB if successfully processed by backend
    let syncedCount = 0;
    for (const item of queue) {
      // If we got here without throwing, the batch succeeded (or partially succeeded). 
      // For a robust implementation, we'd check `result.errors` to avoid deleting failed items.
      const failed = result.errors && result.errors.find(e => e.id === item.id);
      if (!failed) {
        await markSynced(item.id);
        syncedCount++;
      }
    }
    
    return { syncedCount };
  } catch (error) {
    console.error("Sync failed:", error);
    throw error;
  }
};

export const syncInboundData = async (studentId) => {
  try {
    const { fetchStudentOfflineData } = require('./api');
    const { saveCourse, saveLesson } = require('../db/db');
    const data = await fetchStudentOfflineData(studentId);
    
    let coursesAdded = 0;
    let lessonsAdded = 0;
    for (const item of data) {
      await saveCourse(item.course);
      coursesAdded++;
      for (const lesson of item.lessons) {
        await saveLesson(lesson);
        lessonsAdded++;
      }
    }
    return { coursesAdded, lessonsAdded };
  } catch(err) {
    console.error("Inbound sync failed:", err);
    throw err;
  }
};
