import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  useTheme
} from '@mui/material';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const ApiTokenConfig: React.FC = () => {
  const theme = useTheme();
  const [apiToken, setApiToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenSet, setIsTokenSet] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check if token is configured on load
  useEffect(() => {
    checkTokenStatus();
  }, []);

  // Function to check token status from the server
  const checkTokenStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/config`);
      setIsTokenSet(response.data.is_api_token_set);
    } catch (err) {
      console.error('Failed to check token status:', err);
    }
  };

  // Submit the token to the server
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiToken) {
      setError('Please enter a valid API token');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/config/token`, { token: apiToken });
      setSuccess('API token updated successfully!');
      setIsTokenSet(true);
      setApiToken(''); // Clear the field
    } catch (err) {
      setError('Failed to update API token');
      console.error('Token update error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card sx={{ bgcolor: theme.palette.background.paper }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          API Configuration
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Configure your Apify API token for social media data scraping
        </Typography>

        {isTokenSet && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Apify API token is configured and ready to use
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Apify API Token"
            variant="outlined"
            placeholder="Enter your Apify API token"
            value={apiToken}
            onChange={(e) => setApiToken(e.target.value)}
            disabled={isLoading}
            type="password"
            sx={{ mb: 2 }}
            helperText="Get your token at apify.com"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading || !apiToken}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Save API Token'}
          </Button>
        </form>

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

export default ApiTokenConfig; 