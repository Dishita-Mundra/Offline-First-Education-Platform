const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect, teacher } = require('../middleware/authMiddleware');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const Progress = require('../models/Progress');
const QuizAttempt = require('../models/QuizAttempt');
const Lesson = require('../models/Lesson');
const Resource = require('../models/Resource');
const Quiz = require('../models/Quiz');
const upload = require('../config/multer');

// @desc    Get all students enrolled in any of the teacher's courses
// @route   GET /api/teacher/students
// @access  Private/Teacher
router.get('/students', protect, teacher, asyncHandler(async (req, res) => {
  // 1. Find all courses owned by this teacher
  const courses = await Course.find({ teacherId: req.user._id }).select('_id title');
  const courseIds = courses.map(c => c._id);

  // 2. Find all active enrollments for these courses
  const enrollments = await Enrollment.find({ 
    courseId: { $in: courseIds },
    status: 'active'
  }).populate('studentId', 'name schoolId class section');

  // 3. Aggregate unique students and calculate their progress
  const studentMap = new Map();

  for (let enrollment of enrollments) {
    if (!enrollment.studentId) continue;
    
    const student = enrollment.studentId;
    const studentIdStr = student._id.toString();
    
    if (!studentMap.has(studentIdStr)) {
      studentMap.set(studentIdStr, {
        _id: student._id,
        name: student.name,
        schoolId: student.schoolId,
        class: student.class,
        section: student.section,
        enrolledCourses: [],
        averageProgress: 0,
        lastActivity: null,
        status: 'Active'
      });
    }

    const progress = await Progress.findOne({ 
      studentId: student._id, 
      courseId: enrollment.courseId 
    });

    const entry = studentMap.get(studentIdStr);
    
    // Course-specific progress
    const courseProgress = progress ? progress.completionPercentage : 0;
    
    entry.enrolledCourses.push({
      courseId: enrollment.courseId,
      courseTitle: courses.find(c => c._id.toString() === enrollment.courseId.toString())?.title,
      progress: courseProgress,
      enrolledAt: enrollment.enrolledAt
    });

    // Update last activity if newer
    if (progress && progress.lastAccessed) {
      if (!entry.lastActivity || new Date(progress.lastAccessed) > new Date(entry.lastActivity)) {
        entry.lastActivity = progress.lastAccessed;
      }
    }
  }

  // Calculate average progress per student
  const studentsList = Array.from(studentMap.values()).map(s => {
    const totalProgress = s.enrolledCourses.reduce((sum, c) => sum + c.progress, 0);
    s.averageProgress = s.enrolledCourses.length > 0 ? (totalProgress / s.enrolledCourses.length) : 0;
    return s;
  });

  res.json(studentsList);
}));

// @desc    Get all students for a specific course
// @route   GET /api/teacher/courses/:courseId/students
// @access  Private/Teacher
router.get('/courses/:courseId/students', protect, teacher, asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  // Verify ownership
  if (course.teacherId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view students for this course');
  }

  const enrollments = await Enrollment.find({ 
    courseId: req.params.courseId 
  }).populate('studentId', 'name schoolId class section');

  const students = await Promise.all(enrollments.map(async (enrollment) => {
    if(!enrollment.studentId) return null;
    
    const progress = await Progress.findOne({
      studentId: enrollment.studentId._id,
      courseId: req.params.courseId
    });
    
    // Get latest quiz attempt
    const latestQuiz = await QuizAttempt.findOne({
      studentId: enrollment.studentId._id,
      courseId: req.params.courseId
    }).sort({ attemptedAt: -1 });

    return {
      _id: enrollment.studentId._id,
      name: enrollment.studentId.name,
      schoolId: enrollment.studentId.schoolId,
      class: enrollment.studentId.class,
      section: enrollment.studentId.section,
      enrollmentStatus: enrollment.status,
      enrolledAt: enrollment.enrolledAt,
      progress: progress ? progress.completionPercentage : 0,
      lessonsCompleted: progress ? progress.completedLessons.length : 0,
      latestQuiz: latestQuiz ? { score: latestQuiz.score, total: latestQuiz.total, date: latestQuiz.attemptedAt } : null,
      lastActivity: progress ? progress.lastAccessed : null
    };
  }));

  res.json(students.filter(s => s !== null));
}));

// --- COURSES ---

// @desc    Get teacher's courses
// @route   GET /api/teacher/courses
// @access  Private/Teacher
router.get('/courses', protect, teacher, asyncHandler(async (req, res) => {
  const courses = await Course.find({ teacherId: req.user._id });
  
  // Attach stats
  const coursesWithStats = await Promise.all(courses.map(async (c) => {
    const lessonsCount = await Lesson.countDocuments({ courseId: c._id });
    const studentsCount = await Enrollment.countDocuments({ courseId: c._id, status: 'active' });
    
    // Average completion
    const progresses = await Progress.find({ courseId: c._id });
    const avgProgress = progresses.length > 0 
      ? progresses.reduce((acc, p) => acc + p.completionPercentage, 0) / progresses.length 
      : 0;

    return {
      ...c.toObject(),
      lessonsCount,
      studentsCount,
      avgProgress: Math.round(avgProgress)
    };
  }));
  
  res.json(coursesWithStats);
}));

