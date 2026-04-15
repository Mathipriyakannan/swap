

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  BottomNavigation,
  BottomNavigationAction,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [navValue, setNavValue] = useState(0);

  const recentSearches = [
    'History of architecture',
    'Introduction to biology',
    'Basic guitar lessons',
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'white', p: 2, pb: 8 }}>
      <Typography variant="h6" align="center" gutterBottom>
        Swap Knowledge
      </Typography>

      <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
        Search
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton>
          <SearchIcon />
        </IconButton>
        <TextField
          fullWidth
          variant="standard"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <Typography variant="h6" gutterBottom>
        Recent searches
      </Typography>
      <List>
        {recentSearches.map((item, idx) => (
          <ListItem key={idx} sx={{ pl: 0 }}>
            <Typography variant="body1">{item}</Typography>
          </ListItem>
        ))}
      </List>

      <Paper
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={navValue}
          onChange={(event, newValue) => setNavValue(newValue)}
        >
          <BottomNavigationAction label="Search" icon={<SearchIcon />} />
          <BottomNavigationAction label="Post" icon={<AddIcon />} />
          <BottomNavigationAction label="Connect" icon={<PeopleIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default SearchPage;
