import React from 'react';
import { Box, CircularProgress, useTheme } from '@mui/material';
import { keyframes } from '@mui/system';

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const loadingPulse = keyframes`
  0% {
    transform: scale(0.95);
    opacity: 0.5;
  }
  50% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.5;
  }
`;

interface AnimatedTransitionProps {
  children: React.ReactNode;
  loading?: boolean;
}

const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({
  children,
  loading = false,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100%',
        animation: loading ? 'none' : `${fadeIn} 0.5s ease-in-out`,
      }}
    >
      {loading ? (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2,
            animation: `${fadeIn} 0.3s ease-in-out`,
            background: 'rgba(15, 39, 68, 0.7)',
            backdropFilter: 'blur(10px)',
            zIndex: 10,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: 60,
              height: 60,
              animation: `${loadingPulse} 2s ease-in-out infinite`,
            }}
          >
            <CircularProgress
              size={60}
              thickness={4}
              sx={{
                color: theme.palette.primary.main,
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            />
            <CircularProgress
              size={60}
              thickness={4}
              sx={{
                color: theme.palette.secondary.main,
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: 0.3,
                animation: 'spin 3s linear infinite',
                '@keyframes spin': {
                  '0%': {
                    transform: 'rotate(0deg)',
                  },
                  '100%': {
                    transform: 'rotate(360deg)',
                  },
                },
              }}
            />
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            height: '100%',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '100%',
              background: 'linear-gradient(135deg, rgba(157, 78, 221, 0.1) 0%, rgba(157, 78, 221, 0) 100%)',
              opacity: 0,
              transition: 'opacity 0.3s ease-in-out',
              pointerEvents: 'none',
            },
            '&:hover::before': {
              opacity: 0.5,
            },
          }}
        >
          {children}
        </Box>
      )}
    </Box>
  );
};

export default AnimatedTransition;