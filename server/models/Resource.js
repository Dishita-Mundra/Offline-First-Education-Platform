const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  fileUrl: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
