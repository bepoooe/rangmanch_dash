import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  TextField, 
  Typography, 
  Tab, 
  Tabs, 
  CircularProgress,
  Alert,
  Snackbar,
  Grid,
  useTheme,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import { YouTube, Instagram } from '@mui/icons-material';
import api, { Task } from '../services/api';

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
      id={`social-tabpanel-${index}`}
      aria-labelledby={`social-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const SocialDataScraper: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [instagramUsername, setInstagramUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [polling, setPolling] = useState<NodeJS.Timeout | null>(null);

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      if (polling) {
        clearInterval(polling);
      }
    };
  }, [polling]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const startPolling = (taskId: string) => {
    // Stop any existing polling
    if (polling) {
      clearInterval(polling);
    }

    // Start new polling
    const interval = setInterval(async () => {
      try {
        const taskStatus = await api.getTaskStatus(taskId);
        setCurrentTask(taskStatus);

        if (taskStatus.status !== 'running') {
          // Task completed or errored - stop polling
          clearInterval(interval);
          setPolling(null);
          setLoading(false);

          if (taskStatus.status === 'completed') {
            setSuccess(`Successfully scraped data: ${taskStatus.message}`);
          } else if (taskStatus.status === 'error') {
            setError(`Error: ${taskStatus.message}`);
          }
        }
      } catch (err) {
        clearInterval(interval);
        setPolling(null);
        setLoading(false);
        setError('Failed to fetch task status');
      }
    }, 2000);

    setPolling(interval);
  };

  const handleYoutubeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrl) return;

    setLoading(true);
    setError(null);
    setSuccess(null);
    setCurrentTask(null);

    try {
      const task = await api.scrapeYouTube(youtubeUrl);
      setCurrentTask(task);
      startPolling(task.task_id);
    } catch (err) {
      setLoading(false);
      setError('Failed to start YouTube scraping');
    }
  };

  const handleInstagramSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instagramUsername) return;

    setLoading(true);
    setError(null);
    setSuccess(null);
    setCurrentTask(null);

    try {
      const task = await api.scrapeInstagram(instagramUsername);
      setCurrentTask(task);
      startPolling(task.task_id);
    } catch (err) {
      setLoading(false);
      setError('Failed to start Instagram scraping');
    }
  };

  return (
    <Card sx={{ height: '100%', bgcolor: theme.palette.background.paper }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Social Media Data Scraper
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Enter a URL or username to scrape data from social media platforms
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="social media tabs"
            variant="fullWidth"
          >
            <Tab 
              label="YouTube" 
              icon={<YouTube />} 
              iconPosition="start"
              sx={{ 
                minHeight: 60,
                textTransform: 'none',
                fontSize: '0.9rem',
                fontWeight: 500
              }}
            />
            <Tab 
              label="Instagram" 
              icon={<Instagram />} 
              iconPosition="start"
              sx={{ 
                minHeight: 60,
                textTransform: 'none',
                fontSize: '0.9rem',
                fontWeight: 500
              }}
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <form onSubmit={handleYoutubeSubmit}>
            <TextField
              fullWidth
              label="YouTube Channel URL or Search Query"
              variant="outlined"
              placeholder="https://www.youtube.com/c/channelname or search term"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              disabled={loading}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading || !youtubeUrl}
              sx={{ height: 48 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Scrape YouTube Data'}
            </Button>
          </form>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <form onSubmit={handleInstagramSubmit}>
            <TextField
              fullWidth
              label="Instagram Username"
              variant="outlined"
              placeholder="username (without @)"
              value={instagramUsername}
              onChange={(e) => setInstagramUsername(e.target.value)}
              disabled={loading}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading || !instagramUsername}
              sx={{ height: 48 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Scrape Instagram Data'}
            </Button>
          </form>
        </TabPanel>

        {currentTask && (
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Task Status
            </Typography>
            
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
                <Typography variant="body2">
                  {currentTask.message}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} sx={{ textAlign: 'right' }}>
                <Chip 
                  label={currentTask.status} 
                  color={
                    currentTask.status === 'completed' ? 'success' : 
                    currentTask.status === 'error' ? 'error' : 'primary'
                  }
                  size="small"
                />
              </Grid>
            </Grid>

            {currentTask.status === 'running' && (
              <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
                <CircularProgress size={30} />
              </Box>
            )}

            {currentTask.data && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Results
                </Typography>
                <List dense>
                  {currentTask.status === 'completed' && currentTask.data.channel_name && (
                    <ListItem>
                      <ListItemText 
                        primary={`Channel: ${currentTask.data.channel_name}`} 
                        secondary={`Items: ${currentTask.data.item_count}`}
                      />
                    </ListItem>
                  )}
                  {currentTask.status === 'completed' && currentTask.data.username && (
                    <ListItem>
                      <ListItemText 
                        primary={`Username: ${currentTask.data.username}`} 
                        secondary={`Items: ${currentTask.data.item_count}`}
                      />
                    </ListItem>
                  )}
                  {currentTask.status === 'completed' && currentTask.data.file_path && (
                    <ListItem>
                      <ListItemText 
                        primary="Data saved"
                        secondary={currentTask.data.file_path}
                      />
                    </ListItem>
                  )}
                </List>
              </Box>
            )}
          </Box>
        )}

        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>

        <Snackbar 
          open={!!success} 
          autoHideDuration={6000} 
          onClose={() => setSuccess(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default SocialDataScraper; 