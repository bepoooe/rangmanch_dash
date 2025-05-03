import React from 'react';
import { Box, Card, Typography, useTheme } from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { keyframes } from '@mui/system';
import AnimatedButton from './AnimatedButton';

const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
`;

const glowPulse = keyframes`
  0% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
  100% {
    opacity: 0.5;
    transform: scale(1);
  }
`;

interface FeatureSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  delay: number;
  onClick?: () => void;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({
  title,
  description,
  icon,
  color,
  delay,
  onClick
}) => {
  const theme = useTheme();

  return (
    <Card
      onClick={onClick}
      sx={{
        p: 3,
        height: '100%',
        background: 'rgba(15, 39, 68, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        animation: `${fadeInRight} 0.6s ease-out forwards`,
        animationDelay: `${delay}s`,
        opacity: 0,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '120%',
          height: '120%',
          background: `radial-gradient(circle at center, ${color}20 0%, ${color}05 50%, transparent 70%)`,
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          transition: 'all 0.6s ease-in-out',
        },
        '&::after': {
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
            opacity: 1,
            animation: `${glowPulse} 2s ease-in-out infinite`,
          },
          '&::after': {
            opacity: 0.8,
          },
        },
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: `${color}15`,
              color: color,
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                bgcolor: `${color}25`,
                transform: 'scale(1.1)',
              },
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 1, 
                fontWeight: 600,
                background: `linear-gradient(45deg, ${color}, ${color}90)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 2,
                lineHeight: 1.6,
              }}
            >
              {description}
            </Typography>
            <AnimatedButton
              variant="text"
              animation="shine"
              sx={{ 
                color: color,
                p: 0,
                '&:hover': {
                  background: 'transparent',
                  transform: 'translateX(8px)',
                },
                transition: 'transform 0.3s ease-in-out',
              }}
              endIcon={<ArrowForwardIcon />}
            >
              Learn More
            </AnimatedButton>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default FeatureSection;