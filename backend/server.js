const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const adminUserRoutes = require('./routes/adminUserRoutes');
const swapKnowledgeRoutes = require("./routes/swapKnowledgeRoutes");
const messageRoutes = require('./routes/messageRoutes');
const postRoutes = require("./routes/postRoutes");
const { sendMessage } = require('./controllers/messageController');
const followRoutes = require('./routes/followRoutes');
const permissionRoutes = require('./routes/permissionRoutes');


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/messages/send', sendMessage);
app.use('/api/messages', messageRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });
app.get("/api/swap/students", async (req, res) => {
  try {
    const students = await Student.find(); 
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching students" });
  }
});


app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ fileName: req.file.filename });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Mongo error:', err));

app.get("/api/meetings/details/:name", (req, res) => {
  const { name } = req.params;
  if (name === "muthukumar") {
    res.json({ meetingId: "12345", host: "muthukumar" });
  } else {
    res.status(404).json({ error: "Meeting not found" });
  }
});

app.get('/api/meet-link', (req, res) => {
  res.json({
    meetLink: "https://meet.google.com/abc-defg-hij"
  });
});

app.get("/api/meetings/:staffId", (req, res) => {
  const { staffId } = req.params;
  res.json({ meetLink: "https://meet.google.com/xyz" });
});

app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.url);
  next();
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});
app.use("/api/posts", postRoutes);
app.use('/api/meetings', require('./routes/meetingRoutes'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/admin', adminUserRoutes);
app.use('/api/swapKnowledge', swapKnowledgeRoutes);  
app.use('/api/swap', swapKnowledgeRoutes);
app.use('/api', require('./routes/swapKnowledgeRoutes'));
app.use('/api/follow', followRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/student', swapKnowledgeRoutes);
app.get('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const student = await User.findById(id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    const { password, ...studentData } = student.toObject();
    res.json(studentData);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
