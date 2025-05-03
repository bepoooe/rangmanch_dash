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
  ListItemAvatar,
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
  CardActions,
  Button,
  IconButton
} from '@mui/material';
import {
  Visibility,
  ThumbUp,
  CalendarMonth,
  Search,
  YouTube,
  VideoLibrary,
  PlayArrow,
  Comment,
  Share,
  OpenInNew
} from '@mui/icons-material';
import { 
  Bar, 
  Line, 
  Pie, 
  Scatter
} from 'react-chartjs-2';
import { format } from 'date-fns';

interface YouTubeComment {
  author?: string;
  text: string;
  timestamp?: string;
  likes?: number;
}

interface YouTubeVideo {
  title: string;
  id?: string;
  viewCount?: number;
  likes?: number;
  commentCount?: number;
  date?: string;
  url?: string;
  thumbnailUrl?: string;
  description?: string;
  tags?: string[];
  comments?: YouTubeComment[];
  
  // New fields from actual data
  channelName?: string;
  channelUrl?: string;
  numberOfSubscribers?: number;
  duration?: string;
  originalISODate?: string;
}

interface YouTubeDataDetailsProps {
  data: YouTubeVideo[];
  channelName: string;
}

const YouTubeDataDetails: React.FC<YouTubeDataDetailsProps> = ({ data, channelName }) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = React.useState('');
  
  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>No YouTube data available</Typography>
      </Box>
    );
  }

  // Calculated metrics
  const totalViews = data.reduce((sum, item) => sum + (item.viewCount || 0), 0);
  const totalLikes = data.reduce((sum, item) => sum + (item.likes || 0), 0);
  const avgViews = Math.floor(totalViews / data.length);
  const avgLikes = Math.floor(totalLikes / data.length);
  const mostViewedVideo = [...data].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))[0];
  const mostLikedVideo = [...data].sort((a, b) => (b.likes || 0) - (a.likes || 0))[0];
  
  // Date statistics
  const videosByYear: Record<string, number> = {};
  data.forEach(video => {
    if (video.date) {
      const year = video.date.substring(0, 4);
      videosByYear[year] = (videosByYear[year] || 0) + 1;
    }
  });
  
  // Filter videos based on search term
  const filteredVideos = data.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Prepare chart data
  const viewsChartData = {
    labels: [...data]
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 10)
      .map(item => item.title.substring(0, 20) + (item.title.length > 20 ? '...' : '')),
    datasets: [
      {
        label: 'Views',
        data: [...data]
          .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
          .slice(0, 10)
          .map(item => item.viewCount || 0),
        backgroundColor: theme.palette.primary.main,
      }
    ]
  };
  
  const likesChartData = {
    labels: [...data]
      .sort((a, b) => (b.likes || 0) - (a.likes || 0))
      .slice(0, 10)
      .map(item => item.title.substring(0, 20) + (item.title.length > 20 ? '...' : '')),
    datasets: [
      {
        label: 'Likes',
        data: [...data]
          .sort((a, b) => (b.likes || 0) - (a.likes || 0))
          .slice(0, 10)
          .map(item => item.likes || 0),
        backgroundColor: theme.palette.secondary.main,
      }
    ]
  };
  
  const yearlyVideoDistribution = {
    labels: Object.keys(videosByYear).sort(),
    datasets: [
      {
        label: 'Videos Published',
        data: Object.keys(videosByYear).sort().map(year => videosByYear[year]),
        borderColor: theme.palette.primary.main,
        backgroundColor: 'rgba(157, 78, 221, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };
  
  const engagementChart = {
    datasets: [
      {
        label: 'Video Engagement',
        data: data.map(item => ({
          x: item.viewCount || 0,
          y: item.likes || 0,
          r: Math.sqrt((item.viewCount || 0) / 10000) + 5
        })),
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
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
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: function(tooltipItems: any) {
            return data[tooltipItems[0].dataIndex]?.title || '';
          }
        }
      }
    }
  };
  
  const scatterOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Views'
        },
        ticks: {
          callback: function(value: any) {
            return value.toLocaleString();
          }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Likes'
        },
        ticks: {
          callback: function(value: any) {
            return value.toLocaleString();
          }
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const item = data[context.dataIndex];
            return [
              `Title: ${item.title}`,
              `Views: ${item.viewCount?.toLocaleString()}`,
              `Likes: ${item.likes?.toLocaleString()}`
            ];
          }
        }
      }
    }
  };
  
  // Check if comments exist anywhere in the data
  const hasComments = data.some(video => 
    video.comments && Array.isArray(video.comments) && video.comments.length > 0
  );

  return (
    <Box>
      {/* Header & Summary Stats */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <YouTube color="error" sx={{ mr: 1, fontSize: 28 }} />
            <Typography variant="h5">{channelName}</Typography>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <VideoLibrary color="primary" sx={{ mb: 1, fontSize: 30 }} />
                <Typography variant="h6">{data.length}</Typography>
                <Typography variant="body2">Videos</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Visibility color="primary" sx={{ mb: 1, fontSize: 30 }} />
                <Typography variant="h6">{totalViews.toLocaleString()}</Typography>
                <Typography variant="body2">Total Views</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ThumbUp color="primary" sx={{ mb: 1, fontSize: 30 }} />
                <Typography variant="h6">{totalLikes.toLocaleString()}</Typography>
                <Typography variant="body2">Total Likes</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CalendarMonth color="primary" sx={{ mb: 1, fontSize: 30 }} />
                <Typography variant="h6">{Object.keys(videosByYear).length}</Typography>
                <Typography variant="body2">Years Active</Typography>
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
              <Typography variant="h6" gutterBottom>Top 10 Videos by Views</Typography>
              <Box sx={{ height: 400 }}>
                <Bar data={viewsChartData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Top 10 Videos by Likes</Typography>
              <Box sx={{ height: 400 }}>
                <Bar data={likesChartData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Videos Published by Year</Typography>
              <Box sx={{ height: 300 }}>
                <Line data={yearlyVideoDistribution} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Views vs Likes Correlation</Typography>
              <Box sx={{ height: 300 }}>
                <Scatter data={engagementChart} options={scatterOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Video Table */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>All Videos</Typography>
          <TextField
            fullWidth
            placeholder="Search videos..."
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
                  <TableCell>Title</TableCell>
                  <TableCell align="right">Views</TableCell>
                  <TableCell align="right">Likes</TableCell>
                  <TableCell align="right">Date</TableCell>
                  <TableCell>Link</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredVideos.map((video, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{video.title}</TableCell>
                    <TableCell align="right">{video.viewCount?.toLocaleString() || 0}</TableCell>
                    <TableCell align="right">{video.likes?.toLocaleString() || 0}</TableCell>
                    <TableCell align="right">{video.date}</TableCell>
                    <TableCell>
                      <a href={video.url} target="_blank" rel="noopener noreferrer">
                        Watch
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      
      {/* Video Cards with Details */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Featured Videos</Typography>
          <Grid container spacing={3}>
            {filteredVideos.slice(0, 9).map((video, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card elevation={3}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: theme.palette.error.main }}>
                        <YouTube fontSize="small" />
                      </Avatar>
                    }
                    title={video.channelName || channelName}
                    subheader={video.date || 'Unknown date'}
                  />
                  {video.thumbnailUrl && (
                    <CardMedia
                      component="img"
                      height="180"
                      image={video.thumbnailUrl}
                      alt={video.title}
                      sx={{
                        objectFit: 'cover',
                        position: 'relative'
                      }}
                    />
                  )}
                  {!video.thumbnailUrl && video.id && (
                    <CardMedia
                      component="img"
                      height="180"
                      image={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                      alt={video.title}
                      sx={{
                        objectFit: 'cover',
                        position: 'relative'
                      }}
                    />
                  )}
                  {!video.thumbnailUrl && !video.id && (
                    <Box 
                      sx={{ 
                        height: 180, 
                        bgcolor: 'black', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center'
                      }}
                    >
                      <YouTube sx={{ fontSize: 60, color: 'red' }} />
                    </Box>
                  )}
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom component="div" sx={{ fontWeight: 'bold' }}>
                      {video.title.length > 60 ? video.title.substring(0, 60) + '...' : video.title}
                    </Typography>
                    
                    {video.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {video.description.length > 120 
                          ? video.description.substring(0, 120) + '...' 
                          : video.description}
                      </Typography>
                    )}
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                      {video.duration && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarMonth fontSize="small" sx={{ mr: 0.5, color: theme.palette.text.secondary }} />
                          <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                            {video.date}
                          </Typography>
                          <Chip 
                            label={video.duration} 
                            size="small" 
                            color="default"
                            variant="outlined"
                            sx={{ fontSize: '0.65rem', ml: 'auto' }}
                          />
                        </Box>
                      )}
                      
                      {video.numberOfSubscribers && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            {typeof video.numberOfSubscribers === 'number' 
                              ? `${(video.numberOfSubscribers / 1000000).toFixed(1)}M subscribers`
                              : video.numberOfSubscribers}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Visibility fontSize="small" sx={{ mr: 0.5, color: theme.palette.text.secondary }} />
                        <Typography variant="caption" color="text.secondary">
                          {video.viewCount?.toLocaleString() || 0}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ThumbUp fontSize="small" sx={{ mr: 0.5, color: theme.palette.text.secondary }} />
                        <Typography variant="caption" color="text.secondary">
                          {video.likes?.toLocaleString() || 0}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Comment fontSize="small" sx={{ mr: 0.5, color: theme.palette.text.secondary }} />
                        <Typography variant="caption" color="text.secondary">
                          {video.commentCount?.toLocaleString() || 0}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {video.tags && video.tags.length > 0 && (
                      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {video.tags.slice(0, 3).map((tag: string, i: number) => (
                          <Chip 
                            key={i} 
                            label={tag} 
                            size="small" 
                            variant="outlined" 
                            color="primary" 
                            sx={{ fontSize: '0.65rem' }}
                          />
                        ))}
                        {video.tags.length > 3 && (
                          <Typography variant="caption" color="text.secondary">
                            +{video.tags.length - 3} more
                          </Typography>
                        )}
                      </Box>
                    )}
                    
                    {video.comments && Array.isArray(video.comments) && video.comments.length > 0 ? (
                      <Box sx={{ mt: 2 }}>
                        <Divider sx={{ mb: 1 }} />
                        <Typography variant="subtitle2" gutterBottom>
                          Top Comments
                        </Typography>
                        <List dense disablePadding>
                          {video.comments.slice(0, 2).map((comment: YouTubeComment, i: number) => (
                            <ListItem key={i} disablePadding sx={{ pb: 0.5 }}>
                              <ListItemText
                                primary={comment.author || 'YouTube User'}
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
                    ) : (
                      <Box sx={{ mt: 2 }}>
                        <Divider sx={{ mb: 1 }} />
                        <Typography variant="body2" color="text.secondary" align="center">
                          No comments available for this video
                        </Typography>
                        {!hasComments && (
                          <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block', mt: 1 }}>
                            (Comments are not included in the scraped data)
                          </Typography>
                        )}
                      </Box>
                    )}
                  </CardContent>
                  <CardActions>
                    {video.url && (
                      <Button 
                        startIcon={<PlayArrow />} 
                        size="small" 
                        color="error"
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Watch
                      </Button>
                    )}
                    <Button 
                      startIcon={<Share />} 
                      size="small" 
                      color="primary"
                    >
                      Share
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default YouTubeDataDetails; 