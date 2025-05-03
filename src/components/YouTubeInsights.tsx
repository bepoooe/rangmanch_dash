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
  SelectChangeEvent
} from '@mui/material';
import {
  Search,
  YouTube
} from '@mui/icons-material';
import { YouTubeData } from '../services/api';

interface YouTubeInsightsProps {
  youtubeData: YouTubeData[];
  youtubeDetails: any[];
  selectedYoutubeData: string;
  channelName: string;
  onSelect: (filePath: string) => void;
  onRefresh: () => void;
}

const YouTubeInsights: React.FC<YouTubeInsightsProps> = ({
  youtubeData,
  youtubeDetails,
  selectedYoutubeData,
  channelName,
  onSelect,
  onRefresh
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSelectChange = (event: SelectChangeEvent) => {
    onSelect(event.target.value);
  };

  const getVideoStats = () => {
    let totalViews = 0;
    let totalLikes = 0;
    let totalVideos = youtubeDetails.length;

    youtubeDetails.forEach(video => {
      // Handle different field names for views
      if (video.viewCount) totalViews += Number(video.viewCount);
      else if (video.views) totalViews += Number(video.views);
      else if (video.statistics?.viewCount) totalViews += Number(video.statistics.viewCount);

      // Handle different field names for likes
      if (video.likeCount) totalLikes += Number(video.likeCount);
      else if (video.likes) totalLikes += Number(video.likes);
      else if (video.statistics?.likeCount) totalLikes += Number(video.statistics.likeCount);
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
    // Try to find subscriber count in channel data
    for (const video of youtubeDetails) {
      if (video.subscriberCount) return formatNumber(Number(video.subscriberCount));
      if (video.statistics?.subscriberCount) return formatNumber(Number(video.statistics.subscriberCount));
      if (video.channel_statistics?.subscriberCount) return formatNumber(Number(video.channel_statistics.subscriberCount));
    }
    return '0';
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

  const getVideoTitle = (video: any): string => {
    return video.title || video.snippet?.title || 'Untitled Video';
  };

  const getVideoViews = (video: any): number => {
    return Number(video.viewCount || video.views || video.statistics?.viewCount || 0);
  };

  const getVideoLikes = (video: any): number => {
    return Number(video.likeCount || video.likes || video.statistics?.likeCount || 0);
  };

  const getVideoDuration = (video: any): string => {
    return video.duration || video.contentDetails?.duration || '00:00:00';
  };

  const getVideoPublishDate = (video: any): string => {
    return video.publishedAt || video.published_date || video.snippet?.publishedAt || '';
  };

  const filteredVideos = youtubeDetails.filter(video => {
    const title = getVideoTitle(video).toLowerCase();
    return title.includes(searchQuery.toLowerCase());
  }).sort((a, b) => getVideoViews(b) - getVideoViews(a));

  const { totalVideos, totalViews, totalLikes } = getVideoStats();

  return (
    <Box>
      {youtubeData.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" gutterBottom>No YouTube data available</Typography>
          <Button 
            variant="contained" 
            startIcon={<YouTube />}
            onClick={() => window.location.href = '/scrape'}
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
                {youtubeData.map((item) => (
                  <MenuItem key={item.file_path} value={item.file_path}>
                    {item.display_name || item.channel_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {youtubeDetails.length > 0 ? (
            <Box sx={{ bgcolor: '#1a1a2e', color: 'white', borderRadius: 1, p: 3, mb: 3 }}>
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
                  {getSubscriberCount()} subscribers
                </Typography>
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
                      filteredVideos.map((video, index) => (
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

export default YouTubeInsights; 