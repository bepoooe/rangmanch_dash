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
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
        },
        '&:after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
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
          minHeight: { xs: '64px', sm: '74px' },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          flexDirection: 'column'
        }}
      >
        {/* Main header content */}
        <Box sx={{ 
          display: 'flex', 
          width: '100%',
          alignItems: 'center'
        }}>
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
              fontSize: { xs: '1.9rem', sm: '2.5rem' },
              background: `linear-gradient(45deg, 
                #9d4edd,
                #c77dff,
                #ff9e00,
                #ddff00
              )`,
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'gradient 10s ease infinite',
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
        </Box>

        {/* Scrolling text banner */}
        <Box
          sx={{
            width: '100%',
            overflow: 'hidden',
            background: 'rgb(195, 215, 228)',
            mt: 1,
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            position: 'relative'
          }}
        >
          <Typography
            sx={{
              color: 'rgba(159, 0, 0, 0.87)',
              whiteSpace: 'nowrap',
              position: 'absolute',
              fontWeight: 'bold',
              left: 0,
              animation: 'scrollText 20s linear infinite',
              '@keyframes scrollText': {
                '0%': { transform: 'translateX(100vw)' },
                '100%': { transform: 'translateX(-100%)' }
              }
            }}
          >
            As Web Scraping of Facebook & Linkedin is paid. We couldn't integrate that :)
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;