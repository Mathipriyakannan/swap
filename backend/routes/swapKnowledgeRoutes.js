const express = require('express');
const router = express.Router();
const SwapKnowledgeUser = require('../models/SwapKnowledgeUser');
const Feedback = require('../models/Feedback');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');


router.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    
    const { name, email, password, category, school, district, classLevel, department, collegeType, exam } = req.body;
    
    const existingUser = await SwapKnowledgeUser.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ error: 'User already exists with this email' });
    }
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const newUser = new SwapKnowledgeUser({
      name,
      email,
      password: hashedPassword,
      category,
      school,
      district,
      classLevel,
      department,
      collegeType,
      exam,
      dob: '',
      phone: '',
      socialLink: '',
      profileImage: '',
      skills: []
    });
    
    await newUser.save();
    console.log('User registered successfully:', email);
    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await SwapKnowledgeUser.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      message: 'Login successful',
      _id: user._id,
      name: user.name,
      email: user.email,
      category: user.category,
      district: user.district,
      school: user.school,
      department: user.department,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get("/students/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get('/students', async (req, res) => {
  try {
    const students = await SwapKnowledgeUser.find({});
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
router.get("/get-user-by-id/:id", async (req, res) => {
  try {
    const student = await SwapKnowledgeUser.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/", async (req, res) => {
  try {
    const { author, userType } = req.query;
    let query = {};
    
    if (author && userType) {
      query = { name: author, userType: userType };
    } else if (author) {
      query = { name: author };
    }
    
    const posts = await Post.find(query).sort({ createdAt: -1 });
    
    res.json({
      posts,
      total: posts.length
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ 
      message: "Server error while fetching posts",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});



router.put('/update-profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const allowedUpdates = {
      email: updates.email,
      district: updates.district,
      school: updates.school,
      department: updates.department,
      classLevel: updates.classLevel,
      collegeType: updates.collegeType,
      exam: updates.exam,
      dob: updates.dob,
      phone: updates.phone,
      socialLink: updates.socialLink
    };
    
    Object.keys(allowedUpdates).forEach(key => {
      if (allowedUpdates[key] === undefined) {
        delete allowedUpdates[key];
      }
    });
    
    const updatedStudent = await SwapKnowledgeUser.findByIdAndUpdate(
      id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    );
    
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(updatedStudent);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
});


  
  router.post('/reset-password', async (req, res) => {
    console.log("reset-password route hit", req.body);
    try {
      const { email, newPassword } = req.body;
  
      if (!email || !newPassword) {
        return res.status(400).json({ message: "Email and new password required" });
      }
  
      const user = await SwapKnowledgeUser.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      console.error("Error in reset-password:", error);
      res.status(500).json({ message: "Server error", error });
    }
  });
  
  
  
  router.get('/get-user/:email', async (req, res) => {
    try {
      const user = await SwapKnowledgeUser.findOne({ email: req.params.email });
      if (!user) return res.status(404).json({ message: 'Student not found' });
      res.json({ name: user.name, email: user.email });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  router.post('/submit-request', async (req, res) => {
    try {
      const { staffName, department, username, subject, doubt } = req.body;
      
      const newRequest = new DoubtRequest({
        staffName,
        department,
        username,
        subject,
        doubt,
        status: 'pending'
      });
      
      await newRequest.save();
      res.status(201).json({ message: 'Doubt submitted successfully' });
    } catch (err) {
      console.error('Error saving doubt request:', err);
      res.status(500).json({ message: 'Failed to submit doubt request' });
    }
  });
  router.post('/submit-feedback', async (req, res) => {
    try {
      const { staffName, department, emoji, emojiLabel, extraRating, message } = req.body;
      const newFeedback = new Feedback({
        staffName,
        department,
        emoji,
        emojiLabel,
        extraRating,
        message,
      });
      await newFeedback.save();
      res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (err) {
      console.error('Error saving feedback:', err);
      res.status(500).json({ message: 'Failed to submit feedback' });
    }
  });
  
  router.get('/get-feedbacks', async (req, res) => {
    try {
      const feedbacks = await Feedback.find().sort({ createdAt: -1 });
      res.json({
        feedbacks: feedbacks.map(fb => ({
          staffName: fb.staffName,
          department: fb.department,
          emoji: fb.emoji,
          emojiLabel: fb.emojiLabel,
          extraRating: fb.extraRating,
          message: fb.message,
        })),
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

// ✅ Fetch all users
router.get('/students', async (req, res) => {
  try {
    const students = await SwapKnowledgeUser.find({});
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// Make sure to export the router
module.exports = router;
module.exports = router;