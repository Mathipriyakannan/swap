const mongoose = require('mongoose');

const swapKnowledgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  school: String,
  district: String,
  classLevel: String,
  department: String,
  collegeType: String,
  exam: String,
  dob: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  socialLink: {
    type: String,
    default: ''
  },
  profileImage: {
    type: String,
    default: ''
  },
  skills: {
    type: [String],
    default: []
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model('SwapKnowledgeUser', swapKnowledgeSchema);


