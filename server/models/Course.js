const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  class: { type: String, required: true },
  section: { type: String },
  description: { type: String },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  thumbnail: { type: String },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  published: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