// @desc    Create a course
// @route   POST /api/teacher/courses
// @access  Private/Teacher
router.post('/courses', protect, teacher, asyncHandler(async (req, res) => {
  const { title, subject, class: classLevel, section, description, status } = req.body;
  const course = await Course.create({
    title, subject, class: classLevel, section, description, status,
    published: status === 'published',
    teacherId: req.user._id
  });
  res.status(201).json(course);
}));

// @desc    Get single course with all content
// @route   GET /api/teacher/courses/:courseId
// @access  Private/Teacher
router.get('/courses/:courseId', protect, teacher, asyncHandler(async (req, res) => {
  const course = await Course.findOne({ _id: req.params.courseId, teacherId: req.user._id });
  if (!course) {
    res.status(404); throw new Error('Course not found');
  }
  const lessons = await Lesson.find({ courseId: course._id }).sort({ order: 1 });
  const quizzes = await Quiz.find({ courseId: course._id });
  const resources = await Resource.find({ courseId: course._id });
  
  res.json({ course, lessons, quizzes, resources });
}));

// @desc    Update a course
// @route   PUT /api/teacher/courses/:courseId
// @access  Private/Teacher
router.put('/courses/:courseId', protect, teacher, asyncHandler(async (req, res) => {
  const course = await Course.findOne({ _id: req.params.courseId, teacherId: req.user._id });
  if (!course) { res.status(404); throw new Error('Course not found'); }
  
  const { title, subject, class: classLevel, section, description, status } = req.body;
  if(title) course.title = title;
  if(subject) course.subject = subject;
  if(classLevel) course.class = classLevel;
  if(section) course.section = section;
  if(description) course.description = description;
  if(status) {
    course.status = status;
    course.published = status === 'published';
  }
  
  const updatedCourse = await course.save();
  res.json(updatedCourse);
}));

// @desc    Delete a course
// @route   DELETE /api/teacher/courses/:courseId
// @access  Private/Teacher
router.delete('/courses/:courseId', protect, teacher, asyncHandler(async (req, res) => {
  const course = await Course.findOne({ _id: req.params.courseId, teacherId: req.user._id });
  if (!course) { res.status(404); throw new Error('Course not found'); }
  
  await Lesson.deleteMany({ courseId: course._id });
  await Quiz.deleteMany({ courseId: course._id });
  await Resource.deleteMany({ courseId: course._id });
  await course.deleteOne();
  
  res.json({ message: 'Course removed' });
}));

// --- LESSONS ---

// @desc    Create a lesson
// @route   POST /api/teacher/courses/:courseId/lessons
// @access  Private/Teacher
router.post('/courses/:courseId/lessons', protect, teacher, asyncHandler(async (req, res) => {
  const course = await Course.findOne({ _id: req.params.courseId, teacherId: req.user._id });
  if (!course) { res.status(404); throw new Error('Course not found'); }
  
  const { title, chapter, description, notesContent, videoUrl, order } = req.body;
  
  const lesson = await Lesson.create({
    courseId: course._id,
    title, chapter, description, notesContent, videoUrl, order: order || 0
  });
  
  res.status(201).json(lesson);
}));

// @desc    Update a lesson
// @route   PUT /api/teacher/lessons/:lessonId
// @access  Private/Teacher
router.put('/lessons/:lessonId', protect, teacher, asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.lessonId);
  if (!lesson) { res.status(404); throw new Error('Lesson not found'); }
  
  const course = await Course.findOne({ _id: lesson.courseId, teacherId: req.user._id });
  if (!course) { res.status(403); throw new Error('Not authorized'); }
  
  const { title, chapter, description, notesContent, videoUrl, order } = req.body;
  if(title) lesson.title = title;
  if(chapter) lesson.chapter = chapter;
  if(description !== undefined) lesson.description = description;
  if(notesContent !== undefined) lesson.notesContent = notesContent;
  if(videoUrl !== undefined) lesson.videoUrl = videoUrl;
  if(order !== undefined) lesson.order = order;
  
  const updatedLesson = await lesson.save();
  res.json(updatedLesson);
}));

// @desc    Delete a lesson
// @route   DELETE /api/teacher/lessons/:lessonId
// @access  Private/Teacher
router.delete('/lessons/:lessonId', protect, teacher, asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.lessonId);
  if (!lesson) { res.status(404); throw new Error('Lesson not found'); }
  
  const course = await Course.findOne({ _id: lesson.courseId, teacherId: req.user._id });
  if (!course) { res.status(403); throw new Error('Not authorized'); }
  
  await lesson.deleteOne();
  res.json({ message: 'Lesson removed' });
}));

