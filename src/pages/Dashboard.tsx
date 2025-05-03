import React from 'react';
import { Box, Grid, Typography, useTheme, useMediaQuery } from '@mui/material';
import AnimatedButton from '../components/AnimatedButton';
import SocialDataScraper from '../components/SocialDataScraper';
import SocialDataVisualizer from '../components/SocialDataVisualizer';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleRefresh = () => {
    window.location.reload();
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
        <Typography variant="h4" component="h1" gutterBottom={isMobile}>
          Social Media Analytics Dashboard
        </Typography>
        <AnimatedButton 
          variant="contained" 
          color="primary"
          onClick={handleRefresh}
          animation="shine"
          fullWidth={isMobile}
          smallOnMobile={true}
          sx={{ maxWidth: { xs: '100%', sm: '180px' } }}
        >
          Refresh Data
        </AnimatedButton>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <SocialDataScraper />
        </Grid>
        
        <Grid item xs={12} sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Step 2: Analyze Your Social Media Data
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Visualize the scraped data with interactive charts
          </Typography>
          <SocialDataVisualizer />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;