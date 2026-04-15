import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  TextField,
  Rating,
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const emojiRatings = [
  { emoji: '🤢', label: 'Very bad', value: 1 },
  { emoji: '😐', label: 'Bad', value: 2 },
  { emoji: '🙂', label: 'So so', value: 3 },
  { emoji: '😊', label: 'Good', value: 4 },
  { emoji: '😍', label: 'Excellent', value: 5 },
];

export default function FeedbackPage() {
  const [selectedRating, setSelectedRating] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [extraRating, setExtraRating] = useState(0);
  const [staffName, setStaffName] = useState('');
  const [department, setDepartment] = useState('');
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleSubmit = async () => {
    if (!staffName.trim() || !department.trim()) {
      setSnackbar({
        open: true,
        message: '⚠️ Please enter staff name and department.',
        severity: 'warning'
      });
      return;
    }
    if (!selectedRating) {
      setSnackbar({
        open: true,
        message: '⚠️ Please select a rating.',
        severity: 'warning'
      });
      return;
    }
    if (!feedback.trim()) {
      setSnackbar({
        open: true,
        message: '⚠️ Please enter your feedback.',
        severity: 'warning'
      });
      return;
    }

    const payload = {
      staffName,
      department,
      emoji: selectedRating.emoji,
      emojiLabel: selectedRating.label,
      extraRating,
      message: feedback,
    };

    try {
      const res = await fetch("http://localhost:5000/api/feedback/submit-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setSnackbar({
          open: true,
          message: `✅ Feedback submitted successfully for ${data.staffName}!`,
          severity: 'success'
        });
        handleCancel();
      } else {
        setSnackbar({
          open: true,
          message: data.message || '❌ Submission failed.',
          severity: 'error'
        });
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setSnackbar({
        open: true,
        message: '❌ Server error. Please try again later.',
        severity: 'error'
      });
    }
  };

  const handleCancel = () => {
    setStaffName('');
    setDepartment('');
    setSelectedRating(null);
    setExtraRating(0);
    setFeedback('');
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
 

  return (
    <Box
      sx={{
        minHeight: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1b0f2e 0%, #2a0f4e 40%, #3e0e60 60%, #a72693 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 4,
            background: 'rgba(20, 10, 35, 0.85)',
            backdropFilter: 'blur(12px)',
            textAlign: 'center',
            color: '#fff',
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ color: '#ff00cc', mb: 1 }}
          >
            Feedback Form
          </Typography>

          <Typography
            variant="body2"
            sx={{ mb: 3, color: '#ccc' }}
          >
            We value your feedback. Please rate your experience below.
          </Typography>

          <TextField
            placeholder="Enter Staff Name"
            fullWidth
            variant="outlined"
            value={staffName}
            onChange={(e) => setStaffName(e.target.value)}
            sx={{
              mt: 1.5,
              mb: 2,
              input: { color: '#fff' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#6a00ff' },
                '&:hover fieldset': { borderColor: '#ff00cc' },
                '&.Mui-focused fieldset': { borderColor: '#ff00cc' },
              },
            }}
          />

          <TextField
            placeholder="Enter Department"
            fullWidth
            variant="outlined"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            sx={{
              mb: 3,
              input: { color: '#fff' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#6a00ff' },
                '&:hover fieldset': { borderColor: '#ff00cc' },
                '&.Mui-focused fieldset': { borderColor: '#ff00cc' },
              },
            }}
          />

          <Box display="flex" justifyContent="center" flexWrap="wrap" gap={2} mb={3}>
            {emojiRatings.map((rate) => (
              <Box
                key={rate.value}
                onClick={() => setSelectedRating(rate)}
                sx={{
                  cursor: 'pointer',
                  border: selectedRating?.value === rate.value ? '2px solid #ff00cc' : '2px solid transparent',
                  borderRadius: 2,
                  p: 1.5,
                  minWidth: 80,
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  transition: '0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <Typography fontSize={28}>{rate.emoji}</Typography>
                <Typography fontSize={13} color="#ccc">
                  {rate.label}
                </Typography>
              </Box>
            ))}
          </Box>

          <Typography variant="subtitle1" sx={{ color: '#ccc', mb: 1 }}>
            Optional: Rate in stars (1–5)
          </Typography>
          <Box display="flex" justifyContent="center" mb={3}>
            <Rating
              name="extra-rating"
              value={extraRating}
              onChange={(event, newValue) => setExtraRating(newValue)}
              size="large"
              sx={{
                '& .MuiRating-iconFilled': { color: '#ff00cc' },
                '& .MuiRating-iconHover': { color: '#ff00cc' },
              }}
            />
          </Box>

          <TextField
            label="Your Feedback"
            multiline
            rows={4}
            fullWidth
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            sx={{
              mb: 3,
              textarea: { color: '#fff' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#6a00ff' },
                '&:hover fieldset': { borderColor: '#ff00cc' },
                '&.Mui-focused fieldset': { borderColor: '#ff00cc' },
              },
              label: { color: '#ccc' },
            }}
          />

          <Box display="flex" justifyContent="space-between">
          <Button
  variant="outlined"
  onClick={() => navigate('/features')}
  sx={{
    borderRadius: 3,
    px: 4,
    color: '#ff00cc',
    borderColor: '#ff00cc',
    '&:hover': {
      backgroundColor: 'rgba(255,0,204,0.1)',
      borderColor: '#ff00cc',
    },
  }}
>
  Cancel
</Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                px: 4,
                borderRadius: 3,
                background: 'linear-gradient(90deg, #6a00ff, #ff00cc)',
                color: '#fff',
                fontWeight: 'bold',
                '&:hover': {
                  opacity: 0.9,
                },
              }}
            >
              Submit
            </Button>
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}