// --- RESOURCES ---

// @desc    Upload resource
// @route   POST /api/teacher/resources/upload
// @access  Private/Teacher
router.post('/resources/upload', protect, teacher, upload.single('file'), asyncHandler(async (req, res) => {
  const { courseId, lessonId } = req.body;
  
  const course = await Course.findOne({ _id: courseId, teacherId: req.user._id });
  if (!course) { res.status(403); throw new Error('Not authorized for this course'); }
  
  if (!req.file) { res.status(400); throw new Error('No file uploaded'); }
  
  const resource = await Resource.create({
    courseId,
    lessonId: lessonId || null,
    teacherId: req.user._id,
    fileName: req.file.originalname,
    fileType: req.file.mimetype,
    fileSize: req.file.size,
    fileUrl: `/uploads/${req.file.filename}`
  });
  
  res.status(201).json(resource);
}));

// @desc    Delete a resource
// @route   DELETE /api/teacher/resources/:resourceId
// @access  Private/Teacher
router.delete('/resources/:resourceId', protect, teacher, asyncHandler(async (req, res) => {
  const resource = await Resource.findOne({ _id: req.params.resourceId, teacherId: req.user._id });
  if (!resource) { res.status(404); throw new Error('Resource not found'); }
  
  // Ideally, delete file from filesystem too
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(__dirname, '../', resource.fileUrl);
  if(fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  
  await resource.deleteOne();
  res.json({ message: 'Resource removed' });
}));

// --- QUIZZES ---

// @desc    Create a quiz
// @route   POST /api/teacher/quizzes
// @access  Private/Teacher
router.post('/quizzes', protect, teacher, asyncHandler(async (req, res) => {
  const { courseId, lessonId, title, description, timeLimit, passingScore, status, questions } = req.body;
  
  const course = await Course.findOne({ _id: courseId, teacherId: req.user._id });
  if (!course) { res.status(403); throw new Error('Not authorized for this course'); }
  
  const quiz = await Quiz.create({
    courseId, lessonId, teacherId: req.user._id, title, description, timeLimit, passingScore, status, questions,
    published: status === 'published'
  });
  
  res.status(201).json(quiz);
}));

// @desc    Update a quiz
// @route   PUT /api/teacher/quizzes/:quizId
// @access  Private/Teacher
router.put('/quizzes/:quizId', protect, teacher, asyncHandler(async (req, res) => {
  const quiz = await Quiz.findOne({ _id: req.params.quizId, teacherId: req.user._id });
  if (!quiz) { res.status(404); throw new Error('Quiz not found'); }
  
  const { title, description, timeLimit, passingScore, status, questions, lessonId } = req.body;
  if(title) quiz.title = title;
  if(description !== undefined) quiz.description = description;
  if(timeLimit !== undefined) quiz.timeLimit = timeLimit;
  if(passingScore !== undefined) quiz.passingScore = passingScore;
  if(status) {
    quiz.status = status;
    quiz.published = status === 'published';
  }
  if(questions) quiz.questions = questions;
  if(lessonId) quiz.lessonId = lessonId;
  
  const updatedQuiz = await quiz.save();
  res.json(updatedQuiz);
}));

// @desc    Get a quiz
// @route   GET /api/teacher/quizzes/:quizId
// @access  Private/Teacher
router.get('/quizzes/:quizId', protect, teacher, asyncHandler(async (req, res) => {
  const quiz = await Quiz.findOne({ _id: req.params.quizId, teacherId: req.user._id });
  if (!quiz) { res.status(404); throw new Error('Quiz not found'); }
  res.json(quiz);
}));

// @desc    Delete a quiz
// @route   DELETE /api/teacher/quizzes/:quizId
// @access  Private/Teacher
router.delete('/quizzes/:quizId', protect, teacher, asyncHandler(async (req, res) => {
  const quiz = await Quiz.findOne({ _id: req.params.quizId, teacherId: req.user._id });
  if (!quiz) { res.status(404); throw new Error('Quiz not found'); }
  
  await quiz.deleteOne();
  res.json({ message: 'Quiz removed' });
}));

// @desc    Add question to quiz
// @route   POST /api/teacher/quizzes/:quizId/questions
// @access  Private/Teacher
router.post('/quizzes/:quizId/questions', protect, teacher, asyncHandler(async (req, res) => {
  const quiz = await Quiz.findOne({ _id: req.params.quizId, teacherId: req.user._id });
  if (!quiz) { res.status(404); throw new Error('Quiz not found'); }
  
  quiz.questions.push(req.body);
  await quiz.save();
  res.status(201).json(quiz);
}));

module.exports = router;
