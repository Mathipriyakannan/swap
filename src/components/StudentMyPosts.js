import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Alert,
  CircularProgress,
  Chip,
  IconButton
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function StudentMyPosts() {
  const [posts, setPosts] = useState([]); 
  const [postCount, setPostCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const studentUser = JSON.parse(localStorage.getItem("studentUser") || "{}");
  const studentName = studentUser?.name;
  const studentEmail = studentUser?.email;

  const fetchPosts = async () => {
    if (!studentName) {
      setError("Student information not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setRefreshing(true);
      setError("");

      const postsResponse = await axios.get(
        `http://localhost:5000/api/posts?author=${encodeURIComponent(
          studentName
        )}&userType=Student`
      );

      const data = Array.isArray(postsResponse.data)
        ? postsResponse.data
        : postsResponse.data.posts || [];

      setPosts(data);
      setPostCount(data.length);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load your posts. Please try again.");
      setPosts([]); // fallback to safe state
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`);
      fetchPosts();
    } catch (err) {
      console.error("Error deleting post:", err);
      setError("Failed to delete post. Please try again.");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [studentName]);

  const handleRefresh = () => {
    fetchPosts();
  };

  if (loading) {
    return (
      <Container
        maxWidth="md"
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading your posts...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          My Posts
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box mb={4}>
        <Chip
          label={`Total Posts: ${postCount}`}
          color="primary"
          variant="outlined"
          sx={{ fontSize: "1.1rem", padding: "12px" }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Showing posts created by: <strong>{studentName}</strong>
        </Typography>
      </Box>

      {!Array.isArray(posts) || posts.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            You haven't created any posts yet.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Start sharing your knowledge and questions with the community!
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => (window.location.href = "/student-post")}
          >
            Create Your First Post
          </Button>
        </Box>
      ) : (
        posts.map((post) => (
          <Card
            key={post._id}
            sx={{ mb: 3, borderRadius: 3, boxShadow: 3, position: "relative" }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {post.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(post.createdAt).toLocaleString()}
                  </Typography>
                  <Chip
                    label={post.userType}
                    color={post.userType === "Student" ? "secondary" : "primary"}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                  {post.postType && (
                    <Chip
                      label={post.postType}
                      variant="outlined"
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Box>
                <IconButton
                  onClick={() => handleDeletePost(post._id)}
                  color="error"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>

              <Typography variant="h6" mb={1}>
                {post.topic}
              </Typography>

              {post.content && (
                <Typography variant="body1" mb={2} sx={{ whiteSpace: "pre-line" }}>
                  {post.content}
                </Typography>
              )}

              {post.link && (
                <Box mb={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Shared Link:
                  </Typography>
                  <Button
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    size="small"
                  >
                    🔗 Open Link
                  </Button>
                </Box>
              )}

              {post.imageUrl && (
                <Box mb={2}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={`http://localhost:5000${post.imageUrl}`}
                    alt="Post image"
                    sx={{ borderRadius: 2, objectFit: "contain" }}
                  />
                </Box>
              )}

              {post.videoUrl && (
                <Box mb={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Video Attachment:
                  </Typography>
                  <Button
                    href={`http://localhost:5000${post.videoUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    sx={{ mt: 1, mr: 1 }}
                  >
                    🎥 Watch Video
                  </Button>
                </Box>
              )}

              {post.fileUrl && (
                <Box mb={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Document Attachment:
                  </Typography>
                  <Button
                    href={`http://localhost:5000${post.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    sx={{ mt: 1, mr: 1 }}
                  >
                    📄 Download File
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
  
}
