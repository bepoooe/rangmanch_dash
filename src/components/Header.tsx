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
      }}
    >
      <Toolbar 
        sx={{ 
          px: { xs: 2, sm: 3 },
          minHeight: { xs: '60px', sm: '70px' },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
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