import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  InputAdornment,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  IconButton
} from '@mui/material';
import { AccountCircle, Lock, Email, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StaffLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isMobile = useMediaQuery('(max-width:900px)');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/admin/staff/login',
        {
          email: formData.email,
          password: formData.password,
        }
      );

      // ✅ CORRECTED: Store staff information in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('loggedInUser', JSON.stringify(response.data.user));
      localStorage.setItem('staffName', response.data.user.fullName); // ✅ Add this
      localStorage.setItem('staffId', response.data.user._id); // ✅ Add this
      localStorage.setItem('userType', 'staff'); // ✅ Add this

      console.log('🔑 Staff login successful:', {
        staffName: response.data.user.fullName,
        staffId: response.data.user._id
      });

      alert(`Login successful! Welcome, ${response.data.user.fullName}`);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  const handleResetPassword = async () => {
    setResetError('');
    
    if (!resetEmail) {
      setResetError('Email is required');
      return;
    }
    if (!newPassword) {
      setResetError('New password is required');
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/admin/reset-password',
        {
          email: resetEmail,
          newPassword: newPassword
        }
      );

      setResetSuccess(true);
      setTimeout(() => {
        setResetDialogOpen(false);
        setResetSuccess(false);
        setResetEmail('');
        setNewPassword('');
        setConfirmPassword('');
      }, 2000);
    } catch (err) {
      setResetError(err.response?.data?.error || 'Password reset failed. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#ecf6fc',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: '100%',
          maxWidth: 1000,
          borderRadius: 4,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
        }}
      >
        <Box
          sx={{
            width: isMobile ? '100%' : '50%',
            background: 'linear-gradient(to bottom right, #A0D6EF, #82C8E5)',
            color: 'white',
            p: 5,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" gutterBottom>
            WELCOME
          </Typography>
          <Typography variant={isMobile ? 'subtitle1' : 'h6'} gutterBottom>
            Swap Knowledge
          </Typography>
          <Typography variant="body2" textAlign="center">
            "Knowledge grows when it's shared — swap ideas, spark change, and
            empower minds."
          </Typography>
        </Box>

        <Box sx={{ width: isMobile ? '100%' : '50%', p: 5 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: '#82C8E5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <AccountCircle sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Typography variant={isMobile ? 'h6' : 'h5'} mb={3}>
              Sign in
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <TextField
              name="email"
              label="Email"
              type="email"
              fullWidth
              required
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              required
              value={formData.password}
              onChange={handleChange}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Grid container justifyContent="space-between" sx={{ mb: 2 }}>
              <Link 
                href="#" 
                variant="body2" 
                sx={{ color: '#4A69E0' }}
                onClick={() => setResetDialogOpen(true)}
              >
                Forgot password?
              </Link>
            </Grid>

            <Button
              type="submit"
              fullWidth
              sx={{
                backgroundColor: '#A0D6EF',
                color: 'black',
                fontWeight: 'bold',
                py: 1.5,
                borderRadius: 2,
                boxShadow: 2,
                '&:hover': { backgroundColor: '#82C8E5' },
              }}
            >
              LOGIN
            </Button>
          </form>

          <Typography textAlign="center" mt={3}>
            Don't have an account?{' '}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/admin/register-user')}
              sx={{ fontWeight: 'bold', color: '#4A69E0' }}
            >
              Register
            </Link>
          </Typography>
        </Box>
      </Paper>

      <Dialog 
        open={resetDialogOpen} 
        onClose={() => setResetDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          {resetSuccess ? (
            <Alert severity="success" sx={{ mt: 2 }}>
              Password reset successfully! You can now login with your new password.
            </Alert>
          ) : (
            <>
              {resetError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {resetError}
                </Alert>
              )}
              <TextField
                autoFocus
                margin="dense"
                label="Email Address"
                type="email"
                fullWidth
                variant="outlined"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="dense"
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                fullWidth
                variant="outlined"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                margin="dense"
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                fullWidth
                variant="outlined"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setResetDialogOpen(false);
            setResetError('');
            setResetEmail('');
            setNewPassword('');
            setConfirmPassword('');
          }}>
            Cancel
          </Button>
          {!resetSuccess && (
            <Button 
              onClick={handleResetPassword}
              variant="contained"
              disabled={!resetEmail || !newPassword || !confirmPassword}
            >
              Reset Password
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StaffLogin;


