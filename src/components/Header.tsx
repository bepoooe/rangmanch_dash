import React from 'react';
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  Menu as MenuIcon,
} from '@mui/icons-material';

interface HeaderProps {
  onSidebarToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSidebarToggle }) => {
  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'linear-gradient(90deg, rgba(33,33,46,1) 0%, rgba(15,23,42,1) 100%)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1.1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
        },
        '&:after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1.1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
        }
      }}
    >
      {/* Subtle grid pattern */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(237, 228, 228, 0.03) 1px, transparent 0)',
        backgroundSize: '20px 20px',
        pointerEvents: 'none',
      }} />
      
      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <Box key={i} sx={{
          position: 'absolute',
          width: 2,
          height: 2,
          borderRadius: '50%',
          background: `rgba(255,255,255,${Math.random() * 0.2 + 0.05})`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: 'float 15s ease infinite',
          animationDelay: `${Math.random() * 5}s`,
          '@keyframes float': {
            '0%': { transform: 'translateY(0) translateX(0)' },
            '50%': { transform: `translateY(${Math.random() * 20 - 10}px) translateX(${Math.random() * 20 - 10}px)` },
            '100%': { transform: 'translateY(0) translateX(0)' }
          }
        }} />
      ))}

      <Toolbar 
        sx={{ 
          px: { xs: 2, sm: 3 },
          minHeight: { xs: '60px', sm: '70px' },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {onSidebarToggle && (
          <IconButton
            onClick={onSidebarToggle}
            sx={{
              mr: 2,
              display: { sm: 'none' },
              color: 'white',
              '&:hover': {
                transform: 'rotate(180deg)',
                transition: 'transform 0.3s ease-in-out',
                background: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Typography 
          variant="h4" 
          component="div" 
          sx={{ 
            textAlign: 'center',
            fontWeight: 'bold',
            fontFamily: "'Poppins', 'Segoe UI', sans-serif",
            letterSpacing: '0.5px',
            fontSize: { xs: '1.8rem', sm: '2.2rem' },
            background: `linear-gradient(45deg, 
              #9d4edd,
              #c77dff,
              #ff9e00,
              #ddff00
            )`,
            backgroundSize: '300% 300%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'gradient 15s ease infinite',
            textShadow: '0 0 10px rgba(157, 78, 221, 0.3)',
            position: 'relative',
            padding: '0 16px',
            '&:before': {
              content: '""',
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: -4,
              height: '2px',
              background: 'linear-gradient(90deg, transparent, rgba(157, 78, 221, 0.5), transparent)',
              borderRadius: '50%',
            },
            '@keyframes gradient': {
              '0%': {
                backgroundPosition: '0% 50%'
              },
              '50%': {
                backgroundPosition: '100% 50%'
              },
              '100%': {
                backgroundPosition: '0% 50%'
              }
            }
          }}
        >
          Rangmanch Dashboard
        </Typography>

        <Box sx={{ flexGrow: 1 }} />
      </Toolbar>
    </AppBar>
  );
};

export default Header;