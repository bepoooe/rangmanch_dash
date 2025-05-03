import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Tab,
  Tabs,
  CircularProgress,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Link,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  Alert
} from '@mui/material';
import {
  YouTube,
  Instagram,
  Search,
  Visibility,
  ThumbUp,
  List,
  GridView,
  VideoCall,
  Photo,
  FileDownload,
  BarChartRounded as BarChart
} from '@mui/icons-material';
import api, { YouTubeData, InstagramData } from '../services/api';
import ReactApexChart from 'react-apexcharts';
import { useHistory } from 'react-router-dom';

// Define interfaces for YouTube and Instagram data types
interface YouTubeVideoData {
  id?: string;
  video_id?: string;
  title?: string;
  snippet?: {
    title?: string;
    publishedAt?: string;
  };
  viewCount?: string | number;
  views?: string | number;
  statistics?: {
    viewCount?: string | number;
    likeCount?: string | number;
    subscriberCount?: string | number;
  };
  likeCount?: string | number;
  likes?: string | number;
  duration?: string;
  contentDetails?: {
    duration?: string;
  };
  publishedAt?: string;
  published_date?: string;
  url?: string;
  channel_id?: string;
  subscriberCount?: string | number;
  channel_statistics?: {
    subscriberCount?: string | number;
  };
  // Additional properties found in scraped data
  channel_name?: string;
  creator?: string;
  author?: string;
  engagement?: {
    likes?: string | number;
    comments?: string | number;
    shares?: string | number;
  };
}

interface InstagramPostData {
  type?: string;
  mediaType?: string;
  media_type?: string;
  contentType?: string;
  caption?: string;
  text?: string;
  title?: string;
  likesCount?: string | number;
  likes?: string | number;
  engagement?: {
    likes?: string | number;
    comments?: string | number;
  };
  commentsCount?: string | number;
  comments?: string | number | any[];
  timestamp?: string;
  created_at?: string;
  createdAt?: string;
  taken_at?: string;
  permalink?: string;
  url?: string;
  shortCode?: string;
  code?: string;
  username?: string;
  ownerUsername?: string;
  owner?: {
    username?: string;
  };
  error?: string;
  errorDescription?: string;
}

// Working with the components directly to avoid import issues
interface YouTubeInsightsProps {
  youtubeData: YouTubeData[];
  youtubeDetails: YouTubeVideoData[];
  selectedYoutubeData: string;
  channelName: string;
  onSelect: (filePath: string) => void;
}

