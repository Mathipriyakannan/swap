const mongoose = require('mongoose');

const doubtRequestSchema = new mongoose.Schema({
  staffName: String,
  department: String,
  username: String,
  subject: String,
  doubt: String,
  status: { type: String, default: 'pending' }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DoubtRequest', doubtRequestSchema);