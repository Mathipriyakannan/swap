import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Paper,
  Link,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetForm, setResetForm] = useState({ email: '', newPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleResetChange = (e) => {
    setResetForm({ ...resetForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { email, password } = form;
      const response = await axios.post('http://localhost:5000/api/swapKnowledge/login', {
        email,
        password,
      });

      const resData = response.data;

      localStorage.setItem(
        'studentUser',
        JSON.stringify({ id: resData._id, name: resData.name, email: resData.email })
      );
      localStorage.setItem('studentName', resData.name);

      alert('Login successful!');
      navigate("/features");

    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  const handleResetSubmit = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/swapKnowledge/reset-password',
        resetForm
      );
      alert(response.data.message);

      setForm({ email: resetForm.email, password: resetForm.newPassword });

      setForgotOpen(false);
      setResetForm({ email: '', newPassword: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Password reset failed');
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f7f2fa"
      px={2}
    >
      <Paper
        elevation={6}
        sx={{
          width: { xs: '100%', sm: 500, md: 800 },
          height: { xs: 'auto', md: 480 },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          borderRadius: 4,
          overflow: 'hidden'
        }}
      >
        <Box
          width={{ xs: '100%', md: '45%' }}
          minHeight={{ xs: 200, md: '100%' }}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          px={3}
          py={{ xs: 3, md: 0 }}
          sx={{
            background: 'linear-gradient(145deg, #d1c4e9, #b796f4ff)',
            color: '#fff'
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            mb={2}
            fontSize={{ xs: '1.8rem', md: '2.2rem' }}
          >
            WELCOME
          </Typography>
          <Typography variant="subtitle1" align="center">
            Swap Knowledge
          </Typography>
          <Typography
            variant="body2"
            align="center"
            mt={2}
            fontSize={{ xs: '0.8rem', md: '0.9rem' }}
          >
            "Knowledge grows when it's shared — swap ideas, spark change, and empower minds."
          </Typography>
        </Box>

        <Box width={{ xs: '100%', md: '55%' }} p={{ xs: 3, md: 4 }}>
          <Box display="flex" justifyContent="center" mb={2}>
            <Avatar sx={{ bgcolor: '#b39ddb', width: 56, height: 56 }}>
              <AccountCircleIcon fontSize="large" />
            </Avatar>
          </Box>
          <Typography variant="h5" textAlign="center" mb={3}>
            Sign in
          </Typography>

          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box
            display="flex"
            flexDirection={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            mt={1}
            gap={1}
          >
            <Link
              href="#"
              onClick={() => setForgotOpen(true)}
              variant="body2"
              underline="hover"
            >
              Forgot password?
            </Link>
          </Box>

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3, backgroundColor: '#d1c4e9', fontWeight: 'bold' }}
            onClick={handleSubmit}
          >
            Login
          </Button>

          <Typography variant="body2" textAlign="center" mt={2}>
            Don't have an account?{' '}
            <Link href="/register" underline="hover">
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Paper>

      <Dialog fullWidth maxWidth="xs" open={forgotOpen} onClose={() => setForgotOpen(false)}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            name="email"
            value={resetForm.email}
            onChange={handleResetChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="New Password"
            name="newPassword"
            type={showResetPassword ? 'text' : 'password'}
            value={resetForm.newPassword}
            onChange={handleResetChange}
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowResetPassword(!showResetPassword)} edge="end">
                    {showResetPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setForgotOpen(false)}>Cancel</Button>
          <Button onClick={handleResetSubmit} variant="contained" sx={{ bgcolor: '#7e57c2' }}>
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}


