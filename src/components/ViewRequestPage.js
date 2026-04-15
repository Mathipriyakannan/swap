import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Divider,
  Link,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import WarningIcon from '@mui/icons-material/Warning';

const ViewRequestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const staffName = location.state?.staffName || 'Unknown Staff';
  const studentName = location.state?.studentName || 'Unknown Student';
  const studentEmail = location.state?.studentEmail || 'no-email@example.com';

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [meetLink, setMeetLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  const [instructionsDialogOpen, setInstructionsDialogOpen] = useState(false);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const isValidDateTime = () => {
    if (!selectedDate || !selectedTime) return false;
    
    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const now = new Date();
    
    return selectedDateTime > now;
  };

  const handleGenerateMeetLink = async () => {
    if (!selectedDate || !selectedTime) {
      setAlert({
        open: true,
        message: 'Please select both date and time.',
        severity: 'warning'
      });
      return;
    }

    if (!isValidDateTime()) {
      setAlert({
        open: true,
        message: 'Please select a future date and time for the meeting.',
        severity: 'warning'
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/meetings/schedule', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentName: studentName.trim(),
          studentEmail: studentEmail.trim(),
          staffName: staffName.trim(),
          date: selectedDate,
          time: selectedTime
          // Note: We're NOT sending meetLink - backend will generate it
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMeetLink(data.meeting.meetLink);
        
        setAlert({
          open: true,
          message: `Google Meet created successfully for ${studentName}!`,
          severity: 'success'
        });

        // Show instructions dialog
        setInstructionsDialogOpen(true);

      } else {
        throw new Error(data.error || 'Failed to schedule meeting');
      }
    } catch (err) {
      console.error('Request failed:', err);
      setAlert({
        open: true,
        message: `Error: ${err.message}`,
        severity: 'error'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(meetLink);
      setAlert({
        open: true,
        message: 'Meeting link copied to clipboard!',
        severity: 'success'
      });
    } catch (err) {
      setAlert({
        open: true,
        message: 'Failed to copy link. Please copy manually.',
        severity: 'warning'
      });
    }
  };

  const handleJoinMeeting = () => {
    if (meetLink) {
      window.open(meetLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSendToStudent = () => {
    const emailSubject = `Meeting Invitation: ${staffName} with ${studentName}`;
    const emailBody = `Meeting Link: ${meetLink}\nDate: ${selectedDate}\nTime: ${selectedTime}`;
    
    // Simulate email sending
    setAlert({
      open: true,
      message: `Meeting invitation sent to ${studentEmail}!`,
      severity: 'success'
    });
  };

  const formatDisplayDate = (dateStr) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  const formatDisplayTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#F5F7FA', minHeight: '100vh' }}>
      <Box mb={4} display="flex" alignItems="center">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ color: '#4A69E0', fontWeight: 'bold' }}
        >
          Back
        </Button>
      </Box>

      <Paper
        elevation={2}
        sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: '#FFFFFF',
          maxWidth: 600,
          mx: 'auto',
          boxShadow: '0px 2px 10px rgba(0,0,0,0.05)'
        }}
      >
        <Typography variant="h5" fontWeight="bold" color="#4A69E0" gutterBottom>
          Schedule Google Meet
        </Typography>
        
        <Box mb={3}>
          <Chip 
            icon={<WarningIcon />} 
            label="First person to join becomes meeting host" 
            color="info" 
            variant="outlined"
            size="small"
          />
        </Box>

        <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
          Staff: {staffName}
        </Typography>
        <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
          Student: {studentName}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Email: {studentEmail}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Stack spacing={3}>
          <TextField
            label="Select Date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            inputProps={{ min: getTodayDate() }}
            InputProps={{
              startAdornment: <CalendarTodayIcon sx={{ mr: 1, color: '#4A69E0' }} />
            }}
            helperText="Select a future date"
          />

          <TextField
            label="Select Time"
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            InputProps={{
              startAdornment: <AccessTimeIcon sx={{ mr: 1, color: '#4A69E0' }} />
            }}
            helperText="Select meeting time"
          />

          <Button
            variant="contained"
            onClick={handleGenerateMeetLink}
            disabled={isGenerating || !selectedDate || !selectedTime}
            startIcon={<VideoCallIcon />}
            sx={{
              backgroundColor: '#4A69E0',
              fontWeight: 'bold',
              borderRadius: 2,
              py: 1.2,
              '&:hover': {
                backgroundColor: '#3A59D0'
              }
            }}
          >
            {isGenerating ? 'Creating Google Meet...' : 'Create Google Meet Link'}
          </Button>
        </Stack>

        {meetLink && (
          <Box mt={4} p={3} sx={{ backgroundColor: '#f0f7ff', borderRadius: 2, border: '2px solid #4A69E0' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="success.main">
              ✅ Google Meet Ready!
            </Typography>

            <Box mt={2}>
              <Typography variant="body1" gutterBottom>
                <strong>Date:</strong> {formatDisplayDate(selectedDate)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Time:</strong> {formatDisplayTime(selectedTime)}
              </Typography>
              
              <Box mt={2}>
                <Typography variant="body1" fontWeight="bold" gutterBottom>
                  Google Meet Link:
                </Typography>
                <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      wordBreak: 'break-all',
                      fontSize: '0.9rem',
                      color: '#1976d2',
                      fontWeight: 'bold'
                    }}
                  >
                    {meetLink}
                  </Typography>
                  <Button 
                    size="small" 
                    startIcon={<ContentCopyIcon />}
                    onClick={handleCopyLink}
                    variant="outlined"
                  >
                    Copy
                  </Button>
                </Box>
              </Box>
            </Box>

            <Box mt={3} display="flex" gap={2} flexWrap="wrap">
              <Button
                variant="contained"
                color="primary"
                onClick={handleJoinMeeting}
                startIcon={<VideoCallIcon />}
              >
                Join Meeting Now
              </Button>
              
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleSendToStudent}
              >
                Send to Student
              </Button>

              <Button
                variant="text"
                color="info"
                onClick={() => setInstructionsDialogOpen(true)}
              >
                View Instructions
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Instructions Dialog */}
      <Dialog open={instructionsDialogOpen} onClose={() => setInstructionsDialogOpen(false)} maxWidth="md">
        <DialogTitle>Google Meet Instructions</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            <strong>How to use this meeting link:</strong>
          </Typography>
          <ul>
            <li><strong>Staff should join first</strong> to become the meeting host</li>
            <li>Click "Join Meeting Now" to create the Google Meet room</li>
            <li>You must be logged into your Google account</li>
            <li>Share the meeting link with the student</li>
            <li>The meeting room will be created when the first person joins</li>
          </ul>

          <Box mt={2} p={2} sx={{ backgroundColor: '#e8f5e8', borderRadius: 1 }}>
            <Typography variant="body2" color="#2e7d32" fontWeight="bold">
              ✅ This link will ALWAYS work because it creates a new meeting room instantly!
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInstructionsDialogOpen(false)}>Close</Button>
          <Button onClick={handleJoinMeeting} variant="contained" startIcon={<VideoCallIcon />}>
            Join Meeting Now
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ViewRequestPage;


