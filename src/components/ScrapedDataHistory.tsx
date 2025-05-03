import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Divider,
  Paper,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge
} from '@mui/material';
import {
  YouTube,
  Instagram,
  CalendarMonth,
  Visibility,
  ThumbUp,
  Comment,
  ExpandMore,
  VideoLibrary,
  Photo,
  History
} from '@mui/icons-material';
import api, { YouTubeData, InstagramData } from '../services/api';
import { format } from 'date-fns';

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
      id={`history-tabpanel-${index}`}
      aria-labelledby={`history-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

const ScrapedDataHistory: React.FC<{
  onSelectYouTubeData: (filePath: string) => void;
  onSelectInstagramData: (filePath: string) => void;
}> = ({ onSelectYouTubeData, onSelectInstagramData }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [youtubeData, setYoutubeData] = useState<YouTubeData[]>([]);
  const [instagramData, setInstagramData] = useState<InstagramData[]>([]);
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    fetchDataList();
  }, []);

  const fetchDataList = async () => {
    setLoading(true);
    try {
      const dataList = await api.listData();
      setYoutubeData(dataList.youtube);
      setInstagramData(dataList.instagram);
    } catch (error) {
      console.error('Failed to fetch data list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const formatDate = (timestamp: number) => {
    try {
      return format(new Date(timestamp * 1000), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return 'Unknown date';
    }
  };

  return (
    <Card sx={{ bgcolor: theme.palette.background.paper, mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <History sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6">Previously Scraped Data</Typography>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="scraped data history tabs"
              sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
            >
              <Tab 
                icon={<YouTube />} 
                iconPosition="start" 
                label={`YouTube (${youtubeData.length})`}
                sx={{ textTransform: 'none' }}
              />
              <Tab 
                icon={<Instagram />} 
                iconPosition="start" 
                label={`Instagram (${instagramData.length})`}
                sx={{ textTransform: 'none' }}
              />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              {youtubeData.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                  No YouTube data available. Try scraping a channel first.
                </Typography>
              ) : (
                <List sx={{ width: '100%', bgcolor: 'background.paper' }} component={Paper} variant="outlined">
                  {youtubeData.map((item, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <Divider component="li" />}
                      <ListItem
                        secondaryAction={
                          <Chip 
                            label={`${item.item_count} videos`} 
                            size="small" 
                            color="primary" 
                            icon={<VideoLibrary />}
                          />
                        }
                      >
                        <ListItemButton onClick={() => onSelectYouTubeData(item.file_path)}>
                          <ListItemIcon>
                            <YouTube color="error" />
                          </ListItemIcon>
                          <ListItemText
                            primary={item.channel_name}
                            secondary={
                              <React.Fragment>
                                <Typography
                                  sx={{ display: 'inline' }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  Scraped: {formatDate(item.created)}
                                </Typography>
                              </React.Fragment>
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                      
                      <Accordion
                        disableGutters
                        elevation={0}
                        sx={{
                          '&:before': {
                            display: 'none',
                          },
                          bgcolor: 'background.paper'
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMore />}
                          sx={{ pl: 2 }}
                        >
                          <Typography variant="body2" color="text.secondary">Preview (5 videos)</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <List dense sx={{ pl: 2 }}>
                            {item.data.map((video, vIdx) => (
                              <ListItem key={vIdx} sx={{ pl: 2, borderLeft: `2px solid ${theme.palette.divider}` }}>
                                <ListItemText
                                  primary={video.title}
                                  secondary={
                                    <Box sx={{ display: 'flex', gap: 2, mt: 0.5, flexWrap: 'wrap' }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Visibility fontSize="small" sx={{ mr: 0.5, color: theme.palette.text.secondary }} />
                                        <Typography variant="caption" color="text.secondary">
                                          {video.viewCount?.toLocaleString() || 0} views
                                        </Typography>
                                      </Box>
                                      
                                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <ThumbUp fontSize="small" sx={{ mr: 0.5, color: theme.palette.text.secondary }} />
                                        <Typography variant="caption" color="text.secondary">
                                          {video.likes?.toLocaleString() || 0} likes
                                        </Typography>
                                      </Box>
                                      
                                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CalendarMonth fontSize="small" sx={{ mr: 0.5, color: theme.palette.text.secondary }} />
                                        <Typography variant="caption" color="text.secondary">
                                          {video.date}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  }
                                />
                              </ListItem>
                            ))}
                          </List>
                        </AccordionDetails>
                      </Accordion>
                    </React.Fragment>
                  ))}
                </List>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              {instagramData.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                  No Instagram data available. Try scraping a profile first.
                </Typography>
              ) : (
                <List sx={{ width: '100%', bgcolor: 'background.paper' }} component={Paper} variant="outlined">
                  {instagramData.map((item, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <Divider component="li" />}
                      <ListItem
                        secondaryAction={
                          <Chip 
                            label={`${item.item_count} posts`} 
                            size="small" 
                            color="secondary" 
                            icon={<Photo />}
                          />
                        }
                      >
                        <ListItemButton onClick={() => onSelectInstagramData(item.file_path)}>
                          <ListItemIcon>
                            <Instagram color="secondary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={`@${item.username}`}
                            secondary={
                              <React.Fragment>
                                <Typography
                                  sx={{ display: 'inline' }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  Scraped: {formatDate(item.created)}
                                </Typography>
                              </React.Fragment>
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                      
                      <Accordion
                        disableGutters
                        elevation={0}
                        sx={{
                          '&:before': {
                            display: 'none',
                          },
                          bgcolor: 'background.paper'
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMore />}
                          sx={{ pl: 2 }}
                        >
                          <Typography variant="body2" color="text.secondary">Preview (5 posts)</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <List dense sx={{ pl: 2 }}>
                            {item.data.map((post, pIdx) => (
                              <ListItem key={pIdx} sx={{ pl: 2, borderLeft: `2px solid ${theme.palette.divider}` }}>
                                <ListItemText
                                  primary={
                                    <Typography noWrap variant="body2" sx={{ maxWidth: '100%' }}>
                                      {post.caption || `Post ${pIdx + 1}`}
                                    </Typography>
                                  }
                                  secondary={
                                    <Box sx={{ display: 'flex', gap: 2, mt: 0.5, flexWrap: 'wrap' }}>
                                      <Badge 
                                        badgeContent={post.type} 
                                        color="primary"
                                        sx={{ mr: 2 }}
                                      />
                                        
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
                                  }
                                />
                              </ListItem>
                            ))}
                          </List>
                        </AccordionDetails>
                      </Accordion>
                    </React.Fragment>
                  ))}
                </List>
              )}
            </TabPanel>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ScrapedDataHistory; 