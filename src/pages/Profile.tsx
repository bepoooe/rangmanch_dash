import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  Paper,
  Alert,
  InputAdornment,
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';

const Profile: React.FC = () => {
  const [editing, setEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Mock user data
  const [userData, setUserData] = useState({
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 9876543210',
    role: 'Content Creator',
    bio: 'Creative content producer specializing in cultural storytelling and theatrical presentations. 5+ years experience in digital content creation and performance art promotion.',
    location: 'Mumbai, India',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    joinDate: 'January 2022',
    socialLinks: {
      twitter: '@rahulsharma',
      instagram: '@rahulsharma_creates',
      linkedin: 'rahul-sharma-creates',
    },
  });

  const handleEditToggle = () => {
    if (editing) {
      // Save logic would go here
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    setEditing(!editing);
  };

  const handleUserDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setUserData({
        ...userData,
        [parent]: {
          ...userData[parent as keyof typeof userData] as Record<string, any>,
          [child]: value
        }
      });
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Profile
      </Typography>
      
      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Profile updated successfully!
        </Alert>
      )}
      
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Personal Information</Typography>
            <Button
              startIcon={editing ? <SaveIcon /> : <EditIcon />}
              onClick={handleEditToggle}
              variant={editing ? "contained" : "outlined"}
              color={editing ? "primary" : "secondary"}
            >
              {editing ? "Save Changes" : "Edit Profile"}
            </Button>
          </Box>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                src={userData.avatarUrl}
                alt={userData.name}
                sx={{ width: 120, height: 120, mb: 2 }}
              />
              
              {editing && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    startIcon={<UploadIcon />}
                    size="small"
                    variant="outlined"
                    sx={{ mt: 1 }}
                  >
                    Upload
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    size="small"
                    color="error"
                    variant="outlined"
                    sx={{ mt: 1 }}
                  >
                    Remove
                  </Button>
                </Box>
              )}
              
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Member since
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {userData.joinDate}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={userData.name}
                    onChange={handleUserDataChange}
                    disabled={!editing}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Role"
                    name="role"
                    value={userData.role}
                    onChange={handleUserDataChange}
                    disabled={!editing}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={userData.email}
                    onChange={handleUserDataChange}
                    disabled={!editing}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={userData.phone}
                    onChange={handleUserDataChange}
                    disabled={!editing}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bio"
                    name="bio"
                    value={userData.bio}
                    onChange={handleUserDataChange}
                    disabled={!editing}
                    variant="outlined"
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={userData.location}
                    onChange={handleUserDataChange}
                    disabled={!editing}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Social Media Profiles
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Twitter"
                  name="socialLinks.twitter"
                  value={userData.socialLinks.twitter}
                  onChange={handleUserDataChange}
                  disabled={!editing}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TwitterIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Instagram"
                  name="socialLinks.instagram"
                  value={userData.socialLinks.instagram}
                  onChange={handleUserDataChange}
                  disabled={!editing}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <InstagramIcon color="secondary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="LinkedIn"
                  name="socialLinks.linkedin"
                  value={userData.socialLinks.linkedin}
                  onChange={handleUserDataChange}
                  disabled={!editing}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LinkedInIcon sx={{ color: '#0077B5' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile; 