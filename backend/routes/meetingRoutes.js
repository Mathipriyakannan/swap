const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');

// Function to create a REAL Google Meet link
const createGoogleMeetLink = () => {
  return 'https://meet.google.com/new';
};

// Schedule a new meeting with auto-generated Google Meet link
router.post('/schedule', async (req, res) => {
  try {
    console.log('Received meeting request:', req.body);
    
    const { studentName, studentEmail, staffName, date, time } = req.body;

    if (!studentName || !staffName || !date || !time) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create REAL Google Meet link
    const meetLink = createGoogleMeetLink();
    
    const newMeeting = new Meeting({
      studentName,
      studentEmail: studentEmail || 'no-email@example.com',
      staffName,
      date,
      time,
      meetLink,
      meetingCode: meetLink.split('/').pop()
    });

    await newMeeting.save();
    console.log('Meeting saved successfully:', newMeeting);

    res.status(201).json({ 
      message: `Meeting scheduled successfully for ${studentName}`,
      meeting: newMeeting,
      instructions: "Click the link to create a new Google Meet room. The first person to join becomes the host."
    });
  } catch (err) {
    console.error('Error scheduling meeting:', err);
    res.status(500).json({ error: 'Failed to schedule meeting: ' + err.message });
  }
});

// Schedule meeting with provided meetLink (alternative endpoint)
router.post('/schedule-with-link', async (req, res) => {
  try {
    console.log('Received meeting request with link:', req.body);
    
    const { studentName, studentEmail, staffName, date, time, meetLink } = req.body;

    if (!studentName || !staffName || !date || !time || !meetLink) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newMeeting = new Meeting({
      studentName,
      studentEmail: studentEmail || 'no-email@example.com',
      staffName,
      date,
      time,
      meetLink,
      alertSent: false
    });

    await newMeeting.save();
    console.log('Meeting saved successfully:', newMeeting);

    res.status(201).json({ 
      message: `Meeting scheduled successfully for ${studentName}`,
      meeting: newMeeting
    });
  } catch (err) {
    console.error('Error scheduling meeting:', err);
    res.status(500).json({ error: 'Failed to schedule meeting: ' + err.message });
  }
});

// Get latest meeting by student name
router.get('/student/:studentName', async (req, res) => {
  try {
    const studentName = req.params.studentName;
    
    const meetings = await Meeting.find({ studentName })
      .sort({ createdAt: -1 });

    if (!meetings || meetings.length === 0) {
      return res.status(404).json({ 
        message: 'No meetings found for this student' 
      });
    }

    const latestMeeting = meetings[0];
    
    res.json({
      id: latestMeeting._id,
      studentName: latestMeeting.studentName,
      staffName: latestMeeting.staffName,
      date: latestMeeting.date,
      time: latestMeeting.time,
      meetLink: latestMeeting.meetLink,
      createdAt: latestMeeting.createdAt
    });
  } catch (err) {
    console.error('Error fetching meeting by student name:', err);
    res.status(500).json({ error: 'Failed to fetch meeting details' });
  }
});

// Check if student has any meetings
router.get('/has-meeting/:studentName', async (req, res) => {
  try {
    const studentName = req.params.studentName;
    const meetingCount = await Meeting.countDocuments({ studentName });
    
    res.json({ hasMeeting: meetingCount > 0 });
  } catch (err) {
    console.error('Error checking for meetings:', err);
    res.status(500).json({ error: 'Failed to check for meetings' });
  }
});

// Get meetings by staff name (today and future dates)
router.get('/staff/:staffName', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const meetings = await Meeting.find({ 
      staffName: req.params.staffName,
      date: { $gte: today }
    }).sort({ date: 1, time: 1 });
    
    res.json(meetings);
  } catch (err) {
    console.error('Error fetching staff meetings:', err);
    res.status(500).json({ error: 'Failed to fetch meetings' });
  }
});

// Get meeting details by ID
router.get('/details/:id', async (req, res) => {
  try {
    const meetingId = req.params.id;
    const meeting = await Meeting.findById(meetingId);
    
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    res.json({
      id: meeting._id,
      studentName: meeting.studentName,
      staffName: meeting.staffName,
      date: meeting.date,
      time: meeting.time,
      meetLink: meeting.meetLink
    });
  } catch (err) {
    console.error('Error fetching meeting details:', err);
    res.status(500).json({ error: 'Failed to fetch meeting details' });
  }
});

// Check if current time is valid for joining meeting (±15 minutes window)
router.get('/check-time/:studentName', async (req, res) => {
  try {
    const studentName = req.params.studentName;
    const currentDateTime = new Date();
    
    const meetings = await Meeting.find({ studentName })
      .sort({ createdAt: -1 });

    if (!meetings || meetings.length === 0) {
      return res.status(404).json({ 
        isValid: false,
        message: 'No meetings found for this student' 
      });
    }

    const meeting = meetings[0];
    
    // Parse meeting date and time
    const meetingDate = new Date(meeting.date);
    const [hours, minutes] = meeting.time.split(':').map(Number);
    meetingDate.setHours(hours, minutes, 0, 0);
    
    const timeDifference = (meetingDate - currentDateTime) / (1000 * 60); // difference in minutes
    
    // Allow joining 15 minutes before and 30 minutes after scheduled time
    const isTimeValid = timeDifference >= -15 && timeDifference <= 30;
    
    res.json({
      isValid: isTimeValid,
      meetingTime: meetingDate,
      currentTime: currentDateTime,
      timeDifference: timeDifference,
      message: isTimeValid 
        ? 'You can join the meeting now' 
        : `Meeting is scheduled for ${meeting.date} at ${meeting.time}. Please join at the correct time.`
    });
  } catch (err) {
    console.error('Error checking meeting time:', err);
    res.status(500).json({ error: 'Failed to check meeting time' });
  }
});

// Get all meetings for a student
router.get('/student/:studentName/all', async (req, res) => {
  try {
    const studentName = req.params.studentName;
    
    const meetings = await Meeting.find({ studentName })
      .sort({ createdAt: -1 });

    if (!meetings || meetings.length === 0) {
      return res.status(404).json({ 
        message: 'No meetings found for this student' 
      });
    }

    res.json({
      count: meetings.length,
      meetings: meetings.map(meeting => ({
        id: meeting._id,
        studentName: meeting.studentName,
        staffName: meeting.staffName,
        date: meeting.date,
        time: meeting.time,
        meetLink: meeting.meetLink,
        createdAt: meeting.createdAt
      }))
    });
  } catch (err) {
    console.error('Error fetching all meetings:', err);
    res.status(500).json({ error: 'Failed to fetch meetings' });
  }
});

// Update meeting
router.put('/:id', async (req, res) => {
  try {
    const meetingId = req.params.id;
    const updates = req.body;

    const updatedMeeting = await Meeting.findByIdAndUpdate(
      meetingId,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedMeeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    res.json({
      message: 'Meeting updated successfully',
      meeting: updatedMeeting
    });
  } catch (err) {
    console.error('Error updating meeting:', err);
    res.status(500).json({ error: 'Failed to update meeting' });
  }
});

// Delete meeting
router.delete('/:id', async (req, res) => {
  try {
    const meetingId = req.params.id;
    const deletedMeeting = await Meeting.findByIdAndDelete(meetingId);

    if (!deletedMeeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    res.json({
      message: 'Meeting deleted successfully',
      meeting: deletedMeeting
    });
  } catch (err) {
    console.error('Error deleting meeting:', err);
    res.status(500).json({ error: 'Failed to delete meeting' });
  }
});

module.exports = router;






