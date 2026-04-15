import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Stack, 
  Card, 
  CardContent,
  Fab
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const [showManagerButton, setShowManagerButton] = useState(false);

  const handlePeopleIconClick = () => {
    setShowManagerButton(!showManagerButton);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        background: `radial-gradient(circle at bottom right, #0066ff33, transparent 70%),
                     linear-gradient(180deg, #0d0d0f 0%, #0f172a 50%, #020617 100%)`,
        color: 'white',
        px: 2,
        py: 4,
      }}
    >
      <Container maxWidth="md">
        {/* PeopleIcon - Clickable */}
        <Box
          sx={{
            cursor: 'pointer',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.1)',
            },
            mb: 2,
            position: 'relative'
          }}
          onClick={handlePeopleIconClick}
        >
          <PeopleIcon sx={{ fontSize: 100, color: 'primary.main' }} />
          
          {/* Manager Register Button - Circle format */}
          {showManagerButton && (
            <Fab
              variant="extended"
              color="primary"
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 110,
                height: 110,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #FF6B35, #FF8E53)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FF8E53, #FF6B35)',
                  transform: 'translate(-50%, -50%) scale(1.05)',
                },
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                zIndex: 10,
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': {
                    boxShadow: '0 0 0 0 rgba(255, 107, 53, 0.7)'
                  },
                  '70%': {
                    boxShadow: '0 0 0 20px rgba(255, 107, 53, 0)'
                  },
                  '100%': {
                    boxShadow: '0 0 0 0 rgba(255, 107, 53, 0)'
                  }
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                navigate('/manager');
              }}
            >
              <BusinessIcon sx={{ fontSize: 40, mb: 0.5 }} />
              <Typography 
                variant="body1" 
                sx={{ 
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  lineHeight: 1.1,
                  textTransform: 'none'
                }}
              >
                Manager Register
              </Typography>
            </Fab>
          )}
        </Box>
        
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Swap Knowledge
        </Typography>

        <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 4 }} gutterBottom>
          A platform for exchanging knowledge with others.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ 
            px: 4, 
            py: 1.5,
            textTransform: 'none',
            fontSize: '1.1rem',
            mb: 4
          }}
          onClick={() => navigate('/choose-role')}
        >
          Get Started
        </Button>

        <Box sx={{ mt: 4 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255,255,255,0.8)',
              mb: 2
            }}
          >
            Already have an account?
          </Typography>
          
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={3} 
            justifyContent="center"
          >
            <Card 
              sx={{ 
                minWidth: 200, 
                background: 'rgba(25, 118, 210, 0.1)',
                border: '1px solid rgba(25, 118, 210, 0.3)',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 20px rgba(25, 118, 210, 0.25)',
                }
              }}
              onClick={() => navigate('/staff/login')}
            >
              <CardContent sx={{ py: 3 }}>
                <PersonIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography sx={{color:"white"}} variant="h6" gutterBottom>
                  Staff Login
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Access your staff account
                </Typography>
              </CardContent>
            </Card>

            <Card 
              sx={{ 
                minWidth: 200, 
                background: 'rgba(156, 39, 176, 0.1)',
                border: '1px solid rgba(156, 39, 176, 0.3)',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 20px rgba(156, 39, 176, 0.25)',
                }
              }}
              onClick={() => navigate('/login')}
            >
              <CardContent sx={{ py: 3 }}>
                <SchoolIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                <Typography  sx={{color:'white'}}  variant="h6" gutterBottom>
                  Student Login
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Access your student account
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
