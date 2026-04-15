import React, { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

export default function StudentProfilePage() {
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState('https://randomuser.me/api/portraits/men/75.jpg');
  const [tabValue, setTabValue] = useState(0);
  const [student, setStudent] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('studentUser');
    if (stored && stored !== 'undefined') {
      try {
        const parsed = JSON.parse(stored);
        if (parsed) {
          setStudent(parsed);
          setFormData(parsed);
          if (parsed.profileImage) {
            setProfileImage(parsed.profileImage);
          }
        }
      } catch (error) {
        console.error('Error parsing student data:', error);
        setSnackbar({ open: true, message: 'Error loading profile data', severity: 'error' });
      }
    }
  }, []);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setProfileImage(imageUrl);
        
        const updatedForm = { ...formData, profileImage: imageUrl };
        setFormData(updatedForm);
        
        const updatedStudent = { ...student, profileImage: imageUrl };
        setStudent(updatedStudent);
        
        localStorage.setItem('studentUser', JSON.stringify(updatedStudent));
        
        setSnackbar({ open: true, message: 'Profile photo updated successfully!', severity: 'success' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const userId = student?._id || student?.id;

      if (!userId) {
        setSnackbar({ open: true, message: 'User ID missing, cannot update.', severity: 'error' });
        setLoading(false);
        return;
      }

      const updateData = {
        name: formData.name,
        school: formData.school,
        department: formData.department,
        district: formData.district,
        dob: formData.dob,
        phone: formData.phone,
        socialLink: formData.socialLink,
        profileImage: formData.profileImage,
      };

      const res = await fetch(`http://localhost:5000/api/users/update-user/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP error! status: ${res.status}, response: ${errorText}`);
      }

      const responseData = await res.json();

      const updatedStudent = { ...student, ...updateData };
      setStudent(updatedStudent);
      setFormData(updatedStudent);
      localStorage.setItem('studentUser', JSON.stringify(updatedStudent));
      
      if (updateData.profileImage) {
        setProfileImage(updateData.profileImage);
      }
      
      setOpenEdit(false);
      setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
    } catch (err) {
      console.error('Error updating profile:', err);
      setSnackbar({ 
        open: true, 
        message: err.message || 'Error updating profile. Please check if the server is running.', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => setSnackbar((s) => ({ ...s, open: false }));

  if (!student) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ background: 'linear-gradient(135deg, #1f0040, #2b0b60)', minHeight: '100vh', color: '#fff' }}
      >
        <CircularProgress sx={{ color: '#a885ff' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ background: 'linear-gradient(135deg, #1f0040, #2b0b60)', py: 5, minHeight: '100vh', color: '#fff' }}>
      <Container maxWidth="lg">
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
                src={profileImage}
                sx={{ width: 120, height: 120, border: '3px solid #6f42c1', mx: 'auto' }}
              />
              <Button
                variant="contained"
                size="small"
                onClick={handleAvatarClick}
                sx={{ mt: 1, fontSize: 12, bgcolor: '#6f42c1', ':hover': { bgcolor: '#5a32a3' } }}
              >
                Change Photo
              </Button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </Box>

            <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
              {student.name}
            </Typography>
            <Typography variant="body2" sx={{ color: '#a885ff', textAlign: 'center' }}>
              {student.category} Student
            </Typography>

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
              </Box>

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setOpenEdit(true)}
                  sx={{
                    textTransform: 'none',
                    borderColor: '#6f42c1',
                    color: '#6f42c1',
                    ':hover': { bgcolor: 'rgba(111,66,193,0.2)', borderColor: '#a885ff', color: '#a885ff' },
                  }}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/my-posts')}
                  sx={{
                    textTransform: 'none',
                    borderColor: '#6f42c1',
                    color: '#6f42c1',
                    ':hover': { bgcolor: 'rgba(111,66,193,0.2)', borderColor: '#a885ff', color: '#a885ff' },
                  }}
                >
                  View My Posts
                </Button>
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
              <Tab label="Timeline" sx={{ color: '#fff' }} />
            </Tabs>
            <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ color: '#a885ff' }}>
                  Email
                </Typography>
                <Typography variant="body1">{student.email}</Typography>
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
                  Date of Birth
                </Typography>
                <Typography variant="body1">
                  {student.dob ? new Date(student.dob).toLocaleDateString() : '-'}
                </Typography>
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
                    <a 
                      href={student.socialLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ color: '#a885ff', textDecoration: 'none' }}
                    >
                      {student.socialLink}
                    </a>
                  ) : (
                    '-'
                  )}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Full Name"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="School/College Name"
            name="school"
            value={formData.school || ''}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Department"
            name="department"
            value={formData.department || ''}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="District"
            name="district"
            value={formData.district || ''}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Social Media Link"
            name="socialLink"
            value={formData.socialLink || ''}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            type="date"
            label="Date of Birth"
            name="dob"
            value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ''}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField 
            label="Phone Number" 
            name="phone" 
            value={formData.phone || ''} 
            onChange={handleInputChange} 
            fullWidth 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            disabled={loading}
            sx={{ bgcolor: '#6f42c1', ':hover': { bgcolor: '#5a32a3' } }}
          >
            {loading ? <CircularProgress size={24} /> : 'Save'}
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