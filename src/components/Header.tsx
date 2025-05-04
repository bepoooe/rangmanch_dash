import React, { useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Menu,
  MenuItem,
  Typography,
  styled,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

// Styled anchor component
const StyledAnchor = styled('a')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  textDecoration: 'none',
  color: 'inherit',
}));

interface HeaderProps {
  onSidebarToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSidebarToggle }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
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

        <Typography 
          variant="h4" 
          component="div" 
          sx={{ 
            display: { xs: 'none', sm: 'block' },
            fontWeight: 'bold',
            mr: 2,
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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            onClick={handleProfileClick}
            sx={{
              p: 0,
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
              }
            }}
          >
            <Avatar
              sx={{
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 },
                background: 'linear-gradient(45deg, #9d4edd, #c77dff)',
                cursor: 'pointer',
              }}
            >
              A
            </Avatar>
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              background: 'rgba(15, 39, 68, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'rgba(15, 39, 68, 0.8)',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem>
            <StyledAnchor href="/#/profile" onClick={handleClose}>
              <PersonIcon fontSize="small" sx={{ mr: 1 }} />
              Profile
            </StyledAnchor>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;