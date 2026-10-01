const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', asyncHandler(async (req, res) => {
  const { schoolId, password } = req.body;
  if (!schoolId || !password) {
    res.status(400);
    throw new Error('School ID and password are required');
  }

  const user = await User.findOne({ schoolId });

  if (user && (await user.matchPassword(password))) {
    res.json({
      success: true,
      message: 'Login successful',
      token: generateToken(user._id),
      user: {
        id: user._id,
        schoolId: user.schoolId,
        name: user.name,
        role: user.role,
        class: user.class,
        section: user.section
      }
    });
  } else {
    res.status(401);
    throw new Error('Invalid school ID or password');
  }
}));

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const { protect } = require('../middleware/authMiddleware');
router.get('/profile', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      schoolId: user.schoolId,
      name: user.name,
      role: user.role,
      class: user.class,
      section: user.section
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
}));

module.exports = router;
