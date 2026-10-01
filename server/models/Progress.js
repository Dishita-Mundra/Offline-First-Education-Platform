const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  completionPercentage: { type: Number, default: 0 },
  lastAccessed: { type: Date, default: Date.now },
  quizAttempts: [{
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    score: Number,
    total: Number,
    timestamp: Date
  }]
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
