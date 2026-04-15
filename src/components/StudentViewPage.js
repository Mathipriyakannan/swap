import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";

export default function StudentViewPage() {
  const [student, setStudent] = useState(null);
  const [posts, setPosts] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const classLevels = ['1st Standard', '2nd Standard', '3rd Standard', '4th Standard', '5th Standard', '6th Standard', '7th Standard', '8th Standard', '9th Standard', '10th Standard', '11th Standard', '12th Standard', '1st Year', '2nd Year', '3rd Year', '4th Year'];
  const collegeTypes = ['Government', 'Private', 'Aided', 'Autonomous'];
  const exams = ['SSLC', 'HSC', 'UG', 'PG', 'Diploma', 'Other'];

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/student/get-user-by-id/${id}`);
        
        if (res.data) {
          setStudent(res.data);
          setEditForm(res.data); 
        } else {
          setSnackbar({ open: true, message: 'Failed to fetch student data', severity: 'error' });
        }
      } catch (err) {
        console.error('Error fetching student data:', err);
        let errorMessage = 'Error fetching student data';
        
        if (err.response) {
          errorMessage = err.response.data.message || errorMessage;
        } else if (err.request) {
          errorMessage = 'No response from server. Please check your connection.';
        }
        
        setSnackbar({ open: true, message: errorMessage, severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudentData();
    }
  }, [id]);

  useEffect(() => {
    const fetchStudentPosts = async () => {
      if (tabValue === 2 && student) {
        try {
          setPostsLoading(true);
          const response = await axios.get(`http://localhost:5000/api/posts?author=${student.name}&userType=Student`);
          setPosts(response.data.posts || []);
        } catch (err) {
          console.error('Error fetching student posts:', err);
          setSnackbar({ open: true, message: 'Error fetching posts', severity: 'error' });
        } finally {
          setPostsLoading(false);
        }
      }
    };

    fetchStudentPosts();
  }, [tabValue, student]);

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${postToDelete._id}`);
      
      setPosts(posts.filter(post => post._id !== postToDelete._id));
      
      setSnackbar({ open: true, message: 'Post deleted successfully', severity: 'success' });
    } catch (err) {
      console.error('Error deleting post:', err);
      setSnackbar({ open: true, message: 'Error deleting post', severity: 'error' });
    } finally {
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const response = await axios.put(`http://localhost:5000/api/student/update-profile/${id}`, editForm);
      
      if (response.data) {
        setStudent(response.data);
        setSnackbar({ open: true, message: 'Profile updated successfully', severity: 'success' });
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setSnackbar({ open: true, message: 'Error updating profile', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const getFileIcon = (fileUrl) => {
    if (!fileUrl) return null;
    
    const extension = fileUrl.split('.').pop().toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <PictureAsPdfIcon sx={{ mr: 1, color: '#f44336' }} />;
      case 'doc':
      case 'docx':
        return <DescriptionIcon sx={{ mr: 1, color: '#2196f3' }} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <ImageIcon sx={{ mr: 1, color: '#4caf50' }} />;
      default:
        return <InsertDriveFileIcon sx={{ mr: 1, color: '#9e9e9e' }} />;
    }
  };

  const handleCloseSnackbar = () => setSnackbar((s) => ({ ...s, open: false }));

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ background: 'linear-gradient(135deg, #1f0040, #2b0b60)' }}
      >
        <CircularProgress sx={{ color: '#a885ff' }} />
      </Box>
    );
  }

  if (!student) {
    return (
      <Box
        textAlign="center"
        mt={10}
        sx={{ background: 'linear-gradient(135deg, #1f0040, #2b0b60)', minHeight: '100vh', color: '#fff' }}
      >
        <Typography variant="h6">Student not found</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')}
          sx={{ mt: 2, bgcolor: '#6f42c1', '&:hover': { bgcolor: '#5a32a3' } }}
        >
          Go Home
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ background: 'linear-gradient(135deg, #1f0040, #2b0b60)', py: 5, minHeight: '100vh', color: '#fff' }}>
      <Container maxWidth="lg">
        <IconButton 
          onClick={() => navigate(-1)} 
          sx={{ color: '#fff', mb: 2, bgcolor: 'rgba(111,66,193,0.3)', '&:hover': { bgcolor: 'rgba(111,66,193,0.5)' } }}
        >
          <ArrowBackIcon />
        </IconButton>
        
        <Paper
          elevation={6}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            borderRadius: 4,
            overflow: 'hidden',
            bgcolor: '#1a0033',
            color: '#fff',
          }}
        >
          <Box
            sx={{
              width: { xs: '100%', md: 280 },
              background: 'rgba(255,255,255,0.05)',
              px: 2,
              py: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backdropFilter: 'blur(6px)',
            }}
          >
            <Box sx={{ position: 'relative', mb: 2, textAlign: 'center' }}>
              <Avatar
                src={student.profileImage || 'https://randomuser.me/api/portraits/men/75.jpg'}
                sx={{ width: 120, height: 120, border: '3px solid #6f42c1', mx: 'auto' }}
              />
            </Box>

            <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
              {student.name}
            </Typography>
            <Typography variant="body2" sx={{ color: '#a885ff', textAlign: 'center' }}>
              {student.category} Student
            </Typography>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: '#a885ff' }}>
                {posts.length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#d0b8ff' }}>
                Total Posts
              </Typography>
            </Box>

            {Array.isArray(student.skills) && student.skills.length > 0 && (
              <Box sx={{ alignSelf: 'flex-start', mt: 4, width: '100%' }}>
                <Typography variant="subtitle2" sx={{ mb: 1, px: 1, color: '#a885ff', textAlign: 'center' }}>
                  SKILLS
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, px: 1, justifyContent: 'center' }}>
                  {student.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      size="small"
                      sx={{ backgroundColor: '#6f42c1', color: '#fff', fontWeight: 'bold' }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          <Box sx={{ flex: 1, p: { xs: 2, md: 4 } }}>
            <Box
              display="flex"
              flexDirection={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              gap={2}
              mb={2}
            >
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {student.name}
                </Typography>
                <Typography sx={{ fontSize: 16, color: '#a885ff' }}>
                  {student.category} Student
                </Typography>
                <Typography variant="body2" sx={{ color: '#d0b8ff', mt: 1 }}>
                  Student ID: {id}
                </Typography>
              </Box>
            </Box>

            <Tabs
              value={tabValue}
              onChange={(e, newVal) => setTabValue(newVal)}
              TabIndicatorProps={{ style: { backgroundColor: '#a885ff' } }}
              textColor="inherit"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="About" sx={{ color: '#fff' }} />
              <Tab label="Edit Profile" sx={{ color: tabValue === 1 ? '#fff' : 'rgba(255,255,255,0.7)' }} />
              <Tab label={`Posts (${posts.length})`} sx={{ color: tabValue === 2 ? '#fff' : 'rgba(255,255,255,0.7)' }} />
            </Tabs>
            <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />

            {tabValue === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: '#a885ff' }}>
                    Email
                  </Typography>
                  <Typography variant="body1">{student.email || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: '#a885ff' }}>
                    District
                  </Typography>
                  <Typography variant="body1">{student.district || '-'}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: '#a885ff' }}>
                    School/College
                  </Typography>
                  <Typography variant="body1">{student.school || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: '#a885ff' }}>
                    Department
                  </Typography>
                  <Typography variant="body1">{student.department || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: '#a885ff' }}>
                    Class Level
                  </Typography>
                  <Typography variant="body1">{student.classLevel || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: '#a885ff' }}>
                    College Type
                  </Typography>
                  <Typography variant="body1">{student.collegeType || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: '#a885ff' }}>
                    Exam
                  </Typography>
                  <Typography variant="body1">{student.exam || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: '#a885ff' }}>
                    Date of Birth
                  </Typography>
                  <Typography variant="body1">{student.dob || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: '#a885ff' }}>
                    Phone
                  </Typography>
                  <Typography variant="body1">{student.phone || '-'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ color: '#a885ff' }}>
                    Social Media
                  </Typography>
                  <Typography variant="body1">
                    {student.socialLink ? (
                      <a href={student.socialLink} target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>
                        {student.socialLink}
                      </a>
                    ) : (
                      '-'
                    )}
                  </Typography>
                </Grid>
              </Grid>
            )}

            {tabValue === 1 && (
              <Box>
                <Typography variant="h5" sx={{ mb: 3, color: '#a885ff', textAlign: 'center' }}>
                  Edit Profile
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={editForm.email || ''}
                      onChange={handleInputChange}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: '#fff',
                          '& fieldset': {
                            borderColor: '#6f42c1',
                          },
                          '&:hover fieldset': {
                            borderColor: '#a885ff',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#a885ff',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#a885ff',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="District"
                      name="district"
                      value={editForm.district || ''}
                      onChange={handleInputChange}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: '#fff',
                          '& fieldset': {
                            borderColor: '#6f42c1',
                          },
                          '&:hover fieldset': {
                            borderColor: '#a885ff',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#a885ff',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#a885ff',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="School/College"
                      name="school"
                      value={editForm.school || ''}
                      onChange={handleInputChange}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: '#fff',
                          '& fieldset': {
                            borderColor: '#6f42c1',
                          },
                          '&:hover fieldset': {
                            borderColor: '#a885ff',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#a885ff',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#a885ff',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Department"
                      name="department"
                      value={editForm.department || ''}
                      onChange={handleInputChange}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: '#fff',
                          '& fieldset': {
                            borderColor: '#6f42c1',
                          },
                          '&:hover fieldset': {
                            borderColor: '#a885ff',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#a885ff',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#a885ff',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Class Level"
                      name="classLevel"
                      value={editForm.classLevel || ''}
                      onChange={handleInputChange}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: '#fff',
                          '& fieldset': {
                            borderColor: '#6f42c1',
                          },
                          '&:hover fieldset': {
                            borderColor: '#a885ff',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#a885ff',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#a885ff',
                        },
                      }}
                    >
                      {classLevels.map((level) => (
                        <MenuItem key={level} value={level}>
                          {level}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="College Type"
                      name="collegeType"
                      value={editForm.collegeType || ''}
                      onChange={handleInputChange}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: '#fff',
                          '& fieldset': {
                            borderColor: '#6f42c1',
                          },
                          '&:hover fieldset': {
                            borderColor: '#a885ff',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#a885ff',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#a885ff',
                        },
                      }}
                    >
                      {collegeTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Exam"
                      name="exam"
                      value={editForm.exam || ''}
                      onChange={handleInputChange}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: '#fff',
                          '& fieldset': {
                            borderColor: '#6f42c1',
                          },
                          '&:hover fieldset': {
                            borderColor: '#a885ff',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#a885ff',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#a885ff',
                        },
                      }}
                    >
                      {exams.map((exam) => (
                        <MenuItem key={exam} value={exam}>
                          {exam}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      name="dob"
                      type="date"
                      value={editForm.dob || ''}
                      onChange={handleInputChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: '#fff',
                          '& fieldset': {
                            borderColor: '#6f42c1',
                          },
                          '&:hover fieldset': {
                            borderColor: '#a885ff',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#a885ff',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#a885ff',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={editForm.phone || ''}
                      onChange={handleInputChange}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: '#fff',
                          '& fieldset': {
                            borderColor: '#6f42c1',
                          },
                          '&:hover fieldset': {
                            borderColor: '#a885ff',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#a885ff',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#a885ff',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Social Media Link"
                      name="socialLink"
                      value={editForm.socialLink || ''}
                      onChange={handleInputChange}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: '#fff',
                          '& fieldset': {
                            borderColor: '#6f42c1',
                          },
                          '&:hover fieldset': {
                            borderColor: '#a885ff',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#a885ff',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#a885ff',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveProfile}
                      disabled={saving}
                      sx={{
                        bgcolor: '#6f42c1',
                        '&:hover': { bgcolor: '#5a32a3' },
                        mt: 2
                      }}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}

            {tabValue === 2 && (
              <Box>
                <Typography variant="h5" sx={{ mb: 3, color: '#a885ff', textAlign: 'center' }}>
                  Posts by {student.name}
                </Typography>
                
                {postsLoading ? (
                  <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress sx={{ color: '#a885ff' }} />
                  </Box>
                ) : posts.length === 0 ? (
                  <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ color: '#a885ff' }}>
                      No posts found
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#d0b8ff', mt: 1 }}>
                      This student hasn't created any posts yet.
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={3}>
                    {posts.map((post) => (
                      <Grid item xs={12} md={6} key={post._id}>
                        <Card sx={{ 
                          bgcolor: 'rgba(255,255,255,0.05)', 
                          color: '#fff', 
                          border: '1px solid rgba(111,66,193,0.3)',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column'
                        }}>
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                              <Typography variant="h6" sx={{ color: '#a885ff' }}>
                                {post.topic}
                              </Typography>
                              <IconButton 
                                size="small" 
                                onClick={() => handleDeleteClick(post)}
                                sx={{ color: '#ff6b6b' }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                            
                            <Typography variant="body2" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
                              {post.content}
                            </Typography>
                            
                            {post.fileUrl && (
                              <Box sx={{ mb: 2 }}>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  href={`http://localhost:5000${post.fileUrl}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  sx={{ 
                                    color: '#d0b8ff', 
                                    borderColor: '#6f42c1',
                                    '&:hover': {
                                      borderColor: '#a885ff',
                                      backgroundColor: 'rgba(111,66,193,0.1)'
                                    }
                                  }}
                                >
                                  {getFileIcon(post.fileUrl)}
                                  Download File
                                </Button>
                              </Box>
                            )}
                            
                            <Typography variant="caption" sx={{ color: '#d0b8ff', display: 'block', mt: 2 }}>
                              Posted on: {new Date(post.createdAt).toLocaleDateString()} at{' '}
                              {new Date(post.createdAt).toLocaleTimeString()}
                            </Typography>
                          </CardContent>
                          
                          {post.imageUrl && (
                            <CardMedia
                              component="img"
                              height="200"
                              image={`http://localhost:5000${post.imageUrl}`}
                              alt="Post image"
                              sx={{ objectFit: 'contain', backgroundColor: 'rgba(0,0,0,0.2)' }}
                            />
                          )}
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}
          </Box>
        </Paper>
      </Container>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            bgcolor: '#2a004d',
            color: '#fff'
          }
        }}
      >
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this post? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} sx={{ color: '#d0b8ff' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained" 
            sx={{ bgcolor: '#ff6b6b', '&:hover': { bgcolor: '#ff5252' } }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}