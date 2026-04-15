const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  staffId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "AdminUser", 
    required: false
  },
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "SwapKnowledgeUser", 
    required: false
  },
  userType: {
    type: String,
    required: true,
    enum: ["Student", "Staff"]
  },
  name: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  fileUrl: String,
  imageUrl: String
}, { 
  timestamps: true 
});

postSchema.index({ topic: 'text', content: 'text' });

module.exports = mongoose.model('Post', postSchema);


