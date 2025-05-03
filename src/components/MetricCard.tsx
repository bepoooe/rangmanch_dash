import React from 'react';
import { Box, Card, Typography, useTheme } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { keyframes } from '@mui/system';

const slideIn = keyframes`
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
  icon: React.ReactElement;
  color?: string;
  growth: string;
  delay?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  color = '#9d4edd',
  growth,
  delay = 0
}) => {
  const theme = useTheme();
  const isPositive = growth.startsWith('+');

  return (
    <Card
      sx={{
        height: '100%',
        background: 'rgba(15, 39, 68, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        animation: `${slideIn} 0.6s ease-out forwards`,
        animationDelay: `${delay}s`,
        opacity: 0,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: `linear-gradient(135deg, ${color}15, ${color}05)`,
          opacity: 0.5,
          transition: 'all 0.3s ease-in-out',
        },
        '&:hover': {
          transform: 'translateY(-8px)',
          '&::before': {
            opacity: 0.8,
          },
        },
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: `${color}15`,
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {React.cloneElement(icon, { sx: { fontSize: 24 } })}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: isPositive ? theme.palette.success.main : theme.palette.error.main,
              bgcolor: isPositive ? 'rgba(84, 214, 44, 0.16)' : 'rgba(255, 72, 66, 0.16)',
              px: 1,
              py: 0.5,
              borderRadius: 1,
            }}
          >
            {isPositive ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
            <Typography variant="body2" fontWeight={600}>
              {growth}
            </Typography>
          </Box>
        </Box>
        
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 0.5, 
              fontWeight: 700,
              background: `linear-gradient(45deg, ${color}, ${color}90)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default MetricCard;