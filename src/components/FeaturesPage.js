import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  TextField,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Chip,
  Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PostAddIcon from '@mui/icons-material/PostAdd';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ChatIcon from '@mui/icons-material/Chat';
import FeedIcon from '@mui/icons-material/Feed';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import EmailIcon from '@mui/icons-material/Email';
import WcIcon from '@mui/icons-material/Wc';
import { useNavigate } from 'react-router-dom';

export default function FeaturesPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [hasNewMeeting, setHasNewMeeting] = useState(false);
  const [meetingDetails, setMeetingDetails] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    try {
      const stored = localStorage.getItem('studentUser');
      if (stored && stored !== 'undefined') {
        const parsed = JSON.parse(stored);
        if (parsed?.name) {
          setUserName(parsed.name);
          setUserId(parsed.id);
          checkForNewMeetings(parsed.name);
        }
      } else {
        console.warn('studentUser is missing or invalid in localStorage');
      }
    } catch (error) {
      console.error('Error parsing studentUser:', error);
    }

    const intervalId = setInterval(() => {
      const storedUser = localStorage.getItem('studentUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        checkForNewMeetings(parsedUser.name);
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const checkForNewMeetings = async (studentName) => {
    try {
      const response = await fetch(`http://localhost:5000/api/meetings/student/${encodeURIComponent(studentName)}`);
      
      if (response.ok) {
        const meetingData = await response.json();
        
        if (meetingData && meetingData.meetLink) {
          const lastMeetingId = localStorage.getItem('lastMeetingId');
          
          if (!lastMeetingId || lastMeetingId !== meetingData.id) {
            setHasNewMeeting(true);
            setMeetingDetails(meetingData);
            localStorage.setItem('lastMeetingId', meetingData.id);
          } else {
            setHasNewMeeting(false);
          }
        } else {
          setHasNewMeeting(false);
        }
      }
    } catch (error) {
      console.error('Error checking for meetings:', error);
    }
  };

  const handleNotificationClick = () => {
    if (hasNewMeeting && meetingDetails) {
      alert(`New Meeting Scheduled!\n\nStaff: ${meetingDetails.staffName}\nDate: ${meetingDetails.date}\nTime: ${meetingDetails.time}\nLink: ${meetingDetails.meetLink}`);
      setHasNewMeeting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('studentUser');
    localStorage.removeItem('lastMeetingId');
    navigate('/login');
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/search-staff?name=${encodeURIComponent(searchQuery)}`);
      
      if (response.ok) {
        const staffData = await response.json();
        
        if (staffData.length > 0) {
          setSearchResults(staffData);
          setShowSearchResults(true);
        } else {
          setSearchResults([]);
          setShowSearchResults(true);
        }
      } else {
        console.error('Search failed:', response.status);
        alert('Search failed. Please try again.');
      }
    } catch (error) {
      console.error('Error searching for staff:', error);
      alert('Error searching for staff. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleNavigateToStaffProfile = (staff) => {
    // Navigate to staff details page with ONLY allowed information
    navigate('/staff-details', {
      state: {
        staff: {
          // Only these fields are visible to students
          fullName: staff.fullName,
          followers: staff.followers || 0,
          email: staff.email,
          gender: staff.gender,
          department: staff.department,
          staffPost: staff.staffPost,
          // Hide sensitive information like phone, address, salary, etc.
        }
      }
    });
    setShowSearchResults(false);
    setSearchQuery('');
  };

  const features = [
    {
      icon: <PostAddIcon sx={{ fontSize: 40, color: '#fff' }} />,
      label: 'Share your own knowledge',
      description: 'Share your own knowledge.',
      onClick: () => navigate('/swap-posts'),
    },
    {
      icon: <MeetingRoomIcon sx={{ fontSize: 40, color: '#fff' }} />,
      label: 'Google meeting room',
      description: 'Join a live Google Meet discussion.',
      onClick: () => navigate('/student/meet-room'),
    },
  ];

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#1e2a78' }}>
        <Toolbar sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          flexWrap: 'nowrap',
          overflow: 'hidden',
          minHeight: '64px !important',
          gap: 1,
          px: 1,
        }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 'bold', 
            color: 'white',
            fontSize: isMobile ? '1rem' : '1.25rem',
            whiteSpace: 'nowrap',
          }}>
            SwapKnowledge
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: isMobile ? 0.5 : 2,
            flexWrap: 'nowrap',
            overflow: 'hidden',
          }}>
            {/* View All Posts button */}
            <IconButton 
              sx={{ color: '#fff', padding: isMobile ? '6px' : '8px' }} 
              onClick={() => navigate('/social-feed')}
            >
              {!isMobile && (
                <Typography variant="body2" sx={{ fontSize: '0.8rem', mr: 0.5 }}>
                  View All Posts
                </Typography>
              )}
              <FeedIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>

            <IconButton 
              sx={{ color: '#fff', padding: isMobile ? '6px' : '8px' }} 
              onClick={() => navigate('/student/messages')}
            >
              {!isMobile && (
                <Typography variant="body2" sx={{ fontSize: '0.8rem', mr: 0.5 }}>
                  Messages
                </Typography>
              )}
              <DashboardIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>

            <IconButton 
              sx={{ color: '#fff', padding: isMobile ? '6px' : '8px' }} 
              onClick={() => navigate('/admin/view-feedbacks')}
            >
              {!isMobile && (
                <Typography variant="body2" sx={{ fontSize: '0.8rem', mr: 0.5 }}>
                  View Feedback
                </Typography>
              )}
              <ChatIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>

            <IconButton 
              sx={{ color: '#fff', padding: isMobile ? '6px' : '8px' }}
              onClick={handleNotificationClick}
            >
              <Badge 
                color="error" 
                variant="dot" 
                invisible={!hasNewMeeting}
                sx={{
                  '& .MuiBadge-dot': {
                    backgroundColor: '#30e0a1',
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                  }
                }}
              >
                <NotificationsIcon fontSize={isMobile ? "small" : "medium"} />
              </Badge>
            </IconButton>
            
            {!isMobile && (
              <Typography variant="body1" sx={{ fontWeight: 500, color: 'white', whiteSpace: 'nowrap' }}>
                {userName || 'Guest'}
              </Typography>
            )}
            
            <Avatar sx={{ 
              bgcolor: '#30e0a1', 
              width: isMobile ? 28 : 32, 
              height: isMobile ? 28 : 32,
              fontSize: isMobile ? '0.8rem' : '1rem'
            }}>
              {userName ? userName[0]?.toUpperCase() : '?'}
            </Avatar>
            
            <Button
              variant="outlined"
              size="small"
              sx={{
                color: '#fff',
                borderColor: '#fff',
                textTransform: 'none',
                minWidth: 'auto',
                padding: isMobile ? '4px 8px' : '6px 16px',
                fontSize: isMobile ? '0.7rem' : '0.875rem',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
              onClick={handleLogout}
            >
              {isMobile ? 'Logout' : 'Logout'}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1e2a78, #3f1d87)',
          color: 'white',
          py: { xs: 6, md: 10 },
          fontFamily: 'Roboto, sans-serif',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' }, mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<PostAddIcon />}
              sx={{
                backgroundColor: '#30e0a1',
                color: '#000',
                fontWeight: 'bold',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#25b987' },
              }}
              onClick={() => navigate('/student-post')}
            >
              Post
            </Button>
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              textAlign: 'center',
              fontSize: { xs: '1.6rem', md: '2.2rem' },
            }}
          >
            Learn. Grow. <span style={{ color: '#30e0a1' }}>Build your career.</span>
          </Typography>
          <Typography sx={{ fontSize: { xs: 12, md: 14 }, mb: 3, textAlign: 'center' }}>
            "Education is the passport to the future, for tomorrow belongs to those who prepare for it today."
          </Typography>

          <Paper
            sx={{
              p: 2,
              mt: 4,
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'center', md: 'flex-end' },
              flexWrap: 'wrap',
              backgroundColor: '#fff',
              borderRadius: 3,
              gap: 2,
            }}
          >
            <TextField
              variant="outlined"
              placeholder="Search staff by name..."
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              sx={{
                backgroundColor: '#f5f5f5',
                borderRadius: 4,
                width: { xs: '100%', sm: '70%', md: 400 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 4,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#3f1d87' }} />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #1e2a78, #3f1d87)',
                color: '#fff',
                fontWeight: 'bold',
                px: 2,
                minWidth: 120,
                borderRadius: 4,
                '&:hover': {
                  opacity: 0.9,
                },
              }}
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? <CircularProgress size={24} /> : 'Search'}
            </Button>

            <Button
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #1e2a78, #3f1d87)',
                color: '#fff',
                fontWeight: 'bold',
                px: 2,
                minWidth: 120,
                borderRadius: 4,
                '&:hover': {
                  opacity: 0.9,
                },
              }}
              onClick={() => {
                if (userId) {
                  navigate(`/student/view/${userId}`);
                } else {
                  alert("User ID not found. Please log in again.");
                  navigate('/login');
                }
              }}
            >
              My Profile
            </Button>

            <Button
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #1e2a78, #3f1d87)',
                color: '#fff',
                fontWeight: 'bold',
                px: 2,
                minWidth: 120,
                borderRadius: 4,
                '&:hover': {
                  opacity: 0.9,
                },
              }}
              onClick={() => navigate('/feedback')}
            >
              Feedback
            </Button>
          </Paper>

          {/* Search Results Dialog */}
          <Dialog 
            open={showSearchResults} 
            onClose={() => setShowSearchResults(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              Search Results
              <IconButton
                aria-label="close"
                onClick={() => setShowSearchResults(false)}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              {searchResults.length > 0 ? (
                <Box>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Found {searchResults.length} staff member(s) matching "{searchQuery}":
                  </Typography>
                  <List>
                    {searchResults.map((staff) => (
                      <ListItem 
                        key={staff._id}
                        button
                        onClick={() => handleNavigateToStaffProfile(staff)}
                        sx={{
                          mb: 1,
                          borderRadius: 2,
                          border: '1px solid #e0e0e0',
                          '&:hover': {
                            backgroundColor: '#f5f5f5',
                            borderColor: '#1e2a78'
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: '#1e2a78' }}>
                            {staff.fullName ? staff.fullName[0].toUpperCase() : 'S'}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e2a78' }}>
                              {staff.fullName}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Stack direction="row" spacing={1} sx={{ mb: 1 }} flexWrap="wrap" gap={0.5}>
                                <Chip 
                                  icon={<SchoolIcon />} 
                                  label={staff.department} 
                                  size="small" 
                                  variant="outlined"
                                  color="primary"
                                />
                                <Chip 
                                  icon={<WorkIcon />} 
                                  label={staff.staffPost} 
                                  size="small" 
                                  variant="outlined"
                                />
                                {staff.followers && (
                                  <Chip 
                                    icon={<PeopleIcon />} 
                                    label={`${staff.followers} followers`} 
                                    size="small" 
                                    color="secondary"
                                  />
                                )}
                              </Stack>
                              <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <EmailIcon fontSize="small" />
                                {staff.email}
                              </Typography>
                              {staff.gender && (
                                <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                  <WcIcon fontSize="small" />
                                  {staff.gender}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <PersonIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body1" color="textSecondary">
                    No staff members found with the name "{searchQuery}".
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowSearchResults(false)}>
                Close
              </Button>
            </DialogActions>
          </Dialog>

          <Grid container spacing={4} justifyContent="center">
            {features.map((feature, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Box
                  onClick={feature.onClick}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    borderRadius: 4,
                    p: { xs: 3, md: 4 },
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: '0.3s',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.15)',
                    },
                  }}
                >
                  {feature.icon}
                  <Typography variant="body1" mt={1}>
                    {feature.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
}

