import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  CardHeader,
  Avatar,
  IconButton, 
  Chip, 
  TextField, 
  InputAdornment,
  Button,
  useTheme,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Paper,
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Refresh as RefreshIcon,
  ChatBubbleOutline as CommentIcon,
  ThumbUp as LikeIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import api, { InstagramData } from '../services/api';

const ContentLibrary: React.FC = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [instagramData, setInstagramData] = useState<InstagramData[]>([]);
  const [selectedInstagramData, setSelectedInstagramData] = useState<string>('');
  const [instagramDetails, setInstagramDetails] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch Instagram details
  const fetchInstagramDetails = useCallback(async (filePath: string) => {
    if (!filePath) {
      console.warn('No Instagram file path provided');
      return;
    }
    
    try {
      console.log('Fetching Instagram data from:', filePath);
      setLoading(true);
      const data = await api.getDataFile(filePath);
      
      // Check data validity
      if (!data || !Array.isArray(data)) {
        console.error('Instagram data is invalid');
        setInstagramDetails([]);
        return;
      }
      
      setInstagramDetails(data);
      console.log('Instagram data loaded:', data.length, 'items');
    } catch (error) {
      console.error('Failed to fetch Instagram details:', error);
      setInstagramDetails([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data list
  const fetchDataList = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Fetching social media data list...');
      const dataList = await api.listData();
      
      if (dataList.instagram && Array.isArray(dataList.instagram)) {
        // Process Instagram data for display
        const processedInstagramData = dataList.instagram.map(item => {
          // Format username with @ symbol
          const displayName = item.username ? `@${item.username}` : 'Unknown Account';
          
          return {
            ...item,
            display_name: displayName
          };
        });
        
        setInstagramData(processedInstagramData);
        
        // Auto-select first item
        if (processedInstagramData.length > 0 && !selectedInstagramData) {
          setSelectedInstagramData(processedInstagramData[0].file_path);
          fetchInstagramDetails(processedInstagramData[0].file_path);
        }
      } else {
        setInstagramData([]);
      }
    } catch (error) {
      console.error('Failed to fetch data list:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchInstagramDetails, selectedInstagramData]);

  // Load data on component mount
  useEffect(() => {
    fetchDataList();
  }, [fetchDataList]);

  // Handle Instagram data selection
  const handleInstagramDataChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setSelectedInstagramData(value);
    fetchInstagramDetails(value);
  };

  // Filter Instagram comments
  const getInstagramComments = () => {
    if (!instagramDetails.length) return [];
    
    // Extract all comments from posts
    const allComments: any[] = [];
    
    instagramDetails.forEach(post => {
      // Check for comments in different possible locations
      let comments: any[] = [];
      
      // First try latestComments which is the primary format for the data
      if (post.latestComments && Array.isArray(post.latestComments)) {
        comments = post.latestComments;
      } 
      // Fallback to other possible formats
      else if (post.comments && Array.isArray(post.comments)) {
        comments = post.comments;
      }
      else if (post.edges && post.edges.comments && Array.isArray(post.edges.comments)) {
        comments = post.edges.comments;
      }
      
      if (comments.length > 0) {
        // Add post info to each comment
        const postComments = comments.map((comment: any) => ({
          ...comment,
          postCaption: post.caption || post.edge_media_to_caption?.edges?.[0]?.node?.text || '',
          postUrl: post.permalink || post.url || '',
          postImage: post.display_url || post.thumbnail_url || post.thumbnail || '',
          postId: post.id || post.shortcode || '',
        }));
        
        allComments.push(...postComments);
      }
    });
    
    // Sort by like count if available, otherwise by time
    return allComments.sort((a, b) => {
      const aLikes = a.likeCount || a.like_count || a.likesCount || 0;
      const bLikes = b.likeCount || b.like_count || b.likesCount || 0;
      return bLikes - aLikes;
    });
  };

  // Get filtered Instagram comments based on search
  const filteredInstagramComments = () => {
    const comments = getInstagramComments();
    
    if (!searchQuery) return comments;
    
    return comments.filter(comment => {
      const text = comment.text || comment.content || '';
      const username = comment.ownerUsername || comment.username || comment.owner?.username || '';
      
      return (
        text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Render Instagram comment
  const renderInstagramComment = (comment: any) => {
    // Extract comment text based on available properties
    const commentText = comment.text || comment.content || 'No text';
    
    // Extract username from different possible locations
    const username = comment.ownerUsername || comment.username || comment.owner?.username || 'anonymous';
    
    // Extract profile image from different possible locations
    const userImage = comment.ownerProfilePicUrl || comment.profile_pic_url || comment.owner?.profile_pic_url || '';
    
    // Extract like count from different possible locations
    const likeCount = comment.likesCount || comment.likeCount || comment.like_count || 0;
    
    // Extract timestamp from different possible locations
    const timestamp = comment.timestamp || comment.created_at || '';
    
    // Post information
    const postCaption = comment.postCaption || '';
    const postUrl = comment.postUrl || '';
    const postImage = comment.postImage || '';
    
    return (
      <Card key={comment.id || username + timestamp} sx={{ mb: 2, backgroundColor: theme.palette.background.paper }}>
        <CardHeader
          avatar={
            <Avatar src={userImage} aria-label="commenter">
              {username.charAt(0)}
            </Avatar>
          }
          title={`@${username}`}
          subheader={formatDate(timestamp)}
          action={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip 
                icon={<LikeIcon />} 
                label={likeCount} 
                size="small" 
                sx={{ mr: 1 }} 
              />
              {postUrl && (
                <IconButton size="small" href={postUrl} target="_blank" aria-label="open post">
                  <OpenInNewIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          }
        />
        {postImage && (
          <CardMedia
            component="img"
            height="140"
            image={postImage}
            alt="Post image"
            sx={{ objectFit: 'contain', bgcolor: 'black' }}
          />
        )}
        <CardContent>
          {postCaption && (
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Post caption: {postCaption.length > 100 ? postCaption.substring(0, 100) + '...' : postCaption}
            </Typography>
          )}
          <Typography variant="body1">{commentText}</Typography>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' }
      }}>
        <Typography variant="h4" component="h1">
          Instagram Comments Library
        </Typography>
        
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />}
          onClick={fetchDataList}
        >
          Refresh Data
        </Button>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <TextField
          placeholder="Search comments..."
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', p: 5 }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography color="text.secondary">Loading data...</Typography>
        </Box>
      ) : (
        <>
          {instagramData.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>No Instagram data available</Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Please scrape some data using the Instagram scraper first.
              </Typography>
              <Button 
                variant="outlined" 
                color="primary"
                onClick={() => window.location.href = '/'}
              >
                Go to Dashboard
              </Button>
            </Box>
          ) : (
            <>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="instagram-data-select-label">Select Instagram Account</InputLabel>
                <Select
                  labelId="instagram-data-select-label"
                  id="instagram-data-select"
                  value={selectedInstagramData}
                  label="Select Instagram Account"
                  onChange={handleInstagramDataChange}
                >
                  {instagramData.map((data, index) => (
                    <MenuItem key={index} value={data.file_path}>
                      {data.display_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {instagramDetails.length > 0 ? (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Top Comments
                  </Typography>
                  
                  {filteredInstagramComments().length > 0 ? (
                    filteredInstagramComments().slice(0, 20).map(comment => renderInstagramComment(comment))
                  ) : (
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                      <CommentIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
                      <Typography color="text.secondary">
                        No comments found for this account or search query.
                      </Typography>
                    </Paper>
                  )}
                </Box>
              ) : (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    Select an Instagram account to view comments
                  </Typography>
                </Box>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default ContentLibrary; 