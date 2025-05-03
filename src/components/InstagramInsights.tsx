import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  InputAdornment,
  Grid,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import {
  Search,
  Instagram,
  List,
  GridView,
  Photo,
  VideoCall,
  ViewCarousel
} from '@mui/icons-material';
import { InstagramData } from '../services/api';

interface InstagramInsightsProps {
  instagramData: InstagramData[];
  instagramDetails: any[];
  selectedInstagramData: string;
  username: string;
  onSelect: (filePath: string) => void;
  onRefresh: () => void;
}

const InstagramInsights: React.FC<InstagramInsightsProps> = ({
  instagramData,
  instagramDetails,
  selectedInstagramData,
  username,
  onSelect,
  onRefresh
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<string>('table');

  const handleSelectChange = (event: SelectChangeEvent) => {
    onSelect(event.target.value);
  };

  const handleViewModeChange = (event: React.MouseEvent<HTMLElement>, newMode: string) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const getPostStats = () => {
    let totalLikes = 0;
    let totalComments = 0;
    let totalPosts = instagramDetails.length;

    instagramDetails.forEach(post => {
      // Handle different field names for likes
      if (post.likesCount) totalLikes += Number(post.likesCount);
      else if (post.likes) totalLikes += Number(post.likes);
      else if (post.engagement?.likes) totalLikes += Number(post.engagement.likes);

      // Handle different field names for comments
      if (post.commentsCount) totalComments += Number(post.commentsCount);
      else if (post.comments && typeof post.comments === 'number') totalComments += Number(post.comments);
      else if (post.comments && Array.isArray(post.comments)) totalComments += post.comments.length;
      else if (post.engagement?.comments) totalComments += Number(post.engagement.comments);
    });

    return { totalPosts, totalLikes, totalComments };
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDateString = (dateStr: string | number): string => {
    if (!dateStr) return '';
    
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return String(dateStr);
      
      return date.toISOString().substring(0, 16).replace('T', ' ');
    } catch (e) {
      return String(dateStr);
    }
  };

  const getPostCaption = (post: any): string => {
    return post.caption || post.text || post.title || 'No caption';
  };

  const getPostLikes = (post: any): number => {
    return Number(post.likesCount || post.likes || post.engagement?.likes || 0);
  };

  const getPostComments = (post: any): number => {
    if (post.commentsCount) return Number(post.commentsCount);
    if (post.comments && typeof post.comments === 'number') return Number(post.comments);
    if (post.comments && Array.isArray(post.comments)) return post.comments.length;
    if (post.engagement?.comments) return Number(post.engagement.comments);
    return 0;
  };

  const getPostDate = (post: any): string => {
    return post.timestamp || post.created_at || post.createdAt || post.taken_at || '';
  };

  const getPostType = (post: any): string => {
    const type = post.type || post.mediaType || post.media_type || post.contentType || '';
    
    if (type.toLowerCase().includes('image') || type.toLowerCase().includes('photo')) {
      return 'Photo';
    }
    if (type.toLowerCase().includes('video')) {
      return 'Video';
    }
    if (type.toLowerCase().includes('carousel') || type.toLowerCase().includes('album')) {
      return 'Carousel';
    }
    
    return 'Image';
  };

  const getPostTypeIcon = (type: string) => {
    switch(type.toLowerCase()) {
      case 'video':
        return <VideoCall />;
      case 'carousel':
        return <ViewCarousel />;
      default:
        return <Photo />;
    }
  };

  const getPostUrl = (post: any): string => {
    return post.permalink || post.url || `https://www.instagram.com/p/${post.shortCode || post.code || ''}`;
  };

  const getOwnerUsername = (post: any): string => {
    return post.username || post.ownerUsername || post.owner?.username || username.replace('@', '');
  };

  const filteredPosts = instagramDetails.filter(post => {
    const caption = getPostCaption(post).toLowerCase();
    return caption.includes(searchQuery.toLowerCase());
  }).sort((a, b) => getPostLikes(b) - getPostLikes(a));

  const { totalPosts, totalLikes, totalComments } = getPostStats();

  // Check for error in Instagram data
  const hasError = instagramDetails.length > 0 && 
    (instagramDetails[0].error || instagramDetails[0].errorDescription);

  return (
    <Box>
      {instagramData.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" gutterBottom>No Instagram data available</Typography>
          <Button 
            variant="contained" 
            color="secondary"
            startIcon={<Instagram />}
            onClick={() => window.location.href = '/scrape'}
            sx={{ mt: 2 }}
          >
            Scrape Instagram Data
          </Button>
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="instagram-account-select-label">Select Instagram Account</InputLabel>
              <Select
                labelId="instagram-account-select-label"
                value={selectedInstagramData}
                label="Select Instagram Account"
                onChange={handleSelectChange}
              >
                {instagramData.map((item) => (
                  <MenuItem key={item.file_path} value={item.file_path}>
                    {item.display_name || `@${item.username}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {hasError ? (
            <Box sx={{ textAlign: 'center', py: 4, bgcolor: '#2b1f3b', p: 3, borderRadius: 2 }}>
              <Typography variant="h6" color="error" gutterBottom>
                Unable to retrieve Instagram data
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                {instagramDetails[0].errorDescription || instagramDetails[0].error || 'Account may be private or no longer exists'}
              </Typography>
              <Button 
                variant="outlined" 
                color="secondary"
                onClick={onRefresh}
              >
                Try Again
              </Button>
            </Box>
          ) : instagramDetails.length > 0 ? (
            <Box sx={{ bgcolor: '#1a1a2e', color: 'white', borderRadius: 1, p: 3, mb: 3 }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: '#9c27b0', 
                    fontWeight: 'bold', 
                    mb: 1 
                  }}
                >
                  Instagram Data for {username}
                </Typography>
              </Box>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#2b1f3b', borderRadius: 2, border: '1px solid #8e24aa' }}>
                    <Typography variant="h5" sx={{ color: '#ffa726', fontWeight: 'bold' }}>
                      {totalPosts}
                    </Typography>
                    <Typography sx={{ color: 'white' }}>
                      Posts
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#2b1f3b', borderRadius: 2, border: '1px solid #8e24aa' }}>
                    <Typography variant="h5" sx={{ color: '#ffa726', fontWeight: 'bold' }}>
                      {formatNumber(totalLikes)}
                    </Typography>
                    <Typography sx={{ color: 'white' }}>
                      Total Likes
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#2b1f3b', borderRadius: 2, border: '1px solid #8e24aa' }}>
                    <Typography variant="h5" sx={{ color: '#ffa726', fontWeight: 'bold' }}>
                      {formatNumber(totalComments)}
                    </Typography>
                    <Typography sx={{ color: 'white' }}>
                      Total Comments
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={handleViewModeChange}
                  aria-label="view mode"
                  size="small"
                  sx={{ bgcolor: '#2b1f3b' }}
                >
                  <ToggleButton value="table" aria-label="table view" sx={{ color: 'white' }}>
                    <List /> Table View
                  </ToggleButton>
                  <ToggleButton value="list" aria-label="list view" sx={{ color: 'white' }}>
                    <GridView /> List View
                  </ToggleButton>
                </ToggleButtonGroup>

                <TextField
                  placeholder="Search posts..."
                  variant="outlined"
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ 
                    width: '250px',
                    bgcolor: '#2b1f3b',
                    input: { color: 'white' },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#3a3a50" },
                      "&:hover fieldset": { borderColor: "#4a4a60" },
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: 'gray' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <TableContainer sx={{ borderRadius: 1, bgcolor: '#1a1a2e' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold', bgcolor: '#9c27b0' }}>Type</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold', bgcolor: '#9c27b0' }}>Caption</TableCell>
                      <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', bgcolor: '#9c27b0' }}>Likes</TableCell>
                      <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', bgcolor: '#9c27b0' }}>Comments</TableCell>
                      <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', bgcolor: '#9c27b0' }}>Date</TableCell>
                      <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', bgcolor: '#9c27b0' }}>Username</TableCell>
                      <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', bgcolor: '#9c27b0' }}>Link</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPosts.length > 0 ? (
                      filteredPosts.map((post, index) => (
                        <TableRow key={index} sx={{ '&:nth-of-type(odd)': { bgcolor: '#23233a' } }}>
                          <TableCell sx={{ color: 'white' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {getPostTypeIcon(getPostType(post))}
                              <Typography sx={{ ml: 1 }}>
                                {getPostType(post)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: 'white', maxWidth: '300px' }}>
                            <Typography noWrap>
                              {getPostCaption(post)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ color: 'white' }}>
                            {getPostLikes(post)}
                          </TableCell>
                          <TableCell align="right" sx={{ color: 'white' }}>
                            {getPostComments(post)}
                          </TableCell>
                          <TableCell align="right" sx={{ color: 'white' }}>
                            {formatDateString(getPostDate(post))}
                          </TableCell>
                          <TableCell align="right" sx={{ color: 'white' }}>
                            @{getOwnerUsername(post)}
                          </TableCell>
                          <TableCell align="right">
                            <Link 
                              href={getPostUrl(post)}
                              target="_blank"
                              sx={{ color: '#9c27b0', textDecoration: 'none' }}
                            >
                              View
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} sx={{ textAlign: 'center', color: 'white' }}>
                          No posts found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress color="secondary" />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default InstagramInsights; 