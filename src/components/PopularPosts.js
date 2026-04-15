import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Paper, Stack, Avatar, Button } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function PopularPosts() {
  const location = useLocation();
  const navigate = useNavigate();
  const posts = location.state?.posts || [];

  const sortedPosts = [...posts].sort(
    (a, b) => b.likes + b.shares - (a.likes + a.shares)
  );

  return (
    <Box
      sx={{
        p: 3,
        minHeight: "100vh",
        background: "linear-gradient(180deg, #c3a0e8, #b490e8, #a97fe8)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{
          mb: 3,
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          color: "#fff",
          borderRadius: "12px",
          px: 3,
          textTransform: "none",
          "&:hover": {
            background: "rgba(255, 255, 255, 0.2)",
          },
        }}
      >
        Back
      </Button>

      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          mb: 4,
          color: "#fff",
          textShadow: "0px 0px 12px rgba(255, 255, 255, 0.8)",
        }}
      >
        🔥 Popular Posts
      </Typography>

      {sortedPosts.map((post, i) => (
        <Paper
          key={i}
          sx={{
            width: "100%", 
            p: 2,
            mb: 3,
            borderRadius: "20px",
            background: "linear-gradient(145deg, #5a189a, #9d4edd)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
            color: "#fff",
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
            <Avatar
              sx={{
                width: 30,
                height: 30,
                bgcolor: "#ffcc00",
                color: "#000",
                fontWeight: "bold",
              }}
            />
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {post.userType} •{" "}
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </Typography>
          </Stack>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ color: "#fff" }}
          >
            {post.topic}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>
            {post.content}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 1,
              opacity: 0.85,
              fontWeight: "bold",
            }}
          >
            👍 {post.likes} • 🔄 {post.shares} • 💬 {post.comments.length}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}
