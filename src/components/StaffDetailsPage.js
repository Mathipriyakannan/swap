import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Stack,
  Button,
  IconButton,
  Paper,
  Container,
  Divider,
  CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import EmailIcon from '@mui/icons-material/Email';
import WcIcon from '@mui/icons-material/Wc';
import ChatIcon from '@mui/icons-material/Chat';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

const StaffDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { staff } = location.state || {};
  const [followersCount, setFollowersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch actual followers count from backend
  useEffect(() => {
    const fetchFollowersCount = async () => {
      if (!staff || !staff._id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/follow/followers-count/${staff._id}`);
if (response.ok) {
  const data = await response.json();
  setFollowersCount(data.followersCount || 0);
} else {
          console.error('Failed to fetch followers');
          setFollowersCount(staff.followers || 0);
        }
      } catch (error) {
        console.error('Error fetching followers:', error);
        setFollowersCount(staff.followers || 0);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowersCount(); // ✅ This was missing - you need to call the function
  }, [staff]);

  if (!staff) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #1e2a78, #3f1d87)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3
      }}>
        <Card sx={{ maxWidth: 400, textAlign: 'center', p: 3 }}>
          <Typography variant="h6" color="error" gutterBottom>
            Staff Information Not Available
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please search for a staff member first to view their profile.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/')}
            startIcon={<ArrowBackIcon />}
          >
            Back to Home
          </Button>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1e2a78, #3f1d87)',
      color: 'white',
      py: 3
    }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton 
            onClick={() => navigate(-1)} 
            sx={{ 
              color: 'white',
              mr: 2,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="bold">
            Staff Profile
          </Typography>
        </Box>

        {/* Staff Information Card */}
        <Card sx={{ 
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          mb: 3
        }}>
          <CardContent sx={{ p: 4 }}>
            {/* Profile Header */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 4, 
              gap: 3,
              flexDirection: { xs: 'column', sm: 'row' },
              textAlign: { xs: 'center', sm: 'left' }
            }}>
              <Avatar sx={{ 
                width: 100, 
                height: 100, 
                bgcolor: '#1e2a78',
                fontSize: '2rem'
              }}>
                <PersonIcon sx={{ fontSize: 50 }} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  {staff.fullName}
                </Typography>
                <Chip 
                  icon={<WorkIcon />} 
                  label={staff.staffPost} 
                  color="primary" 
                  variant="filled"
                  sx={{ 
                    fontSize: '1rem',
                    py: 1,
                    '& .MuiChip-icon': { fontSize: '1.2rem' }
                  }}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Information Grid */}
            <Stack spacing={3}>
              {/* Department */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: 50,
                  height: 50,
                  backgroundColor: '#e3f2fd',
                  borderRadius: '50%'
                }}>
                  <SchoolIcon sx={{ color: '#1e2a78', fontSize: 30 }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="medium">
                    Department
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="#1e2a78">
                    {staff.department}
                  </Typography>
                </Box>
              </Box>

              {/* Email */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: 50,
                  height: 50,
                  backgroundColor: '#e8f5e8',
                  borderRadius: '50%'
                }}>
                  <EmailIcon sx={{ color: '#2e7d32', fontSize: 30 }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="medium">
                    Email Address
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="#2e7d32">
                    {staff.email}
                  </Typography>
                </Box>
              </Box>

              {/* Gender */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: 50,
                  height: 50,
                  backgroundColor: '#f3e5f5',
                  borderRadius: '50%'
                }}>
                  <WcIcon sx={{ color: '#7b1fa2', fontSize: 30 }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="medium">
                    Gender
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="#7b1fa2">
                    {staff.gender}
                  </Typography>
                </Box>
              </Box>

            
            </Stack>

            {/* Action Buttons */}
            <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#1e2a78', mb: 2 }}>
                Connect with {staff.fullName.split(' ')[0]}
              </Typography>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                sx={{ mt: 2 }}
              >
                <Button 
                  variant="contained" 
                  fullWidth
                  startIcon={<ChatIcon />}
                  onClick={() => navigate('/student/chat', { 
                    state: { staffName: staff.fullName } 
                  })}
                  sx={{
                    background: 'linear-gradient(135deg, #1e2a78, #3f1d87)',
                    color: '#fff',
                    fontWeight: 'bold',
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #3f1d87, #1e2a78)',
                    },
                  }}
                >
                  Start Chat
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth
                  startIcon={<QuestionAnswerIcon />}
                  onClick={() => navigate(`/form/${staff.department}/${staff.fullName}`)}
                  sx={{
                    borderColor: '#1e2a78',
                    color: '#1e2a78',
                    fontWeight: 'bold',
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': {
                      backgroundColor: '#1e2a78',
                      color: 'white',
                      borderColor: '#1e2a78',
                    },
                  }}
                >
                  Send Doubt Request
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Paper sx={{ 
          p: 3, 
          backgroundColor: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <Typography variant="body2" align="center" sx={{ color: 'white' }}>
            🔒 For privacy and security reasons, only limited information is displayed to students.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default StaffDetailsPage;