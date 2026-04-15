const express = require('express');
const router = express.Router();
const Permission = require('../models/Permission');
const Follow = require('../models/Follow');

router.post('/send-request/:adminId', async (req, res) => {
  try {
    const { adminId } = req.params;
    const {
      staffName,
      staffId,
      message,
      adminName,
      adminDepartment,
      followersCount = 0
    } = req.body;

    console.log('🔔 Received permission request:', {
      adminId, staffName, staffId, message, adminName, adminDepartment
    });

    if (!staffName || !staffId || !message || !adminName || !adminDepartment) {
      return res.status(400).json({ 
        error: 'Missing required fields: staffName, staffId, message, adminName, adminDepartment' 
      });
    }

    // ✅ Set paymentApprovalStatus to 'Processing' to show in pending button
    const permissionRequest = new Permission({
      staffId: staffId,
      staffName: staffName,
      adminId: adminId,
      adminName: adminName,
      adminDepartment: adminDepartment,
      message: message,
      followersCount: followersCount,
      status: 'Pending', 
      paymentApprovalStatus: 'Processing', // ✅ This makes it show in pending button
      requestType: 'CapacityIncrease',
      batchSize: 50,
      paymentStatus: 'Pending',
      paymentPhone: '94860 42369',
      paymentAmount: 500,
      isBatchComplete: false,
      approvedCount: 0
    });

    await permissionRequest.save();

    console.log('✅ Capacity request created:', permissionRequest._id);

    res.status(201).json({
      message: 'Capacity increase request sent successfully! Waiting for admin approval.',
      request: permissionRequest
    });

  } catch (error) {
    console.error('❌ Error sending permission request:', error);
    res.status(500).json({ error: 'Failed to send permission request: ' + error.message });
  }
});
/*router.post('/send-request/:adminId', async (req, res) => {
  try {
    const { adminId } = req.params;
    const {
      staffName,
      staffId,
      message,
      adminName,
      adminDepartment,
      followersCount = 0
    } = req.body;

    console.log('🔔 Received permission request:', {
      adminId, staffName, staffId, message, adminName, adminDepartment
    });

    if (!staffName || !staffId || !message || !adminName || !adminDepartment) {
      return res.status(400).json({ 
        error: 'Missing required fields: staffName, staffId, message, adminName, adminDepartment' 
      });
    }

    const permissionRequest = new Permission({
      staffId: staffId,
      staffName: staffName,
      adminId: adminId,
      adminName: adminName,
      adminDepartment: adminDepartment,
      message: message,
      followersCount: followersCount,
      status: 'Approved', 
      requestType: 'CapacityIncrease',
      batchSize: 50,
      paymentStatus: 'Pending',
      paymentPhone: '94860 42369',
      paymentAmount: 500,
      isBatchComplete: false,
      approvedCount: 0
    });

    await permissionRequest.save();

    console.log('✅ Permission request approved for payment processing:', permissionRequest._id);

    res.status(201).json({
      message: 'Permission approved for capacity increase! Proceed with payment.',
      request: permissionRequest
    });

  } catch (error) {
    console.error('❌ Error sending permission request:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error: ' + error.message });
    }
    if (error.name === 'MongoError') {
      return res.status(500).json({ error: 'Database error: ' + error.message });
    }
    
    res.status(500).json({ error: 'Failed to send permission request: ' + error.message });
  }
});*/
router.get('/requests', async (req, res) => {
  try {
    const requests = await Permission.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch permission requests' });
  }
});
 


