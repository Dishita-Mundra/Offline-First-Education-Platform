const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId },
    selectedOption: { type: String },
    isCorrect: { type: Boolean }
  }],
  attemptedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
