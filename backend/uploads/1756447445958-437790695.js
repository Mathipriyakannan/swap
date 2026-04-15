const express = require('express');
const router = express.Router();
const SwapKnowledgeUser = require('../models/SwapKnowledgeUser');

router.post('/register', async (req, res) => {
  try {
    const newUser = new SwapKnowledgeUser(req.body);
    await newUser.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await SwapKnowledgeUser.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    // Authentication successful
    res.json({ message: 'Login successful', name: user.name }); // Return name
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
