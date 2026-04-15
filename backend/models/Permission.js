const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  staffId: {
    type: String,
    required: true
  },
  staffName: {
    type: String,
    required: true
  },
  adminId: {
    type: String,
    required: true
  },
  adminName: {
    type: String,
    required: true
  },
  adminDepartment: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  followersCount: {
    type: Number,
    default: 0
  },
  // ✅ ADDED: Payment approval status
  paymentApprovalStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed'],
    default: 'Pending'
  },
  studentId: {
    type: String,
    required: false
  },
  studentName: {
    type: String,
    required: false
  },
  requestType: {
    type: String,
    enum: ['FollowRequest', 'CapacityIncrease', 'General'],
    default: 'General'
  },
  batchSize: {
    type: Number,
    default: 50
  },
  approvedCount: {
    type: Number,
    default: 0
  },
  isBatchComplete: {
    type: Boolean,
    default: false
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Verified'],
    default: 'Pending'
  },
  paymentInstructions: {
    type: String,
    default: ''
  },
  paymentPhone: {
    type: String,
    default: '94860 42369'
  },
  paymentAmount: {
    type: Number,
    default: 500
  },
  transactionId: {
    type: String,
    default: ''
  },
  paymentScreenshot: {
    type: String,
    default: ''
  }
}, 
 {
  timestamps: true
});

module.exports = mongoose.model('Permission', permissionSchema);





