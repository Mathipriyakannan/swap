import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
  Paper,
  Alert,
  CircularProgress,
  Snackbar,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [filePreview, setFilePreview] = useState({
    image: null
  });

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  const isStaff = Boolean(loggedInUser?.fullName);
  const isStudent = Boolean(loggedInUser?.name);

  // File size limits
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

  // Supported formats
  const SUPPORTED_IMAGE_FORMATS = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ];

  const SUPPORTED_FILE_FORMATS = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];

  const [formData, setFormData] = useState({
    userType: isStaff ? "Staff" : "Student",
    topic: "",
    content: "",
    file: null,
    image: null,
    name: isStaff ? loggedInUser.fullName : loggedInUser.name || "",
  });

  useEffect(() => {
    if (formData.userType === "Staff" && isStaff) {
      setFormData((prev) => ({
        ...prev,
        name: loggedInUser.fullName,
      }));
    } else if (formData.userType === "Student" && isStudent) {
      setFormData((prev) => ({
        ...prev,
        name: loggedInUser.name,
      }));
    }
  }, [formData.userType, isStaff, isStudent, loggedInUser]);

  const validateFile = (file, type) => {
    if (type === 'image') {
      if (!SUPPORTED_IMAGE_FORMATS.includes(file.type)) {
        return `Unsupported image format. Please use: JPEG, PNG, GIF, WebP, SVG`;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        return `Image size must be less than 2MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`;
      }
    } else if (type === 'file') {
      if (!SUPPORTED_FILE_FORMATS.includes(file.type)) {
        return `Unsupported file format. Please use: PDF, DOC, DOCX, TXT, PPT, PPTX`;
      }
      if (file.size > MAX_FILE_SIZE) {
        return `File size must be less than 5MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`;
      }
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (files && files[0]) {
      const file = files[0];
      let error = null;

      if (name === 'image') {
        error = validateFile(file, 'image');
      } else if (name === 'file') {
        error = validateFile(file, 'file');
      }

      if (error) {
        setError(error);
        return;
      }

      setFormData(prev => ({ ...prev, [name]: file }));
      
      // Create preview for image
      if (name === "image") {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(prev => ({ ...prev, image: e.target.result }));
        };
        reader.readAsDataURL(file);
      }
      
      setError(""); // Clear any previous errors
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    // Validation
    if (!formData.topic.trim()) {
      setError("Topic is required");
      setLoading(false);
      return;
    }
    if (!formData.content.trim()) {
      setError("Content is required");
      setLoading(false);
      return;
    }
    if (formData.topic.trim().length < 3) {
      setError("Topic should be at least 3 characters long");
      setLoading(false);
      return;
    }
    if (formData.content.trim().length < 10) {
      setError("Content should be at least 10 characters long");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("userType", formData.userType);
      formDataToSend.append("topic", formData.topic);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("name", formData.name);

      if (formData.userType === "Staff" && loggedInUser.id) {
        formDataToSend.append("staffId", loggedInUser.id);
      }

      if (formData.file) {
        formDataToSend.append("file", formData.file);
      }
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const res = await axios.post("http://localhost:5000/api/posts", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 10000,
      });

      console.log("✅ Post created:", res.data);

      setSuccessMessage(`${formData.userType}: ${formData.name}`);
      setSuccess(true);

      setTimeout(() => navigate("/social-feed"), 2000);
    } catch (err) {
      console.error("❌ Error creating post:", err);

      if (err.code === "ECONNABORTED") {
        setError("Request timeout. Please try again.");
      } else if (err.response) {
        if (err.response.status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(err.response.data?.message || "Failed to create post.");
        }
      } else if (err.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFile = (fieldName) => {
    setFormData(prev => ({ ...prev, [fieldName]: null }));
    if (fieldName === "image") {
      setFilePreview(prev => ({ ...prev, image: null }));
    }
  };

  const handleCloseSnackbar = () => {
    setError("");
    setSuccess(false);
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    const icons = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      txt: '📃',
      ppt: '📊',
      pptx: '📊',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️',
      gif: '🖼️',
      webp: '🖼️',
      svg: '🖼️'
    };
    return icons[ext] || '📎';
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          sx={{
            p: 4,
            borderRadius: "25px",
            background: "white",
            boxShadow: "0px 12px 40px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            textAlign="center"
            mb={3}
            sx={{
              background: "linear-gradient(45deg, #667eea, #764ba2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Create a Post
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: "12px" }}>
              {error}
            </Alert>
          )}

          <TextField
            select
            label="User Type"
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
            disabled={loading}
          >
            <MenuItem value="Student">Student</MenuItem>
            <MenuItem value="Staff">Staff</MenuItem>
          </TextField>

          <TextField
            label="Name"
            name="name"
            value={formData.name}
            fullWidth
            sx={{ mb: 2 }}
            disabled={true}
            helperText="Your name is automatically set based on your login"
          />

          <TextField
            label="Topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
            disabled={loading}
            required
            error={formData.topic && formData.topic.length < 3}
            helperText={
              formData.topic && formData.topic.length < 3
                ? "Topic should be at least 3 characters"
                : "Enter a topic for your post"
            }
          />

          <TextField
            label="Content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            sx={{ mb: 2 }}
            disabled={loading}
            required
            error={formData.content && formData.content.length < 10}
            helperText={
              formData.content && formData.content.length < 10
                ? "Content should be at least 10 characters"
                : "Write your post content here"
            }
          />

          {/* File Upload Section */}
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              component="label"
              fullWidth
              disabled={loading}
              sx={{
                borderRadius: "12px",
                background: "linear-gradient(45deg, #667eea, #764ba2)",
              }}
            >
              📁 Upload File / PDF
              <input 
                type="file" 
                name="file" 
                hidden 
                onChange={handleChange}
                accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
              />
            </Button>
            {formData.file && (
              <Card
                variant="outlined"
                sx={{
                  mt: 1,
                  borderRadius: "12px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2">
                      {getFileIcon(formData.file.name)} {formData.file.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ({(formData.file.size / (1024 * 1024)).toFixed(2)} MB)
                    </Typography>
                  </Box>
                  <Chip 
                    label="Remove" 
                    size="small" 
                    onDelete={() => removeFile("file")} 
                    color="error"
                  />
                </CardContent>
              </Card>
            )}
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
              Supported: PDF, DOC, DOCX, TXT, PPT, PPTX (Max 5MB)
            </Typography>
          </Box>

          {/* Image Upload Section */}
          <Box sx={{ mb: 3 }}>
            <Button
              variant="contained"
              component="label"
              fullWidth
              disabled={loading}
              sx={{
                borderRadius: "12px",
                background: "linear-gradient(45deg, #43cea2, #185a9d)",
              }}
            >
              🖼️ Upload Image
              <input 
                type="file" 
                name="image" 
                hidden 
                onChange={handleChange} 
                accept="image/*" 
              />
            </Button>
            
            {formData.image && (
              <Card
                variant="outlined"
                sx={{
                  mt: 1,
                  borderRadius: "12px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <CardContent sx={{ py: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body2">
                        {getFileIcon(formData.image.name)} {formData.image.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ({(formData.image.size / (1024 * 1024)).toFixed(2)} MB)
                      </Typography>
                    </Box>
                    <Chip 
                      label="Remove" 
                      size="small" 
                      onDelete={() => removeFile("image")} 
                      color="error"
                    />
                  </Box>
                  
                  {filePreview.image && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" display="block" sx={{ mb: 1, fontWeight: 'bold' }}>
                        Image Preview:
                      </Typography>
                      <img 
                        src={filePreview.image} 
                        alt="Preview" 
                        style={{ 
                          maxWidth: "100%", 
                          maxHeight: "200px", 
                          borderRadius: "8px",
                          border: "2px solid #e0e0e0",
                          display: "block",
                          margin: "0 auto"
                        }} 
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            )}
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
              Supported: JPEG, PNG, GIF, WebP, SVG (Max 2MB)
            </Typography>
          </Box>

          <Box textAlign="center">
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || !formData.topic.trim() || !formData.content.trim() || formData.topic.trim().length < 3 || formData.content.trim().length < 10}
              sx={{
                borderRadius: "20px",
                px: 4,
                py: 1.5,
                fontWeight: "bold",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                boxShadow: "0px 6px 20px rgba(0,0,0,0.2)",
                '&:disabled': {
                  background: '#cccccc',
                  color: '#666666'
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Create Post"}
            </Button>
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={`Post created successfully! (${successMessage})`}
      />
    </Box>
  );
}