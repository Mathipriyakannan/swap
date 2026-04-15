const express = require("express");
const router = express.Router();
const Follow = require("../models/Follow");
const Permission = require("../models/Permission"); // Add this import

// ✅ Follow a staff with batch approval system
router.post("/follow/:staffId", async (req, res) => {
  try {
    const { staffId } = req.params;
    const { studentId, studentName, staffName } = req.body;

    if (!studentId || !studentName || !staffId || !staffName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if already following
    const existingFollow = await Follow.findOne({ studentId, staffId });
    if (existingFollow) {
      return res.status(400).json({ message: `You already follow ${staffName}` });
    }

    // ✅ Get current followers count
    const currentFollowersCount = await Follow.countDocuments({ staffId });
    
    // ✅ Check if staff has active batch permission
    const activePermission = await Permission.findOne({
      staffId: staffId,
      status: 'Approved',
      isBatchComplete: false,
      requestType: 'CapacityIncrease'
    }).sort({ createdAt: -1 });

    let availableSlots = 0;
    
    if (activePermission) {
      // Calculate available slots in current batch
      const usedSlots = await Follow.countDocuments({ 
        staffId: staffId,
        createdAt: { $gte: activePermission.createdAt }
      });
      availableSlots = activePermission.batchSize - usedSlots;
    }

    // ✅ Allow follow if within current capacity
    if (currentFollowersCount < 50 || availableSlots > 0) {
      const follow = new Follow({ 
        studentId, 
        studentName,  // ✅ This will store the correct student name
        staffId, 
        staffName 
      });
      await follow.save();

      // ✅ Update used slots if following under batch permission
      if (activePermission && availableSlots > 0) {
        const newUsedSlots = await Follow.countDocuments({ 
          staffId: staffId,
          createdAt: { $gte: activePermission.createdAt }
        });
        
        // Mark batch as complete if all slots are used
        if (newUsedSlots >= activePermission.batchSize) {
          await Permission.findByIdAndUpdate(activePermission._id, { 
            isBatchComplete: true,
            approvedCount: activePermission.batchSize
          });
        }
      }

      return res.status(201).json({
        message: `${studentName} followed ${staffName} successfully!`, // ✅ Correct message
        follow,
      });
    }

    // ✅ Create permission request for capacity increase
    const permissionRequest = new Permission({
      staffId: staffId,
      staffName: staffName,
      adminId: staffId,
      adminName: staffName,
      adminDepartment: "Academic",
      message: `Need capacity increase. Current followers: ${currentFollowersCount}. Requesting additional 50 student slots.`,
      followersCount: currentFollowersCount,
      studentId: studentId,
      studentName: studentName, // ✅ Store student name in permission request
      requestType: 'CapacityIncrease',
      status: 'Pending',
      batchSize: 50
    });

    await permissionRequest.save();

    return res.status(403).json({ 
      message: `${studentName}'s request to follow ${staffName} has been sent for approval.`, // ✅ Correct message
      requiresApproval: true,
      permissionRequest: permissionRequest
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Already following this staff member" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
router.post("/unfollow/:staffId", async (req, res) => {
  try {
    const { staffId } = req.params;
    const { studentId, studentName, staffName } = req.body; // ✅ Add studentName and staffName

    const result = await Follow.findOneAndDelete({ studentId, staffId });
    if (!result) return res.status(404).json({ message: "Follow not found" });

    res.json({ 
      message: `${studentName} successfully unfollowed ${staffName}` // ✅ Correct unfollow message
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// ✅ Get followers for a specific staff (by staffId)
router.get("/followers/:staffId", async (req, res) => {
  try {
    const { staffId } = req.params;
    const followers = await Follow.find({ staffId })
      .select("studentId studentName createdAt")
      .sort({ createdAt: -1 });

    res.json(followers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get all staff followed by a student
router.get("/following/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const following = await Follow.find({ studentId })
      .select("staffId staffName createdAt")
      .sort({ createdAt: -1 });

    res.json(following);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// ✅ Get current capacity info for staff
router.get("/capacity/:staffId", async (req, res) => {
  try {
    const { staffId } = req.params;
    
    const currentFollowers = await Follow.countDocuments({ staffId });
    
    const activePermission = await Permission.findOne({
      staffId: staffId,
      status: 'Approved',
      isBatchComplete: false,
      requestType: 'CapacityIncrease'
    }).sort({ createdAt: -1 });

    let availableSlots = 0;
    let totalCapacity = 50; // Base capacity

    if (activePermission) {
      const usedSlots = await Follow.countDocuments({ 
        staffId: staffId,
        createdAt: { $gte: activePermission.createdAt }
      });
      availableSlots = activePermission.batchSize - usedSlots;
      totalCapacity = 50 + activePermission.batchSize;
    }

    res.json({
      currentFollowers,
      totalCapacity,
      availableSlots: Math.max(0, availableSlots),
      hasActiveBatch: !!activePermission,
      baseCapacity: 50
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// Add this route to your follow routes (follow.js)
router.get("/followers-count/:staffId", async (req, res) => {
  try {
    const { staffId } = req.params;
    
    // Count all follows for this staff member
    const followersCount = await Follow.countDocuments({ staffId });
    
    res.json({ 
      followersCount,
      staffId 
    });
  } catch (error) {
    console.error('Error fetching followers count:', error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
});
// ✅ Add this new route to check follow status
router.get("/status/:staffId", async (req, res) => {
  try {
    const { staffId } = req.params;
    const { studentId } = req.query;

    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    const existingFollow = await Follow.findOne({ studentId, staffId });
    
    res.json({
      isFollowing: !!existingFollow,
      follow: existingFollow
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;




