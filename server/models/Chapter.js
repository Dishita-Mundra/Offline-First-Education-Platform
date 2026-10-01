const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  chapterNumber: {
    type: Number,
    required: true
  },
  description: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Chapter', chapterSchema);
