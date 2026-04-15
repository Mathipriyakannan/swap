const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  department: { type: String, required: true },
  joiningDate: { type: Date, default: Date.now },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('AdminUser', adminUserSchema);











