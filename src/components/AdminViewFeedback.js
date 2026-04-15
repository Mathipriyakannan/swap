import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Rating,
  Container,
  Snackbar,
  Alert,
  Stack,
  TextField,
  IconButton,
  MenuItem,
} from '@mui/material';
import FeedbackIcon from '@mui/icons-material/Feedback';
const AdminViewFeedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [staffNames, setStaffNames] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('all');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/feedback/get-feedbacks');
        const data = await res.json();
        if (res.ok) {
          setFeedbackList(data.feedbacks);
          setFilteredFeedback(data.feedbacks);
          
          const names = [...new Set(data.feedbacks.map(item => item.staffName))];
          setStaffNames(names);
          
          setSnackbarMessage('✅ Feedbacks loaded successfully!');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
        } else {
          setSnackbarMessage(data.message || 'Failed to load feedbacks.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        }
      } catch (err) {
        console.error(err);
        setSnackbarMessage('❌ Server error while loading feedbacks.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    };

    fetchFeedback();
  }, []);

  const handleStaffFilter = (event) => {
    const staffName = event.target.value;
    setSelectedStaff(staffName);
    
    if (staffName === 'all') {
      setFilteredFeedback(feedbackList);
    } else {
      const filtered = feedbackList.filter(item => item.staffName === staffName);
      setFilteredFeedback(filtered);
    }
  };

  return (
   <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        
</Box>
      {/* Staff Filter */}
      <Box sx={{ mb: 3 }}>
        <TextField
          select
          label="Filter by Staff"
          value={selectedStaff}
          onChange={handleStaffFilter}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">All Staff</MenuItem>
          {staffNames.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {filteredFeedback.length === 0 ? (
        <Typography>No feedbacks found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredFeedback.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0px 1px 5px rgba(0,0,0,0.1)',
                }}
              >
                <Stack spacing={0.5}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Staff: {item.staffName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Department: {item.department}
                  </Typography>
                </Stack>

                <Divider sx={{ my: 1.5 }} />

                <Box>
                  <Typography>
                    <strong>Emoji Rating:</strong> {item.emojiLabel} {item.emoji}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={1} mt={1}>
                    <Typography fontWeight="medium">Detailed Rating:</Typography>
                    <Rating value={item.extraRating} readOnly />
                  </Box>

                  <Typography sx={{ mt: 1.5 }}>{item.message}</Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminViewFeedback;