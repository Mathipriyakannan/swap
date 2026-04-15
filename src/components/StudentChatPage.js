import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const StudentChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [textMessage, setTextMessage] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [resourceLink, setResourceLink] = useState('');
  const [pdfFile, setPdfFile] = useState(null);

  const [studentName, setStudentName] = useState('');
  const [staffName, setStaffName] = useState('');

  useEffect(() => {
    const fetchStudentName = async () => {
      try {
        const storedStudentName = localStorage.getItem('studentName');
        
        if (storedStudentName) {
          setStudentName(storedStudentName);
          return;
        }
        
        const studentUser = JSON.parse(localStorage.getItem('studentUser') || '{}');
        if (studentUser.name) {
          setStudentName(studentUser.name);
          localStorage.setItem('studentName', studentUser.name);
          return;
        }
        
        const studentEmail = localStorage.getItem('studentEmail') || studentUser.email;
        
        if (studentEmail) {
          const response = await axios.get(`http://localhost:5000/api/swapKnowledge/get-user/${studentEmail}`);
          if (response.data && response.data.name) {
            setStudentName(response.data.name);
            localStorage.setItem('studentName', response.data.name);
          } else {
            setStudentName('Student');
          }
        } else {
          setStudentName('Student');
        }
      } catch (error) {
        console.error('Error fetching student name:', error);
        setStudentName('Student');
      }
    };

    fetchStudentName();
    
    // Get staff name from navigation state or localStorage
    const staffNameFromState = location.state?.staffName;
    const storedStaff = localStorage.getItem('staffName');
    
    if (staffNameFromState) {
      setStaffName(staffNameFromState);
      localStorage.setItem('staffName', staffNameFromState);
    } else if (storedStaff) {
      setStaffName(storedStaff);
    } else {
      setStaffName('Staff');
    }
  }, [location.state]);

  const handlePDFChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      alert('Please select a valid PDF file');
    }
  };

  const handleSubmit = () => {
    if (!textMessage && !videoLink && !resourceLink && !pdfFile) {
      alert('Please fill at least one field');
      return;
    }

    const payload = {
      id: Date.now(),
      text: textMessage || '',
      video: videoLink || '',
      resource: resourceLink || '',
      pdfName: pdfFile?.name || '',
      studentName,
      staffName,
      timestamp: new Date().toLocaleString(),
    };

    const previous = JSON.parse(localStorage.getItem('staffMessages')) || [];
    const updated = [payload, ...previous];
    localStorage.setItem('staffMessages', JSON.stringify(updated));
    localStorage.setItem('newStaffMessageCount', updated.length.toString());

    alert('Message sent to staff!');
    setTextMessage('');
    setVideoLink('');
    setResourceLink('');
    setPdfFile(null);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1b0f2e 0%, #2a0f4e 40%, #3e0e60 60%, #a72693 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2
      }}
    >
      <Paper
        elevation={6}
        sx={{
          borderRadius: '20px',
          p: 4,
          maxWidth: { xs: '100%', sm: 500, md: 600 },
          width: '100%',
          textAlign: 'center',
          backgroundColor: 'rgba(25, 0, 50, 0.9)',
          color: '#fff',
          position: 'relative'
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            mb: 2,
            color: '#fff',
            textTransform: 'none',
            borderRadius: '50px',
            px: 2,
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
          }}
        >
          Back
        </Button>

        <Typography variant="h5" fontWeight="bold" mb={1} sx={{ color: '#fff', mt: 1 }}>
          Messages Send to Staff
        </Typography>

        <Typography variant="body2" mb={3} sx={{ color: '#bbb' }}>
          student: {studentName} ↔ staff: {staffName}
        </Typography>

        <Stack spacing={2}>
          <TextField
            placeholder="Enter Message"
            value={textMessage}
            onChange={(e) => setTextMessage(e.target.value)}
            fullWidth
            multiline
            rows={3}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '50px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: '#fff',
                '& fieldset': { border: '1px solid rgba(255,255,255,0.3)' }
              },
              '& input, & textarea': { color: '#fff' }
            }}
          />

          <TextField
            placeholder="Video Link (e.g., YouTube)"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '50px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: '#fff',
                '& fieldset': { border: '1px solid rgba(255,255,255,0.3)' }
              },
              '& input': { color: '#fff' }
            }}
          />

          <Button
            variant="outlined"
            component="label"
            sx={{
              borderRadius: '50px',
              textTransform: 'none',
              color: '#fff',
              borderColor: 'rgba(255,255,255,0.5)'
            }}
          >
            Upload PDF
            <input
              type="file"
              accept="application/pdf"
              hidden
              onChange={handlePDFChange}
            />
          </Button>

          {pdfFile && (
            <Typography variant="body2" sx={{ color: '#bbb' }}>
              Selected: {pdfFile.name}
            </Typography>
          )}

          <TextField
            placeholder="Other Resource Link"
            value={resourceLink}
            onChange={(e) => setResourceLink(e.target.value)}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '50px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: '#fff',
                '& fieldset': { border: '1px solid rgba(255,255,255,0.3)' }
              },
              '& input': { color: '#fff' }
            }}
          />

          <Button
            variant="contained"
            sx={{
              mt: 2,
              py: 1.2,
              borderRadius: '50px',
              textTransform: 'none',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #ff007f, #6a00ff)'
            }}
            onClick={handleSubmit}
          >
            Send to Staff →
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default StudentChatPage;