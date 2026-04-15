const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  studentName: String,
  studentEmail: String,
  staffName: String,
  date: String, 
  time: String, 
  meetLink: String,
  meetingCode: String, // Store the actual meeting code
  alertSent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Meeting', meetingSchema);




