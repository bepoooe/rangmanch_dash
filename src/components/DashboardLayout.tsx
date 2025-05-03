import React, { useState, useEffect } from 'react';
import { Box, Container, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallMobile = useMediaQuery('(max-width:380px)');

  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [currentSection, setCurrentSection] = useState('dashboard');

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
  };

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  return (
    <Box sx={{ 
      display: 'flex',
      minHeight: '100vh',
      background: theme.palette.background.default,
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'fixed',
        top: '10%',
        left: '45%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(157, 78, 221, 0.1) 0%, rgba(157, 78, 221, 0) 70%)',
        zIndex: 0,
        animation: 'pulse 15s ease-in-out infinite',
      },
      '&::after': {
        content: '""',
        position: 'fixed',
        bottom: '10%',
        right: '45%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(255, 158, 0, 0.1) 0%, rgba(255, 158, 0, 0) 70%)',
        zIndex: 0,
        animation: 'pulse 15s ease-in-out infinite reverse',
      },
      '@keyframes pulse': {
        '0%': {
          transform: 'scale(1) translate(0, 0)',
        },
        '50%': {
          transform: 'scale(1.2) translate(-5%, 5%)',
        },
        '100%': {
          transform: 'scale(1) translate(0, 0)',
        },
      },
    }}>
      <Header onSidebarToggle={handleSidebarToggle} />
      <Sidebar 
        open={sidebarOpen}
        onClose={handleSidebarToggle}
        onSectionChange={handleSectionChange}
        currentSection={currentSection}
        isMobile={isMobile}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          position: 'relative',
          zIndex: 1,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: 0,
          height: '100vh',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(157, 78, 221, 0.5)',
            borderRadius: '3px',
            '&:hover': {
              background: 'rgba(157, 78, 221, 0.7)',
            },
          },
        }}
      >
        <Toolbar />
        <Container 
          maxWidth="xl" 
          disableGutters={isSmallMobile}
          sx={{ 
            py: { xs: 2, sm: 3 },
            px: { xs: 1, sm: 2, md: 3 },
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Box sx={{ 
            backgroundColor: 'rgba(15, 39, 68, 0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: { xs: 1, sm: 2 },
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 24px 0 rgba(0, 0, 0, 0.2)',
            p: { xs: 1.5, sm: 2, md: 3 },
            flex: 1,
            overflow: 'hidden',
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
            },
          }}>
            {children}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardLayout;