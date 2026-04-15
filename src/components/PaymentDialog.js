import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Grid,
  Paper,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import QrCodeIcon from '@mui/icons-material/QrCode';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const PaymentDialog = ({ open, onClose, permission, onPaymentSuccess }) => {
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
  const [paymentCompleted, setPaymentCompleted] = useState(false);

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
      setPaymentCompleted(true);
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
    setPaymentCompleted(false);
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
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ mb: 2, fontWeight: 'bold' }}>
                Select Payment Method
              </FormLabel>
              <RadioGroup value={paymentMethod} onChange={handlePaymentMethodChange}>
                <Grid container spacing={2}>
                  {paymentMethods.map((method) => (
                    <Grid item xs={12} key={method.value}>
                      <Paper 
                        variant="outlined" 
                        sx={{ 
                          p: 2,
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
                                <Typography variant="h6" fontWeight="bold">
                                  {method.label}
                                </Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary">
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
              <Typography variant="body2">
                <strong>Payment Amount:</strong> ₹{permission?.paymentAmount || 500}
              </Typography>
            </Alert>
          </Box>
        );

      case 1:
        if (paymentMethod === 'gpay') {
          return (
            <Box textAlign="center">
              <Typography variant="h6" gutterBottom>
                Pay with GPay/UPI
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Click the button below to open GPay or any UPI app
              </Typography>
              
              <Box sx={{ my: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={openGpay}
                  sx={{
                    backgroundColor: '#4285F4',
                    '&:hover': { backgroundColor: '#3367D6' },
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem'
                  }}
                >
                  Open GPay
                </Button>
              </Box>

              <Typography variant="body2" color="text.secondary">
                UPI ID: <strong>educonnect@oksbi</strong>
              </Typography>

              <TextField
                fullWidth
                label="Transaction ID (Optional)"
                value={paymentDetails.transactionId}
                onChange={(e) => handlePaymentDetailsChange('transactionId', e.target.value)}
                margin="normal"
                helperText="Enter UPI transaction reference number"
              />
            </Box>
          );
        }

        if (paymentMethod === 'qr') {
          return (
            <Box textAlign="center">
              <Typography variant="h6" gutterBottom>
                Scan QR Code to Pay
              </Typography>
              
              <Paper sx={{ p: 3, my: 2, display: 'inline-block' }}>
                <img 
                  src={generateQRCodeUrl()} 
                  alt="UPI QR Code"
                  style={{ width: 200, height: 200 }}
                />
              </Paper>

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Steps:</strong>
                </Typography>
                <Typography variant="body2">
                  1. Open any UPI app on your phone
                </Typography>
                <Typography variant="body2">
                  2. Tap on "Scan QR Code"
                </Typography>
                <Typography variant="body2">
                  3. Scan the QR code above
                </Typography>
                <Typography variant="body2">
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
                helperText="Enter UPI transaction reference number after payment"
              />
            </Box>
          );
        }

        if (paymentMethod === 'bank') {
          return (
            <Box>
              <Typography variant="h6" gutterBottom>
                Bank Transfer Details
              </Typography>

              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#F0F7FF' }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Recipient Bank Details:
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Account Holder:</strong> {bankDetails.accountHolderName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Account Number:</strong> {bankDetails.accountNumber}
                  </Typography>
                  <Typography variant="body2">
                    <strong>IFSC Code:</strong> {bankDetails.ifscCode}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Bank:</strong> {bankDetails.bankName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Branch:</strong> {bankDetails.branch}
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                    <strong>Amount:</strong> ₹{permission?.paymentAmount || 500}
                  </Typography>
                </Box>
              </Paper>

              <Typography variant="body2" color="text.secondary" paragraph>
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
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Account Holder Name"
                    value={paymentDetails.accountHolderName}
                    onChange={(e) => handlePaymentDetailsChange('accountHolderName', e.target.value)}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="IFSC Code"
                    value={paymentDetails.ifscCode}
                    onChange={(e) => handlePaymentDetailsChange('ifscCode', e.target.value)}
                    margin="normal"
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
            <CheckCircleIcon sx={{ fontSize: 64, color: '#4CAF50', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Payment Successful!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Your payment of ₹{permission?.paymentAmount || 500} has been processed successfully.
            </Typography>
            {paymentDetails.transactionId && (
              <Typography variant="body2">
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
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ backgroundColor: '#4A69E0', color: 'white' }}>
        <Typography variant="h6" fontWeight="bold">
          Payment - Capacity Increase
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent(activeStep)}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        {activeStep > 0 && activeStep < 2 && (
          <Button onClick={handleBack} disabled={processing}>
            Back
          </Button>
        )}
        
        <Box sx={{ flex: 1 }} />
        
        {activeStep === 0 && (
          <Button 
            variant="contained" 
            onClick={handleNext}
            sx={{ backgroundColor: '#4A69E0' }}
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
          >
            {processing ? 'Processing...' : 'Confirm Payment'}
          </Button>
        )}
        
        {activeStep === 2 && (
          <Button 
            variant="contained" 
            onClick={handleClose}
            sx={{ backgroundColor: '#4CAF50' }}
          >
            Done
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;