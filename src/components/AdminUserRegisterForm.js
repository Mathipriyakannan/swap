import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  InputAdornment,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const genders = ["Male", "Female", "Other"];

const AdminUserRegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    department: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/admin/register',
        formData
      );

      if (response.data.message) {
        const { fullName } = formData;
        alert(response.data.message || `Registration successful! Welcome, ${fullName}`);
        navigate('/staff/login', {
          state: { message: `Registration successful! Welcome, ${fullName}` }
        });

        setFormData({
          fullName: "",
          email: "",
          phone: "",
          gender: "",
          department: "",
          password: "",
          confirmPassword: ""
        });
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed. Please try again.');
    }
  };
  const handleBackToDashboard = () => {
    navigate('/admin'); 
  };
  return (
    <Box
      sx={{
        backgroundColor: '#EAF7FB',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 4
      }}
    >
        {/* Back to Dashboard Button - Top Left */}
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={handleBackToDashboard}
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          color: '#4A69E0',
          fontWeight: 'bold',
          '&:hover': { 
            backgroundColor: 'rgba(74,105,224,0.08)' 
          }
        }}
      >
        Back to Dashboard
      </Button>

      <Box sx={{ width: '100%', maxWidth: 700 }}>
        <Box
          sx={{
            backgroundColor: '#82C8E5',
            px: 4,
            py: 3,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            color: 'white',
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Staff Registration
          </Typography>
          <Typography variant="body2">
            Please fill in the information below to continue
          </Typography>
        </Box>

        <Paper
          elevation={4}
          sx={{
            px: 4,
            py: 5,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12
          }}
        >
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} sx={{width:"255px"}}>
                <TextField
                  select
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  fullWidth
                  sx={{ minWidth: "220px" }}
                >
                  <MenuItem disabled value="">
                    Select Gender
                  </MenuItem>
                  {genders.map((g) => (
                    <MenuItem key={g} value={g}>
                      {g}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} sx={{width:"255px"}}>
                <TextField
                  fullWidth
                  label="Subject"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Enter your subject "
                />
              </Grid>

              <Grid item xs={12} sm={6} sx={{marginLeft:"2px"}}>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={togglePasswordVisibility} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginLeft: "230px" }}>
                  <Button
                    type="submit"
                    sx={{
                      px: 6,
                      py: 1.5,
                      borderRadius: 2,
                      backgroundColor: '#82C8E5',
                      color: '#fff',
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: '#69b7d9'
                      }
                    }}
                  >
                    Submit
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminUserRegisterForm;




