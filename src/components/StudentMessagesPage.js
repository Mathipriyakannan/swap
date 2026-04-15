import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Link,
  Divider,
  Button,
  Stack,
  CircularProgress,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import LinkIcon from '@mui/icons-material/Link';
import axios from 'axios';

const StudentMessagesPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const storedUser = JSON.parse(localStorage.getItem('studentUser'));
  const studentName = storedUser?.name;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/messages/${studentName}`);
        const validMessages = res.data.filter(msg =>
          msg.timestamp && !isNaN(new Date(msg.timestamp).getTime())
        );
        setMessages(validMessages);
        setError(null);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (studentName) {
      fetchMessages();
    } else {
      setError('Student name not found. Please login again.');
      setLoading(false);
    }
  }, [studentName]);

  const formatTimestamp = (timestamp) => {
    try {
      if (!timestamp) return 'Unknown';
      const date = new Date(timestamp);
      return isNaN(date.getTime()) ? 'Unknown' : date.toLocaleString();
    } catch {
      return 'Unknown';
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1b0f2e 0%, #2a0f4e 40%, #3e0e60 60%, #a72693 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Paper
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 650,
          borderRadius: '20px',
          backgroundColor: 'rgba(25, 0, 50, 0.9)',
          color: '#fff',
          boxShadow: '0px 8px 30px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(10px)'
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

        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          align="center"
          sx={{ color: '#fff', mb: 3 }}
        >
          📩 Messages from Your Teacher
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress sx={{ color: '#ff00a6' }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        ) : messages.length === 0 ? (
          <Typography variant="body2" align="center" sx={{ color: '#ccc' }}>
            No messages received yet.
          </Typography>
        ) : (
        <List
  sx={{
    maxHeight: '400px', 
    overflowY: 'auto',  
    pr: 1, 
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: 'rgba(255,255,255,0.5)',
    }
  }}
>
  {messages.map((msg, index) => (
    <React.Fragment key={msg._id || index}>
      <ListItem
        alignItems="flex-start"
        sx={{
          background: 'linear-gradient(90deg, rgba(255,0,166,0.1), rgba(106,0,255,0.1))',
          borderRadius: '12px',
          mb: 2,
          p: 2
        }}
      >
        <ListItemText
          primary={
            <Typography fontWeight="bold" sx={{ color: '#ff00a6' }}>
              From: {msg.from || 'Staff'}
            </Typography>
          }
          secondary={
            <Stack spacing={1} mt={1}>
              {msg.text && (
                <Typography variant="body1" sx={{ color: '#fff' }}>
                  {msg.text}
                </Typography>
              )}

              {msg.fileName && (
                <Button
                  variant="text"
                  href={`http://localhost:5000/uploads/${msg.fileName}`}
                  download={msg.fileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<AttachFileIcon fontSize="small" sx={{ color: '#00eaff' }} />}
                  sx={{
                    color: '#00eaff',
                    justifyContent: 'flex-start',
                    p: 0
                  }}
                >
                  Download File: {msg.fileName}
                </Button>
              )}

              {msg.video && (
                <Link
                  href={msg.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  display="flex"
                  alignItems="center"
                  sx={{ color: '#00eaff' }}
                >
                  <VideoLibraryIcon fontSize="small" sx={{ mr: 0.5 }} />
                  Watch Video
                </Link>
              )}

              {msg.resource && (
                <Link
                  href={msg.resource}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  display="flex"
                  alignItems="center"
                  sx={{ color: '#00eaff' }}
                >
                  <LinkIcon fontSize="small" sx={{ mr: 0.5 }} />
                  Resource Link
                </Link>
              )}
            </Stack>
          }
        />
      </ListItem>
      <Typography
        variant="caption"
        sx={{ ml: 1, color: '#aaa' }}
      >
        Sent: {formatTimestamp(msg.timestamp)}
      </Typography>
    </React.Fragment>
  ))}
</List>

        )}
      </Paper>
    </Box>
  );
};

export default StudentMessagesPage;
