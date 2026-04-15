import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Button,
  TableBody,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  Snackbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const AdminUserDashboard = () => {
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingCounts, setPendingCounts] = useState({});
  const [adminRequestCounts, setAdminRequestCounts] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [requestDialog, setRequestDialog] = useState({ open: false, admin: null });
  const [requestMessage, setRequestMessage] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [staffRequests, setStaffRequests] = useState([]);
  const [requestsDialogOpen, setRequestsDialogOpen] = useState(false);
  const [selectedAdminForRequests, setSelectedAdminForRequests] = useState(null);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const navigate = useNavigate();

  const storedUser = localStorage.getItem("studentUser");
  const student = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
      setIsLoggedIn(loggedIn);

      if (loggedIn) {
        loadData();
      }
    };
    checkLoginStatus();
  }, []);

  const loadData = async () => {
    try {
      // Fetch admins
      const res = await fetchAdmins();
      setAdmins(res);

      const token = localStorage.getItem('authToken');
      
      // Fetch pending requests for each admin
      const pendingRes = await fetchPendingRequests();
      const counts = {};
      pendingRes.forEach((item) => {
        counts[`${item.fullName}-${item.department}`] = item.count;
      });
      setPendingCounts(counts);

      // Load admin request counts
      await loadAdminRequestCounts(res);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setSnackbar({
        open: true,
        message: "Failed to load data",
        severity: 'error'
      });
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/admin/pending-requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      return [];
    }
  };

  const loadAdminRequestCounts = async (adminsList) => {
    const counts = {};
    for (const admin of adminsList) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/admin-requests-count/${admin._id}`);
        const data = await response.json();
        counts[admin._id] = data.count;
      } catch {
        counts[admin._id] = 0;
      }
    }
    setAdminRequestCounts(counts);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    setIsLoggedIn(false);
    navigate('/manager');
  };

  const handleOpenRequestDialog = (admin) => {
    if (!student) {
      setSnackbar({
        open: true,
        message: "Please log in first before sending a request!",
        severity: 'error'
      });
      return;
    }
    setRequestDialog({ open: true, admin });
    setRequestMessage(`Hello ${admin.fullName}, I would like to connect with you for ${admin.department} related queries.`);
  };

  const handleCloseRequestDialog = () => {
    setRequestDialog({ open: false, admin: null });
    setRequestMessage('');
  };

  const handleSendRequest = async () => {
    if (!requestDialog.admin || !student) return;

    try {
      const data = {
        studentId: student._id,
        studentName: student.fullName,
        studentEmail: student.email,
        adminName: requestDialog.admin.fullName,
        adminDepartment: requestDialog.admin.department,
        message: requestMessage
      };

      const response = await fetch(`http://localhost:5000/api/admin/send-request/${requestDialog.admin._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to send request');
      }

      setSnackbar({
        open: true,
        message: `Request sent successfully to ${requestDialog.admin.fullName}!`,
        severity: 'success'
      });

      await loadAdminRequestCounts(admins);
      handleCloseRequestDialog();
    } catch (error) {
      console.error('Error sending request:', error);
      setSnackbar({
        open: true,
        message: "Failed to send request. Please try again.",
        severity: 'error'
      });
    }
  };

  const fetchStaffRequests = async (adminId) => {
    setLoadingRequests(true);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/admin-requests/${adminId}`);
      const data = await response.json();
      setStaffRequests(data);
    } catch (err) {
      console.error("Error fetching staff requests:", err);
      setStaffRequests([]);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleRequestAction = async (requestId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/update-request/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update request');
      }

      setSnackbar({
        open: true,
        message: `Request ${status.toLowerCase()} successfully`,
        severity: 'success'
      });

      // Refresh the requests list and counts
      if (selectedAdminForRequests) {
        fetchStaffRequests(selectedAdminForRequests._id);
      }
      await loadAdminRequestCounts(admins);
    } catch (err) {
      console.error('Error updating request:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update request',
        severity: 'error'
      });
    }
  };

  const fetchAllRequests = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/requests');
      return await response.json();
    } catch (error) {
      console.error('Error fetching all requests:', error);
      return [];
    }
  };

  const approveRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Approved' })
      });
      return await response.json();
    } catch (error) {
      console.error('Error approving request:', error);
      throw error;
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Rejected' })
      });
      return await response.json();
    } catch (error) {
      console.error('Error rejecting request:', error);
      throw error;
    }
  };

  const filteredAdmins = admins.filter((user) =>
    user.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBadgeStyle = (value) => ({
    backgroundColor: value > 0 ? '#FFEBD3' : '#E0E0E0',
    color: value > 0 ? '#CC8A00' : '#555',
    padding: '4px 10px',
    borderRadius: '16px',
    fontWeight: 'bold',
    fontSize: '0.75rem',
    display: 'inline-block',
    minWidth: '90px',
    textAlign: 'center',
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      {/* Request Dialog */}
      <Dialog
        open={requestDialog.open}
        onClose={handleCloseRequestDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Send Request to {requestDialog.admin?.fullName}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            You are sending a connection request to {requestDialog.admin?.fullName} from {requestDialog.admin?.department} department.
          </Typography>
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            label="Request Message"
            value={requestMessage}
            onChange={(e) => setRequestMessage(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRequestDialog}>Cancel</Button>
          <Button onClick={handleSendRequest} variant="contained" color="primary">
            Send Request
          </Button>
        </DialogActions>
      </Dialog>

      {isLoggedIn && (
        <Box sx={{ p: 3, backgroundColor: '#F5F7FA', minHeight: '100vh' }}>
          <Paper
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              mb: 3,
              backgroundColor: '#FFFFFF',
              borderRadius: 2,
              boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.03)',
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Welcome Back
                <Typography variant="body2" color="text.secondary">
                  SwapKnowledge!
                </Typography>
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  px: 2,
                  py: 1,
                  mr: 1
                }}
                onClick={() => navigate('/student-details')}
              >
                Student Details
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  px: 2,
                  py: 1,
                }}
                onClick={handleLogout}
              >
                Logout
              </Button>

              <IconButton>
                <NotificationsNoneIcon sx={{ color: '#666' }} />
              </IconButton>
            </Box>
          </Paper>

          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E0E0E0',
            }}
          >
            {/* Header Section */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
              flexWrap="wrap"
              gap={2}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Button
                  variant="contained"
                  color="success"
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    px: 2,
                    py: 1,
                  }}
                  onClick={() => navigate('/admin/approvals')}
                >
                  Approval
                </Button>

                <TextField
                  label="Search by Department"
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#999' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#F5F7FA',
                    },
                  }}
                />
              </Box>

              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  textAlign: 'right',
                  color: '#333',
                  flexGrow: 1,
                }}
              >
                Staff Details
              </Typography>
            </Box>

            <Table>
              <TableHead sx={{ backgroundColor: '#F5F7FA' }}>
                <TableRow>
                  <TableCell><b>Name</b></TableCell>
                  <TableCell><b>Email</b></TableCell>
                  <TableCell><b>Phone</b></TableCell>
                  <TableCell><b>Gender</b></TableCell>
                  <TableCell><b>Department</b></TableCell>
                  <TableCell><b>Joined</b></TableCell>
                  <TableCell><b>Pending Requests</b></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredAdmins.length > 0 ? (
                  filteredAdmins.map((user, index) => {
                    const countKey = `${user.fullName}-${user.department}`;
                    const pending = pendingCounts[countKey] || 0;
                    const adminRequests = adminRequestCounts[user._id] || 0;

                    return (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar sx={{ bgcolor: '#DDEEFF', mr: 1.5 }}>
                              {user.fullName?.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography fontWeight="medium">
                                {user.fullName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {user.designation}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>{user.gender}</TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>
                          {new Date(user.joiningDate).toLocaleDateString('en-US')}
                        </TableCell>
                        <TableCell>
                          <Box display="flex" flexDirection="column" gap={1}>
                            <span style={getBadgeStyle(pending)}>
                              {pending > 0
                                ? `${pending} doubt${pending > 1 ? 's' : ''}`
                                : 'No doubts'}
                            </span>
                            {adminRequests > 0 && (
                              <Chip
                                label={`${adminRequests} staff request${adminRequests > 1 ? 's' : ''}`}
                                color="primary"
                                size="small"
                                variant="outlined"
                                sx={{ cursor: 'pointer' }}
                                onClick={() => {
                                  setSelectedAdminForRequests(user);
                                  fetchStaffRequests(user._id);
                                  setRequestsDialogOpen(true);
                                }}
                              />
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No admin found for this department.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>

          {/* Staff Requests Dialog */}
          <Dialog
            open={requestsDialogOpen}
            onClose={() => setRequestsDialogOpen(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              Staff Requests for {selectedAdminForRequests?.fullName}
            </DialogTitle>
            <DialogContent>
              {loadingRequests ? (
                <Typography sx={{ textAlign: 'center', py: 3 }}>Loading requests...</Typography>
              ) : staffRequests.length === 0 ? (
                <Typography sx={{ textAlign: 'center', py: 3 }} color="text.secondary">
                  No staff requests found.
                </Typography>
              ) : (
                staffRequests.map((req) => (
                  <Paper
                    key={req._id}
                    sx={{
                      p: 2,
                      mb: 2,
                      border: '1px solid #eee',
                      borderRadius: 2,
                      backgroundColor: req.status === 'Approved' ? '#E8F5E9' : req.status === 'Rejected' ? '#FFEBEE' : '#FFF',
                    }}
                  >
                    <Typography><b>Staff:</b> {req.staffName}</Typography>
                    <Typography><b>Message:</b> {req.message}</Typography>
                    <Typography><b>Status:</b> {req.status}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Sent on {new Date(req.createdAt).toLocaleString()}
                    </Typography>

                    {req.status === "Pending" && (
                      <Box mt={2} display="flex" gap={2}>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleRequestAction(req._id, "Approved")}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleRequestAction(req._id, "Rejected")}
                        >
                          Reject
                        </Button>
                      </Box>
                    )}
                  </Paper>
                ))
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setRequestsDialogOpen(false)}>Close</Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              sx={{ width: '100%' }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      )}
    </>
  );
};

// API functions
const fetchAdmins = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/admin/admins');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching admins:', error);
    return [];
  }
};

export default AdminUserDashboard;

