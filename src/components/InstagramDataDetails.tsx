import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Paper,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  CardMedia,
  CardHeader,
  IconButton
} from '@mui/material';
import {
  ThumbUp,
  Comment,
  CalendarMonth,
  Search,
  Instagram,
  Photo,
  Videocam,
  Album,
  Favorite,
  ChatBubble,
  Share
} from '@mui/icons-material';
import { 
  Bar, 
  Line, 
  Pie, 
  Doughnut
} from 'react-chartjs-2';

interface InstagramComment {
  id?: string;
  text: string;
  ownerUsername?: string;
  timestamp?: string;
  repliesCount?: number;
  likesCount?: number;
  owner?: {
    username: string;
    profile_pic_url?: string;
    id?: string;
    is_verified?: boolean;
  };
}

interface InstagramPost {
  caption?: string;
  likesCount?: number;
  commentsCount?: number;
  type?: string;
  url?: string;
  displayUrl?: string;
  timestamp?: string | number;
  comments?: InstagramComment[];
  // New fields from actual data
  id?: string;
  shortCode?: string;
  hashtags?: string[];
  mentions?: string[];
  firstComment?: string;
  latestComments?: InstagramComment[];
  mediaUrl?: string;
  dimensions?: {
    height: number;
    width: number;
  };
  likedBy?: string[];
  location?: string;
  thumbnail?: string;
  displayImage?: string;
}

interface InstagramDataDetailsProps {
  data: InstagramPost[];
  username: string;
}

