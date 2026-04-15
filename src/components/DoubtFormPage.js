import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Container, Grid
} from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DoubtFormPage = () => {
  const { subject, staff } = useParams();
  const [username, setUsername] = useState('');
  const [doubt, setDoubt] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('studentName') || 
                      localStorage.getItem('swapUserName') || 
                      JSON.parse(localStorage.getItem('studentUser'))?.name;
    
    if (storedName) {
      setUsername(storedName);
    }
  }, []);

  const handleSubmit = async () => {
    const formData = {
      staffName: staff,
      department: subject,
      username,
      subject,
      doubt
    };

    try {
      await axios.post('http://localhost:5000/api/admin/submit-request', formData);
      alert('Your doubt has been submitted!');
      setDoubt('');
    } catch (error) {
      alert('Failed to submit doubt');
      console.error('Doubt submission error:', error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1b0f2e 0%, #2a0f4e 40%, #3e0e60 60%, #a72693 100%)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        color: '#fff'
      }}
    >
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            color: '#fff',
            textShadow: '0 0 10px rgba(255,255,255,0.3)'
          }}
        >
          Submit Your Doubt
        </Typography>
        <Box
          sx={{
            width: 80,
            height: 3,
            backgroundColor: '#ff00cc',
            mx: 'auto',
            mt: 1,
            borderRadius: 2
          }}
        />
      </Box>

      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            backgroundColor: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px'
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={username}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                  style: { color: '#fff' }
                }}
                InputLabelProps={{ style: { color: '#ccc' } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subject"
                value={subject}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                  style: { color: '#fff' }
                }}
                InputLabelProps={{ style: { color: '#ccc' } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Staff Name"
                value={staff}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                  style: { color: '#fff' }
                }}
                InputLabelProps={{ style: { color: '#ccc' } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Your Message"
                value={doubt}
                onChange={(e) => setDoubt(e.target.value)}
                variant="outlined"
                InputProps={{ style: { color: '#fff' } }}
                InputLabelProps={{ style: { color: '#ccc' } }}
              />
            </Grid>

            <Grid item xs={12} sx={{ textAlign: 'right' }}>
              <Button
                variant="contained"
                sx={{
                  background: 'linear-gradient(90deg, #ff00cc, #6a00ff)',
                  borderRadius: 20,
                  px: 4,
                  py: 1,
                  fontWeight: 'bold',
                  boxShadow: '0 0 15px rgba(255,0,204,0.5)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #ff33dd, #7a33ff)'
                  }
                }}
                onClick={handleSubmit}
                disabled={!doubt}
              >
                SUBMIT
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Box sx={{ mt: 4 }}>
        <Box
          sx={{
            backgroundColor: 'rgba(0,0,0,0.2)',
            py: 4
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={2} justifyContent="space-between">
              <Grid item>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#fff' }}>
                  <a 
                    href="https://www.lifechangersind.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: '#fff', textDecoration: 'none' }}
                  >
                    LifeChangers IND
                  </a>
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                 
                  <a 
                    href="https://www.instagram.com/lifechangersind" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" 
                      alt="Instagram" 
                      width="24" 
                    />
                  </a>
                  <a 
                    href="https://www.facebook.com/lifechangersind" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/733/733547.png" 
                      alt="Facebook" 
                      width="24" 
                    />
                  </a>
                </Box>
              </Grid>

              <Grid item>
                <Typography variant="h6" sx={{ color: '#fff' }}>
                  SwapKnowledge
                </Typography>
              </Grid>
            </Grid>
          </Container>
        </Box>

        <Box textAlign="center" py={2} sx={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <Typography variant="caption" sx={{ color: '#ccc' }}>
  all rights reserved || designed & developed by{" "}
  <a 
    href="https://www.lifechangersind.com" 
    target="_blank" 
    rel="noopener noreferrer" 
    style={{ color: '#ccc', textDecoration: 'none', fontWeight: 'bold' }}
  >
    LifeChangersInd
  </a>
</Typography>

        </Box>
      </Box>
    </Box>
  );
};

export default DoubtFormPage;
