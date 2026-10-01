const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String },
  marks: { type: Number, default: 1 },
  order: { type: Number, default: 0 }
});

const quizSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  description: { type: String },
  timeLimit: { type: Number },
  passingScore: { type: Number, default: 50 },
  questions: [questionSchema],
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  published: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
