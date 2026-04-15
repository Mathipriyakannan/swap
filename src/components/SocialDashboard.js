import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  InputBase,
  Button,
  Avatar,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": { backgroundColor: alpha(theme.palette.common.white, 0.25) },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: { marginLeft: theme.spacing(1), width: "auto" }
}));
const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: { width: "20ch" }
  }
}));

export default function SocialDashboard() {
  const stories = [
    { name: "John", img: "https://i.pravatar.cc/150?img=1" },
    { name: "Sara", img: "https://i.pravatar.cc/150?img=2" },
    { name: "Mike", img: "https://i.pravatar.cc/150?img=3" },
    { name: "Emma", img: "https://i.pravatar.cc/150?img=4" }
  ];
  const posts = [
    {
      name: "John Doe",
      img: "https://i.pravatar.cc/150?img=5",
      contentImg: "https://placekitten.com/500/300",
      caption: "Enjoying the sunny day! #sunny #happy"
    },
    {
      name: "Sara Lee",
      img: "https://i.pravatar.cc/150?img=6",
      contentImg: "https://placebear.com/500/300",
      caption: "Adventure time! #travel #fun"
    }
  ];
  const suggestions = [
    { name: "Alex", img: "https://i.pravatar.cc/150?img=7" },
    { name: "Nina", img: "https://i.pravatar.cc/150?img=8" }
  ];

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f5f5f5" }}>
      <Box sx={{ width: 80, bgcolor: "#6a1b9a", color: "#fff", p: 1 }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, mt: 2 }}>
          <IconButton color="inherit"><HomeIcon /></IconButton>
          <IconButton color="inherit"><PeopleIcon /></IconButton>
          <IconButton color="inherit"><NotificationsIcon /></IconButton>
          <IconButton color="inherit"><SettingsIcon /></IconButton>
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <AppBar position="static" sx={{ bgcolor: "#fff", color: "#000" }}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Search>
              <SearchIconWrapper><SearchIcon /></SearchIconWrapper>
              <StyledInputBase placeholder="Search…" inputProps={{ "aria-label": "search" }} />
            </Search>
            <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: "#6a1b9a" }}>
              Add New Post
            </Button>
          </Toolbar>
        </AppBar>

        <Paper sx={{ display: "flex", gap: 2, p: 2, overflowX: "auto" }}>
          {stories.map((story, i) => (
            <Box key={i} sx={{ textAlign: "center" }}>
              <Avatar src={story.img} sx={{ width: 56, height: 56, mb: 1 }} />
              <Typography variant="caption">{story.name}</Typography>
            </Box>
          ))}
        </Paper>

        <Box sx={{ p: 2, overflowY: "auto" }}>
          {posts.map((post, i) => (
            <Card key={i} sx={{ mb: 3 }}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar src={post.img} />
                <Typography variant="subtitle1" fontWeight="bold">{post.name}</Typography>
              </CardContent>
              <CardMedia component="img" height="300" image={post.contentImg} />
              <CardContent>
                <Typography variant="body2">{post.caption}</Typography>
                <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                  <IconButton><FavoriteBorderIcon /></IconButton>
                  <IconButton><ChatBubbleOutlineIcon /></IconButton>
                  <IconButton><ShareIcon /></IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      <Box sx={{ width: 300, bgcolor: "#fff", p: 2 }}>
        <Typography variant="h6" gutterBottom>Friend Suggestions</Typography>
        <List>
          {suggestions.map((s, i) => (
            <ListItem key={i}>
              <ListItemAvatar><Avatar src={s.img} /></ListItemAvatar>
              <ListItemText primary={s.name} />
              <Button size="small" variant="outlined">Add</Button>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>Upcoming Events</Typography>
        <Typography variant="body2">No upcoming events</Typography>
      </Box>
    </Box>
  );
}
