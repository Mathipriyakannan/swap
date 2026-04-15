import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, TextField, Typography, MenuItem, Paper, Avatar, FormControl,
  InputLabel, Select, Divider, Alert, Snackbar, InputAdornment, IconButton
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function SwapKnowledgeRegistration() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    category: '',
    school: '',
    district: '',
    classLevel: '',
    department: '',
    collegeType: '',
    exam: '',
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.password !== form.confirmPassword) {
      setSnackbar({ open: true, message: 'Passwords do not match!', severity: 'error' });
      return;
    }
    
    if (form.password.length < 6) {
      setSnackbar({ open: true, message: 'Password must be at least 6 characters long!', severity: 'error' });
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...submitForm } = form;
      console.log('Sending registration request:', submitForm);
      
      const response = await fetch('http://localhost:5000/api/swap/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitForm),
      });

      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        setSnackbar({ open: true, message: 'Registration successful! Redirecting to login...', severity: 'success' });
        setForm({ name: '', email: '', password: '', confirmPassword: '', category: '', school: '', district: '', classLevel: '', department: '', collegeType: '', exam: '' });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setSnackbar({ open: true, message: 'Error: ' + (data.error || 'Registration failed'), severity: 'error' });
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setSnackbar({ open: true, message: 'Network error: Could not connect to server', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const inputStyles = {
    '& .MuiInputBase-input': { color: '#4A148C' },
    '& .MuiInputBase-input::placeholder': { color: '#6A1B9A', opacity: 1 },
    '& label': { color: '#6A1B9A' },
    '& label.Mui-focused': { color: '#4A148C' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: '#d1c4e9' },
      '&:hover fieldset': { borderColor: '#b39ddb' },
      '&.Mui-focused fieldset': { borderColor: '#9575cd' },
      backgroundColor: '#f3e5f5',
    },
  };

  const renderSchoolForm = () => (
    <>
      <TextField label="Which School" name="school" fullWidth margin="dense"
        value={form.school} onChange={handleChange} placeholder="Enter your school name" sx={inputStyles} />
      <TextField label="District" name="district" fullWidth margin="dense"
        value={form.district} onChange={handleChange} placeholder="Enter your district" sx={inputStyles} />
      <FormControl fullWidth margin="dense" sx={inputStyles}>
        <InputLabel>Class</InputLabel>
        <Select name="classLevel" value={form.classLevel} onChange={handleChange} label="Class">
          {[...Array(12)].map((_, i) => (
            <MenuItem key={i + 1} value={(i + 1).toString()}>{`${i + 1}th`}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {(form.classLevel === '11' || form.classLevel === '12') && (
        <TextField label="Department" name="department" fullWidth margin="dense"
          value={form.department} onChange={handleChange} placeholder="Enter department" sx={inputStyles} />
      )}
    </>
  );

  const renderCollegeForm = () => (
    <>
      <FormControl fullWidth margin="dense" sx={inputStyles}>
        <InputLabel>UG or PG</InputLabel>
        <Select name="collegeType" value={form.collegeType} onChange={handleChange} label="UG or PG">
          <MenuItem value="UG">UG</MenuItem>
          <MenuItem value="PG">PG</MenuItem>
        </Select>
      </FormControl>
      {form.collegeType && (
        <>
          <TextField label="College Name" name="school" fullWidth margin="dense"
            value={form.school} onChange={handleChange} placeholder="Enter your college" sx={inputStyles} />
          <TextField label="District" name="district" fullWidth margin="dense"
            value={form.district} onChange={handleChange} placeholder="Enter district" sx={inputStyles} />
          <TextField label="Department" name="department" fullWidth margin="dense"
            value={form.department} onChange={handleChange} placeholder="Enter department" sx={inputStyles} />
        </>
      )}
    </>
  );

  const renderOtherForm = () => (
    <TextField label="Which Government Exam" name="exam" fullWidth margin="dense"
      value={form.exam} onChange={handleChange} placeholder="Enter exam name" sx={inputStyles} />
  );

  const renderDynamicForm = () => {
    switch (form.category) {
      case 'School': return renderSchoolForm();
      case 'College': return renderCollegeForm();
      case 'Other': return renderOtherForm();
      default: return null;
    }
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" sx={{ backgroundColor: '#d1c4e9', p: 2 }}>
      <Paper elevation={6} sx={{ display: 'flex', width: '500px', height: 'auto', borderRadius: 5, overflow: 'hidden' }}>
        <Box flex={1} display="flex" flexDirection="column" justifyContent="center" px={4} py={5} sx={{ backgroundColor: 'white', backdropFilter: 'blur(3px)' }}>
          <Box display="flex" justifyContent="center" mb={2}>
            <Avatar sx={{ bgcolor: '#d1c4e9', width: 56, height: 56 }}>
              <SchoolIcon fontSize="large" sx={{ color: '#4A148C' }} />
            </Avatar>
          </Box>

          <Typography variant="h5" textAlign="center" fontWeight={600} sx={{ color: '#4A148C', mb: 1 }}>
            Swap Knowledge
          </Typography>
          <Typography variant="subtitle1" textAlign="center" sx={{ color: '#6A1B9A', mb: 3 }}>
            Registration Form
          </Typography>

          <Divider sx={{ mb: 2, backgroundColor: '#d1c4e9' }} />

          <form onSubmit={handleSubmit}>
            <TextField label="Username" name="name" fullWidth margin="dense" required
              value={form.name} onChange={handleChange} placeholder="Enter full name" sx={inputStyles} />
            <TextField label="Email Address" name="email" type="email" fullWidth margin="dense" required
              value={form.email} onChange={handleChange} placeholder="Enter email" sx={inputStyles} />

            <TextField
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="dense"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password (min 6 characters)"
              sx={inputStyles}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              fullWidth
              margin="dense"
              required
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              sx={inputStyles}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FormControl fullWidth margin="dense" sx={inputStyles} required>
              <InputLabel>Category</InputLabel>
              <Select name="category" value={form.category} onChange={handleChange} label="Category">
                <MenuItem value="School">School</MenuItem>
                <MenuItem value="College">College</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            <Box mt={1}>{renderDynamicForm()}</Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.2,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                bgcolor: '#d1c4e9',
                color: '#4A148C',
                ':hover': {
                  bgcolor: '#c0afe3',
                },
              }}
            >
              {loading ? 'Processing...' : 'Submit Registration'}
            </Button>
          </form>
        </Box>
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}