const InstagramDataDetails: React.FC<InstagramDataDetailsProps> = ({ data, username }) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = React.useState('');
  
  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>No Instagram data available</Typography>
      </Box>
    );
  }

  // Calculated metrics
  const totalLikes = data.reduce((sum, item) => sum + (item.likesCount || 0), 0);
  const totalComments = data.reduce((sum, item) => sum + (item.commentsCount || 0), 0);
  const avgLikes = Math.floor(totalLikes / data.length);
  const avgComments = Math.floor(totalComments / data.length);
  
  // Content type statistics
  const contentTypes: Record<string, number> = {};
  data.forEach(post => {
    const type = post.type || 'Unknown';
    contentTypes[type] = (contentTypes[type] || 0) + 1;
  });
  
  // Find most engaging posts
  const mostLikedPost = [...data].sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))[0];
  const mostCommentedPost = [...data].sort((a, b) => (b.commentsCount || 0) - (a.commentsCount || 0))[0];
  
  // Check if comments exist anywhere in the data
  const hasComments = data.some(post => 
    (post.latestComments && Array.isArray(post.latestComments) && post.latestComments.length > 0) ||
    (post.comments && Array.isArray(post.comments) && post.comments.length > 0)
  );

  // Filter posts based on search term
  const filteredPosts = data.filter(post => 
    (post.caption || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Prepare chart data
  const contentTypeData = {
    labels: Object.keys(contentTypes),
    datasets: [
      {
        data: Object.values(contentTypes),
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.error.main,
          theme.palette.warning.main,
          theme.palette.info.main,
        ],
      }
    ]
  };
  
  const likesChartData = {
    labels: [...data]
      .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
      .slice(0, 10)
      .map((_, index) => `Post ${index + 1}`),
    datasets: [
      {
        label: 'Likes',
        data: [...data]
          .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
          .slice(0, 10)
          .map(item => item.likesCount || 0),
        backgroundColor: theme.palette.primary.main,
      }
    ]
  };
  
  const commentsChartData = {
    labels: [...data]
      .sort((a, b) => (b.commentsCount || 0) - (a.commentsCount || 0))
      .slice(0, 10)
      .map((_, index) => `Post ${index + 1}`),
    datasets: [
      {
        label: 'Comments',
        data: [...data]
          .sort((a, b) => (b.commentsCount || 0) - (a.commentsCount || 0))
          .slice(0, 10)
          .map(item => item.commentsCount || 0),
        backgroundColor: theme.palette.secondary.main,
      }
    ]
  };
  
  const engagementRatioData = {
    labels: ['Likes', 'Comments'],
    datasets: [
      {
        data: [totalLikes, totalComments],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main
        ],
        hoverOffset: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };
  
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      }
    }
  };
  
  // Get icon for content type
  const getTypeIcon = (type?: string) => {
    if (!type) return <Photo />;
    
    switch(type.toLowerCase()) {
      case 'image':
        return <Photo />;
      case 'video':
        return <Videocam />;
      case 'carousel':
        return <Album />;
      default:
        return <Photo />;
    }
  };

  return (
    <Box>
      {/* Header & Summary Stats */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Instagram color="secondary" sx={{ mr: 1, fontSize: 28 }} />
            <Typography variant="h5">@{username}</Typography>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Photo color="secondary" sx={{ mb: 1, fontSize: 30 }} />
                <Typography variant="h6">{data.length}</Typography>
                <Typography variant="body2">Posts</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ThumbUp color="secondary" sx={{ mb: 1, fontSize: 30 }} />
                <Typography variant="h6">{totalLikes.toLocaleString()}</Typography>
                <Typography variant="body2">Total Likes</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Comment color="secondary" sx={{ mb: 1, fontSize: 30 }} />
                <Typography variant="h6">{totalComments.toLocaleString()}</Typography>
                <Typography variant="body2">Total Comments</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Album color="secondary" sx={{ mb: 1, fontSize: 30 }} />
                <Typography variant="h6">{Object.keys(contentTypes).length}</Typography>
                <Typography variant="body2">Content Types</Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Top 10 Posts by Likes</Typography>
              <Box sx={{ height: 400 }}>
                <Bar data={likesChartData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Top 10 Posts by Comments</Typography>
              <Box sx={{ height: 400 }}>
                <Bar data={commentsChartData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Content Type Distribution</Typography>
              <Box sx={{ height: 300 }}>
                <Pie data={contentTypeData} options={pieOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Engagement Breakdown</Typography>
              <Box sx={{ height: 300 }}>
                <Doughnut data={engagementRatioData} options={pieOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Posts Table */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>All Posts</Typography>
          <TextField
            fullWidth
            placeholder="Search posts by caption..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          
          <TableContainer component={Paper} sx={{ maxHeight: 500, overflow: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Caption</TableCell>
                  <TableCell align="right">Likes</TableCell>
                  <TableCell align="right">Comments</TableCell>
                  <TableCell>Link</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPosts.map((post, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Chip 
                        icon={getTypeIcon(post.type)}
                        label={post.type || 'Post'} 
                        size="small" 
                        color="secondary"
                      />
                    </TableCell>
                    <TableCell>
                      {post.caption 
                        ? (post.caption.length > 100 ? post.caption.substring(0, 100) + '...' : post.caption)
                        : 'No caption'}
                    </TableCell>
                    <TableCell align="right">{post.likesCount?.toLocaleString() || 0}</TableCell>
                    <TableCell align="right">{post.commentsCount?.toLocaleString() || 0}</TableCell>
                    <TableCell>
                      {post.url && (
                        <a href={post.url} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      
      {/* Posts Cards with Comments and Captions */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Post Highlights</Typography>
          <Grid container spacing={3}>
            {filteredPosts.slice(0, 9).map((post, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card elevation={3}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                        {username.charAt(0).toUpperCase()}
                      </Avatar>
                    }
                    title={`@${username}`}
                    subheader={post.timestamp ? 
                      (typeof post.timestamp === 'string' ? 
                        new Date(post.timestamp).toLocaleDateString() : 
                        new Date(post.timestamp * 1000).toLocaleDateString())
                      : ''}
                    action={
                      <Chip 
                        icon={getTypeIcon(post.type)}
                        label={post.type || 'Post'} 
                        size="small" 
                        color="secondary"
                      />
                    }
                  />
                  {post.mediaUrl && (
                    <CardMedia
                      component="img"
                      height="194"
                      image={post.mediaUrl}
                      alt="Post image"
                      sx={{
                        objectFit: 'contain',
                        bgcolor: 'black'
                      }}
                    />
                  )}
                  {post.displayUrl && !post.mediaUrl && (
                    <CardMedia
                      component="img"
                      height="194"
                      image={post.displayUrl}
                      alt="Post image"
                      sx={{
                        objectFit: 'contain',
                        bgcolor: 'black'
                      }}
                    />
                  )}
                  {!post.mediaUrl && !post.displayUrl && post.thumbnail && (
                    <CardMedia
                      component="img"
                      height="194"
                      image={post.thumbnail}
                      alt="Post image"
                      sx={{
                        objectFit: 'contain',
                        bgcolor: 'black'
                      }}
                    />
                  )}
                  {!post.mediaUrl && !post.displayUrl && !post.thumbnail && post.displayImage && (
                    <CardMedia
                      component="img"
                      height="194"
                      image={post.displayImage}
                      alt="Post image"
                      sx={{
                        objectFit: 'contain',
                        bgcolor: 'black'
                      }}
                    />
                  )}
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {post.caption 
                        ? (post.caption.length > 150 ? post.caption.substring(0, 150) + '...' : post.caption)
                        : 'No caption'}
                    </Typography>
                    
                    {post.hashtags && post.hashtags.length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        {post.hashtags.slice(0, 3).map((tag, i) => (
                          <Chip 
                            key={i} 
                            label={`#${tag}`} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        ))}
                        {post.hashtags.length > 3 && (
                          <Typography variant="caption" color="text.secondary">
                            +{post.hashtags.length - 3} more
                          </Typography>
                        )}
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ThumbUp fontSize="small" sx={{ mr: 0.5, color: theme.palette.text.secondary }} />
                        <Typography variant="caption" color="text.secondary">
                          {post.likesCount?.toLocaleString() || 0}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Comment fontSize="small" sx={{ mr: 0.5, color: theme.palette.text.secondary }} />
                        <Typography variant="caption" color="text.secondary">
                          {post.commentsCount?.toLocaleString() || 0}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {(post.latestComments && Array.isArray(post.latestComments) && post.latestComments.length > 0) ? (
                      <Box sx={{ mt: 2 }}>
                        <Divider sx={{ mb: 1 }} />
                        <Typography variant="subtitle2" gutterBottom>
                          Top Comments
                        </Typography>
                        <List dense disablePadding>
                          {post.latestComments.slice(0, 3).map((comment: InstagramComment, i: number) => (
                            <ListItem key={i} disablePadding sx={{ pb: 0.5 }}>
                              <ListItemText
                                primary={comment.ownerUsername ? `@${comment.ownerUsername}` : 
                                       (comment.owner?.username ? `@${comment.owner.username}` : 'User')}
                                secondary={comment.text}
                                primaryTypographyProps={{ 
                                  variant: 'caption', 
                                  fontWeight: 'bold',
                                  color: theme.palette.primary.main
                                }}
                                secondaryTypographyProps={{ 
                                  variant: 'caption',
                                  sx: { wordBreak: 'break-word' }
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    ) : (post.comments && Array.isArray(post.comments) && post.comments.length > 0) ? (
                      <Box sx={{ mt: 2 }}>
                        <Divider sx={{ mb: 1 }} />
                        <Typography variant="subtitle2" gutterBottom>
                          Top Comments
                        </Typography>
                        <List dense disablePadding>
                          {post.comments.slice(0, 3).map((comment: InstagramComment, i: number) => (
                            <ListItem key={i} disablePadding sx={{ pb: 0.5 }}>
                              <ListItemText
                                primary={comment.ownerUsername ? `@${comment.ownerUsername}` : 
                                       (comment.owner?.username ? `@${comment.owner.username}` : 'User')}
                                secondary={comment.text}
                                primaryTypographyProps={{ 
                                  variant: 'caption', 
                                  fontWeight: 'bold',
                                  color: theme.palette.primary.main
                                }}
                                secondaryTypographyProps={{ 
                                  variant: 'caption',
                                  sx: { wordBreak: 'break-word' }
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    ) : post.firstComment ? (
                      <Box sx={{ mt: 2 }}>
                        <Divider sx={{ mb: 1 }} />
                        <Typography variant="subtitle2" gutterBottom>
                          First Comment
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {post.firstComment}
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ mt: 2 }}>
                        <Divider sx={{ mb: 1 }} />
                        <Typography variant="body2" color="text.secondary" align="center">
                          No comments available for this post
                        </Typography>
                        {!hasComments && (
                          <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block', mt: 1 }}>
                            (Comments are not included in the scraped data)
                          </Typography>
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default InstagramDataDetails; 