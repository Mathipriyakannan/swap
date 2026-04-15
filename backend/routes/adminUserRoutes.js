const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const DoubtRequest = require('../models/DoubtRequest');
const authMiddleware = require('../middleware/authMiddleware');

const {
  getAllAdminUsers,
  getAdminUserById,
  registerAdminUser,
  getStaffBySubject,
  getAllSubjects,
   getAllStaffRequests,
  updateStaffRequestStatus,
} = require('../controllers/adminUserController');

router.get('/subjects', getAllSubjects);
router.get('/staff-by-subject/:subject', getStaffBySubject);

router.get('/admins/:id', authMiddleware, getAdminUserById);
router.get('/admins', getAllAdminUsers);
// ✅ Get all staff requests for admin dashboard
router.get('/requests', getAllStaffRequests);

// ✅ Update staff request status (Approve / Reject)
router.put('/requests/:id', updateStaffRequestStatus);
router.post('/register', registerAdminUser);

router.get('/staff/:id', async (req, res) => {
  try {
    const staff = await AdminUser.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ error: 'Staff not found' });
    }
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
router.get('/staff-by-name/:name', async (req, res) => {
  try {
    const staff = await AdminUser.findOne({ fullName: req.params.name });
    if (!staff) {
      return res.status(404).json({ error: 'Staff not found' });
    }
    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required' });
    }

    const user = await AdminUser.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ error: 'Server error during password reset' });
  }
});

router.post('/staff/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await AdminUser.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, department: user.department },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        department: user.department
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/submit-request', async (req, res) => {
  try {
    const newRequest = new DoubtRequest(req.body);
    await newRequest.save();
    res.status(201).json({ message: 'Doubt submitted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SEND REQUEST TO ADMIN
router.post('/send-request/:id', async (req, res) => {
  try {
    const { id } = req.params; // admin ID
    const { message, adminName, adminDepartment } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Request message is required' });
    }

    // You can store this in a separate collection if needed (like an "AdminRequest" model)
    // For now, we’ll just log or simulate storing
    console.log(`Request sent to admin: ${adminName} (${adminDepartment})`);
    console.log(`Message: ${message}`);

    // Optionally, save to MongoDB (you can create AdminRequest model if needed)
    // const newRequest = new AdminRequest({ adminId: id, adminName, adminDepartment, message });
    // await newRequest.save();

    res.status(200).json({ message: 'Request sent successfully to admin!' });
  } catch (error) {
    console.error('Error sending request:', error);
    res.status(500).json({ error: 'Server error while sending request' });
  }
});

router.get('/pending-requests-count', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const staff = await AdminUser.find({});
    
    const counts = {};
    for (const member of staff) {
      const count = await DoubtRequest.countDocuments({
        staffName: member.fullName,
        department: member.department,
        status: 'pending'
      });
      counts[`${member.fullName}-${member.department}`] = count;
    }
    
    res.json(counts);
  } catch (error) {
    console.error('Error fetching pending request counts:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/pending-requests', authMiddleware, async (req, res) => {
  try {
    
    const pendingRequests = [];
    
    const admins = await AdminUser.find({});
    for (const admin of admins) {
      const count = await DoubtRequest.countDocuments({
        assignedTo: admin._id,
        status: 'pending'
      });
      
      pendingRequests.push({
        fullName: admin.fullName,
        department: admin.department,
        count: count
      });
    }
    
    res.json(pendingRequests);
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({ error: 'Failed to fetch pending requests' });
  }
});
router.get('/pending-requests/:name/:department', async (req, res) => {
  try {
    const { name, department } = req.params;

    const pendingRequests = await DoubtRequest.find({
      staffName: name,
      department,
      status: 'pending'
    });

    res.json(pendingRequests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/pending-requests/:name/:department', async (req, res) => {
  const { name, department } = req.params;
  const result = await DoubtRequest.find({
    staffName: name,
    department,
    status: 'pending'
  });
  res.json(result);
});
router.get('/search-staff', async (req, res) => {
  try {
    const { name } = req.query;
    
    if (!name) {
      return res.status(400).json({ error: 'Name parameter is required' });
    }
    
    const staffMembers = await AdminUser.find({
      fullName: { $regex: name, $options: 'i' }
    });
    
    res.json(staffMembers);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Server error during search' });
  }
});

router.get('/staff', async (req, res) => {
  try {
    const staff = await AdminUser.find({});
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
module.exports = router;


