import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Box,
  Typography,
  Button
} from '@mui/material';
import axios from 'axios';

const UserDataTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Use the endpoint that exists in your backend
      const response = await axios.get('http://localhost:5000/api/students');
      
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users from server. Please check: 1) Backend server is running on port 5000, 2) MongoDB is connected, 3) API endpoint /api/students exists');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading users from database...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">
          User Management - SwapKnowledge Users
        </Typography>
        <Button 
          variant="contained" 
          onClick={fetchUsers}
          sx={{ backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}
        >
          Refresh Data
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {users.length === 0 && !error ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No users found in the database.
        </Alert>
      ) : users.length > 0 ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          Displaying {users.length} user(s) from MongoDB database
        </Alert>
      ) : null}
      
      <TableContainer component={Paper} sx={{ maxHeight: '600px', overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>School</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>District</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Class Level</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Department</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id} hover>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    backgroundColor: user.category === 'School' ? '#e3f2fd' : 
                                   user.category === 'College' ? '#f3e5f5' : '#e8f5e8',
                    color: user.category === 'School' ? '#1976d2' : 
                          user.category === 'College' ? '#7b1fa2' : '#2e7d32',
                    fontWeight: '500'
                  }}>
                    {user.category || 'N/A'}
                  </span>
                </TableCell>
                <TableCell>{user.school || 'N/A'}</TableCell>
                <TableCell>{user.district || 'N/A'}</TableCell>
                <TableCell>{user.classLevel || 'N/A'}</TableCell>
                <TableCell>{user.department || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Total Users: {users.length}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Data sourced from MongoDB database
        </Typography>
      </Box>
    </Box>
  );
};

export default UserDataTable;