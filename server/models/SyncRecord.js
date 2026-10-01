const mongoose = require('mongoose');

const syncRecordSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  payload: { type: mongoose.Schema.Types.Mixed },
  status: { type: String, enum: ['pending', 'synced', 'failed'], default: 'synced' },
  syncedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('SyncRecord', syncRecordSchema);
