import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Rating,
  TextField
} from '@mui/material';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SchoolIcon from '@mui/icons-material/School';
import HandshakeIcon from '@mui/icons-material/Handshake';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ConnectWithTeacher = () => {
  const { staffId } = useParams();
  const [navValue, setNavValue] = useState(2);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [meetLink, setMeetLink] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
  fetch(`/api/meetings/${staffId}`)
    .then(res => res.json())
    .then(data => setMeetLink(data.meetLink))
    .catch(err => console.error(err));
}, [staffId]);


 
  const handleMeetRoomClick = () => {
    if (meetLink) {
      navigate('/student/meet-room');
    } else {
      console.log('No meet link available.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff', pb: 12, px: 3, pt: 4 }}>
      <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
        Connect via Google Meet
      </Typography>

      {/* Avatars */}
      <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
        <Box
          sx={{
            width: 64,
            height: 64,
            bgcolor: '#3b82f6',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 32,
            mr: 1
          }}
        >
          👤
        </Box>
        <Typography variant="h6">↔️</Typography>
        <Box
          sx={{
            width: 64,
            height: 64,
            bgcolor: '#9ca3af',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            ml: 1
          }}
        >
          👩‍🏫
        </Box>
      </Box>

      <Typography variant="subtitle1" align="center" mb={3}>
        Join your teacher online and exchange knowledge.
      </Typography>

      <Stack spacing={2}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleMeetRoomClick}
          startIcon={<VideoCallIcon />}
        >
          Meet Room
        </Button>

        {feedbackVisible && (
          <Box mt={4} textAlign="center">
            <Typography variant="h6" gutterBottom>
              Rate Your Session
            </Typography>
            <Rating
              name="session-rating"
              value={rating}
              onChange={(e, newValue) => setRating(newValue)}
            />
            <TextField
              multiline
              rows={3}
              fullWidth
              placeholder="Leave your feedback..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => alert(`Rating: ${rating}\nComment: ${comment}`)}
            >
              Submit Feedback
            </Button>
          </Box>
        )}
      </Stack>

      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          value={navValue}
          onChange={(event, newValue) => setNavValue(newValue)}
        >
          <BottomNavigationAction label="Schedule" icon={<CalendarTodayIcon />} />
          <BottomNavigationAction label="Classes" icon={<SchoolIcon />} />
          <BottomNavigationAction label="Connect" icon={<HandshakeIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default ConnectWithTeacher;
