import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  Divider,
  Chip,
  Grid,
  Stack,
  Collapse,
  Alert,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  useMediaQuery,
  useTheme,
  AppBar,
  Toolbar,
  Drawer,
  Menu,
  MenuItem
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SendIcon from '@mui/icons-material/Send';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleIcon from '@mui/icons-material/People';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import QrCodeIcon from '@mui/icons-material/QrCode';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import MenuIcon from '@mui/icons-material/Menu';
import { useParams, useNavigate } from 'react-router-dom';

// Payment Dialog Component
const PaymentDialog = ({ open, onClose, permission, onPaymentSuccess }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('gpay');
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    transactionId: ''
  });
  const [processing, setProcessing] = useState(false);

  const steps = ['Choose Method', 'Payment Details', 'Complete'];

  const paymentMethods = [
    {
      value: 'gpay',
      label: 'GPay/UPI',
      icon: <PhoneIphoneIcon />,
      description: 'Pay using GPay or any UPI app'
    },
    {
      value: 'qr',
      label: 'QR Code',
      icon: <QrCodeIcon />,
      description: 'Scan QR code to pay'
    },
    {
      value: 'bank',
      label: 'Internet Banking',
      icon: <AccountBalanceIcon />,
      description: 'Transfer via bank account'
    }
  ];

  const bankDetails = {
    accountNumber: '123456789012',
    accountHolderName: 'EDU CONNECT PVT LTD',
    ifscCode: 'SBIN0001234',
    bankName: 'State Bank of India',
    branch: 'Chennai Main Branch'
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handlePaymentDetailsChange = (field, value) => {
    setPaymentDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleClose();
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handlePaymentSubmit = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setActiveStep(2);
      
      // Call success callback
      if (onPaymentSuccess) {
        onPaymentSuccess({
          ...paymentDetails,
          paymentMethod,
          amount: permission?.paymentAmount || 500,
          timestamp: new Date().toISOString()
        });
      }
    }, 3000);
  };

  const handleClose = () => {
    setActiveStep(0);
    setPaymentMethod('gpay');
    setPaymentDetails({});
    onClose();
  };

  const openGpay = () => {
    const upiId = 'educonnect@oksbi';
    const amount = permission?.paymentAmount || 500;
    const name = 'EDU CONNECT';
    const note = `Capacity Increase - ${permission?.staffName}`;
    
    const gpayUrl = `tez://upi/pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&tn=${encodeURIComponent(note)}`;
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&tn=${encodeURIComponent(note)}`;
    
    // Try GPay first, then fallback to generic UPI
    window.location.href = gpayUrl;
    
    // Fallback after a delay
    setTimeout(() => {
      window.location.href = upiUrl;
    }, 500);
  };

  const generateQRCodeUrl = () => {
    const upiId = 'educonnect@oksbi';
    const amount = permission?.paymentAmount || 500;
    const name = 'EDU CONNECT';
    const note = `Capacity Increase - ${permission?.staffName}`;
    
    return `https://upiqr.in/?pid=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&tn=${encodeURIComponent(note)}`;
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={{ mb: 2, fontWeight: 'bold', fontSize: isMobile ? '1rem' : '1.1rem' }}>
                Select Payment Method
              </FormLabel>
              <RadioGroup value={paymentMethod} onChange={handlePaymentMethodChange}>
                <Grid container spacing={2}>
                  {paymentMethods.map((method) => (
                    <Grid item xs={12} key={method.value}>
                      <Paper 
                        variant="outlined" 
                        sx={{ 
                          p: isMobile ? 1.5 : 2,
                          border: paymentMethod === method.value ? '2px solid #4A69E0' : '1px solid #e0e0e0',
                          backgroundColor: paymentMethod === method.value ? '#F0F7FF' : 'white',
                          cursor: 'pointer'
                        }}
                        onClick={() => setPaymentMethod(method.value)}
                      >
                        <FormControlLabel
                          value={method.value}
                          control={<Radio />}
                          label={
                            <Box sx={{ ml: 1 }}>
                              <Box display="flex" alignItems="center">
                                <Box sx={{ color: '#4A69E0', mr: 1 }}>
                                  {method.icon}
                                </Box>
                                <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="bold">
                                  {method.label}
                                </Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                                {method.description}
                              </Typography>
                            </Box>
                          }
                          sx={{ width: '100%', m: 0 }}
                        />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </RadioGroup>
            </FormControl>

            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                <strong>Payment Amount:</strong> ₹{permission?.paymentAmount || 500}
              </Typography>
            </Alert>
          </Box>
        );

      case 1:
        if (paymentMethod === 'gpay') {
          return (
            <Box textAlign="center">
              <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
                Pay with GPay/UPI
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                Click the button below to open GPay or any UPI app
              </Typography>
              
              <Box sx={{ my: 3 }}>
                <Button
                  variant="contained"
                  size={isMobile ? "medium" : "large"}
                  onClick={openGpay}
                  sx={{
                    backgroundColor: '#4285F4',
                    '&:hover': { backgroundColor: '#3367D6' },
                    px: isMobile ? 3 : 4,
                    py: isMobile ? 1 : 1.5,
                    fontSize: isMobile ? '0.9rem' : '1.1rem',
                    minWidth: isMobile ? '140px' : '160px'
                  }}
                >
                  {isMobile ? 'Open GPay' : 'Open GPay App'}
                </Button>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                UPI ID: <strong>educonnect@oksbi</strong>
              </Typography>

              <TextField
                fullWidth
                label="Transaction ID (Optional)"
                value={paymentDetails.transactionId}
                onChange={(e) => handlePaymentDetailsChange('transactionId', e.target.value)}
                margin="normal"
                size={isMobile ? "small" : "medium"}
                helperText="Enter UPI transaction reference number"
              />
            </Box>
          );
        }

        if (paymentMethod === 'qr') {
          return (
            <Box textAlign="center">
              <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
                Scan QR Code to Pay
              </Typography>
              
              <Paper sx={{ p: isMobile ? 2 : 3, my: 2, display: 'inline-block' }}>
                <img 
                  src={generateQRCodeUrl()} 
                  alt="UPI QR Code"
                  style={{ 
                    width: isMobile ? 150 : 200, 
                    height: isMobile ? 150 : 200 
                  }}
                />
              </Paper>

              <Box sx={{ mt: 2, textAlign: 'left' }}>
                <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                  Steps:
                </Typography>
                <Typography variant="body2" sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem', mb: 0.5 }}>
                  1. Open any UPI app on your phone
                </Typography>
                <Typography variant="body2" sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem', mb: 0.5 }}>
                  2. Tap on "Scan QR Code"
                </Typography>
                <Typography variant="body2" sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem', mb: 0.5 }}>
                  3. Scan the QR code above
                </Typography>
                <Typography variant="body2" sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                  4. Confirm payment of ₹{permission?.paymentAmount || 500}
                </Typography>
              </Box>

              <TextField
                fullWidth
                label="Transaction ID"
                value={paymentDetails.transactionId}
                onChange={(e) => handlePaymentDetailsChange('transactionId', e.target.value)}
                margin="normal"
                required
                size={isMobile ? "small" : "medium"}
                helperText="Enter UPI transaction reference number after payment"
              />
            </Box>
          );
        }

        if (paymentMethod === 'bank') {
          return (
            <Box>
              <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
                Bank Transfer Details
              </Typography>

              <Paper sx={{ p: isMobile ? 2 : 3, mb: 3, backgroundColor: '#F0F7FF' }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                  Recipient Bank Details:
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem', mb: 0.5 }}>
                    <strong>Account Holder:</strong> {bankDetails.accountHolderName}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem', mb: 0.5 }}>
                    <strong>Account Number:</strong> {bankDetails.accountNumber}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem', mb: 0.5 }}>
                    <strong>IFSC Code:</strong> {bankDetails.ifscCode}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem', mb: 0.5 }}>
                    <strong>Bank:</strong> {bankDetails.bankName}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem', mb: 0.5 }}>
                    <strong>Branch:</strong> {bankDetails.branch}
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ mt: 1, fontSize: isMobile ? '0.8rem' : '0.9rem', fontWeight: 'bold' }}>
                    <strong>Amount:</strong> ₹{permission?.paymentAmount || 500}
                  </Typography>
                </Box>
              </Paper>

              <Typography variant="body2" color="text.secondary" paragraph sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                Please transfer the exact amount using internet banking and provide transaction details below:
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Your Bank Account Number"
                    value={paymentDetails.accountNumber}
                    onChange={(e) => handlePaymentDetailsChange('accountNumber', e.target.value)}
                    margin="normal"
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Account Holder Name"
                    value={paymentDetails.accountHolderName}
                    onChange={(e) => handlePaymentDetailsChange('accountHolderName', e.target.value)}
                    margin="normal"
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="IFSC Code"
                    value={paymentDetails.ifscCode}
                    onChange={(e) => handlePaymentDetailsChange('ifscCode', e.target.value)}
                    margin="normal"
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bank Transaction ID/Reference Number"
                    value={paymentDetails.transactionId}
                    onChange={(e) => handlePaymentDetailsChange('transactionId', e.target.value)}
                    margin="normal"
                    required
                    size={isMobile ? "small" : "medium"}
                    helperText="Enter the transaction reference number from your bank"
                  />
                </Grid>
              </Grid>
            </Box>
          );
        }
        return null;

      case 2:
        return (
          <Box textAlign="center">
            <CheckCircleIcon sx={{ fontSize: isMobile ? 48 : 64, color: '#4CAF50', mb: 2 }} />
            <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
              Payment Successful!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
              Your payment of ₹{permission?.paymentAmount || 500} has been processed successfully.
            </Typography>
            {paymentDetails.transactionId && (
              <Typography variant="body2" sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                <strong>Transaction ID:</strong> {paymentDetails.transactionId}
              </Typography>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle sx={{ 
        backgroundColor: '#4A69E0', 
        color: 'white',
        py: isMobile ? 2 : 3
      }}>
        <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
          Payment - Capacity Increase
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel sx={{
                '& .MuiStepLabel-label': {
                  fontSize: isMobile ? '0.7rem' : '0.875rem'
                }
              }}>
                {isMobile ? label.split(' ')[0] : label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent(activeStep)}
      </DialogContent>

      <DialogActions sx={{ p: isMobile ? 2 : 3 }}>
        {activeStep > 0 && activeStep < 2 && (
          <Button 
            onClick={handleBack} 
            disabled={processing}
            size={isMobile ? "small" : "medium"}
          >
            Back
          </Button>
        )}
        
        <Box sx={{ flex: 1 }} />
        
        {activeStep === 0 && (
          <Button 
            variant="contained" 
            onClick={handleNext}
            sx={{ backgroundColor: '#4A69E0' }}
            size={isMobile ? "small" : "medium"}
          >
            Next
          </Button>
        )}
        
        {activeStep === 1 && (
          <Button 
            variant="contained" 
            onClick={handlePaymentSubmit}
            disabled={processing || (paymentMethod !== 'gpay' && !paymentDetails.transactionId)}
            startIcon={processing ? <CircularProgress size={16} /> : null}
            size={isMobile ? "small" : "medium"}
          >
            {processing ? 'Processing...' : 'Confirm Payment'}
          </Button>
        )}
        
        {activeStep === 2 && (
          <Button 
            variant="contained" 
            onClick={handleClose}
            sx={{ backgroundColor: '#4CAF50' }}
            size={isMobile ? "small" : "medium"}
          >
            Done
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

// Main AdminViewPage Component
const AdminViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pendingRequests, setPendingRequests] = useState([]);
  const [showStudents, setShowStudents] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [staffPosts, setStaffPosts] = useState([]);
  const [showPosts, setShowPosts] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState(null);

  // Request to admin
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [sendingRequest, setSendingRequest] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Followers
  const [followers, setFollowers] = useState([]);
  const [followersDialogOpen, setFollowersDialogOpen] = useState(false);
  const [followersLoading, setFollowersLoading] = useState(false);

  // Pending permissions
  const [pendingPermissions, setPendingPermissions] = useState([]);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [permissionsLoading, setPermissionsLoading] = useState(false);

  // Capacity info
  const [capacityInfo, setCapacityInfo] = useState(null);

  // Payment dialog
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);

  // Mobile menu
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  // Check staff authentication status
  const checkStaffAuth = () => {
    const staffName = localStorage.getItem('staffName');
    const staffId = localStorage.getItem('staffId');
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    return { staffName, staffId, token, userType };
  };

  // Fetch admin + pending requests + followers + permissions + capacity
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/admin/admins/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setAdmin(data);

        const pendingRes = await fetch(
          `http://localhost:5000/api/admin/pending-requests/${data.fullName}/${data.department}`
        );
        const pendingData = await pendingRes.json();
        setPendingRequests(pendingData);

        await fetchFollowers(data._id);
        await fetchPendingPermissions(data._id);
        await fetchCapacityInfo(data._id);

        setLoading(false);
      } catch (err) {
        setError('Failed to load admin');
        setLoading(false);
      }
    };

    if (id) fetchAdmin();
    else {
      setError('No admin ID provided');
      setLoading(false);
    }
  }, [id]);

  // Fetch followers
  const fetchFollowers = async (adminId) => {
    setFollowersLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/follow/followers/${adminId}`);
      const data = await res.json();
      if (Array.isArray(data)) setFollowers(data);
      else setFollowers([]);
    } catch (err) {
      console.error('Error fetching followers:', err);
      setFollowers([]);
    } finally {
      setFollowersLoading(false);
    }
  };

  // Fetch capacity info
  const fetchCapacityInfo = async (adminId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/permissions/staff-capacity/${adminId}`);
      const data = await res.json();
      setCapacityInfo(data);
    } catch (err) {
      console.error('Error fetching capacity info:', err);
      setCapacityInfo(null);
    }
  };

  // Fetch pending permissions
  const fetchPendingPermissions = async (adminId) => {
    setPermissionsLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/permissions/requests`);
      const data = await res.json();
      
      const adminPermissions = data.filter(permission => 
        permission.adminId === adminId && 
        permission.status === 'Pending' &&
        permission.paymentApprovalStatus === 'Processing'
      );
      
      setPendingPermissions(adminPermissions);
    } catch (err) {
      console.error('Error fetching pending permissions:', err);
      setPendingPermissions([]);
    } finally {
      setPermissionsLoading(false);
    }
  };

  // Fetch staff posts
  const fetchStaffPosts = async () => {
    if (!admin?.fullName) return;

    setPostsLoading(true);
    setPostsError(null);
    try {
      const res = await fetch(`http://localhost:5000/api/posts?staffName=${encodeURIComponent(admin.fullName)}`);
      const data = await res.json();
      if (Array.isArray(data)) setStaffPosts(data);
      else if (data?.posts && Array.isArray(data.posts)) setStaffPosts(data.posts);
      else setStaffPosts([]);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setPostsError('Failed to load posts');
    } finally {
      setPostsLoading(false);
    }
  };

  // Payment dialog functions
  const handleOpenPaymentDialog = (permission) => {
    setSelectedPermission(permission);
    setPaymentDialogOpen(true);
  };

  const handleClosePaymentDialog = () => {
    setPaymentDialogOpen(false);
    setSelectedPermission(null);
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/permissions/requests/${selectedPermission._id}/payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentStatus: 'Paid',
          transactionId: paymentData.transactionId,
          paymentMethod: paymentData.paymentMethod,
          paidAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Payment completed successfully!',
          severity: 'success'
        });
        
        await fetchPendingPermissions(admin._id);
      }
    } catch (err) {
      console.error('Error updating payment status:', err);
    }
  };

  // WhatsApp functions
  const openWhatsAppForPayment = (permission) => {
    const phoneNumber = permission.paymentPhone || '9486042369';
    const staffName = permission.staffName || 'Staff';
    const message = `Hello! I have made the payment of ₹${permission.paymentAmount || 500} for capacity increase. Here is my payment screenshot. My Staff ID: ${permission.staffId}. Staff Name: ${staffName}`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const togglePostsVisibility = () => {
    if (!showPosts && staffPosts.length === 0) fetchStaffPosts();
    setShowPosts(!showPosts);
  };

  // Request dialog handlers
  const handleOpenRequestDialog = () => {
    const { staffName, staffId, userType } = checkStaffAuth();

    if (!staffName || !staffId || userType !== 'staff') {
      setSnackbar({ 
        open: true, 
        message: 'Please login as staff to send requests', 
        severity: 'error' 
      });
      return;
    }

    setRequestDialogOpen(true);
    setRequestMessage(
      `I need to increase my student capacity. Current followers: ${followers.length}. Requesting approval for additional 50 student slots.`
    );
  };

  const handleCloseRequestDialog = () => {
    setRequestDialogOpen(false);
    setRequestMessage('');
  };

  // Send permission request
  const handleSendRequest = async () => {
    if (!requestMessage.trim()) {
      setSnackbar({ open: true, message: 'Please enter a request message', severity: 'error' });
      return;
    }

    const { staffName, staffId, token, userType } = checkStaffAuth();

    if (!staffName || !staffId || !token || userType !== 'staff') {
      setSnackbar({ 
        open: true, 
        message: 'Please login as staff to send requests', 
        severity: 'error' 
      });
      handleCloseRequestDialog();
      return;
    }

    setSendingRequest(true);
    try {
      const requestData = {
        staffName: staffName,
        staffId: staffId,
        message: requestMessage,
        adminName: admin.fullName,
        adminDepartment: admin.department,
        adminId: admin._id,
        followersCount: followers.length
      };

      const response = await fetch(`http://localhost:5000/api/permissions/send-request/${admin._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || responseData.message || `Request failed with status ${response.status}`);
      }

      setSnackbar({ 
        open: true, 
        message: responseData.message || 'Capacity increase request sent successfully!', 
        severity: 'success' 
      });
      handleCloseRequestDialog();
      setHasRequested(true);
      
      await fetchPendingPermissions(admin._id);
      
    } catch (err) {
      console.error('Error sending request:', err);
      setSnackbar({ 
        open: true, 
        message: err.message || 'Failed to send request. Please try again.', 
        severity: 'error' 
      });
    } finally {
      setSendingRequest(false);
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  // Followers dialog handlers
  const handleOpenFollowersDialog = () => {
    setFollowersDialogOpen(true);
    if (followers.length === 0) fetchFollowers(admin._id);
  };

  const handleCloseFollowersDialog = () => setFollowersDialogOpen(false);

  // Permissions dialog handlers
  const handleOpenPermissionsDialog = () => {
    setPermissionsDialogOpen(true);
    if (pendingPermissions.length === 0) fetchPendingPermissions(admin._id);
  };

  const handleClosePermissionsDialog = () => setPermissionsDialogOpen(false);

  // Mobile menu handlers
  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const DetailItem = ({ label, value }) => (
    <Box mb={2}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
        {value || 'N/A'}
      </Typography>
    </Box>
  );

  if (loading) return (
    <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <CircularProgress />
      <Typography sx={{ ml: 2, fontSize: isMobile ? '0.9rem' : '1rem' }}>Loading admin data...</Typography>
    </Box>
  );

  if (error) return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      <Button variant="contained" onClick={() => navigate(-1)} startIcon={<ArrowBackIcon />}>
        Go Back
      </Button>
    </Box>
  );

  return (
    <Box sx={{ 
      p: isMobile ? 1 : 3, 
      backgroundColor: '#F5F7FA', 
      minHeight: '100vh' 
    }}>
      {/* Back Button */}
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)} 
        sx={{ 
          mb: 2, 
          color: '#4A69E0', 
          '&:hover': { backgroundColor: 'rgba(74,105,224,0.08)' },
          fontSize: isMobile ? '0.8rem' : '0.9rem'
        }}
      >
        Back to Dashboard
      </Button>

      <Paper sx={{ 
        p: isMobile ? 2 : 4, 
        borderRadius: isMobile ? 2 : 3, 
        backgroundColor: '#FFFFFF' 
      }}>
        {/* Header Section */}
        <Box 
          display="flex" 
          alignItems={isMobile ? "flex-start" : "center"} 
          justifyContent="space-between" 
          mb={4}
          flexDirection={isMobile ? "column" : "row"}
          gap={isMobile ? 2 : 0}
        >
          <Box display="flex" alignItems="center">
            <Avatar sx={{ 
              width: isMobile ? 64 : 96, 
              height: isMobile ? 64 : 96, 
              bgcolor: '#DDEEFF', 
              color: '#4A69E0', 
              fontSize: isMobile ? '1.5rem' : '2.5rem', 
              mr: isMobile ? 2 : 3 
            }}>
              {admin.fullName?.charAt(0) || 'A'}
            </Avatar>
            <Box>
              <Typography 
                variant={isMobile ? "h5" : "h4"} 
                fontWeight="bold" 
                gutterBottom
                sx={{ fontSize: isMobile ? '1.5rem' : '2rem' }}
              >
                {admin.fullName}
              </Typography>
              <Stack 
                direction="row" 
                spacing={1} 
                alignItems="center"
                flexWrap="wrap"
              >
                <Chip 
                  label="Staff" 
                  color="primary" 
                  variant="outlined" 
                  size={isMobile ? "small" : "medium"} 
                />
                <Chip 
                  label={admin.isActive ? 'Active' : 'Inactive'} 
                  color={admin.isActive ? 'success' : 'error'} 
                  size={isMobile ? "small" : "medium"} 
                />
              </Stack>
            </Box>
          </Box>

          {/* Capacity Info Card */}
          {capacityInfo && (
            <Card sx={{ 
              minWidth: isMobile ? '100%' : 200, 
              backgroundColor: '#F0F7FF', 
              border: '1px solid #4A69E0',
              mt: isMobile ? 1 : 0
            }}>
              <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
                <Typography variant="h6" gutterBottom color="#4A69E0" sx={{ fontSize: isMobile ? '1rem' : '1.25rem' }}>
                  Capacity
                </Typography>
                <Typography variant="body2" sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                  Followers: {capacityInfo.currentFollowers}/{capacityInfo.totalCapacity}
                </Typography>
                {capacityInfo.hasActiveBatch && (
                  <Typography variant="body2" color="success.main" sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                    Available: {capacityInfo.availableSlots} slots
                  </Typography>
                )}
              </CardContent>
            </Card>
          )}
        </Box>

        {/* Action Buttons - Mobile vs Desktop */}
        {isMobile ? (
          // Mobile Action Buttons
          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<MenuIcon />}
              onClick={handleMobileMenuOpen}
              fullWidth
              sx={{
                borderColor: '#4A69E0',
                color: '#4A69E0',
                py: 1.2,
                borderRadius: 2,
                fontWeight: 'bold',
                textTransform: 'none'
              }}
            >
              Quick Actions
            </Button>
            <Menu
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={handleMobileMenuClose}
            >
              <MenuItem onClick={() => { handleOpenFollowersDialog(); handleMobileMenuClose(); }}>
                <PeopleIcon sx={{ mr: 1, color: '#4A69E0' }} />
                Followers ({followers.length})
              </MenuItem>
              <MenuItem onClick={() => { handleOpenPermissionsDialog(); handleMobileMenuClose(); }}>
                <Badge badgeContent={pendingPermissions.length} color="error">
                  <PendingActionsIcon sx={{ mr: 1, color: '#FF6B35' }} />
                </Badge>
                Pending ({pendingPermissions.length})
              </MenuItem>
              <MenuItem onClick={() => { handleOpenRequestDialog(); handleMobileMenuClose(); }}>
                <PersonAddIcon sx={{ mr: 1, color: '#FF6B35' }} />
                Request Capacity
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          // Desktop Action Buttons
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <Button 
              variant="outlined" 
              startIcon={<PeopleIcon />} 
              onClick={handleOpenFollowersDialog} 
              sx={{ 
                borderColor:'#4A69E0', 
                color:'#4A69E0', 
                px:3, 
                py:1.2, 
                borderRadius:2, 
                fontWeight:'bold', 
                textTransform:'none', 
                fontSize:'1rem', 
                '&:hover': { 
                  backgroundColor:'rgba(74,105,224,0.08)', 
                  borderColor:'#3A59D0' 
                } 
              }}
            >
              Followers ({followers.length})
            </Button>

            <Button 
              variant="outlined" 
              startIcon={
                <Badge badgeContent={pendingPermissions.length} color="error">
                  <PendingActionsIcon />
                </Badge>
              } 
              onClick={handleOpenPermissionsDialog} 
              sx={{ 
                borderColor:'#FF6B35', 
                color:'#FF6B35', 
                px:3, 
                py:1.2, 
                borderRadius:2, 
                fontWeight:'bold', 
                textTransform:'none', 
                fontSize:'1rem', 
                '&:hover': { 
                  backgroundColor:'rgba(255,107,53,0.08)', 
                  borderColor:'#E55A2B' 
                } 
              }}
            >
              Pending ({pendingPermissions.length})
            </Button>

            <Button 
              variant="contained" 
              startIcon={<PersonAddIcon />} 
              onClick={handleOpenRequestDialog} 
              sx={{ 
                backgroundColor:'#FF6B35', 
                '&:hover':{backgroundColor:'#E55A2B'}, 
                px:3, 
                py:1.2, 
                borderRadius:2, 
                fontWeight:'bold', 
                textTransform:'none', 
                fontSize:'1rem' 
              }}
            >
              Request Capacity
            </Button>
          </Box>
        )}

        <Divider sx={{ my:3 }} />

        {/* Information Grid */}
        <Grid container spacing={isMobile ? 2 : 4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" mb={3} color="#4A69E0" sx={{ fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
              Personal Information
            </Typography>
            <DetailItem label="Email" value={admin.email} />
            <DetailItem label="Phone" value={admin.phone} />
            <DetailItem label="Gender" value={admin.gender} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" mb={3} color="#4A69E0" sx={{ fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
              Professional Information
            </Typography>
            <DetailItem label="Department" value={admin.department} />
            <DetailItem label="Joined On" value={admin.joiningDate ? new Date(admin.joiningDate).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric'}) : 'N/A'} />

            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                Student Requests
              </Typography>
              <Chip 
                label={`${pendingRequests.length} pending`} 
                onClick={() => setShowStudents(!showStudents)} 
                icon={showStudents ? <ExpandLessIcon /> : <ExpandMoreIcon />} 
                sx={{ 
                  backgroundColor: pendingRequests.length>0 ? '#FFEBD3':'#E0E0E0', 
                  color: pendingRequests.length>0 ? '#CC8A00':'#555', 
                  fontWeight:'bold', 
                  cursor:'pointer',
                  fontSize: isMobile ? '0.7rem' : '0.8rem'
                }} 
              />
            </Box>

            <Collapse in={showStudents}>
              <Paper variant="outlined" sx={{ p: isMobile ? 1 : 2, mt:1 }}>
                {pendingRequests.length === 0 ? 
                  <Typography color="text.secondary" sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                    No pending student requests.
                  </Typography> :
                  pendingRequests.map(student => (
                    <Box 
                      key={student._id} 
                      onClick={() => setSelectedStudent(student)} 
                      sx={{ 
                        border:'1px solid #ccc', 
                        borderRadius:2, 
                        p: isMobile ? 1 : 2, 
                        mb:2, 
                        backgroundColor:selectedStudent?._id===student._id?'#E3EDFF':'#f9f9f9', 
                        cursor:'pointer', 
                        '&:hover':{backgroundColor:'#EDF3FF'}
                      }}
                    >
                      <Typography sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                        <strong>Name:</strong> {student.username}
                      </Typography>
                      <Typography sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                        <strong>Doubt:</strong> {student.doubt}
                      </Typography>
                      <Typography sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                        <strong>Subject:</strong> {student.subject}
                      </Typography>
                      <Typography sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                        <strong>Submitted On:</strong> {new Date(student.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                  ))
                }
              </Paper>
            </Collapse>
          </Grid>
        </Grid>

        {/* Staff posts section */}
        <Box mt={6}>
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="space-between" 
            onClick={togglePostsVisibility} 
            sx={{ 
              cursor:'pointer', 
              '&:hover':{backgroundColor:'#f5f5f5'}, 
              p:1, 
              borderRadius:1 
            }}
          >
            <Typography variant="h6" fontWeight="bold" color="#4A69E0" sx={{ fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
              Staff Posts ({staffPosts.length})
            </Typography>
            <IconButton size="small">
              {showPosts ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>

          <Collapse in={showPosts}>
            {postsLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" py={3}>
                <CircularProgress size={24} />
                <Typography sx={{ ml: 2, fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                  Loading posts...
                </Typography>
              </Box>
            ) : postsError ? (
              <Alert severity="error" sx={{ my:2 }}>{postsError}</Alert>
            ) : staffPosts.length === 0 ? (
              <Typography color="text.secondary" sx={{ mt:2, fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                No posts available.
              </Typography>
            ) : (
              <Box sx={{ mt:2 }}>
                {staffPosts.map(post => (
                  <Paper key={post._id} sx={{ p: isMobile ? 2 : 3, mb:3, borderRadius:2 }}>
                    <Box display="flex" alignItems="center" mb={2} flexWrap="wrap" gap={1}>
                      <Chip 
                        label={post.userType} 
                        color={post.userType==='Staff'?'primary':'secondary'} 
                        size="small" 
                        sx={{ fontSize: isMobile ? '0.7rem' : '0.8rem' }}
                      />
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: isMobile ? '0.7rem' : '0.8rem' }}>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: isMobile ? '1rem' : '1.25rem' }}>
                      {post.topic}
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                      {post.content}
                    </Typography>
                    {post.fileUrl && (
                      <Button 
                        variant="outlined" 
                        size="small" 
                        component="a" 
                        href={`http://localhost:5000${post.fileUrl}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        sx={{ fontSize: isMobile ? '0.7rem' : '0.8rem' }}
                      >
                        Download File
                      </Button>
                    )}
                    {post.imageUrl && (
                      <Box mt={2}>
                        <img 
                          src={`http://localhost:5000${post.imageUrl}`} 
                          alt="Post" 
                          style={{
                            maxWidth:'100%', 
                            borderRadius:'8px',
                            height: 'auto'
                          }}
                        />
                      </Box>
                    )}
                  </Paper>
                ))}
              </Box>
            )}
          </Collapse>
        </Box>

        {/* Actions */}
        <Box mt={6} display="flex" justifyContent="flex-end" gap={2} flexWrap="wrap">
          <Button 
            variant="outlined" 
            onClick={() => {
              selectedStudent ? 
                navigate(`/admin/message-student/${selectedStudent._id}`, {state:{studentName:selectedStudent.username}}) : 
                alert('Please select a student first.');
            }} 
            sx={{ 
              borderColor:'#4A69E0', 
              color:'#4A69E0', 
              px: isMobile ? 2 : 4, 
              py:1.2, 
              borderRadius:2, 
              fontWeight:'bold',
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              minWidth: isMobile ? '120px' : 'auto',
              '&:hover':{backgroundColor:'rgba(74,105,224,0.08)'}
            }}
          >
            Message
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              selectedStudent ? 
                navigate(`/admin/view-requests/${selectedStudent._id}`, {state:{studentName:selectedStudent.username, staffName:admin.fullName}}) : 
                alert('Please select a student first.');
            }} 
            sx={{ 
              backgroundColor:'#4A69E0', 
              px: isMobile ? 2 : 4, 
              py:1.2, 
              borderRadius:2, 
              fontWeight:'bold',
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              minWidth: isMobile ? '120px' : 'auto',
              '&:hover':{backgroundColor:'#3A59D0'}
            }}
          >
            View Requests
          </Button>
        </Box>
      </Paper>

      {/* Request Dialog */}
      <Dialog 
        open={requestDialogOpen} 
        onClose={handleCloseRequestDialog} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ 
          backgroundColor:'#FF6B35', 
          color:'white', 
          fontWeight:'bold',
          py: isMobile ? 2 : 3
        }}>
          <Box display="flex" alignItems="center">
            <PersonAddIcon sx={{ mr:1 }} />
            <Typography variant={isMobile ? "h6" : "h5"}>
              Request Capacity Increase
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
          <Typography variant="body1" gutterBottom sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
            You are requesting capacity increase from <strong>{admin.fullName}</strong> ({admin.department}).
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb:2, fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
            Current Followers: {followers.length} | Staff: {localStorage.getItem('staffName')}
          </Typography>
          <TextField 
            autoFocus 
            multiline 
            rows={4} 
            fullWidth 
            variant="outlined" 
            label="Request Message" 
            value={requestMessage} 
            onChange={e=>setRequestMessage(e.target.value)} 
            placeholder="Describe why you need capacity increase..." 
            sx={{ mt:2 }}
            size={isMobile ? "small" : "medium"}
          />
        </DialogContent>
        <DialogActions sx={{ p: isMobile ? 2 : 3 }}>
          <Button 
            onClick={handleCloseRequestDialog} 
            sx={{ 
              color:'text.secondary', 
              fontWeight:'bold',
              fontSize: isMobile ? '0.8rem' : '0.9rem'
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            startIcon={<SendIcon />} 
            onClick={handleSendRequest} 
            disabled={sendingRequest || !requestMessage.trim()} 
            sx={{ 
              backgroundColor:'#FF6B35',
              '&:hover':{backgroundColor:'#E55A2B'}, 
              fontWeight:'bold', 
              px:3,
              fontSize: isMobile ? '0.8rem' : '0.9rem'
            }}
          >
            {sendingRequest ? 'Sending...' : 'Send Request'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Followers Dialog */}
      <Dialog 
        open={followersDialogOpen} 
        onClose={handleCloseFollowersDialog} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ 
          backgroundColor:'#4A69E0', 
          color:'white', 
          fontWeight:'bold',
          py: isMobile ? 2 : 3
        }}>
          <Box display="flex" alignItems="center">
            <PeopleIcon sx={{ mr:1 }} />
            <Typography variant={isMobile ? "h6" : "h5"}>
              Followers of {admin.fullName}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
          {followersLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={3}>
              <CircularProgress size={24} />
              <Typography sx={{ ml:2, fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                Loading followers...
              </Typography>
            </Box>
          ) : followers.length === 0 ? (
            <Typography color="text.secondary" textAlign="center" py={3} sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
              No followers yet.
            </Typography>
          ) : (
            <List>
              {followers.map((follower,index) => (
                <ListItem key={follower._id||index} divider>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor:'#DDEEFF', color:'#4A69E0' }}>
                      {follower.studentName?.charAt(0).toUpperCase()||'S'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={
                      <Typography sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                        {follower.studentName||'Unknown Student'}
                      </Typography>
                    }
                    secondary={
                      <Typography sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                        Student ID: {follower.studentId}
                      </Typography>
                    } 
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions sx={{ p: isMobile ? 2 : 3 }}>
          <Button 
            onClick={handleCloseFollowersDialog} 
            sx={{ 
              color:'text.secondary', 
              fontWeight:'bold',
              fontSize: isMobile ? '0.8rem' : '0.9rem'
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Pending Permissions Dialog */}
      <Dialog 
        open={permissionsDialogOpen} 
        onClose={handleClosePermissionsDialog} 
        maxWidth="md" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ 
          backgroundColor:'#FF6B35', 
          color:'white', 
          fontWeight:'bold',
          py: isMobile ? 2 : 3
        }}>
          <Box display="flex" alignItems="center">
            <PendingActionsIcon sx={{ mr:1 }} />
            <Typography variant={isMobile ? "h6" : "h5"}>
              Pending Permission Requests ({pendingPermissions.length})
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
          {permissionsLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={3}>
              <CircularProgress size={24} />
              <Typography sx={{ ml:2, fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                Loading permissions...
              </Typography>
            </Box>
          ) : pendingPermissions.length === 0 ? (
            <Typography color="text.secondary" textAlign="center" py={3} sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
              No pending permission requests.
            </Typography>
          ) : (
            <List>
              {pendingPermissions.map((permission,index) => (
                <ListItem 
                  key={permission._id||index} 
                  divider 
                  sx={{ 
                    mb:2, 
                    border:'1px solid #eee', 
                    borderRadius:2,
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                  }}
                >
                  <Box display="flex" alignItems="center" width="100%" mb={1}>
                    <ListItemAvatar>
                      <Avatar sx={{
                        bgcolor: permission.studentId ? '#FFEBD3' : '#DDEEFF', 
                        color: permission.studentId ? '#CC8A00' : '#4A69E0'
                      }}>
                        {permission.studentId ? 
                          (permission.studentName?.charAt(0).toUpperCase()||'S') : 
                          (permission.staffName?.charAt(0).toUpperCase()||'S')
                        }
                      </Avatar>
                    </ListItemAvatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" sx={{ fontSize: isMobile ? '1rem' : '1.1rem' }}>
                        {permission.studentId ? 
                          `Student: ${permission.studentName}` : 
                          `Staff: ${permission.staffName}`
                        }
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                        {permission.studentId ? 
                          `Student ID: ${permission.studentId}` : 
                          `Staff ID: ${permission.staffId}`
                        }
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ mt:1, width: '100%' }}>
                    <Typography variant="body1" paragraph sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                      <strong>Request:</strong> {permission.message}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                      <strong>Current Followers:</strong> {permission.followersCount}
                    </Typography>
                    
                    {/* Payment Information */}
                    {permission.paymentStatus && permission.paymentStatus !== 'Paid' && (
                      <Box sx={{ mt: 1, p: 2, backgroundColor: '#FFF3E0', borderRadius: 2, border: '2px solid #FF9800' }}>
                        <Typography variant="body2" color="warning.main" gutterBottom sx={{ fontWeight: 'bold', fontSize: isMobile ? '1rem' : '1.1rem' }}>
                          💰 Payment Required - ₹{permission.paymentAmount || 500}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                          <Button
                            variant="contained"
                            onClick={() => handleOpenPaymentDialog(permission)}
                            sx={{ 
                              backgroundColor: '#FF6B35', 
                              '&:hover': { backgroundColor: '#E55A2B' },
                              fontWeight: 'bold',
                              textTransform: 'none',
                              fontSize: isMobile ? '0.7rem' : '0.8rem'
                            }}
                            size="small"
                          >
                            Pay Now
                          </Button>

                          <Button
                            variant="outlined"
                            startIcon={<WhatsAppIcon />}
                            onClick={() => openWhatsAppForPayment(permission)}
                            sx={{ 
                              borderColor: '#25D366',
                              color: '#25D366',
                              '&:hover': { 
                                backgroundColor: '#25D366',
                                color: 'white'
                              },
                              fontWeight: 'bold',
                              textTransform: 'none',
                              fontSize: isMobile ? '0.7rem' : '0.8rem'
                            }}
                            size="small"
                          >
                            WhatsApp
                          </Button>
                        </Box>

                        <Typography variant="body2" sx={{ mt: 1, fontSize: isMobile ? '0.7rem' : '0.8rem' }}>
                          <strong>Payment Methods:</strong> GPay, UPI, QR Code, Bank Transfer
                        </Typography>
                      </Box>
                    )}

                    {permission.paymentStatus === 'Paid' && (
                      <Box sx={{ mt: 1, p: 2, backgroundColor: '#E8F5E8', borderRadius: 2, border: '2px solid #4CAF50' }}>
                        <Typography variant="body2" color="success.main" gutterBottom sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                          ✅ Payment Completed
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                          <strong>Transaction ID:</strong> {permission.transactionId}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                          <strong>Payment Method:</strong> {permission.paymentMethod}
                        </Typography>
                      </Box>
                    )}
                    
                    {permission.requestType === 'CapacityIncrease' && (
                      <Typography variant="body2" color="primary" sx={{ mt: 1, fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                        <strong>🎯 Batch Request: {permission.batchSize} additional slots</strong>
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                      <strong>Requested On:</strong> {new Date(permission.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions sx={{ p: isMobile ? 2 : 3 }}>
          <Button 
            onClick={handleClosePermissionsDialog} 
            sx={{ 
              color:'text.secondary', 
              fontWeight:'bold',
              fontSize: isMobile ? '0.8rem' : '0.9rem'
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Dialog */}
      <PaymentDialog
        open={paymentDialogOpen}
        onClose={handleClosePaymentDialog}
        permission={selectedPermission}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Snackbar */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar} 
        anchorOrigin={{ vertical:'bottom', horizontal:'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width:'100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminViewPage;