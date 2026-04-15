const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

router.post("/submit-feedback", async (req, res) => {
  try {
    const { staffName, department, emoji, emojiLabel, extraRating, message } = req.body;

    if (!staffName || !department || !emoji || !message) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled." });
    }

    const feedback = new Feedback({
      staffName,
      department,
      emoji,
      emojiLabel,
      extraRating: extraRating || 0,
      message,
    });

    await feedback.save();
    res.status(201).json({ 
      message: "Feedback submitted successfully!",
      staffName: staffName 
    });
  } catch (err) {
    console.error("Error saving feedback:", err);
    res.status(500).json({ message: "Server error" });
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
        createdAt: fb.createdAt
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/get-feedbacks/:staffName', async (req, res) => {
  try {
    const { staffName } = req.params;
    const feedbacks = await Feedback.find({ staffName }).sort({ createdAt: -1 });
    
    if (feedbacks.length === 0) {
      return res.status(404).json({ 
        message: `No feedback found for staff: ${staffName}` 
      });
    }
    
    res.json({
      feedbacks: feedbacks.map(fb => ({
        staffName: fb.staffName,
        department: fb.department,
        emoji: fb.emoji,
        emojiLabel: fb.emojiLabel,
        extraRating: fb.extraRating,
        message: fb.message,
        createdAt: fb.createdAt
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;