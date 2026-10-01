const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
  title: { type: String, required: true },
  description: { type: String },
  order: { type: Number, default: 0 },
  notesContent: { type: String },
  notesFile: { type: String }, // path/url
  videoFile: { type: String }, // path/url
  videoUrl: { type: String },
  duration: { type: Number },
  alwaysOffline: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);
