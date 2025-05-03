import React from 'react';
import { Box } from '@mui/material';
import AudienceInsightsComponent from '../components/AudienceInsights';

const AudienceInsights: React.FC = () => {
  return (
    <Box sx={{ height: '100%', p: 2 }}>
      <AudienceInsightsComponent />
    </Box>
  );
};

export default AudienceInsights; 