// ✅ Update request status with batch processing (case-insensitive)
router.put('/requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let { status } = req.body;

    // ✅ Convert to proper case
    if (status) {
      status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }

    console.log('Updating request:', id, 'to status:', status);

    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be: Pending, Approved, or Rejected' });
    }

    const permission = await Permission.findById(id);
    if (!permission) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // ✅ If approving a capacity increase request
    if (status === 'Approved' && permission.requestType === 'CapacityIncrease') {
      // Check if there's already an active batch for this staff
      const activeBatch = await Permission.findOne({
        staffId: permission.staffId,
        status: 'Approved',
        isBatchComplete: false,
        requestType: 'CapacityIncrease',
        _id: { $ne: id } // Exclude current request
      });

      if (activeBatch) {
        return res.status(400).json({ 
          error: 'Staff already has an active batch approval. Complete current batch first.' 
        });
      }

      // Approve the permission and make batch active
      permission.status = 'Approved';
      permission.isBatchComplete = false;
      permission.approvedCount = 0;
      await permission.save();

      return res.json({ 
        message: `Capacity increase approved! Staff can now accept ${permission.batchSize} more students.`,
        request: permission 
      });
    }

    // For other request types or rejections
    const updated = await Permission.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true, runValidators: true }
    );

    res.json({ 
      message: `Request ${status.toLowerCase()}`,
      request: updated 
    });

  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ error: 'Failed to update request status: ' + error.message });
  }
});
// In your backend permissions.js - Updated payment message
router.post('/requests/:id/payment-message', async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentPhone, paymentAmount } = req.body;

    const permission = await Permission.findById(id);
    if (!permission) {
      return res.status(404).json({ error: 'Permission request not found' });
    }

    // ✅ UPDATED: More detailed payment message
    const paymentMessage = `💰 Payment Required for Capacity Increase\n\nDear ${permission.staffName},\n\n📋 Payment Details:\n👤 Staff Name: ${permission.staffName}\n🆔 Staff ID: ${permission.staffId}\n📚 Subject/Department: ${permission.adminDepartment}\n👨‍🏫 Admin: ${permission.adminName}\n💰 Amount: ₹${paymentAmount || 500}\n📱 Send to: ${paymentPhone || '94860 42369'}\n\nAfter payment, share the screenshot on WhatsApp with all details for verification.\n\nThank you!`;

    const updatedPermission = await Permission.findByIdAndUpdate(
      id,
      {
        $set: {
          paymentMessage: paymentMessage,
          paymentPhone: paymentPhone,
          paymentAmount: paymentAmount,
          messageType: 'capacity_increase',
          paymentMessageSent: true,
          paymentMessageSentAt: new Date(),
          paymentApprovalStatus: 'Processing'
        }
      },
      { new: true }
    );

    res.json({
      message: 'Payment message sent successfully to staff!',
      request: updatedPermission
    });

  } catch (error) {
    console.error('❌ Error sending payment message:', error);
    res.status(500).json({ error: 'Failed to send payment message: ' + error.message });
  }
});

// Update payment status
router.put('/requests/:id/payment', async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, transactionId, paymentMethod, paidAt } = req.body;

    const permission = await Permission.findByIdAndUpdate(
      id,
      {
        paymentStatus,
        transactionId,
        paymentMethod,
        paidAt: paidAt || new Date(),
        paymentApprovalStatus: paymentStatus === 'Paid' ? 'Processing' : 'Pending'
      },
      { new: true }
    );

    if (!permission) {
      return res.status(404).json({ error: 'Permission request not found' });
    }

    res.json({ 
      message: 'Payment status updated successfully', 
      permission 
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Add this to your permissions routes
/*router.put('/requests/:id/payment', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      paymentStatus, 
      paymentInstructions, 
      paymentPhone, 
      paymentAmount, 
      transactionId 
    } = req.body;

    const updatedPermission = await Permission.findByIdAndUpdate(
      id,
      {
        paymentStatus,
        paymentInstructions,
        paymentPhone,
        paymentAmount,
        transactionId
      },
      { new: true }
    );

    if (!updatedPermission) {
      return res.status(404).json({ error: 'Permission request not found' });
    }

    res.json({
      message: 'Payment instructions updated successfully',
      request: updatedPermission
    });

  } catch (error) {
    console.error('Error updating payment instructions:', error);
    res.status(500).json({ error: 'Failed to update payment instructions' });
  }
});*/

router.get('/staff-capacity/:staffId', async (req, res) => {
  try {
    const { staffId } = req.params;
    
    const response = await fetch(`http://localhost:5000/api/follow/capacity/${staffId}`);
    const capacityData = await response.json();
    
    res.json(capacityData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch capacity data' });
  }
});

module.exports = router;

