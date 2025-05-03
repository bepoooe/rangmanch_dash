import React from 'react';
import {
  Drawer,
  List,
  Box,
  useTheme,
  styled,
  Divider,
  Typography,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Button,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  LibraryBooks as ContentLibraryIcon,
  BarChart as AnalyticsIcon,
  People as AudienceIcon,
  Person as ProfileIcon,
  ExitToApp as SignOutIcon,
  CloudDownload as ScrapeIcon,
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
    background: 'rgba(15, 39, 68, 0.7)',
    backdropFilter: 'blur(20px)',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  },
}));

const LogoWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3),
  background: 'linear-gradient(135deg, rgba(157, 78, 221, 0.1) 0%, rgba(157, 78, 221, 0) 100%)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
}));

// Main navigation items
const navigationItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, id: 'dashboard', path: '/' },
  { text: 'Content Library', icon: <ContentLibraryIcon />, id: 'content-library', path: '/content-library' },
  { text: 'Analytics', icon: <AnalyticsIcon />, id: 'analytics', path: '/analytics' },
  { text: 'Audience Insights', icon: <AudienceIcon />, id: 'audience-insights', path: '/audience-insights' },
  { text: 'Scrape Data', icon: <ScrapeIcon />, id: 'scrape', path: '/scrape' },
];

// User related items
const userItems = [
  { text: 'Profile', icon: <ProfileIcon />, id: 'profile', path: '/profile' },
  { text: 'Sign Out', icon: <SignOutIcon />, id: 'sign-out', path: '/login' },
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

  const renderNavItem = (item: { text: string; icon: React.ReactNode; id: string; path: string }) => {
    const active = currentSection === item.id;

    return (
      <ListItem 
        key={item.id} 
        disablePadding 
        sx={{ 
          mb: 0.5,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <ListItemButton
          onClick={() => {
            onSectionChange(item.id);
            history.push(item.path);
            if (isMobile) onClose();
          }}
          sx={{
            minHeight: 48,
            px: 2.5,
            py: 1.5,
            borderRadius: 2,
            transition: 'all 0.3s ease-in-out',
            background: active ? 'rgba(157, 78, 221, 0.1)' : 'transparent',
            '&:hover': {
              background: active 
                ? 'rgba(157, 78, 221, 0.2)' 
                : 'rgba(255, 255, 255, 0.05)',
              transform: 'translateX(5px)',
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 40,
              color: active ? theme.palette.primary.main : theme.palette.text.secondary,
              transition: 'color 0.3s ease-in-out',
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText 
            primary={item.text}
            sx={{
              '& .MuiTypography-root': {
                fontWeight: active ? 600 : 400,
                color: active ? theme.palette.primary.main : theme.palette.text.primary,
                transition: 'color 0.3s ease-in-out',
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
                width: 3,
                height: '30%',
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
            background: 'linear-gradient(45deg, #9d4edd, #c77dff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: 1,
          }}
        >
          Rangmanch
        </Typography>
      </LogoWrapper>

      <Box sx={{ p: 2, mb: 2 }}>
        <Typography 
          variant="subtitle2"
          sx={{ 
            color: theme.palette.text.secondary,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontSize: '0.75rem',
            fontWeight: 500,
            ml: 2,
            mb: 1,
          }}
        >
          Main Menu
        </Typography>
        <List sx={{ p: 0 }}>
          {navigationItems.map(renderNavItem)}
        </List>
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ p: 2 }}>
        <Typography 
          variant="subtitle2"
          sx={{ 
            color: theme.palette.text.secondary,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontSize: '0.75rem',
            fontWeight: 500,
            ml: 2,
            mb: 1,
          }}
        >
          User
        </Typography>
        <List sx={{ p: 0 }}>
          {userItems.map(renderNavItem)}
        </List>
      </Box>

      
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
          background: 'rgba(15, 39, 68, 0.7)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
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