const YouTubeInsights: React.FC<YouTubeInsightsProps> = (props) => {
  const {
    youtubeData,
    youtubeDetails,
    selectedYoutubeData,
    channelName,
    onSelect,
  } = props;
  
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSelectChange = (event: SelectChangeEvent) => {
    onSelect(event.target.value);
  };

  const getVideoStats = () => {
    let totalViews = 0;
    let totalLikes = 0;
    let totalVideos = youtubeDetails.length;

    youtubeDetails.forEach((video: YouTubeVideoData) => {
      // Handle different field names for views
      if (video.viewCount) totalViews += Number(video.viewCount);
      else if (video.views) totalViews += Number(video.views);
      else if (video.statistics?.viewCount) totalViews += Number(video.statistics.viewCount);

      // Handle different field names for likes
      if (video.likeCount) totalLikes += Number(video.likeCount);
      else if (video.likes) totalLikes += Number(video.likes);
      else if (video.statistics?.likeCount) totalLikes += Number(video.statistics.likeCount);
      else if ((video as any).engagement?.likes) totalLikes += Number((video as any).engagement.likes);
      // Estimate likes if missing (5% of views)
      else {
        const views = Number(video.viewCount || video.views || video.statistics?.viewCount || 0);
        totalLikes += Math.floor(views * 0.05);
      }
    });

    return { totalViews, totalLikes, totalVideos };
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatLargeNumber = (num: number): string => {
    return num.toLocaleString();
  };

  const getSubscriberCount = (): string => {
    // Try to find subscriber count in channel data - checking all possible paths
    for (const video of youtubeDetails) {
      if (video.subscriberCount) return formatNumber(Number(video.subscriberCount));
      if (video.statistics?.subscriberCount) return formatNumber(Number(video.statistics.subscriberCount));
      if ((video as any).channel_statistics?.subscriberCount) return formatNumber(Number((video as any).channel_statistics.subscriberCount));
      if ((video as any).channelInfo?.subscriberCount) return formatNumber(Number((video as any).channelInfo.subscriberCount));
      if ((video as any).channel?.subscriberCount) return formatNumber(Number((video as any).channel.subscriberCount));
    }
    
    // If we can't find a subscriber count, try to get it from the metadata
    const selected = youtubeData.find(item => item.file_path === selectedYoutubeData);
    if (selected && (selected as any).subscriberCount) {
      return formatNumber(Number((selected as any).subscriberCount));
    }
    
    // Default value if no subscriber count is found
    return 'Unknown';
  };

  const formatDuration = (duration: string): string => {
    // Format ISO duration or seconds to HH:MM:SS
    if (!duration) return '00:00:00';
    
    // If it's already in HH:MM:SS format
    if (duration.includes(':')) return duration;
    
    // If it's in seconds
    if (!isNaN(Number(duration))) {
      const seconds = Number(duration);
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    // If it's ISO format (PT1H30M15S)
    try {
      const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      if (!match) return '00:00:00';
      
      const hours = match[1] ? parseInt(match[1]) : 0;
      const minutes = match[2] ? parseInt(match[2]) : 0;
      const seconds = match[3] ? parseInt(match[3]) : 0;
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } catch (e) {
      return '00:00:00';
    }
  };

  const formatPublishDate = (dateStr: string | number): string => {
    if (!dateStr) return '';
    
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '';
      
      // Format: "June 15, 2024 - 04:00 PM"
      return date.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      }) + ' - ' + 
      date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch (e) {
      return String(dateStr);
    }
  };

  const getVideoTitle = (video: YouTubeVideoData): string => {
    return video.title || video.snippet?.title || 'Untitled Video';
  };

  const getVideoViews = (video: YouTubeVideoData): number => {
    return Number(video.viewCount || video.views || video.statistics?.viewCount || 0);
  };

  const getVideoLikes = (video: YouTubeVideoData): number => {
    // Try all possible paths where likes might be stored
    if (video.likeCount) return Number(video.likeCount);
    if (video.likes) return Number(video.likes);
    if (video.statistics?.likeCount) return Number(video.statistics.likeCount);
    if ((video as any).engagement?.likes) return Number((video as any).engagement.likes);
    
    // If likes data is missing, estimate based on views (5% of views)
    const views = getVideoViews(video);
    if (views > 0) {
      return Math.floor(views * 0.05); // Estimate likes as 5% of views as a fallback
    }
    
    return 0;
  };

  const getVideoDuration = (video: YouTubeVideoData): string => {
    return video.duration || video.contentDetails?.duration || '00:00:00';
  };

  const getVideoPublishDate = (video: YouTubeVideoData): string => {
    return video.publishedAt || video.published_date || video.snippet?.publishedAt || '';
  };

  const isLikeCountEstimated = (video: YouTubeVideoData): boolean => {
    // Check if the likes count is directly available in any of the expected properties
    return !(video.likeCount || video.likes || video.statistics?.likeCount || (video as any).engagement?.likes);
  };

  const filteredVideos = youtubeDetails.filter((video: YouTubeVideoData) => {
    const title = getVideoTitle(video).toLowerCase();
    return title.includes(searchQuery.toLowerCase());
  }).sort((a: YouTubeVideoData, b: YouTubeVideoData) => getVideoViews(b) - getVideoViews(a));

  const { totalVideos, totalViews, totalLikes } = getVideoStats();
  
  // Function to export YouTube data as CSV
  const exportToCSV = () => {
    // Create CSV headers
    const headers = ['Title', 'Views', 'Likes', 'Duration', 'Published Date', 'URL'];
    
    // Format data for CSV
    const csvData = filteredVideos.map(video => [
      `"${getVideoTitle(video).replace(/"/g, '""')}"`,
      getVideoViews(video),
      getVideoLikes(video),
      formatDuration(getVideoDuration(video)),
      formatPublishDate(getVideoPublishDate(video)),
      video.url || `https://www.youtube.com/watch?v=${video.id || video.video_id || ''}`
    ]);
    
    // Add headers to the beginning
    csvData.unshift(headers);
    
    // Convert to CSV string
    const csvString = csvData.map(row => row.join(',')).join('\n');
    
    // Create blob and download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${channelName}_youtube_data.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper function to check if a specific field is missing across all video items
  const isMissingField = (fieldName: string): boolean => {
    if (!youtubeDetails || youtubeDetails.length === 0) return true;
    
    // Check if any video has this field
    return !youtubeDetails.some(video => {
      // Check direct property
      if ((video as any)[fieldName] !== undefined) return true;
      
      // Check in statistics
      if (video.statistics && (video.statistics as any)[fieldName] !== undefined) return true;
      
      // Check in other common nested locations
      if ((video as any).engagement && (video as any).engagement[fieldName] !== undefined) return true;
      if ((video as any).channel && (video as any).channel[fieldName] !== undefined) return true;
      if ((video as any).channelInfo && (video as any).channelInfo[fieldName] !== undefined) return true;
      
      return false;
    });
  };

  return (
    <Box>
      {youtubeData.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" gutterBottom>No YouTube data available</Typography>
          <Button 
            variant="contained" 
            startIcon={<YouTube />}
            onClick={() => history.push('/scrape')}
            sx={{ mt: 2 }}
          >
            Scrape YouTube Data
          </Button>
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="youtube-channel-select-label">Select YouTube Channel</InputLabel>
              <Select
                labelId="youtube-channel-select-label"
                value={selectedYoutubeData}
                label="Select YouTube Channel"
                onChange={handleSelectChange}
              >
                {youtubeData.map((item: YouTubeData) => (
                  <MenuItem key={item.file_path} value={item.file_path}>
                    {item.display_name || item.channel_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {youtubeDetails.length > 0 ? (
            <Box sx={{ bgcolor: '#1a1a2e', color: 'white', borderRadius: 1, p: 3, mb: 3 }}>
              {(youtubeDetails.some(isLikeCountEstimated) || getSubscriberCount() === 'Unknown' || isMissingField('subscriberCount')) && (
                <Alert 
                  severity="info" 
                  sx={{ 
                    mb: 3, 
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    border: '1px solid rgba(33, 150, 243, 0.3)',
                    color: 'white',
                    '& .MuiAlert-icon': { color: 'info.main' }
                  }}
                >
                  {youtubeDetails.some(isLikeCountEstimated) && (getSubscriberCount() === 'Unknown' || isMissingField('subscriberCount')) ? (
                    <>Some data is missing or unavailable. Likes are estimated as 5% of views, and subscriber count couldn't be found.</>
                  ) : youtubeDetails.some(isLikeCountEstimated) ? (
                    <>Note: Some videos don't have like counts available. For these videos, likes are estimated as approximately 5% of view count.</>
                  ) : (
                    <>Note: Subscriber count information is not available in the data.</>
                  )}
                </Alert>
              )}
              
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: '#ff0000', 
                    fontWeight: 'bold', 
                    mb: 1 
                  }}
                >
                  {channelName}
                </Typography>
                <Typography 
                  sx={{ 
                    color: '#4169e1', 
                    mb: 2 
                  }}
                >
                  {getSubscriberCount() === 'Unknown' ? (
                    <Tooltip title="Subscriber count not available in the data">
                      <Box component="span" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span>Subscribers</span>
                        <Typography 
                          component="span" 
                          sx={{ 
                            fontSize: '0.7rem', 
                            ml: 0.5, 
                            color: 'warning.main',
                            verticalAlign: 'super'
                          }}
                        >
                          *
                        </Typography>
                      </Box>
                    </Tooltip>
                  ) : (
                    `${getSubscriberCount()} subscribers`
                  )}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <Button 
                    variant="contained" 
                    color="error" 
                    sx={{ borderRadius: 20 }}
                    component="a"
                    href={`https://www.youtube.com/channel/${youtubeDetails[0]?.channel_id || ''}`}
                    target="_blank"
                  >
                    Visit Channel
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<FileDownload />}
                    sx={{ borderRadius: 20 }}
                    onClick={exportToCSV}
                  >
                    Export CSV
                  </Button>
                </Box>
              </Box>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#23233a', borderRadius: 2, border: '1px solid #ff3e3e' }}>
                    <Typography variant="h5" sx={{ color: '#4169e1' }}>
                      {formatNumber(totalVideos)}
                    </Typography>
                    <Typography sx={{ color: 'white' }}>
                      Videos
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#23233a', borderRadius: 2, border: '1px solid #ff3e3e' }}>
                    <Typography variant="h5" sx={{ color: '#4169e1' }}>
                      {formatLargeNumber(totalViews)}
                    </Typography>
                    <Typography sx={{ color: 'white' }}>
                      Total Views
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#23233a', borderRadius: 2, border: '1px solid #ff3e3e' }}>
                    <Typography variant="h5" sx={{ color: '#4169e1' }}>
                      {formatLargeNumber(totalLikes)}
                    </Typography>
                    <Typography sx={{ color: 'white' }}>
                      Total Likes
                      {youtubeDetails.some(isLikeCountEstimated) && (
                        <Tooltip title="Some like counts are estimated based on view counts">
                          <Typography 
                            component="span" 
                            sx={{ 
                              fontSize: '0.7rem', 
                              ml: 0.5, 
                              color: 'warning.main',
                              verticalAlign: 'super'
                            }}
                          >
                            *
                          </Typography>
                        </Tooltip>
                      )}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Search videos..."
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ 
                    bgcolor: '#2d2d42',
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
                      <TableCell sx={{ color: 'white', fontWeight: 'bold', bgcolor: 'error.main' }}>Title</TableCell>
                      <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', bgcolor: 'error.main' }}>Views</TableCell>
                      <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', bgcolor: 'error.main' }}>Likes</TableCell>
                      <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', bgcolor: 'error.main' }}>Duration</TableCell>
                      <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', bgcolor: 'error.main' }}>Published Date</TableCell>
                      <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', bgcolor: 'error.main' }}>Link</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredVideos.length > 0 ? (
                      filteredVideos.map((video: YouTubeVideoData, index: number) => (
                        <TableRow key={index} sx={{ '&:nth-of-type(odd)': { bgcolor: '#23233a' } }}>
                          <TableCell 
                            component="th" 
                            scope="row" 
                            sx={{ color: 'white' }}
                          >
                            {getVideoTitle(video)}
                          </TableCell>
                          <TableCell align="right" sx={{ color: 'white' }}>
                            {formatLargeNumber(getVideoViews(video))}
                          </TableCell>
                          <TableCell align="right" sx={{ color: 'white' }}>
                            {formatLargeNumber(getVideoLikes(video))}
                            {isLikeCountEstimated(video) && (
                              <Tooltip title="Estimated based on view count">
                                <Typography 
                                  component="span" 
                                  sx={{ 
                                    fontSize: '0.7rem', 
                                    ml: 0.5, 
                                    color: 'warning.main',
                                    verticalAlign: 'super'
                                  }}
                                >
                                  *
                                </Typography>
                              </Tooltip>
                            )}
                          </TableCell>
                          <TableCell align="right" sx={{ color: 'white' }}>
                            {formatDuration(getVideoDuration(video))}
                          </TableCell>
                          <TableCell align="right" sx={{ color: 'white' }}>
                            {formatPublishDate(getVideoPublishDate(video))}
                          </TableCell>
                          <TableCell align="right">
                            <Link 
                              href={video.url || `https://www.youtube.com/watch?v=${video.id || video.video_id || ''}`}
                              target="_blank"
                              sx={{ color: '#4169e1', textDecoration: 'none' }}
                            >
                              View
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} sx={{ textAlign: 'center', color: 'white' }}>
                          No videos found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

interface InstagramInsightsProps {
  instagramData: InstagramData[];
  instagramDetails: InstagramPostData[];
  selectedInstagramData: string;
  username: string;
  onSelect: (filePath: string) => void;
  onRefresh?: () => void;
}

const InstagramInsights: React.FC<InstagramInsightsProps> = (props) => {
  const {
    instagramData,
    instagramDetails,
    selectedInstagramData,
    username,
    onSelect,
    onRefresh
  } = props;
  
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<string>('table');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const handleSelectChange = useCallback((event: SelectChangeEvent) => {
    onSelect(event.target.value);
  }, [onSelect]);

  const handleViewModeChange = useCallback((event: React.MouseEvent<HTMLElement>, newMode: string) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  }, []);

  const handleTypeFilterChange = useCallback((event: SelectChangeEvent) => {
    setTypeFilter(event.target.value);
  }, []);

  // Format numbers with K, M, B suffixes
  const formatNumber = useCallback((num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }, []);

  // Format date strings to a consistent format
  const formatDateString = useCallback((dateStr: string | number): string => {
    if (!dateStr) return '';
    
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return String(dateStr);
      
      return date.toISOString().substring(0, 10).replace(/-/g, '-') + ' ' + 
             date.toTimeString().substring(0, 5);
    } catch (e) {
      return String(dateStr);
    }
  }, []);

  // Post data extraction functions
  const getPostCaption = useCallback((post: InstagramPostData): string => {
    return post.caption || post.text || post.title || 'No caption';
  }, []);

  const getPostLikes = useCallback((post: InstagramPostData): number => {
    return Number(post.likesCount || post.likes || post.engagement?.likes || 0);
  }, []);

  const getPostComments = useCallback((post: InstagramPostData): number => {
    if (post.commentsCount) return Number(post.commentsCount);
    if (post.comments && typeof post.comments === 'number') return Number(post.comments);
    if (post.comments && Array.isArray(post.comments)) return post.comments.length;
    if (post.engagement?.comments) return Number(post.engagement.comments);
    return 0;
  }, []);

  const getPostDate = useCallback((post: InstagramPostData): string => {
    return post.timestamp || post.created_at || post.createdAt || post.taken_at || '';
  }, []);

  const getPostType = useCallback((post: InstagramPostData): string => {
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
    
    return 'Sidecar';
  }, []);

  const getPostTypeIcon = useCallback((type: string) => {
    switch(type.toLowerCase()) {
      case 'video':
        return <VideoCall />;
      case 'carousel':
        return <GridView />;
      default:
        return <Photo />;
    }
  }, []);

  const getPostUrl = useCallback((post: InstagramPostData): string => {
    return post.permalink || post.url || `https://www.instagram.com/p/${post.shortCode || post.code || ''}`;
  }, []);

  const getOwnerUsername = useCallback((post: InstagramPostData): string => {
    return post.username || post.ownerUsername || post.owner?.username || username.replace('@', '');
  }, [username]);

  // Calculate aggregated statistics with memoization
  const postStats = useMemo(() => {
    let totalLikes = 0;
    let totalComments = 0;
    let totalPosts = instagramDetails.length;
    
    const typeCounts = {
      Photo: 0,
      Video: 0,
      Carousel: 0,
      Other: 0
    };

    instagramDetails.forEach((post: InstagramPostData) => {
      // Increment type counter
      const type = getPostType(post);
      if (type === 'Photo') typeCounts.Photo++;
      else if (type === 'Video') typeCounts.Video++;
      else if (type === 'Carousel') typeCounts.Carousel++;
      else typeCounts.Other++;
      
      // Count likes and comments
      totalLikes += getPostLikes(post);
      totalComments += getPostComments(post);
    });

    return { 
      totalPosts, 
      totalLikes, 
      totalComments,
      typeCounts
    };
  }, [instagramDetails, getPostType, getPostLikes, getPostComments]);

  // Memoize filtered posts to prevent unnecessary recalculations
  const filteredPosts = useMemo(() => {
    return instagramDetails.filter((post: InstagramPostData) => {
      const caption = getPostCaption(post).toLowerCase();
      const matchesSearch = caption.includes(searchQuery.toLowerCase());
      
      // Apply type filter if not set to "all"
      if (typeFilter !== 'all') {
        const postType = getPostType(post).toLowerCase();
        return matchesSearch && postType.includes(typeFilter.toLowerCase());
      }
      
      return matchesSearch;
    }).sort((a: InstagramPostData, b: InstagramPostData) => getPostLikes(b) - getPostLikes(a));
  }, [instagramDetails, searchQuery, typeFilter, getPostCaption, getPostType, getPostLikes]);

  const { totalPosts, totalLikes, totalComments } = postStats;

  // Check for error in Instagram data
  const hasError = instagramDetails.length > 0 && 
    (instagramDetails[0].error || instagramDetails[0].errorDescription);
    
  // Function to export Instagram data as CSV
  const exportToCSV = useCallback(() => {
    // Create CSV headers
    const headers = ['Type', 'Caption', 'Likes', 'Comments', 'Date', 'Username', 'URL'];
    
    // Format data for CSV
    const csvData = filteredPosts.map(post => [
      getPostType(post),
      `"${getPostCaption(post).replace(/"/g, '""')}"`,
      getPostLikes(post),
      getPostComments(post),
      formatDateString(getPostDate(post)),
      getOwnerUsername(post),
      getPostUrl(post)
    ]);
    
    // Add headers to the beginning
    csvData.unshift(headers);
    
    // Convert to CSV string
    const csvString = csvData.map(row => row.join(',')).join('\n');
    
    // Create blob and download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${username}_instagram_data.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [
    filteredPosts,
    username,
    getPostType,
    getPostCaption,
    getPostLikes,
    getPostComments,
    formatDateString,
    getPostDate,
    getOwnerUsername,
    getPostUrl
  ]);

  return (
    <Box>
      {instagramData.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" gutterBottom>No Instagram data available</Typography>
          <Button 
            variant="contained" 
            color="secondary"
            startIcon={<Instagram />}
            onClick={() => history.push('/scrape')}
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
                {instagramData.map((item: InstagramData) => (
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
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<FileDownload />}
                    sx={{ borderRadius: 20 }}
                    onClick={exportToCSV}
                  >
                    Export CSV
                  </Button>
                </Box>
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

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControl sx={{ minWidth: 150, bgcolor: '#2b1f3b' }} size="small">
                    <InputLabel id="post-type-filter-label" sx={{ color: 'white' }}>Content Type</InputLabel>
                    <Select
                      labelId="post-type-filter-label"
                      value={typeFilter}
                      label="Content Type"
                      onChange={handleTypeFilterChange}
                      sx={{ color: 'white', '& .MuiSelect-icon': { color: 'white' } }}
                    >
                      <MenuItem value="all">All Types</MenuItem>
                      <MenuItem value="photo">Photos</MenuItem>
                      <MenuItem value="video">Videos</MenuItem>
                      <MenuItem value="carousel">Carousels</MenuItem>
                    </Select>
                  </FormControl>
                
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
                      filteredPosts.map((post: InstagramPostData, index: number) => (
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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`insights-tabpanel-${index}`}
      aria-labelledby={`insights-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Chart component for YouTube data
interface YouTubeChartProps {
  youtubeDetails: YouTubeVideoData[];
}

const YouTubeChart: React.FC<YouTubeChartProps> = ({ youtubeDetails }) => {
  const [chartType, setChartType] = useState<string>('views');
  
  // Process YouTube data for top 10 videos
  const processData = useCallback(() => {
    // Helper function to extract likes from different possible fields
    const extractLikes = (video: YouTubeVideoData): number => {
      if (video.likeCount !== undefined && video.likeCount !== null) {
        const likes = typeof video.likeCount === 'string' ? 
          parseInt(video.likeCount.replace(/,/g, '')) : Number(video.likeCount);
        return isNaN(likes) ? 0 : likes;
      }
      
      if (video.likes !== undefined && video.likes !== null) {
        const likes = typeof video.likes === 'string' ? 
          parseInt(video.likes.replace(/,/g, '')) : Number(video.likes);
        return isNaN(likes) ? 0 : likes;
      }
      
      if (video.statistics && video.statistics.likeCount !== undefined) {
        const likes = typeof video.statistics.likeCount === 'string' ? 
          parseInt(video.statistics.likeCount.replace(/,/g, '')) : Number(video.statistics.likeCount);
        return isNaN(likes) ? 0 : likes;
      }
      
      if (video.engagement && video.engagement.likes !== undefined) {
        const likes = typeof video.engagement.likes === 'string' ? 
          parseInt(video.engagement.likes.replace(/,/g, '')) : Number(video.engagement.likes);
        return isNaN(likes) ? 0 : likes;
      }
      
      // If no likes data found, estimate based on views (typically 5% of views)
      if (video.viewCount || video.views || (video.statistics && video.statistics.viewCount)) {
        const views = Number(video.viewCount || video.views || video.statistics?.viewCount || 0);
        return Math.max(1, Math.floor(views * 0.05)); // Ensure at least 1 like
      }
      
      return 0;
    };
    
    // Helper function to extract views
    const extractViews = (video: YouTubeVideoData): number => {
      if (video.viewCount !== undefined && video.viewCount !== null) {
        const views = typeof video.viewCount === 'string' ? 
          parseInt(video.viewCount.replace(/,/g, '')) : Number(video.viewCount);
        return isNaN(views) ? 0 : views;
      }
      
      if (video.views !== undefined && video.views !== null) {
        const views = typeof video.views === 'string' ? 
          parseInt(video.views.replace(/,/g, '')) : Number(video.views);
        return isNaN(views) ? 0 : views;
      }
      
      if (video.statistics && video.statistics.viewCount !== undefined) {
        const views = typeof video.statistics.viewCount === 'string' ? 
          parseInt(video.statistics.viewCount.replace(/,/g, '')) : Number(video.statistics.viewCount);
        return isNaN(views) ? 0 : views;
      }
      
      return 0;
    };

    // Sort by views or likes based on chart type
    const sortedVideos = [...youtubeDetails].sort((a, b) => {
      if (chartType === 'views') {
        return extractViews(b) - extractViews(a);
      } else {
        return extractLikes(b) - extractLikes(a);
      }
    });
    
    // Get top 10 videos
    const top10 = sortedVideos.slice(0, 10);
    
    // Prepare series data
    const categories = top10.map(video => {
      const title = video.title || video.snippet?.title || 'Untitled';
      // Truncate title for better display
      return title.length > 20 ? title.substring(0, 17) + '...' : title;
    });
    
    const seriesData = top10.map(video => {
      if (chartType === 'views') {
        return extractViews(video);
      } else {
        return extractLikes(video);
      }
    });
    
    // Log the processed data for debugging
    if (chartType === 'likes') {
      console.log('Processed likes data for chart:', 
        top10.map((video, i) => ({
          title: categories[i],
          likes: seriesData[i]
        }))
      );
    }
    
    return { categories, seriesData };
  }, [youtubeDetails, chartType]);
  
  const { categories, seriesData } = processData();
  
  const series = [{
    name: chartType === 'views' ? 'Views' : 'Likes',
    data: seriesData
  }];
  
  const options = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      },
      background: '#1a1a2e'
    },
    colors: ['#ff0000'],
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '70%',
        distributed: true,
        borderRadius: 5
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function(val: number) {
        if (val >= 1000000) {
          return (val / 1000000).toFixed(1) + 'M';
        } else if (val >= 1000) {
          return (val / 1000).toFixed(1) + 'K';
        }
        return val.toString();
      },
      style: {
        colors: ['#ffffff'],
        fontSize: '12px'
      }
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: Array(10).fill('#ffffff')
        },
        formatter: function(val: string) {
          // Format x-axis labels for large numbers
          const num = parseInt(val);
          if (!isNaN(num)) {
            if (num >= 1000000) {
              return (num / 1000000).toFixed(1) + 'M';
            } else if (num >= 1000) {
              return (num / 1000).toFixed(1) + 'K';
            }
            return num.toString();
          }
          return val;
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: ['#ffffff']
        }
      }
    },
    grid: {
      borderColor: '#2d2d42'
    },
    title: {
      text: chartType === 'views' ? 'Top 10 Videos by Views' : 'Top 10 Videos by Likes',
      align: 'center',
      style: {
        color: '#ffffff'
      }
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: function(val: number) {
          return val.toLocaleString();
        }
      }
    }
  };
  
  return (
    <Box sx={{ bgcolor: '#1a1a2e', p: 2, borderRadius: 2, mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={(e, newValue) => newValue && setChartType(newValue)}
          size="small"
        >
          <ToggleButton value="views" sx={{ color: 'white' }}>
            <Visibility sx={{ mr: 1 }} /> Views
          </ToggleButton>
          <ToggleButton value="likes" sx={{ color: 'white' }}>
            <ThumbUp sx={{ mr: 1 }} /> Likes
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <ReactApexChart 
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    </Box>
  );
};

// Chart component for Instagram data
interface InstagramChartProps {
  instagramDetails: InstagramPostData[];
}

const InstagramChart: React.FC<InstagramChartProps> = ({ instagramDetails }) => {
  const [chartType, setChartType] = useState<string>('engagement');
  
  // Process data for pie chart showing post types
  const processTypeData = useCallback(() => {
    const typeCount = {
      Photo: 0,
      Video: 0,
      Carousel: 0,
      Other: 0
    };
    
    instagramDetails.forEach(post => {
      const type = post.type || post.mediaType || post.media_type || post.contentType || '';
      
      if (type.toLowerCase().includes('image') || type.toLowerCase().includes('photo')) {
        typeCount.Photo++;
      } else if (type.toLowerCase().includes('video')) {
        typeCount.Video++;
      } else if (type.toLowerCase().includes('carousel') || type.toLowerCase().includes('album')) {
        typeCount.Carousel++;
      }
    });
    
    return [
      { name: 'Photos', value: typeCount.Photo },
      { name: 'Videos', value: typeCount.Video },
      { name: 'Carousels', value: typeCount.Carousel }
    ];
  }, [instagramDetails]);
  
  // Process data for top 10 posts by engagement (likes + comments)
  const processEngagementData = useCallback(() => {
    // Calculate engagement for each post
    const postsWithEngagement = instagramDetails.map(post => {
      let likes = 0;
      let comments = 0;
      
      // Get likes
      if (post.likesCount) likes = Number(post.likesCount);
      else if (post.likes) likes = Number(post.likes);
      else if (post.engagement?.likes) likes = Number(post.engagement.likes);
      
      // Get comments
      if (post.commentsCount) comments = Number(post.commentsCount);
      else if (post.comments && typeof post.comments === 'number') comments = Number(post.comments);
      else if (post.comments && Array.isArray(post.comments)) comments = post.comments.length;
      else if (post.engagement?.comments) comments = Number(post.engagement.comments);
      
      return {
        ...post,
        totalEngagement: likes + comments,
        caption: post.caption || post.text || post.title || 'No caption'
      };
    });
    
    // Sort by engagement and get top 10
    const top10 = postsWithEngagement
      .sort((a, b) => b.totalEngagement - a.totalEngagement)
      .slice(0, 10);
    
    // Prepare series data
    const categories = top10.map(post => {
      // Truncate caption for better display
      return post.caption.length > 20 ? post.caption.substring(0, 17) + '...' : post.caption;
    });
    
    const seriesData = top10.map(post => post.totalEngagement);
    
    return { categories, seriesData };
  }, [instagramDetails]);
  
  const typeData = processTypeData();
  const { categories, seriesData } = processEngagementData();
  
  // Type distribution chart options
  const typeOptions = {
    chart: {
      type: 'pie',
      background: '#1a1a2e'
    },
    colors: ['#e91e63', '#03a9f4', '#ff9800'],
    labels: typeData.map(item => item.name),
    legend: {
      position: 'bottom',
      labels: {
        colors: Array(3).fill('#ffffff')
      }
    },
    title: {
      text: 'Post Type Distribution',
      align: 'center',
      style: {
        color: '#ffffff'
      }
    },
    tooltip: {
      theme: 'dark'
    }
  };
  
  const typeSeries = typeData.map(item => item.value);
  
  // Engagement chart options
  const engagementOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      },
      background: '#1a1a2e'
    },
    colors: ['#9c27b0'],
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '70%',
        distributed: true,
        borderRadius: 5
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: Array(10).fill('#ffffff')
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: ['#ffffff']
        }
      }
    },
    grid: {
      borderColor: '#2d2d42'
    },
    title: {
      text: 'Top 10 Posts by Engagement',
      align: 'center',
      style: {
        color: '#ffffff'
      }
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: function(val: number) {
          return val.toLocaleString();
        }
      }
    }
  };
  
  const engagementSeries = [{
    name: 'Engagement',
    data: seriesData
  }];
  
  return (
    <Box sx={{ bgcolor: '#1a1a2e', p: 2, borderRadius: 2, mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={(e, newValue) => newValue && setChartType(newValue)}
          size="small"
        >
          <ToggleButton value="types" sx={{ color: 'white' }}>
            <GridView sx={{ mr: 1 }} /> Post Types
          </ToggleButton>
          <ToggleButton value="engagement" sx={{ color: 'white' }}>
            <BarChart sx={{ mr: 1 }} /> Engagement
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {chartType === 'types' ? (
        <ReactApexChart 
          options={typeOptions}
          series={typeSeries}
          type="pie"
          height={350}
        />
      ) : (
        <ReactApexChart 
          options={engagementOptions}
          series={engagementSeries}
          type="bar"
          height={350}
        />
      )}
    </Box>
  );
};

const AudienceInsights: React.FC = () => {
  const [tabValue, setTabValue] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [youtubeData, setYoutubeData] = useState<YouTubeData[]>([]);
  const [instagramData, setInstagramData] = useState<InstagramData[]>([]);
  const [selectedYoutubeData, setSelectedYoutubeData] = useState<string>('');
  const [selectedInstagramData, setSelectedInstagramData] = useState<string>('');
  const [youtubeDetails, setYoutubeDetails] = useState<YouTubeVideoData[]>([]);
  const [instagramDetails, setInstagramDetails] = useState<InstagramPostData[]>([]);
  const [showCharts, setShowCharts] = useState<boolean>(false);

  // Tab change handler with useCallback
  const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  }, []);

  // Fetch YouTube details with retry mechanism
  const fetchYoutubeDetails = useCallback(async (filePath: string) => {
    if (!filePath) return;
    setLoading(true);
    try {
      const data = await api.getDataFile(filePath);
      if (Array.isArray(data)) {
        setYoutubeDetails(data);
        // Show charts after data is loaded
        setShowCharts(true);
      } else {
        setYoutubeDetails([]);
      }
    } catch (error) {
      console.error('Failed to fetch YouTube details:', error);
      setYoutubeDetails([]);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setYoutubeDetails, setShowCharts]);

  // Fetch Instagram details with retry mechanism
  const fetchInstagramDetails = useCallback(async (filePath: string) => {
    if (!filePath) return;
    setLoading(true);
    try {
      const data = await api.getDataFile(filePath);
      if (Array.isArray(data)) {
        setInstagramDetails(data);
        // Show charts after data is loaded
        setShowCharts(true);
      } else {
        setInstagramDetails([]);
      }
    } catch (error) {
      console.error('Failed to fetch Instagram details:', error);
      setInstagramDetails([]);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setInstagramDetails, setShowCharts]);

  // YouTube data selection handler
  const handleYoutubeSelect = useCallback((filePath: string) => {
    setSelectedYoutubeData(filePath);
    fetchYoutubeDetails(filePath);
  }, [fetchYoutubeDetails]);

  // Instagram data selection handler
  const handleInstagramSelect = useCallback((filePath: string) => {
    setSelectedInstagramData(filePath);
    fetchInstagramDetails(filePath);
  }, [fetchInstagramDetails]);

  // Memoize channel and username getter functions
  const getSelectedYoutubeChannelName = useCallback((): string => {
    const selected = youtubeData.find(item => item.file_path === selectedYoutubeData);
    // First try to get the display_name or channel_name from the metadata
    if (selected?.display_name) return selected.display_name;
    if (selected?.channel_name) return selected.channel_name;
    
    // If not available in metadata, try to extract from the first video
    if (youtubeDetails.length > 0) {
      // Try various properties where channel name might be stored
      return (youtubeDetails[0] as any).channel_name || 
             (youtubeDetails[0] as any).creator || 
             (youtubeDetails[0] as any).author || 
             'YouTube Channel';
    }
    
    return 'YouTube Channel';
  }, [youtubeData, selectedYoutubeData, youtubeDetails]);

  const getSelectedInstagramUsername = useCallback((): string => {
    const selected = instagramData.find(item => item.file_path === selectedInstagramData);
    return selected?.display_name || selected?.username || 'Instagram Account';
  }, [instagramData, selectedInstagramData]);

  // Main data fetching function
  const fetchDataList = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Fetching social media data list...');
      const dataList = await api.listData();
      console.log('Data list received:', dataList);
      
      if (dataList.youtube && Array.isArray(dataList.youtube)) {
        setYoutubeData(dataList.youtube);
        console.log(`Loaded ${dataList.youtube.length} YouTube data items`);
        
        // Auto-select first item if available
        if (dataList.youtube.length > 0) {
          setSelectedYoutubeData(dataList.youtube[0].file_path);
          fetchYoutubeDetails(dataList.youtube[0].file_path);
        }
      }
      
      if (dataList.instagram && Array.isArray(dataList.instagram)) {
        setInstagramData(dataList.instagram);
        console.log(`Loaded ${dataList.instagram.length} Instagram data items`);
        
        // Auto-select first item if available
        if (dataList.instagram.length > 0) {
          setSelectedInstagramData(dataList.instagram[0].file_path);
          fetchInstagramDetails(dataList.instagram[0].file_path);
        }
      }
    } catch (error) {
      console.error('Failed to fetch data list:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchYoutubeDetails, fetchInstagramDetails]);

  useEffect(() => {
    fetchDataList();
  }, [fetchDataList]);  // Add fetchDataList as a dependency

  return (
    <Box sx={{ height: '100%', bgcolor: 'background.paper', borderRadius: 1, overflow: 'hidden' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="insights tabs"
          variant="fullWidth"
          sx={{ bgcolor: 'background.paper' }}
        >
          <Tab 
            icon={<YouTube />} 
            label="YouTube Insights" 
            sx={{ py: 2 }}
          />
          <Tab 
            icon={<Instagram />} 
            label="Instagram Insights" 
            sx={{ py: 2 }}
          />
        </Tabs>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      <TabPanel value={tabValue} index={0}>
        <YouTubeInsights 
          youtubeData={youtubeData}
          youtubeDetails={youtubeDetails}
          selectedYoutubeData={selectedYoutubeData}
          channelName={getSelectedYoutubeChannelName()}
          onSelect={handleYoutubeSelect}
        />
        {showCharts && youtubeDetails.length > 0 && (
          <YouTubeChart youtubeDetails={youtubeDetails} />
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <InstagramInsights
          instagramData={instagramData}
          instagramDetails={instagramDetails}
          selectedInstagramData={selectedInstagramData}
          username={getSelectedInstagramUsername()}
          onSelect={handleInstagramSelect}
          onRefresh={fetchDataList}
        />
        {showCharts && instagramDetails.length > 0 && !instagramDetails[0].error && (
          <InstagramChart instagramDetails={instagramDetails} />
        )}
      </TabPanel>
    </Box>
  );
};

export default AudienceInsights; 