import React, { useState, useEffect } from "react";
import {
  AppBar, Toolbar, Typography, Box, Avatar, TextField,
  InputAdornment, Button, Stack, Paper, Dialog, Snackbar,
  Alert, CircularProgress, Modal,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ShareIcon from "@mui/icons-material/Share";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";


const timeAgo = (dateString) => {
  if (!dateString) return ""; 
  const now = new Date();
  const postDate = new Date(dateString);
  const seconds = Math.floor((now - postDate) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 }
  ];

  for (let interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return count === 1
        ? `${count} ${interval.label} ago`
        : `${count} ${interval.label}s ago`;
    }
  }
  return "Just now";
};

export default function SocialDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  
  const [studentProfileModal, setStudentProfileModal] = useState({
    open: false,
    studentName: "",
  });
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("adminUser") || localStorage.getItem("studentUser") || "{}");
    setCurrentUser(user);
    
    fetchPosts(1);
  }, []);

  useEffect(() => {
    if (location.state?.post) {
      setPosts(prev => [
        {
          ...location.state.post,
          likes: location.state.post.likes || 0,
          likedBy: location.state.post.likedBy || [],
        },
        ...prev,
      ]);
    }
  }, [location.state, currentUser]);

  const fetchPosts = async (pageNum) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/posts?page=${pageNum}&limit=15`);
      const data = await res.json();
      
      if (data && data.posts && Array.isArray(data.posts)) {
        if (data.posts.length > 0) {
          const postsWithUIFields = data.posts.map(post => ({
            ...post,
            likes: post.likes || 0,
            likedBy: post.likedBy || [],
          }));
          
          if (pageNum === 1) {
            setPosts(postsWithUIFields);
          } else {
            setPosts(prev => [...prev, ...postsWithUIFields]);
          }
          
          setHasMore(data.pagination && data.pagination.hasNext);
        } else {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
      
      setInitialLoad(false);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setHasMore(false);
      setInitialLoad(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  const handleShare = async (index) => {
    const post = posts[index];
    const shareText = `${post.topic} - ${post.content}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: post.topic, text: shareText, url: window.location.href });
        
        try {
          await axios.post(`http://localhost:5000/api/posts/${post._id}/share`);
          setPosts(prev =>
            prev.map((p, i) => i === index ? { ...p, shares: p.shares + 1 } : p)
          );
        } catch (error) {
          console.error("Error updating share count:", error);
        }
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      setSnackbar({
        open: true,
        message: "Post link copied to clipboard!",
        severity: "success"
      });
    }
  };
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        try {
          const studentRes = await axios.get("http://localhost:5000/api/swap/student", {
            timeout: 10000 
          });
          if (studentRes.data && Array.isArray(studentRes.data)) {
            setStudents(studentRes.data);
          }
        } catch (err) {
          console.warn("Could not load student directory:", err.message);
        }
        
        try {
          const staffRes = await axios.get("http://localhost:5000/api/admin/staff", {
            timeout: 10000 
          });
          if (staffRes.data && Array.isArray(staffRes.data)) {
            setStaff(staffRes.data);
          }
        } catch (err) {
          console.warn("Could not load staff directory:", err.message);
        }
      } catch (err) {
        console.error("Error in fetchUsers:", err);
      }
    };
    
    fetchUsers();
  }, []);

 const handleUserProfileClick = async (post) => {
  if (post.userType === "Student") {
    setStudentProfileModal({
      open: true,
      studentName: post.name,
    });
    return;
  } 
  
  else if (post.userType === "Staff") {
    setProfileLoading(true);
    try {
      const currentUser = JSON.parse(localStorage.getItem("adminUser") || "{}");
      
      if (post.staffId) {
        navigate(`/admin/view/${post.staffId}`);
        return;
      }
      
      if (currentUser && currentUser.fullName === post.name) {
        navigate(`/admin/view/${currentUser._id}`);
        return;
      }
      
      const matchedStaff = staff.find((s) => 
        s.fullName && s.fullName.toLowerCase() === post.name.toLowerCase()
      );
      
      if (matchedStaff && matchedStaff._id) {
        setPosts(prev => 
          prev.map(p => 
            p._id === post._id ? {...p, staffId: matchedStaff._id} : p
          )
        );
        navigate(`/admin/view/${matchedStaff._id}`);
      } else {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/admin/get-staff-by-name/${encodeURIComponent(post.name)}`,
            { timeout: 8000 }
          );
          
          if (response.data && response.data._id) {
            // Update the post with the staffId for future clicks
            setPosts(prev => 
              prev.map(p => 
                p._id === post._id ? {...p, staffId: response.data._id} : p
              )
            );
            navigate(`/admin/view/${response.data._id}`);
          } else {
            setSnackbar({
              open: true,
              message: `Staff "${post.name}" not found`,
              severity: "info",
            });
          }
        } catch (error) {
          console.error("Error fetching staff by name:", error);
          setSnackbar({
            open: true,
            message: `Could not find staff "${post.name}"`,
            severity: "info",
          });
        }
      }
    } catch (err) {
      console.error("Error in handleUserProfileClick:", err);
      setSnackbar({
        open: true,
        message: "Unable to load profile",
        severity: "error",
      });
    } finally {
      setProfileLoading(false);
    }
  }
};

  const filteredPosts = posts.filter(post => {
    const q = searchQuery.toLowerCase();
    return (
      post.userType.toLowerCase().includes(q) ||
      post.topic.toLowerCase().includes(q) ||
      post.content.toLowerCase().includes(q)
    );
  });

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #1d0d46, #2c0d56, #110d2c)",
        minHeight: "100vh",
        color: "#fff",
        overflowY: "auto",
        position: "relative"
      }}
    >
      {profileLoading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999
          }}
        >
          <CircularProgress sx={{ color: "#a885ff" }} />
          <Typography variant="h6" sx={{ ml: 2, color: "#fff" }}>
            Loading profile...
          </Typography>
        </Box>
      )}

      <AppBar position="sticky" elevation={0} sx={{
        background: "rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
        mb: 3
      }}>
        <Toolbar sx={{ 
          justifyContent: "space-between",
          px: { xs: 2, sm: 3 }
        }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
 
  <img
    src="/images/swap.jpg"
    alt="Slothit Logo"
    style={{
      height: "40px",
      borderRadius: "4px",
      width: "120px"
    }}
  />
</Box>

          <TextField
            variant="outlined"
            placeholder="Search slothit"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              width: { xs: 200, sm: 300, md: 400 },
              background: "rgba(255,255,255,0.15)",
              borderRadius: 2,
              "& .MuiInputBase-input": { color: "#fff", py: 1 },
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#fff" }} />
                </InputAdornment>
              ),
            }}
          />
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                textTransform: "none",
                background: "linear-gradient(45deg, #ff007f, #ff5f6d)",
                "&:hover": { background: "linear-gradient(45deg, #e60073, #ff4d5c)" },
                borderRadius: "20px",
                px: 2,
                display: { xs: 'none', sm: 'flex' }
              }}
              onClick={() => navigate("/create-post")}
            >
              Create
            </Button>
            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                background: "linear-gradient(45deg, #ff007f, #ff5f6d)",
                "&:hover": { background: "linear-gradient(45deg, #e60073, #ff4d5c)" },
                borderRadius: "50%",
                minWidth: 'auto',
                width: 40,
                height: 40,
                display: { xs: 'flex', sm: 'none' }
              }}
              onClick={() => navigate("/create-post")}
            >
              <AddIcon />
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
        {initialLoad ? (
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <CircularProgress sx={{ color: '#a885ff' }} />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Loading posts...
            </Typography>
          </Box>
        ) : (
          <>
            {filteredPosts.map((post, index) => (
              <Paper key={post._id || index} sx={{
                mb: 2,
                borderRadius: 2,
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(8px)",
                color: "#fff",
                width: '100%',
                mx: 'auto'
              }} elevation={0}>
                
                <Box sx={{ p: 2 }}>
                  <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <Avatar sx={{ bgcolor: "#ff007f", width: 36, height: 36 }} />
                    <Box 
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                      onClick={() => handleUserProfileClick(post)}
                    >
                      <Typography variant="subtitle2" sx={{ fontSize: '0.9rem' }}>
                        {post.userType === "Student"
                          ? `Student: ${post.name}`
                          : `Staff: ${post.name}`}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {timeAgo(post.createdAt)}
                      </Typography>
                    </Box>
                  </Stack>

                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>{post.topic}</Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>{post.content}</Typography>

                  {post.imageUrl && (
                    <Box sx={{ mb: 2 }}>
                      <img
                        src={`http://localhost:5000${post.imageUrl}`}
                        alt="Post"
                        style={{
                          width: "100%",
                          maxHeight: "400px",
                          borderRadius: "8px",
                          objectFit: "cover",
                          cursor: "pointer"
                        }}
                        onClick={() => setSelectedImage(`http://localhost:5000${post.imageUrl}`)}
                      />
                    </Box>
                  )}

                  {post.fileUrl && (
                    <Box sx={{ mb: 2 }}>
                      <a 
                        href={`http://localhost:5000${post.fileUrl}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{ 
                          color: "#00f2fe",
                          textDecoration: 'none',
                          display: 'inline-block',
                          padding: '8px 16px',
                          backgroundColor: 'rgba(0, 242, 254, 0.1)',
                          borderRadius: '4px'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = 'rgba(0, 242, 254, 0.2)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = 'rgba(0, 242, 254, 0.1)';
                        }}
                      >
                        📎 View Attachment
                      </a>
                    </Box>
                  )}

                  <Stack direction="row" spacing={3} alignItems="center">
                    <Stack 
                      direction="row" 
                      spacing={0.5} 
                      alignItems="center" 
                      sx={{ cursor: "pointer" }} 
                      onClick={() => handleShare(index)}
                    >
                      <ShareIcon fontSize="small" sx={{ color: "#00ff88" }} />
                      <Typography variant="body2" sx={{ color: "#fff" }}>Share</Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Paper>
            ))}
            
            {hasMore && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 3 }}>
                <Button
                  variant="contained"
                  onClick={handleLoadMore}
                  disabled={loading}
                  sx={{
                    background: "linear-gradient(45deg, #ff007f, #ff5f6d)",
                    "&:hover": { background: "linear-gradient(45deg, #e60073, #ff4d5c)" },
                    borderRadius: "20px",
                    textTransform: "none",
                    minWidth: "120px",
                    px: 3,
                    py: 1
                  }}
                >
                  {loading ? "Loading..." : "Load More"}
                  </Button>
              </Box>
            )}
            
            {!hasMore && posts.length > 0 && (
              <Box sx={{ textAlign: 'center', mt: 3, mb: 3, opacity: 0.7 }}>
                <Typography variant="body2">
                  No more posts to load
                </Typography>
              </Box>
            )}
            
            {posts.length === 0 && !loading && (
              <Box sx={{ textAlign: 'center', mt: 3, mb: 3, opacity: 0.7 }}>
                <Typography variant="body2">
                  No posts available yet. Be the first to create one!
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>

      <Dialog 
        open={!!selectedImage} 
        onClose={() => setSelectedImage(null)} 
        maxWidth="lg"
        fullWidth
      >
        <img
          src={selectedImage}
          alt="Full View"
          style={{
            width: "100%",
            height: "auto",
            objectFit: "contain"
          }}
        />
      </Dialog>
      
      <Modal
        open={studentProfileModal.open}
        onClose={() => setStudentProfileModal({ open: false, studentName: "" })}
        aria-labelledby="student-profile-modal"
        aria-describedby="student-profile-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          background: "linear-gradient(135deg, #1d0d46, #2c0d56)"
        }}>
          <Typography id="student-profile-modal" variant="h6" component="h2" sx={{ color: "#fff", mb: 2 }}>
            Student Profile Access
          </Typography>
          <Typography id="student-profile-description" sx={{ color: "#fff", mb: 3 }}>
            For student safety and privacy, you cannot view other students' profiles. 
            You can only view staff profiles or your own student profile.
          </Typography>
          <Typography sx={{ color: "#fff", mb: 3, fontStyle: 'italic' }}>
            If you need to contact {studentProfileModal.studentName}, please ask a staff member for assistance.
          </Typography>
          <Button 
            onClick={() => setStudentProfileModal({ open: false, studentName: "" })}
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #ff007f, #ff5f6d)",
              "&:hover": { background: "linear-gradient(45deg, #e60073, #ff4d5c)" },
            }}
          >
            Understood
          </Button>
        </Box>
      </Modal>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}