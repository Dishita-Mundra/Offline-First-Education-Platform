const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect, teacher } = require('../middleware/authMiddleware');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');

// @desc    Enroll a student in a course
// @route   POST /api/courses/:courseId/enroll
// @access  Private/Teacher
router.post('/:courseId/enroll', protect, teacher, asyncHandler(async (req, res) => {
  const { studentId } = req.body;
  const courseId = req.params.courseId;

  // Verify course ownership
  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  
  if (course.teacherId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to manage this course');
  }

  // Verify student exists
  const student = await User.findById(studentId);
  if (!student || student.role !== 'student') {
    res.status(404);
    throw new Error('Student not found');
  }

  // Check if already enrolled
  const existingEnrollment = await Enrollment.findOne({ studentId, courseId });
  if (existingEnrollment) {
    if (existingEnrollment.status === 'inactive') {
      existingEnrollment.status = 'active';
      await existingEnrollment.save();
      return res.json(existingEnrollment);
    }
    res.status(400);
    throw new Error('Student already enrolled');
  }

  const enrollment = await Enrollment.create({
    studentId,
    courseId,
    status: 'active'
  });

  res.status(201).json(enrollment);
}));

// @desc    Remove/Unenroll a student
// @route   DELETE /api/courses/:courseId/students/:studentId
// @access  Private/Teacher
router.delete('/:courseId/students/:studentId', protect, teacher, asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  const studentId = req.params.studentId;

  // Verify course ownership
  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  
  if (course.teacherId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to manage this course');
  }

  const enrollment = await Enrollment.findOne({ studentId, courseId });
  if (!enrollment) {
    res.status(404);
    throw new Error('Enrollment not found');
  }

  // Soft delete (mark inactive)
  enrollment.status = 'inactive';
  await enrollment.save();

  res.json({ message: 'Student removed from course' });
}));

module.exports = router;
