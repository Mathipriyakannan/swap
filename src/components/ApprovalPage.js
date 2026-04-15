import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Grid,
  Snackbar,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

const ApprovalPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Message dialog state
  const [messageDialog, setMessageDialog] = useState({
    open: false,
    request: null,
  });

  // ✅ Fetch all permission requests from permission endpoint
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/permissions/requests");
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setSnackbar({
        open: true,
        message: "Failed to load requests",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (requestId, action) => {
    try {
      const status = action === 'approved' ? 'Approved' : 
                     action === 'rejected' ? 'Rejected' : action;
      
      const requestData = {
        status: status,
      };

      const response = await fetch(`http://localhost:5000/api/permissions/requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const updatedRequest = await response.json();
      
      setRequests(prev => prev.map(req => 
        req._id === requestId ? updatedRequest.request : req
      ));
      
      setSnackbar({
        open: true,
        message: updatedRequest.message || `Request ${status.toLowerCase()} successfully`,
        severity: 'success',
      });
      
    } catch (error) {
      console.error('Error updating request:', error);
      setSnackbar({
        open: true,
        message: error.message || `Failed to update request`,
        severity: 'error',
      });
    }
  };

  // Handle message button click
  const handleMessageClick = (request) => {
    setMessageDialog({
      open: true,
      request: request,
    });
  };

  // Close message dialog
  const handleCloseMessageDialog = () => {
    setMessageDialog({
      open: false,
      request: null,
    });
  };

  // ✅ Send payment instructions to backend (ONLY MESSAGE, NO PAYMENT PROCESSING)
  const sendPaymentInstructions = async () => {
    try {
      const { request } = messageDialog;
      
      const messageData = {
        paymentMessage: `💰 Payment Required for Capacity Increase\n\nDear ${request.staffName},\n\nTo increase your capacity from current ${request.followersCount || 0} followers to additional 50 slots, please pay ₹500 to:\n\n📱 Phone: 94860 42369\n💳 Amount: ₹500\n\nAfter payment, share the screenshot on WhatsApp to complete the process.\n\nThank you!`,
        paymentPhone: '9486042369',
        paymentAmount: 500,
        messageType: 'capacity_increase'
      };

      console.log('Sending payment message for request:', request._id);

      const response = await fetch(`http://localhost:5000/api/permissions/requests/${request._id}/payment-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error(`Failed to send payment message. Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Payment message sent successfully:', result);

      setSnackbar({
        open: true,
        message: 'Payment message sent successfully to staff!',
        severity: 'success',
      });

      handleCloseMessageDialog();
      fetchRequests(); // Refresh the list

    } catch (error) {
      console.error('Error sending payment message:', error);
      setSnackbar({
        open: true,
        message: `Failed to send payment message: ${error.message}`,
        severity: 'error',
      });
    }
  };

 // Copy payment details to clipboard - UPDATED
const copyPaymentDetails = () => {
  const paymentText = `💰 Payment Instructions for Capacity Increase:\n\n📋 Payment Details:\n👤 Staff Name: ${messageDialog.request?.staffName}\n🆔 Staff ID: ${messageDialog.request?.staffId}\n📚 Subject/Department: ${messageDialog.request?.adminDepartment}\n👨‍🏫 Admin: ${messageDialog.request?.adminName}\n💰 Amount: ₹500\n📱 Phone Number: 94860 42369\n\nAfter successful payment, share the payment screenshot on WhatsApp with all these details.\n\nThank you!`;
  
  navigator.clipboard.writeText(paymentText).then(() => {
    setSnackbar({
      open: true,
      message: 'Payment instructions copied to clipboard!',
      severity: 'success',
    });
  }).catch(() => {
    setSnackbar({
      open: true,
      message: 'Failed to copy to clipboard',
      severity: 'error',
    });
  });
};

  // Open WhatsApp with pre-filled message
  const openWhatsApp = () => {
    const phoneNumber = "9486042369";
    const staffName = messageDialog.request?.staffName || 'Staff';
    const staffId = messageDialog.request?.staffId || 'Unknown';
    const message = `Hello! Staff ${staffName} (ID: ${staffId}) has made the payment of ₹500 for capacity increase. Here is the payment screenshot.`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Rejected': return 'error';
      case 'Pending': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f4f5f7", p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: "#333" }}>
        Staff Permission Requests
      </Typography>

      {loading ? (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : requests.length === 0 ? (
        <Typography variant="h6" color="text.secondary" sx={{ textAlign: "center", mt: 5 }}>
          No staff permission requests found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {requests.map((req) => (
            <Grid item xs={12} md={6} lg={4} key={req._id}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor:
                    req.status === "Approved"
                      ? "#E8F5E9"
                      : req.status === "Rejected"
                      ? "#FFEBEE"
                      : "#FFFFFF",
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h6" fontWeight="bold">
                    {req.staffName}
                  </Typography>
                  <Chip 
                    label={req.status} 
                    color={getStatusColor(req.status)} 
                    size="small" 
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  <strong>Staff ID:</strong> {req.staffId}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  To: {req.adminName} ({req.adminDepartment})
                </Typography>
                
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <b>Message:</b> {req.message}
                </Typography>
                
                {req.followersCount > 0 && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <b>Current Followers:</b> {req.followersCount}
                  </Typography>
                )}

                {req.paymentMessageSent && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <b>Payment Message:</b> 
                    <Chip 
                      label="Sent" 
                      color="info" 
                      size="small" 
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                )}
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.8rem' }}>
                  Requested on: {new Date(req.createdAt).toLocaleDateString()}
                </Typography>

                {req.status === "Pending" && (
                  <Box mt={2} display="flex" gap={2} flexDirection="column">
                    <Box display="flex" gap={2}>
                      <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        onClick={() => handleAction(req._id, "Approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        onClick={() => handleAction(req._id, "Rejected")}
                      >
                        Reject
                      </Button>
                    </Box>
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      onClick={() => handleMessageClick(req)}
                      sx={{ mt: 1 }}
                      disabled={req.paymentMessageSent}
                    >
                      {req.paymentMessageSent ? 'Message Sent' : 'Send Payment Message'}
                    </Button>
                  </Box>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog 
        open={messageDialog.open} 
        onClose={handleCloseMessageDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight="bold">
              💰 Send Payment Message to {messageDialog.request?.staffName}
            </Typography>
            <IconButton onClick={handleCloseMessageDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          {messageDialog.request && (
            <Box>
              <Box sx={{ mb: 3, p: 2, backgroundColor: '#E3F2FD', borderRadius: 1 }}>
                <Typography variant="body2" fontWeight="bold">
                  <strong>Staff:</strong> {messageDialog.request.staffName}
                </Typography>
                <Typography variant="body2">
                  <strong>Staff ID:</strong> {messageDialog.request.staffId}
                </Typography>
                <Typography variant="body2">
                  This payment instruction will be stored and shown in the staff's pending requests.
                </Typography>
              </Box>

              <Card sx={{ backgroundColor: '#FFF3E0', mb: 3, border: '2px solid #FF9800' }}>
                <CardContent>
                  <Typography variant="h6" color="#E65100" gutterBottom sx={{ fontWeight: 'bold' }}>
                    📱 Payment Details
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, fontSize: '1.1rem' }}>
                    <strong>Amount:</strong> ₹500
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, fontSize: '1.1rem' }}>
                    <strong>Phone Number:</strong> 94860 42369
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Payment Method:</strong> UPI / PhonePe / GPay / Any UPI App
                  </Typography>
                  
                  <Box display="flex" gap={2} flexWrap="wrap">
                    <Button
                      variant="outlined"
                      startIcon={<ContentCopyIcon />}
                      onClick={copyPaymentDetails}
                      color="primary"
                    >
                      Copy Instructions
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<WhatsAppIcon />}
                      onClick={openWhatsApp}
                      color="success"
                    >
                      Open WhatsApp
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ backgroundColor: '#E8F5E9', mb: 3, border: '2px solid #4CAF50' }}>
                <CardContent>
                  <Typography variant="h6" color="#2E7D32" gutterBottom sx={{ fontWeight: 'bold' }}>
                    📸 Instructions for Staff
                  </Typography>
                  <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                      <strong>Step 1:</strong> Pay ₹500 to phone number <strong>94860 42369</strong>
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                      <strong>Step 2:</strong> Take a clear screenshot of the successful payment
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                      <strong>Step 3:</strong> Share the payment screenshot on WhatsApp to the same number
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                      <strong>Step 4:</strong> Capacity will be increased after payment verification
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseMessageDialog} color="primary">
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={sendPaymentInstructions}
            startIcon={<SendIcon />}
            color="success"
          >
            Send Message to Staff
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ApprovalPage;