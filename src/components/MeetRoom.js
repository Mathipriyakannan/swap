import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import VideoCallIcon from '@mui/icons-material/VideoCall';

const MeetRoom = () => {
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeCheck, setTimeCheck] = useState(null);
  const [timeDialogOpen, setTimeDialogOpen] = useState(false);

  useEffect(() => {
    const fetchMeetingDetails = async () => {
      try {
        let studentName = localStorage.getItem('studentName');
        if (!studentName) {
          const storedUser = JSON.parse(localStorage.getItem('studentUser'));
          studentName = storedUser?.name || '';
        }

        if (!studentName) {
          setError('No student name found. Please log in again.');
          setLoading(false);
          navigate('/login');
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/meetings/student/${encodeURIComponent(studentName)}`
        );

        if (response.data && response.data.meetLink) {
          setMeeting(response.data);
          
          // Check if meeting time is valid
          const timeResponse = await axios.get(
            `http://localhost:5000/api/meetings/check-time/${encodeURIComponent(studentName)}`
          );
          setTimeCheck(timeResponse.data);
        } else {
          setError('No meeting scheduled yet. Please ask your teacher to schedule a meeting.');
        }
      } catch (err) {
        console.error('Error fetching meeting details:', err);
        if (err.response?.status === 404) {
          setError('No meeting scheduled for you yet. Please ask your teacher to schedule a meeting.');
        } else {
          setError(err.response?.data?.error || 'Failed to fetch meeting details. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMeetingDetails();
  }, [navigate]);

  const handleJoinMeeting = async () => {
    try {
      const studentName = localStorage.getItem('studentName') || 
                         JSON.parse(localStorage.getItem('studentUser'))?.name;
      
      if (studentName) {
        const timeResponse = await axios.get(
          `http://localhost:5000/api/meetings/check-time/${encodeURIComponent(studentName)}`
        );
        
        if (timeResponse.data.isValid) {
          // Open meeting link in new tab
          window.open(meeting.meetLink, '_blank', 'noopener,noreferrer');
        } else {
          setTimeCheck(timeResponse.data);
          setTimeDialogOpen(true);
        }
      }
    } catch (err) {
      console.error('Error checking meeting time:', err);
      setTimeDialogOpen(true);
    }
  };

  const handleJoinAnyway = () => {
    if (meeting && meeting.meetLink) {
      window.open(meeting.meetLink, '_blank', 'noopener,noreferrer');
    }
    setTimeDialogOpen(false);
  };

  const formatMeetingTime = (dateStr, timeStr) => {
    try {
      const date = new Date(dateStr);
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return `${date.toLocaleDateString('en-US', options)} at ${timeStr}`;
    } catch (error) {
      return `${dateStr} at ${timeStr}`;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" flexDirection="column">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading your meeting details...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" px={2}>
        <Alert 
          severity="info" 
          sx={{ 
            width: '100%', 
            maxWidth: 500,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" gutterBottom>
            Meeting Information
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/features')}
            sx={{ mt: 1 }}
          >
            Back to Dashboard
          </Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f0f4f8" px={2}>
      <Card sx={{ 
        maxWidth: 500, 
        width: '100%', 
        p: 4, 
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <CardContent>
          <Typography 
            variant="h4" 
            align="center" 
            fontWeight="bold" 
            gutterBottom 
            color="primary"
            sx={{ mb: 3 }}
          >
            Your Meeting Room
          </Typography>

          {timeCheck && !timeCheck.isValid && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Note:</strong> {timeCheck.message}
              </Typography>
            </Alert>
          )}

          <Box sx={{ 
            p: 3, 
            backgroundColor: '#f8f9fa', 
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            mb: 3
          }}>
            <Typography variant="body1" gutterBottom sx={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center' }}>
              <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
              <strong>Date:</strong> {meeting.date}
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center' }}>
              <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
              <strong>Time:</strong> {meeting.time}
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ fontSize: '1.1rem' }}>
              <strong>Student:</strong> {meeting.studentName}
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ fontSize: '1.1rem' }}>
              <strong>Teacher:</strong> {meeting.staffName}
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ fontSize: '1.1rem' }}>
              <strong>Meeting Link:</strong> Ready to join
            </Typography>
          </Box>

          <Box textAlign="center" mt={4}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleJoinMeeting}
              startIcon={<VideoCallIcon />}
              sx={{ 
                mb: 2, 
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: 2
              }}
            >
              Join Google Meet
            </Button>
            <br />
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              onClick={() => navigate('/features')}
              sx={{ 
                mb: 2,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: 2
              }}
            >
              Back to Dashboard
            </Button>
          </Box>

          <Typography variant="body2" color="textSecondary" align="center" mt={4}>
            Click "Join Google Meet" to enter your meeting room. 
            Make sure you join at the scheduled time.
          </Typography>
        </CardContent>
      </Card>

      <Dialog open={timeDialogOpen} onClose={() => setTimeDialogOpen(false)}>
        <DialogTitle>Meeting Time Validation</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            {timeCheck?.message || 'It is not time for your meeting yet.'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Your meeting is scheduled for: {formatMeetingTime(meeting?.date, meeting?.time)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTimeDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleJoinAnyway}
            variant="contained"
            startIcon={<VideoCallIcon />}
          >
            Join Anyway
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MeetRoom;

