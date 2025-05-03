import React from 'react';
import { Box, Card, Typography, useTheme, useMediaQuery } from '@mui/material';
import { keyframes } from '@mui/system';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  delay: number;
}

const ContentMetricsCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  delay
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card
      sx={{
        p: { xs: 2, sm: 3 },
        bgcolor: theme.palette.background.paper,
        borderRadius: 2,
        height: '100%',
        animation: `${fadeInUp} 0.6s ease-out forwards`,
        animationDelay: `${delay}s`,
        opacity: 0,
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)',
        },
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'flex-start' },
        mb: 2
      }}>
        <Box
          sx={{
            p: isMobile ? 1 : 1.5,
            borderRadius: 2,
            bgcolor: `${color}15`,
            color: color,
            mr: 2,
            mb: { xs: 1.5, sm: 0 },
          }}
        >
          {icon}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            sx={{ 
              mb: 0.5, 
              fontWeight: 600,
              fontSize: { xs: '1.25rem', sm: '2rem' }
            }}
          >
            {value}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
          >
            {title}
          </Typography>
        </Box>
      </Box>
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
      >
        {subtitle}
      </Typography>
    </Card>
  );
};

export default ContentMetricsCard; 