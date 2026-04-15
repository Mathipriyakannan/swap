import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  CircularProgress,
  Snackbar,
  Chip
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function StudentPostPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const studentUser = JSON.parse(localStorage.getItem("studentUser") || "{}");
  const studentName = studentUser?.name || "Student";

  const [formData, setFormData] = useState({
    userType: "Student",
    topic: "",
    content: "",
    file: null,
    image: null,
    name: studentName,
  });

  const [filePreview, setFilePreview] = useState({
    file: null,
    image: null
  });

  // Supported image formats
  const supportedImageFormats = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (files && files[0]) {
      const file = files[0];
      
      // File size validation
      if (file.size > maxFileSize) {
        setError("File size should be less than 5MB");
        return;
      }

      // Image format validation
      if (name === "image" && !supportedImageFormats.includes(file.type)) {
        setError("Please upload a valid image file (JPEG, PNG, GIF, WebP)");
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
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });

      await axios.post("http://localhost:5000/api/posts", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      setTimeout(() => navigate("/social-feed"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post. Try again.");
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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(160deg, #8E2DE2 0%, #4A00E0 100%)",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          sx={{
            p: 4,
            borderRadius: "25px",
            background: "rgba(255, 255, 255, 0.95)",
            textAlign: "center",
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ color: "#6A1B9A", mb: 3 }}
          >
            ✨ Create Post
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="Your Name"
            value={formData.name}
            fullWidth
            sx={{ mb: 2 }}
            disabled
          />

          <TextField
            label="Topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 3 }}
            placeholder="Enter your post topic..."
            error={formData.topic && formData.topic.length < 3}
            helperText={
              formData.topic && formData.topic.length < 3
                ? "Topic should be at least 3 characters"
                : ""
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
            sx={{ mb: 3 }}
            placeholder="Write your post..."
            error={formData.content && formData.content.length < 10}
            helperText={
              formData.content && formData.content.length < 10
                ? "Content should be at least 10 characters"
                : ""
            }
          />

          {/* File Upload Section */}
          <Box sx={{ mb: 3 }}>
            <Button 
              variant="contained" 
              component="label" 
              fullWidth
              sx={{ mb: 1 }}
            >
              📄 Upload File / PDF
              <input 
                type="file" 
                name="file" 
                hidden 
                onChange={handleChange}
                accept=".pdf,.doc,.docx,.txt"
              />
            </Button>
            {formData.file && (
              <Chip
                label={formData.file.name}
                onDelete={() => removeFile("file")}
                variant="outlined"
                sx={{ mt: 1 }}
              />
            )}
            <Typography variant="caption" color="text.secondary">
              Supported: PDF, DOC, DOCX, TXT (Max 5MB)
            </Typography>
          </Box>

          {/* Image Upload Section */}
          <Box sx={{ mb: 3 }}>
            <Button 
              variant="outlined" 
              component="label" 
              fullWidth
              sx={{ mb: 1 }}
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
              <Box sx={{ mt: 2 }}>
                <Chip
                  label={formData.image.name}
                  onDelete={() => removeFile("image")}
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
                {filePreview.image && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                      Image Preview:
                    </Typography>
                    <img 
                      src={filePreview.image} 
                      alt="Preview" 
                      style={{ 
                        maxWidth: "100%", 
                        maxHeight: "200px", 
                        borderRadius: "8px",
                        border: "1px solid #ddd"
                      }} 
                    />
                  </Box>
                )}
              </Box>
            )}
            <Typography variant="caption" color="text.secondary">
              Supported: JPG, PNG, GIF, WebP (Max 5MB)
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              borderRadius: "30px",
              py: 1.5,
              fontSize: "1rem",
              background: "linear-gradient(45deg,#7b1fa2,#512da8)",
              "&:hover": {
                background: "linear-gradient(45deg,#6a1b9a,#4527a0)",
              }
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              "Create Post"
            )}
          </Button>
        </Paper>
      </Container>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="✅ Post created successfully!"
      />
    </Box>
  );
}

