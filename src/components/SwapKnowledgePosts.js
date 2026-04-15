import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  CssBaseline,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from '@mui/material';

const SubjectListPage = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const staffSubject = localStorage.getItem('staffDepartment');

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      if (staffSubject) {
        setSubjects([staffSubject]);
      }
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleClick = (subject) => {
    navigate(`/staff/${subject}`);
  };

  const filteredSubjects = subjects.filter((subject) =>
    subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1b0f2e 0%, #2a0f4e 40%, #3e0e60 60%, #a72693 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 4,
        px: 2,
      }}
    >
      <CssBaseline />

      <Typography
        variant="h3"
        sx={{
          fontWeight: 'bold',
          color: '#fff',
          mb: 3,
          textShadow: '0 0 10px rgba(255,255,255,0.3)',
        }}
      >
        Subjects
      </Typography>

      <TextField
        variant="outlined"
        placeholder="Search subjects..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          mb: 3,
          width: '100%',
          maxWidth: 800,
          backgroundColor: 'rgba(255,255,255,0.1)',
          input: { color: '#fff' },
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
            '&:hover fieldset': { borderColor: '#ff00cc' },
            '&.Mui-focused fieldset': { borderColor: '#ff00cc' },
          },
        }}
      />

      <TableContainer
        component={Paper}
        elevation={6}
        sx={{
          backgroundColor: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          overflow: 'hidden',
          maxWidth: 800,
          width: '100%',
        }}
      >
        <Table stickyHeader>
          <TableHead>
  <TableRow>
    <TableCell
      sx={{
        backgroundColor: '#ff007f',
        color: '#fff',
        fontWeight: 'bold',
      }}
    >
      #
    </TableCell>
    <TableCell
      sx={{
        backgroundColor: '#ff007f',
        color: '#fff',
        fontWeight: 'bold',
      }}
    >
      Subject
    </TableCell>
    <TableCell
      sx={{
        backgroundColor: '#ff007f',
        color: '#fff',
        fontWeight: 'bold',
      }}
    >
      Action
    </TableCell>
  </TableRow>
</TableHead>

          <TableBody>
            {filteredSubjects.length > 0 ? (
              filteredSubjects.map((subject, index) => (
                <TableRow
                  key={index}
                  hover
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
                  }}
                >
                  <TableCell sx={{ color: '#fff' }}>{index + 1}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{subject}</TableCell>
                  <TableCell>
                    <Typography
                      onClick={() => handleClick(subject)}
                      sx={{
                        cursor: 'pointer',
                        color: '#00e5ff',
                        textDecoration: 'underline',
                        '&:hover': { color: '#00b8d4' },
                      }}
                    >
                      View
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
              
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ color: '#ccc', py: 3 }}>
                  No subjects found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SubjectListPage;










{/*import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CssBaseline,
} from '@mui/material';

const subjectData = [
  'Science - Physics',
  'Science - Chemistry',
  'Science - Biology',
  'Computer - Computer Science',
  'Computer - Web Development',
  'Arts - Tamil',
  'Arts - English',
  'Commerce - Accounting',
  'Commerce - Economics',
  'Medical - Lab Assistant',
  'Vocational - Drawing',
  'Vocational - Salon & Beauty',
];

const drawerWidth = 260;
const primaryColor = '#aa56cc';

const SubjectListPage = () => {
  const navigate = useNavigate();

  const handleClick = (subject) => {
    navigate(`/staff/${subject}`);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />


      <AppBar position="fixed" sx={{ backgroundColor: primaryColor, zIndex: 1300 }}>
        <Toolbar>
          <Typography variant="h6" fontWeight="bold">
            Swap Knowledge
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#f5f5f5',
            paddingTop: 8,
          },
        }}
      >
        <Toolbar />
        <List>
          {subjectData.map((subject, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => handleClick(subject)}>
                <ListItemText
                  primary={subject}
                  primaryTypographyProps={{
                    fontWeight: 'bold',
                    sx: { color: primaryColor },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: `${drawerWidth}px`,
          mt: 8,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" fontWeight="bold" color={primaryColor}>
          Select a Subject from Sidebar
        </Typography>
      </Box>
    </Box>
  );
};

export default SubjectListPage;*/}
