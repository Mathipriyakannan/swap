import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

const SettingsPage = () => {
  const [notifications, setNotifications] = useState({
    phone: true,
    email: false,
    message: false,
  });

  const [language, setLanguage] = useState('english');

  const handleNotificationChange = (event) => {
    setNotifications({
      ...notifications,
      [event.target.name]: event.target.checked,
    });
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <Container sx={{ py: 8 }}>
      <Box textAlign="center" mb={4}>
        <SettingsIcon sx={{ fontSize: 80, color: 'primary.main' }} />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Settings
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Customize your preferences
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Notification Preferences
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={notifications.phone}
                    onChange={handleNotificationChange}
                    name="phone"
                  />
                }
                label="Phone"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={notifications.email}
                    onChange={handleNotificationChange}
                    name="email"
                  />
                }
                label="Email"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={notifications.message}
                    onChange={handleNotificationChange}
                    name="message"
                  />
                }
                label="Message"
              />
            </FormGroup>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Language
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="language-select-label">Language</InputLabel>
              <Select
                labelId="language-select-label"
                value={language}
                label="Language"
                onChange={handleLanguageChange}
              >
                <MenuItem value="english">English</MenuItem>
                <MenuItem value="tamil">Tamil</MenuItem>
                <MenuItem value="hindi">Hindi</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Privacy & Security
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review and configure security settings.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SettingsPage;
