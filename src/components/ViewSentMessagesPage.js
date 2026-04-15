import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  Divider,
  Link,
  Button,
  IconButton
} from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import LinkIcon from '@mui/icons-material/Link';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const StudentMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('staffMessages')) || [];
    setMessages(stored);
  }, []);

  return (
    <Box sx={{ p: 4, backgroundColor: '#F5F7FA', minHeight: '100vh' }}>
      {/* 🔙 Back to Dashboard Arrow */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton
          onClick={() => navigate('/admin')}
          sx={{
            color: '#1976d2',
            '&:hover': { color: '#0d47a1' },
            mr: 1
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          Messages from Students
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {messages.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No messages from students yet.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {messages.map((msg) => (
            <Card key={msg.id} elevation={1} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <MessageIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    From: {msg.studentName || 'Unknown Student'}
                  </Typography>
                </Box>

                {msg.text && (
                  <Typography variant="body1" gutterBottom>
                    {msg.text}
                  </Typography>
                )}

                {msg.pdfUrl && msg.pdfName && (
                  <Box display="flex" alignItems="center" mb={1}>
                    <AttachFileIcon fontSize="small" sx={{ mr: 1 }} />
                    <Button
                      href={msg.pdfUrl}
                      download={msg.pdfName}
                      target="_blank"
                      rel="noopener"
                      variant="text"
                      sx={{ textTransform: 'none', color: '#1976d2' }}
                    >
                      Download PDF: {msg.pdfName}
                    </Button>
                  </Box>
                )}

                {msg.video && (
                  <Box display="flex" alignItems="center" mb={1}>
                    <VideoLibraryIcon fontSize="small" sx={{ mr: 1 }} />
                    <Link
                      href={msg.video}
                      target="_blank"
                      underline="hover"
                      rel="noopener noreferrer"
                    >
                      Watch Video
                    </Link>
                  </Box>
                )}

                {msg.resource && (
                  <Box display="flex" alignItems="center" mb={1}>
                    <LinkIcon fontSize="small" sx={{ mr: 1 }} />
                    <Link
                      href={msg.resource}
                      target="_blank"
                      underline="hover"
                      rel="noopener noreferrer"
                    >
                      View Resource
                    </Link>
                  </Box>
                )}

                <Typography variant="caption" color="text.secondary">
                  Sent: {msg.timestamp}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default StudentMessagesPage;
