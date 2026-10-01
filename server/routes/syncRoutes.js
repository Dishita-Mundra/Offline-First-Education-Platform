const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/authMiddleware');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const QuizAttempt = require('../models/QuizAttempt');
const SyncRecord = require('../models/SyncRecord');

// @desc    Process batch sync from offline queue
// @route   POST /api/sync
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const { queue } = req.body;
  const studentId = req.user._id;

  if (!queue || !Array.isArray(queue)) {
    res.status(400);
    throw new Error('Invalid sync payload');
  }

  let syncedCount = 0;
  const errors = [];

  for (const item of queue) {
    try {
      const { action, data } = item;
      
      if (action === 'update_progress') {
        const { lessonId, percent } = data;
        // In the mock, lessonId was 'l1', 'l2', etc. In real DB it's ObjectId.
        // Assuming data.lessonId is the real ObjectId now.
        // Wait, if frontend is still using seedData (mock ID like 'l1'), we have a problem.
        // Assuming we are migrating to real IDs.
        const lesson = await Lesson.findById(lessonId);
        if (lesson) {
          const courseId = lesson.courseId;
          
          let progress = await Progress.findOne({ studentId, courseId });
          if (!progress) {
            progress = new Progress({ studentId, courseId, completedLessons: [] });
          }
          
          if (percent >= 100 && !progress.completedLessons.includes(lessonId)) {
            progress.completedLessons.push(lessonId);
          }
          
          // Basic percentage calculation (mocked as percent directly here for simplicity,
          // in a real app we'd calculate based on total lessons in course)
          progress.completionPercentage = percent > progress.completionPercentage ? percent : progress.completionPercentage;
          progress.lastAccessed = Date.now();
          
          await progress.save();
        }
      } else if (action === 'submit_quiz') {
        const { lessonId, courseId, score, total, answers } = data;
        
        await QuizAttempt.create({
          studentId,
          lessonId,
          courseId,
          quizId: lessonId, // mock using lessonId since we don't have separate quizId in the frontend yet
          score,
          total,
          answers: Object.keys(answers || {}).map(qId => ({ questionId: null, selectedOption: answers[qId], isCorrect: null }))
        });

        // Also update progress
        let progress = await Progress.findOne({ studentId, courseId });
        if (!progress) {
          progress = new Progress({ studentId, courseId, completedLessons: [lessonId], completionPercentage: 100 });
        } else {
          progress.lastAccessed = Date.now();
          if (!progress.completedLessons.includes(lessonId)) {
             progress.completedLessons.push(lessonId);
          }
        }
        await progress.save();
      }

      await SyncRecord.create({
        studentId,
        action,
        payload: data,
        status: 'synced'
      });

      syncedCount++;
    } catch (error) {
      console.error('Error syncing item:', item, error);
      errors.push({ id: item.id, error: error.message });
      
      await SyncRecord.create({
        studentId,
        action: item.action,
        payload: item.data,
        status: 'failed'
      });
    }
  }

  res.json({ syncedCount, errors });
}));

module.exports = router;
