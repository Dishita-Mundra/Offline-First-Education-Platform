const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');

// @desc    Get student details
// @route   GET /api/students/:studentId
// @access  Private
router.get('/:studentId', protect, asyncHandler(async (req, res) => {
  const student = await User.findById(req.params.studentId).select('-passwordHash');
  
  if (!student || student.role !== 'student') {
    res.status(404);
    throw new Error('Student not found');
  }

  res.json(student);
}));

// @desc    Get student's enrolled courses
// @route   GET /api/students/:studentId/courses
// @access  Private
router.get('/:studentId/courses', protect, asyncHandler(async (req, res) => {
  // Ensure a student can only view their own courses, or a teacher can view them
  if (req.user.role === 'student' && req.user._id.toString() !== req.params.studentId) {
    res.status(403);
    throw new Error('Not authorized to view these courses');
  }

  const enrollments = await Enrollment.find({ 
    studentId: req.params.studentId,
    status: 'active'
  }).populate('courseId');

  res.json(enrollments.map(e => e.courseId).filter(c => c !== null));
}));

// @desc    Get all data for offline sync
// @route   GET /api/students/:studentId/offline-data
// @access  Private
router.get('/:studentId/offline-data', protect, asyncHandler(async (req, res) => {
  if (req.user.role === 'student' && req.user._id.toString() !== req.params.studentId) {
    res.status(403); throw new Error('Not authorized');
  }

  const enrollments = await Enrollment.find({ 
    studentId: req.params.studentId,
    status: 'active'
  }).populate('courseId');

  const validCourses = enrollments.map(e => e.courseId).filter(c => c !== null && c.published);
  
  const Course = require('../models/Course');
  const Lesson = require('../models/Lesson');
  const Quiz = require('../models/Quiz');
  const Resource = require('../models/Resource');

  const fullData = [];
  
  for(let course of validCourses) {
    const lessons = await Lesson.find({ courseId: course._id }).sort({ order: 1 });
    const quizzes = await Quiz.find({ courseId: course._id, published: true });
    // Assuming resources are also needed, but IDB stores them as lessons or not at all?
    // Let's bundle quizzes into lessons for the frontend mock db.js format if needed, 
    // or just return as is.
    
    // Transform course for IDB
    const c = course.toObject();
    c.id = c._id.toString(); // IDB expects 'id'
    
    const transformedLessons = lessons.map(l => {
      const les = l.toObject();
      les.id = les._id.toString();
      les.courseId = les.courseId.toString();
      les.hasVideo = !!les.videoUrl; // simple mapping
      // Find quiz for this lesson or course
      const quiz = quizzes.find(q => q.lessonId && q.lessonId.toString() === les.id) || quizzes.find(q => !q.lessonId);
      if(quiz) {
        const qObj = quiz.toObject();
        qObj.id = qObj._id.toString();
        // Convert questions structure if needed, but we used question: String
        qObj.questions = qObj.questions.map((q, idx) => ({
          id: q._id ? q._id.toString() : idx.toString(),
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer
        }));
        les.quiz = qObj;
      }
      return les;
    });

    fullData.push({
      course: c,
      lessons: transformedLessons
    });
  }

  res.json(fullData);
}));

module.exports = router;
