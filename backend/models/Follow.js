const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  studentName: { type: String, required: true },
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  staffName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// ✅ Prevent duplicate follows between same student and staff
followSchema.index({ studentId: 1, staffId: 1 }, { unique: true });

module.exports = mongoose.model('Follow', followSchema);
