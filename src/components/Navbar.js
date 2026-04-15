import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { deepOrange } from '@mui/material/colors';

const Navbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('swapUserName') || 'User'; 
  const firstLetter = username.charAt(0).toUpperCase();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    setAnchorEl(null);
    localStorage.removeItem('swapUserName'); // Remove on sign out
    navigate('/login');
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Swap
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button color="inherit" onClick={() => navigate('/')} sx={{ fontWeight: 'bold' }}>
            Home
          </Button>
          <Button color="inherit" onClick={() => navigate('/about')}>
            About
          </Button>
          <Button
            color="inherit"
            sx={{ display: 'flex', alignItems: 'center', gap: 1, textTransform: 'none', fontWeight: 'bold' }}
            onClick={handleMenuOpen}
          >
            <Avatar sx={{ width: 24, height: 24, bgcolor: deepOrange[500], fontSize: 14 }}>{firstLetter}</Avatar>
            {username}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
