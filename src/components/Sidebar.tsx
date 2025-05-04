import React from 'react';
import {
  Drawer,
  List,
  Box,
  useTheme,
  styled,
  Typography,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  LibraryBooks as ContentLibraryIcon,
  BarChart as AnalyticsIcon,
  People as AudienceIcon,
  Person as ProfileIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onSectionChange: (section: string) => void;
  currentSection: string;
  isMobile: boolean;
}

const drawerWidth = 280;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    background: theme.palette.mode === 'dark' ? '#1a2035' : '#ffffff',
    borderRight: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
    boxShadow: theme.palette.mode === 'dark' ? '0 8px 24px 0 rgba(0, 0, 0, 0.2)' : '0 8px 24px 0 rgba(0, 0, 0, 0.05)',
  },
}));

const LogoWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  background: theme.palette.mode === 'dark' ? 'rgba(66, 66, 66, 0.1)' : 'rgba(245, 245, 245, 0.5)',
  borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
}));

const UserProfileSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
}));

// Main navigation items
const navigationItems = [
  { text: 'Home', icon: <HomeIcon />, id: 'home', path: 'https://rangmanch.vercel.app' },
  { text: 'Dashboard', icon: <DashboardIcon />, id: 'dashboard', path: '/' },
  { text: 'Content Library', icon: <ContentLibraryIcon />, id: 'content-library', path: '/content-library' },
  { text: 'Analytics', icon: <AnalyticsIcon />, id: 'analytics', path: '/analytics' },
  { text: 'Audience Insights', icon: <AudienceIcon />, id: 'audience-insights', path: '/audience-insights' },
];

// User related items
const userItems = [
  { text: 'Profile', icon: <ProfileIcon />, id: 'profile', path: '/profile' },
];

const Sidebar: React.FC<SidebarProps> = ({
  open,
  onClose,
  onSectionChange,
  currentSection,
  isMobile,
}) => {
  const theme = useTheme();
  const history = useHistory();

  const handleNavItemClick = (item: { text: string; id: string; path: string }) => {
    onSectionChange(item.id);
    
    // Handle external link for Home
    if (item.path.startsWith('http')) {
      window.location.href = item.path;
    } else {
      history.push(item.path);
    }
    
    if (isMobile) onClose();
  };

  const renderNavItem = (item: { text: string; icon: React.ReactNode; id: string; path: string }) => {
    const active = currentSection === item.id;
    const isExternal = item.path.startsWith('http');

    return (
      <ListItem 
        key={item.id} 
        disablePadding 
        sx={{ 
          mb: 0.5,
          position: 'relative',
        }}
      >
        <ListItemButton
          onClick={() => handleNavItemClick(item)}
          sx={{
            minHeight: 48,
            px: 2.5,
            py: 1,
            borderRadius: 1,
            transition: 'all 0.2s ease',
            background: active ? 
              theme.palette.mode === 'dark' ? 'rgba(67, 83, 192, 0.1)' : 'rgba(67, 83, 192, 0.08)' : 
              'transparent',
            '&:hover': {
              background: active ? 
                theme.palette.mode === 'dark' ? 'rgba(67, 83, 192, 0.2)' : 'rgba(67, 83, 192, 0.15)' : 
                theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 40,
              color: active ? theme.palette.primary.main : theme.palette.text.secondary,
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText 
            primary={item.text}
            sx={{
              '& .MuiTypography-root': {
                fontWeight: active ? 600 : 500,
                fontSize: '0.9rem',
                color: active ? theme.palette.primary.main : theme.palette.text.primary,
              },
            }}
          />
          {active && (
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 4,
                height: '60%',
                bgcolor: theme.palette.primary.main,
                borderRadius: '0 4px 4px 0',
              }}
            />
          )}
        </ListItemButton>
      </ListItem>
    );
  };

  const drawerContent = (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <LogoWrapper>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #4353c0, #7986cb)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: 1,
          }}
        >
          Rangmanch
        </Typography>
      </LogoWrapper>

      <Box sx={{ p: 2, mb: 2, mt: 1 }}>
        <List sx={{ p: 0 }}>
          {navigationItems.map(renderNavItem)}
        </List>
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ 
        opacity: 0.6,
        mx: 2,
        my: 1,
      }} />

      <Box sx={{ p: 2 }}>
        <List sx={{ p: 0 }}>
          {userItems.map(renderNavItem)}
        </List>
      </Box>

      <UserProfileSection>
        <Avatar
          sx={{ 
            width: 40, 
            height: 40,
            bgcolor: theme.palette.primary.main,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
        >
          U
        </Avatar>
        <Box sx={{ ml: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            User Name
          </Typography>
          <Typography variant="caption" color="text.secondary">
            user@example.com
          </Typography>
        </Box>
      </UserProfileSection>
    </Box>
  );

  return isMobile ? (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      PaperProps={{
        sx: {
          width: drawerWidth,
          background: theme.palette.mode === 'dark' ? '#1a2035' : '#ffffff',
          borderRight: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
          boxShadow: theme.palette.mode === 'dark' ? '0 8px 24px 0 rgba(0, 0, 0, 0.2)' : '0 8px 24px 0 rgba(0, 0, 0, 0.05)',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  ) : (
    <StyledDrawer variant="permanent">{drawerContent}</StyledDrawer>
  );
};

export default Sidebar;