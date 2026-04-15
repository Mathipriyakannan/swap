import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Badge,
  useMediaQuery,
} from '@mui/material';
import PieChartIcon from '@mui/icons-material/PieChart';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import PeopleIcon from '@mui/icons-material/People';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FeedbackIcon from '@mui/icons-material/Feedback';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import FeedIcon from '@mui/icons-material/Feed';
import { useNavigate, useLocation } from 'react-router-dom';
import Typewriter from 'typewriter-effect';

const collapsedWidth = 80;
const fullWidth = 260;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message || '';
  const [feedbackCount, setFeedbackCount] = useState(0);

  const [anchorEl, setAnchorEl] = useState(null);
  const [userName, setUserName] = useState('');
  const [messageCount, setMessageCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const isMobile = useMediaQuery('(max-width:600px)');

  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (storedUser?.fullName) setUserName(storedUser.fullName);

    const count = parseInt(localStorage.getItem('newStaffMessageCount') || '0', 10);
    setMessageCount(count);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const count = parseInt(localStorage.getItem('newStaffMessageCount') || '0', 10);
      setMessageCount(count);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const fetchFeedbackCount = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/swap/feedback-count");
        const data = await res.json();
        if (res.ok) {
          setFeedbackCount(data.count || 0);
        }
      } catch (err) {
        console.error("Error fetching feedback count:", err);
      }
    };

    fetchFeedbackCount();
    const interval = setInterval(fetchFeedbackCount, 30000); 
    return () => clearInterval(interval);
  }, []);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/staff/login');
  };

  const formattedDateTime = currentDateTime.toLocaleString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f1b2e' }}>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={sidebarOpen}
        onClose={handleSidebarToggle}
        sx={{
          width: sidebarOpen ? fullWidth : collapsedWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          transition: 'width 0.3s',
          [`& .MuiDrawer-paper`]: {
            width: sidebarOpen ? fullWidth : collapsedWidth,
            transition: 'width 0.3s',
            overflowX: 'hidden',
            background: 'linear-gradient(to bottom, #5fdce2ff, #4facfe)',
            color: '#fff',
            borderRight: 'none',
            borderTopRightRadius: 30,
            borderBottomRightRadius: 30,
          },
        }}
      >
        <Toolbar />
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ textAlign: 'center', my: 2 }}>
            <IconButton onClick={handleSidebarToggle} sx={{ color: '#fff' }}>
              {sidebarOpen ? <ChevronLeftIcon /> : <MenuOpenIcon />}
            </IconButton>
          </Box>
          <List>
            <ListItem button onClick={() => navigate('/admin')}>
              <ListItemIcon sx={{ color: '#fff' }}><PieChartIcon /></ListItemIcon>
              {sidebarOpen && <ListItemText primary="Dashboard" />}
            </ListItem>
            
            <ListItem button onClick={() => navigate('/social-feed')}>
              <ListItemIcon sx={{ color: '#fff' }}><FeedIcon /></ListItemIcon>
              {sidebarOpen && <ListItemText primary="View All Posts" />}
            </ListItem>
            
            <ListItem button onClick={() => {
              const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
              const staffId = storedUser?._id;
              if (staffId) navigate(`/admin/view/${staffId}`);
              else alert('Staff ID not found. Please login again.');
            }}>
              <ListItemIcon sx={{ color: '#fff' }}><DesktopWindowsIcon /></ListItemIcon>
              {sidebarOpen && <ListItemText primary="Student Requests" />}
            </ListItem>
            <ListItem button onClick={() => navigate('/admin/register-user')}>
              <ListItemIcon sx={{ color: '#fff' }}><PeopleIcon /></ListItemIcon>
              {sidebarOpen && <ListItemText primary="Staff Registration" />}
            </ListItem>
            <ListItem button onClick={() => {
              navigate('/admin/sent-messages');
              localStorage.setItem('newStaffMessageCount', '0');
              setMessageCount(0);
            }}>
              <ListItemIcon sx={{ color: '#fff' }}>
                <Badge badgeContent={messageCount} color="error" invisible={messageCount === 0}>
                  <NotificationsIcon />
                </Badge>
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Sent Messages" />}
            </ListItem>
            <ListItem button onClick={() => navigate('/admin/view-feedbacks')}>
              <ListItemIcon sx={{ color: '#fff' }}>
                <Badge
                  badgeContent={feedbackCount}
                  color="error"
                  invisible={feedbackCount === 0} 
                >
                  <FeedbackIcon />
                </Badge>
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="View Feedbacks" />}
            </ListItem>
          </List>

          <Box sx={{ mt: 'auto', p: 2, textAlign: 'center', fontSize: 12 }}>
            {sidebarOpen && (
              <Typography id="date-time" color="#0f1b2e">
                {formattedDateTime}
              </Typography>
            )}
          </Box>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: 'width 0.3s',
          width: `calc(100% - ${isMobile ? 0 : (sidebarOpen ? fullWidth : collapsedWidth)}px)`,
          backgroundColor: '#0f1b2e',
          color: '#fff',
        }}
      >
        <AppBar position="static" elevation={0} sx={{ background: 'transparent', boxShadow: 'none' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff' }}>
              Staff Dashboard
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              {successMessage && (
                <Typography variant="body1" sx={{ color: '#00f2fe', fontWeight: 'bold' }}>
                  {successMessage}
                </Typography>
              )}

              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#00f2fe',
                  color: '#000',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  '&:hover': { backgroundColor: '#00d4e6' },
                }}
                onClick={() => {
                  const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
                  navigate('/create-post', { state: { staffName: storedUser?.fullName } });
                }}
              >
                + Post
              </Button>

              {userName && (
                <>
                  <IconButton>
                    <NotificationsIcon sx={{ fontSize: 28, color: '#00f2fe' }} />
                  </IconButton>
                  <IconButton onClick={handleMenuOpen}>
                    <AccountCircleIcon sx={{ fontSize: 30, color: '#00f2fe' }} />
                  </IconButton>
                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    <MenuItem disabled>{userName}</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            borderRadius: 4,
            px: 4,
            py: 4,
            background: '#1f2a40',
            boxShadow: '0 4px 30px rgba(0,0,0,0.4)',
            color: '#fff',
            width: '100%',
            minHeight: 'calc(100vh - 64px - 48px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <Grid container spacing={4} alignItems="center" direction={isMobile ? "column" : "row"}>
            <Grid item xs={12} md={6}>
              <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                Welcome to{' '}
                <span style={{ color: '#5fdce2ff' }}>
                  Knowledge Partner
                </span>
              </Typography>
              <Typography variant={isMobile ? "body1" : "h6"} fontWeight="bold" gutterBottom>
                "The beautiful thing about learning is that no one can take it away from you."
              </Typography>
              <Typography variant="body2">
                Your words today light someone’s fire.
              </Typography>
            </Grid>

            <img
              src="/images/swap.jpg"
              alt="SWAP KNOWLEDGE Logo"
              style={{
                width: isMobile ? '100px' : '150px',
                height: 'auto',
                position: 'absolute',
                top: '20px',
                right: '20px'
              }}
            />

            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" justifyContent="space-between" gap={3} flexDirection={isMobile ? "column" : "row"}>
                {/* Cards */}
                <Box display="flex" justifyContent="flex-start" gap={3} flexWrap="wrap">
                  <Card
                    onClick={() => {
                      const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
                      const staffId = storedUser?._id;
                      if (staffId) navigate(`/admin/view/${staffId}`);
                      else alert('Staff ID not found. Please login again.');
                    }}
                    sx={{
                      borderRadius: 4,
                      cursor: 'pointer',
                      width: isMobile ? '100%' : 200,
                      background: '#263859',
                      color: '#fff',
                      '&:hover': { boxShadow: 6, backgroundColor: '#2f3e63' },
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center' }}>
                      <DesktopWindowsIcon sx={{ fontSize: 40, color: '#00f2fe' }} />
                      <Typography variant="h6" fontWeight="bold" mt={1}>Student Request</Typography>
                      <Typography variant="body2">View all student requests</Typography>
                    </CardContent>
                  </Card>

                  <Card
                    onClick={() => navigate('/admin/register-user')}
                    sx={{
                      borderRadius: 4,
                      cursor: 'pointer',
                      width: isMobile ? '100%' : 200,
                      background: '#263859',
                      color: '#fff',
                      '&:hover': { boxShadow: 6, backgroundColor: '#2f3e63' },
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center' }}>
                      <PeopleIcon sx={{ fontSize: 40, color: '#00f2fe' }} />
                      <Typography variant="h6" fontWeight="bold" mt={1}>Staff Registration</Typography>
                      <Typography variant="body2">Manage registered users</Typography>
                    </CardContent>
                  </Card>
                </Box>

                <Box sx={{ textAlign: isMobile ? "center" : "right", minWidth: isMobile ? '100%' : '400px' }}>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                    <Typewriter
                      options={{ delay: 100 }}
                      onInit={(typewriter) => {
                        typewriter
                          .typeString(
                            `<span style="font-size:2.5rem; color:#aa56cc;">S</span><span style="font-size:1.8rem;">WAP</span>`
                          )
                          .pauseFor(1200)
                          .start();
                      }}
                    />
                  </Typography>

                  <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                    <Typewriter
                      options={{ delay: 100 }}
                      onInit={(typewriter) => {
                        typewriter
                          .typeString(
                            `<span style="font-size:4.5rem; color:#aa56cc;">K</span><span style="font-size:2.8rem;">NOWLED</span><span style="font-size:2.5rem; color:#aa56cc;">G</span><span style="font-size:1.8rem;">E</span>`
                          )
                          .pauseFor(1200)
                          .start();
                      }}
                    />
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;