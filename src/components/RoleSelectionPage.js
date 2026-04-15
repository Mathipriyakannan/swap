import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function RoleSelectionPage() {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        gap: 3,
      }}
    >
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Choose Your Role
      </Typography>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => navigate('/staff/login')}
      >
        Staff Register
      </Button>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => navigate('/login')}
      >
        Student Register
      </Button>
    </Container>
  );
}