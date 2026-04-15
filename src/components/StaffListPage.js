import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Chip,
  Stack
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import ChatIcon from '@mui/icons-material/Chat';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { fetchStaffBySubject } from '../api/adminApi';

const SubjectStaffListPage = () => {
  const { subject } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // ✅ Get current student info from localStorage - FIXED VERSION
  const getCurrentStudent = () => {
    try {
      // Try multiple possible storage locations
      const studentUser = localStorage.getItem('studentUser');
      const userData = localStorage.getItem('user');
      
      if (studentUser) {
        const user = JSON.parse(studentUser);
        return {
          _id: user.id || user._id,
          name: user.name || 'Student',
          email: user.email
        };
      } else if (userData) {
        const user = JSON.parse(userData);
        return {
          _id: user._id || user.id,
          name: user.name || user.username || user.fullName || 'Student',
          email: user.email
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

  const currentStudent = getCurrentStudent();

  // ✅ Fetch staff by subject and check follow status
  useEffect(() => {
    const loadStaff = async () => {
      try {
        const data = await fetchStaffBySubject(subject);

        const staffWithFollowStatus = await Promise.all(
          data.map(async (staffMember) => {
            try {
              if (!currentStudent || !currentStudent._id) {
                return { ...staffMember, isFollowing: false };
              }

              const response = await fetch(
                `http://localhost:5000/api/follow/status/${staffMember._id}?studentId=${currentStudent._id}`
              );

              if (response.ok) {
                const followData = await response.json();
                return { ...staffMember, isFollowing: followData.isFollowing || false };
              }

              return { ...staffMember, isFollowing: false };
            } catch (error) {
              console.error('Error fetching follow status:', error);
              return { ...staffMember, isFollowing: false };
            }
          })
        );

        setStaff(staffWithFollowStatus);
        setError(null);
      } catch (error) {
        console.error('Staff fetch error:', error);
        setError(error.message || 'Failed to fetch staff data');
        setStaff([]);
      } finally {
        setLoading(false);
      }
    };

    if (subject) {
      loadStaff();
    }
  }, [subject, currentStudent]);

  const handleRowClick = (id) => {
    setSelectedRowId((prev) => (prev === id ? null : id));
  };

  const handleSpeakClick = (staff) => {
    setSelectedStaff(staff);
    setOpenDialog(true);
  };

  const handleChatClick = () => {
    navigate('/student/chat', { state: { staffName: selectedStaff.fullName, subject } });
    setOpenDialog(false);
  };

  const handleDoubtRequestClick = () => {
    navigate(`/form/${subject}/${selectedStaff.fullName}`);
    setOpenDialog(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStaff(null);
  };

  // ✅ UPDATED: Follow handler with correct student name
  const handleFollowClick = async (staffId, event) => {
    event?.stopPropagation();

    if (!currentStudent || !currentStudent._id) {
      setSnackbar({
        open: true,
        message: 'Please login to follow staff',
        severity: 'error'
      });
      return;
    }

    const staffMember = staff.find(s => s._id === staffId);
    const isCurrentlyFollowing = staffMember?.isFollowing;

    try {
      const endpoint = isCurrentlyFollowing
        ? `http://localhost:5000/api/follow/unfollow/${staffId}`
        : `http://localhost:5000/api/follow/follow/${staffId}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: currentStudent._id,
          studentName: currentStudent.name, // ✅ This will send the correct student name
          staffName: staffMember.fullName
        })
      });

      const result = await response.json();

      if (response.ok) {
        if (result.requiresApproval) {
          // ✅ Follow request sent for approval
          setSnackbar({
            open: true,
            message: result.message || 'Follow request sent for approval!',
            severity: 'info'
          });
        } else {
          // ✅ Direct follow successful
          setStaff(prevStaff =>
            prevStaff.map(s =>
              s._id === staffId ? { ...s, isFollowing: !s.isFollowing } : s
            )
          );
          setSnackbar({
            open: true,
            message: result.message || 'Followed successfully!',
            severity: 'success'
          });
        }
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Cannot follow this staff',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Follow action error:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to update follow status',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // ✅ Mobile Card View
  const MobileStaffCard = ({ staffMember }) => (
    <Card
      sx={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        mb: 2,
        color: '#fff',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: 'rgba(255,255,255,0.08)',
          transform: 'translateY(-2px)'
        }
      }}
      onClick={() => handleRowClick(staffMember._id)}
    >
      <CardContent>
        <Stack spacing={2}>
          {/* Staff Info Row */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box flex={1}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                {staffMember.fullName || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#ddd', mb: 1 }}>
                {staffMember.email || 'N/A'}
              </Typography>
              <Chip 
                label={staffMember.department || 'N/A'} 
                size="small"
                sx={{
                  backgroundColor: 'rgba(106, 0, 255, 0.2)',
                  color: '#fff',
                  border: '1px solid rgba(106, 0, 255, 0.5)'
                }}
              />
            </Box>
            
            {/* Follow Button */}
            <IconButton
              onClick={(e) => handleFollowClick(staffMember._id, e)}
              sx={{
                color: staffMember.isFollowing ? '#ff007f' : '#fff',
                backgroundColor: staffMember.isFollowing
                  ? 'rgba(255, 0, 127, 0.2)'
                  : 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: staffMember.isFollowing
                    ? 'rgba(255, 0, 127, 0.3)'
                    : 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
                ml: 1
              }}
            >
              {staffMember.isFollowing ? <PersonRemoveIcon /> : <PersonAddIcon />}
            </IconButton>
          </Box>

          {/* Connect Button - Show when expanded */}
          {selectedRowId === staffMember._id && (
            <Button
              variant="contained"
              fullWidth
              sx={{
                background: 'linear-gradient(to right, #ff007f, #6a00ff)',
                color: '#fff',
                fontWeight: 'bold',
                py: 1,
                borderRadius: '12px',
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(to right, #ff3399, #8a33ff)',
                },
              }}
              onClick={() => handleSpeakClick(staffMember)}
            >
              Connect with Staff →
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );

  // ✅ Desktop Table View
  const DesktopTableView = () => (
    <TableContainer
      component={Paper}
      elevation={6}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        overflow: 'hidden',
        maxWidth: 900,
        width: '100%',
      }}
    >
      <Table>
        <TableHead sx={{ background: 'linear-gradient(90deg, #6a00ff, #ff007f)' }}>
          <TableRow>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Department</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
              Follow
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {staff.length > 0 ? (
            staff.map((s) => (
              <React.Fragment key={s._id}>
                <TableRow
                  hover
                  onClick={() => handleRowClick(s._id)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
                  }}
                >
                  <TableCell sx={{ color: '#fff' }}>{s.fullName || 'N/A'}</TableCell>
                  <TableCell sx={{ color: '#ddd' }}>{s.email || 'N/A'}</TableCell>
                  <TableCell sx={{ color: '#bbb' }}>{s.department || 'N/A'}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <IconButton
                      onClick={(e) => handleFollowClick(s._id, e)}
                      sx={{
                        color: s.isFollowing ? '#ff007f' : '#fff',
                        backgroundColor: s.isFollowing
                          ? 'rgba(255, 0, 127, 0.2)'
                          : 'rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                          backgroundColor: s.isFollowing
                            ? 'rgba(255, 0, 127, 0.3)'
                            : 'rgba(255, 255, 255, 0.2)',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {s.isFollowing ? <PersonRemoveIcon /> : <PersonAddIcon />}
                    </IconButton>
                  </TableCell>
                </TableRow>

                {selectedRowId === s._id && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 2 }}>
                      <Button
                        variant="contained"
                        sx={{
                          background: 'linear-gradient(to right, #ff007f, #6a00ff)',
                          color: '#fff',
                          fontWeight: 'bold',
                          px: 3,
                          py: 1,
                          borderRadius: '50px',
                          textTransform: 'none',
                          '&:hover': {
                            background: 'linear-gradient(to right, #ff3399, #8a33ff)',
                          },
                        }}
                        onClick={() => handleSpeakClick(s)}
                      >
                        Connect with Staff →
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 3, color: '#ccc' }}>
                {error ? 'Error loading staff' : 'No staff found for this subject'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1b0f2e 0%, #2a0f4e 40%, #3e0e60 60%, #a72693 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: { xs: 2, sm: 3, md: 4 },
        color: '#fff',
      }}
    >
      <Typography
        variant={isMobile ? "h5" : "h4"}
        fontWeight="bold"
        sx={{ 
          mb: 3, 
          textShadow: '0px 0px 8px rgba(255,255,255,0.3)',
          textAlign: 'center',
          px: 2
        }}
      >
        Staff for Subject: {subject}
        {currentStudent && (
          <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.8 }}>
            Logged in as: {currentStudent.name}
          </Typography>
        )}
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
          <CircularProgress sx={{ color: '#ff00cc' }} />
        </Box>
      ) : error ? (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3, 
            backgroundColor: 'rgba(255,0,0,0.2)', 
            color: '#fff',
            width: '100%',
            maxWidth: 600
          }}
        >
          {error}
        </Alert>
      ) : (
        <Box sx={{ width: '100%', maxWidth: 900 }}>
          {isMobile ? (
            <Box>
              {staff.length > 0 ? (
                staff.map((staffMember) => (
                  <MobileStaffCard key={staffMember._id} staffMember={staffMember} />
                ))
              ) : (
                <Box 
                  sx={{ 
                    textAlign: 'center', 
                    py: 3, 
                    color: '#ccc',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    p: 3
                  }}
                >
                  No staff found for this subject
                </Box>
              )}
            </Box>
          ) : (
            <DesktopTableView />
          )}
        </Box>
      )}

      {/* ✅ Responsive Dialog for connection options */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #2a0f4e 0%, #3e0e60 100%)',
            color: '#fff',
            borderRadius: isMobile ? 0 : '20px',
            m: isMobile ? 0 : 2,
            maxWidth: isMobile ? '100%' : 500,
            width: '100%'
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', pt: isMobile ? 4 : 2 }}>
          How would you like to connect with {selectedStaff?.fullName}?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ textAlign: 'center', mb: 2 }}>
            Choose your preferred method of communication
          </Typography>
        </DialogContent>
        <DialogActions sx={{ 
          justifyContent: 'center', 
          pb: isMobile ? 4 : 3, 
          gap: 2,
          flexDirection: isMobile ? 'column' : 'row',
          px: 3
        }}>
          <Button
            variant="contained"
            onClick={handleChatClick}
            startIcon={<ChatIcon />}
            fullWidth={isMobile}
            sx={{
              background: 'linear-gradient(to right, #6a00ff, #ff007f)',
              color: '#fff',
              fontWeight: 'bold',
              px: 4,
              py: 1.5,
              borderRadius: '50px',
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(to right, #8a33ff, #ff3399)',
              },
            }}
          >
            Start Chat
          </Button>
          <Button
            variant="contained"
            onClick={handleDoubtRequestClick}
            startIcon={<QuestionAnswerIcon />}
            fullWidth={isMobile}
            sx={{
              background: 'linear-gradient(to right, #ff007f, #6a00ff)',
              color: '#fff',
              fontWeight: 'bold',
              px: 4,
              py: 1.5,
              borderRadius: '50px',
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(to right, #ff3399, #8a33ff)',
              },
            }}
          >
            Send Doubt Request
          </Button>
        </DialogActions>
        {isMobile && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Button 
              onClick={handleCloseDialog}
              sx={{ color: '#fff' }}
            >
              Cancel
            </Button>
          </Box>
        )}
      </Dialog>

      {/* ✅ Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            backgroundColor:
              snackbar.severity === 'success' ? 'rgba(76, 175, 80, 0.9)' :
              snackbar.severity === 'info' ? 'rgba(33, 150, 243, 0.9)' :
              'rgba(244, 67, 54, 0.9)',
            color: 'white',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SubjectStaffListPage;