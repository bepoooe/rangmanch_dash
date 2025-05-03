import React from 'react';
import { Box, Card, Typography, useTheme, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Today as TodayIcon,
  DateRange as DateRangeIcon,
  CalendarMonth as CalendarMonthIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { keyframes } from '@mui/system';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

interface EngagementChartProps {
  data: {
    labels: string[];
    likes: number[];
    comments: number[];
    shares: number[];
  };
}

const EngagementChart: React.FC<EngagementChartProps> = ({ data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [timeRange, setTimeRange] = React.useState('week');

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Likes',
        data: data.likes,
        backgroundColor: '#9d4edd',
        borderRadius: 6,
        barThickness: isMobile ? 12 : 16,
      },
      {
        label: 'Comments',
        data: data.comments,
        backgroundColor: '#ff9e00',
        borderRadius: 6,
        barThickness: isMobile ? 12 : 16,
      },
      {
        label: 'Shares',
        data: data.shares,
        backgroundColor: '#00b4d8',
        borderRadius: 6,
        barThickness: isMobile ? 12 : 16,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          color: theme.palette.text.secondary,
          font: {
            size: 12,
            family: theme.typography.fontFamily,
          },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 39, 68, 0.8)',
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        bodyFont: {
          size: 13,
          family: theme.typography.fontFamily,
        },
        titleFont: {
          size: 14,
          family: theme.typography.fontFamily,
          weight: '600',
        },
        displayColors: true,
        usePointStyle: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 12,
            family: theme.typography.fontFamily,
          },
          padding: 8,
          maxRotation: isMobile ? 45 : 0,
          minRotation: isMobile ? 45 : 0,
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 12,
            family: theme.typography.fontFamily,
          },
          padding: 8,
          stepSize: 100,
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutCubic',
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  };

  return (
    <Card
      sx={{
        height: '100%',
        background: 'rgba(15, 39, 68, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        p: { xs: 2, sm: 3 },
        animation: `${fadeIn} 0.6s ease-out forwards`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: 'linear-gradient(135deg, rgba(157, 78, 221, 0.1) 0%, rgba(157, 78, 221, 0) 100%)',
          opacity: 0.5,
          transition: 'opacity 0.3s ease-in-out',
        },
        '&:hover::before': {
          opacity: 0.8,
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                background: 'linear-gradient(45deg, #9d4edd, #c77dff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mr: 1,
              }}
            >
              Engagement Overview
            </Typography>
            <Tooltip title="Shows likes, comments, and shares over time">
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={(e, value) => value && setTimeRange(value)}
            size="small"
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              '& .MuiToggleButton-root': {
                color: theme.palette.text.secondary,
                borderColor: 'rgba(255, 255, 255, 0.1)',
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                  bgcolor: 'rgba(157, 78, 221, 0.1)',
                },
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                },
              },
            }}
          >
            <ToggleButton value="day" aria-label="day">
              <TodayIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="week" aria-label="week">
              <DateRangeIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="month" aria-label="month">
              <CalendarMonthIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box
          sx={{
            height: { xs: 300, sm: 400 },
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Bar data={chartData}/>
        </Box>
      </Box>
    </Card>
  );
};

export default EngagementChart;