const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Post = require("../models/Post");

const router = express.Router();

const uploadsDir = "./uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, 
  }
});

router.post("/", upload.fields([
  { name: "file", maxCount: 1 },
  { name: "image", maxCount: 1 }
]), async (req, res) => {
  try {
    const { userType, name, topic, content, staffId, studentId } = req.body;

    console.log("Received post data:", { userType, name, topic, content, staffId, studentId });

    if (!topic || !content) {
      return res.status(400).json({ message: 'Topic and content are required' });
    }

    const fileUrl = req.files?.file ? `/uploads/${req.files.file[0].filename}` : null;
    const imageUrl = req.files?.image ? `/uploads/${req.files.image[0].filename}` : null;

    const postData = {
      userType,
      name,
      topic,
      content,
      fileUrl,
      imageUrl
    };

    if (staffId && staffId !== "undefined" && userType === "Staff") {
      postData.staffId = staffId;
    }
    
    if (studentId && studentId !== "undefined" && userType === "Student") {
      postData.studentId = studentId;
    }

    const post = new Post(postData);
    await post.save();
    
    console.log("Post saved successfully:", post);
    
    res.status(201).json({ 
      message: "Post created successfully", 
      post 
    });

  } catch (err) {
    console.error("Post creation error:", err);
    res.status(500).json({ 
      message: "Server error while creating post",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});
router.post("/", async (req, res) => {
  try {
    const newPost = new Post({
      staffId: req.body.staffId,
      studentId: req.body.studentId,
      userType: req.body.userType,
      name: req.body.name,
      topic: req.body.topic,
      content: req.body.content,
      fileUrl: req.body.fileUrl,
      imageUrl: req.body.imageUrl,
      videoUrl: req.body.videoUrl,
      linkUrl: req.body.linkUrl,
      documentUrl: req.body.documentUrl
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const { staffName, author, userType, populate, page = 1, limit = 15 } = req.query;
    let query = {};
    
    if (staffName) {
      query = { name: staffName, userType: "Staff" };
    } else if (author && userType) {
      query = { name: author, userType: userType };
    } else if (author) {
      query = { name: author };
    } else if (userType) {
      query = { userType: userType };
    }
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    let posts;
    
    if (populate === "true") {
      posts = await Post.find(query)
        .populate('staffId', 'fullName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);
    } else {
      posts = await Post.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);
    }
    
    const total = await Post.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);
    
    res.json({
      posts,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalPosts: total,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    });
  } catch (err) {
    console.error("Fetching posts error:", err);
    res.status(500).json({ 
      message: "Server error while fetching posts",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

router.get("/staff/:staffId", async (req, res) => {
  try {
    const { staffId } = req.params;
    const { page = 1, limit = 15 } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const posts = await Post.find({ staffId: staffId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    const total = await Post.countDocuments({ staffId: staffId });
    const totalPages = Math.ceil(total / limitNum);
    
    res.json({
      posts,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalPosts: total,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    });
  } catch (err) {
    console.error("Fetching posts by staff ID error:", err);
    res.status(500).json({ 
      message: "Server error while fetching posts",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

router.get("/staff-name/:staffName", async (req, res) => {
  try {
    const { staffName } = req.params;
    const { page = 1, limit = 15 } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const posts = await Post.find({ 
      name: staffName, 
      userType: "Staff" 
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);
    
    const total = await Post.countDocuments({ name: staffName, userType: "Staff" });
    const totalPages = Math.ceil(total / limitNum);
    
    res.json({
      posts,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalPosts: total,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    });
  } catch (err) {
    console.error("Fetching posts by staff name error:", err);
    res.status(500).json({ 
      message: "Server error while fetching posts",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ 
      message: "Server error while deleting post",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

router.get("/count/:author", async (req, res) => {
  try {
    const { author } = req.params;
    const count = await Post.countDocuments({ name: author });
    
    res.json({ count });
  } catch (err) {
    console.error("Error counting posts:", err);
    res.status(500).json({ 
      message: "Server error while counting posts",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

router.get("/count/staff/:staffId", async (req, res) => {
  try {
    const { staffId } = req.params;
    const count = await Post.countDocuments({ staffId: staffId });
    
    res.json({ count });
  } catch (err) {
    console.error("Error counting posts by staff ID:", err);
    res.status(500).json({ 
      message: "Server error while counting posts",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;