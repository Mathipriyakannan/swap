import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  Link,
  Stack,
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import LinkIcon from '@mui/icons-material/Link';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const SendMessagePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { studentName } = location.state || {};
  const selectedStudentName = studentName || 'Selected Student';

  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [video, setVideo] = useState('');
  const [resource, setResource] = useState('');
  const [messages, setMessages] = useState([]);
  const staffName = localStorage.getItem('staffName') || 'Staff';

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/messages/${selectedStudentName}`);
        setMessages(res.data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();
  }, [selectedStudentName]);

  const handleSend = async () => {
  if (!message && !file && !video && !resource) {
    alert('Please enter a message or upload a file or add a link.');
    return;
  }

  const newMsg = {
    from: staffName,
    to: selectedStudentName,
    text: message,
    fileName: file?.name || '',
    video,
    resource,
  };

  try {
    const res = await axios.post('http://localhost:5000/api/messages/send', newMsg);
    setMessages([res.data, ...messages]);
    setMessage('');
    setFile(null);
    setVideo('');
    setResource('');

    alert('Message sent successfully!'); // ✅ Alert added here
  } catch (err) {
    console.error('Error sending message:', err);
    alert('Failed to send message.');
  }
};


  return (
    <Box sx={{ p: 4, backgroundColor: '#F5F7FA', minHeight: '100vh' }}>
      {/* Header */}
      <Box mb={4} display="flex" alignItems="center">
        <IconButton onClick={() => navigate(-1)} sx={{ color: '#4A69E0', mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" fontWeight="bold">
          Send Message to{' '}
          <Box component="span" sx={{ color: '#4A69E0' }}>
            {selectedStudentName}
          </Box>
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
        <Stack spacing={3}>
          <TextField
            label="Message"
            multiline
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
          />

          <TextField
            label="YouTube / Video Link"
            value={video}
            onChange={(e) => setVideo(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VideoLibraryIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Resource Link (Google Docs, Drive, etc.)"
            value={resource}
            onChange={(e) => setResource(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LinkIcon />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="outlined"
            component="label"
            startIcon={<AttachFileIcon />}
          >
            Upload PDF/Video File
            <input
              type="file"
              hidden
              accept=".pdf,video/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Button>

          {file && (
            <Typography variant="body2" color="text.secondary">
              Selected: {file.name}
            </Typography>
          )}

          <Box textAlign="right">
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleSend}
              sx={{ backgroundColor: '#4A69E0', textTransform: 'none' }}
            >
              Send Message
            </Button>
          </Box>
        </Stack>
      </Paper>

      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Sent Messages to {selectedStudentName}
      </Typography>

      {messages.filter((msg) => msg.to === selectedStudentName).length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No messages sent yet.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {messages
            .filter((msg) => msg.to === selectedStudentName)
            .map((msg, index) => (
              <Card key={msg._id || index} variant="outlined">
                <CardContent>
                  {msg.text && (
                    <Typography variant="body1" gutterBottom>
                      {msg.text}
                    </Typography>
                  )}

                  {msg.fileName && (
                    <Typography variant="body2" color="text.secondary">
                      <AttachFileIcon sx={{ mr: 1 }} fontSize="small" />
                      File: {msg.fileName}
                    </Typography>
                  )}

                  {msg.video && (
                    <Box display="flex" alignItems="center" mt={1}>
                      <VideoLibraryIcon fontSize="small" sx={{ mr: 1 }} />
                      <Link href={msg.video} target="_blank" underline="hover">
                        Watch Video
                      </Link>
                    </Box>
                  )}

                  {msg.resource && (
                    <Box display="flex" alignItems="center" mt={1}>
                      <LinkIcon fontSize="small" sx={{ mr: 1 }} />
                      <Link href={msg.resource} target="_blank" underline="hover">
                        View Resource
                      </Link>
                    </Box>
                  )}

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    mt={2}
                    display="block"
                  >
                    Sent: {new Date(msg.timestamp).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            ))}
        </Stack>
      )}
    </Box>
  );
};

export default SendMessagePage;
