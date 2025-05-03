import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9d4edd',
      light: '#c77dff',
      dark: '#7b2cbf',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff9e00',
      light: '#ffb74d',
      dark: '#f57c00',
      contrastText: '#ffffff',
    },
    success: {
      main: '#52c41a',
      light: '#73d13d',
      dark: '#389e0d',
      contrastText: '#ffffff',
    },
    error: {
      main: '#f5222d',
      light: '#ff4d4f',
      dark: '#cf1322',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#faad14',
      light: '#ffc53d',
      dark: '#d48806',
      contrastText: '#ffffff',
    },
    info: {
      main: '#13c2c2',
      light: '#36cfc9',
      dark: '#08979c',
      contrastText: '#ffffff',
    },
    background: {
      default: '#111420',
      paper: '#1a1d2b',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    action: {
      active: 'rgba(255, 255, 255, 0.8)',
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(255, 255, 255, 0.16)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      background: 'linear-gradient(45deg, #9d4edd, #c77dff)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.75rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.3,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.3,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.3,
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '0.00714em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '0.01071em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.875rem',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
      letterSpacing: '0.03333em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
    '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
    '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
    '0px 6px 10px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
    '0px 8px 10px -5px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
    '0px 9px 11px -5px rgba(0,0,0,0.2),0px 15px 19px 2px rgba(0,0,0,0.14),0px 6px 24px 4px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 17px 21px 2px rgba(0,0,0,0.14),0px 7px 26px 4px rgba(0,0,0,0.12)',
    '0px 11px 14px -7px rgba(0,0,0,0.2),0px 19px 23px 2px rgba(0,0,0,0.14),0px 8px 28px 4px rgba(0,0,0,0.12)',
    '0px 12px 15px -7px rgba(0,0,0,0.2),0px 21px 25px 2px rgba(0,0,0,0.14),0px 9px 30px 4px rgba(0,0,0,0.12)',
    '0px 13px 16px -8px rgba(0,0,0,0.2),0px 23px 27px 2px rgba(0,0,0,0.14),0px 10px 32px 4px rgba(0,0,0,0.12)',
    '0px 14px 17px -8px rgba(0,0,0,0.2),0px 25px 29px 2px rgba(0,0,0,0.14),0px 11px 34px 4px rgba(0,0,0,0.12)',
    '0px 15px 19px -9px rgba(0,0,0,0.2),0px 27px 31px 2px rgba(0,0,0,0.14),0px 12px 36px 4px rgba(0,0,0,0.12)',
    '0px 16px 20px -9px rgba(0,0,0,0.2),0px 29px 33px 2px rgba(0,0,0,0.14),0px 13px 38px 4px rgba(0,0,0,0.12)',
    '0px 17px 21px -10px rgba(0,0,0,0.2),0px 31px 35px 2px rgba(0,0,0,0.14),0px 14px 40px 4px rgba(0,0,0,0.12)',
    '0px 18px 22px -10px rgba(0,0,0,0.2),0px 33px 37px 2px rgba(0,0,0,0.14),0px 15px 42px 4px rgba(0,0,0,0.12)',
    '0px 19px 23px -11px rgba(0,0,0,0.2),0px 35px 39px 2px rgba(0,0,0,0.14),0px 16px 44px 4px rgba(0,0,0,0.12)',
    '0px 20px 24px -11px rgba(0,0,0,0.2),0px 37px 41px 2px rgba(0,0,0,0.14),0px 17px 46px 4px rgba(0,0,0,0.12)',
    '0px 21px 26px -12px rgba(0,0,0,0.2),0px 39px 43px 2px rgba(0,0,0,0.14),0px 18px 48px 4px rgba(0,0,0,0.12)',
    '0px 22px 27px -12px rgba(0,0,0,0.2),0px 41px 45px 2px rgba(0,0,0,0.14),0px 19px 50px 4px rgba(0,0,0,0.12)',
    '0px 23px 28px -13px rgba(0,0,0,0.2),0px 43px 47px 2px rgba(0,0,0,0.14),0px 20px 52px 4px rgba(0,0,0,0.12)',
    '0px 24px 29px -13px rgba(0,0,0,0.2),0px 45px 49px 2px rgba(0,0,0,0.14),0px 21px 54px 4px rgba(0,0,0,0.12)',
    '0px 25px 30px -14px rgba(0,0,0,0.2),0px 47px 51px 2px rgba(0,0,0,0.14),0px 22px 56px 4px rgba(0,0,0,0.12)',
    '0px 26px 31px -14px rgba(0,0,0,0.2),0px 49px 53px 2px rgba(0,0,0,0.14),0px 23px 58px 4px rgba(0,0,0,0.12)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        *,
        *::before,
        *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        html,
        body,
        #root {
          height: 100%;
          width: 100%;
        }

        body {
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
          background-color: #111420;
          color: #ffffff;
          font-family: 'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif;
        }

        #root {
          isolation: isolate;
          display: flex;
          flex-direction: column;
        }

        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(157, 78, 221, 0.6);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(157, 78, 221, 0.8);
        }

        a {
          color: #9d4edd;
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }
      `,
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 16,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 24px 0 rgba(0, 0, 0, 0.2)',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 32px 0 rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
          '&:last-child': {
            paddingBottom: '24px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontWeight: 600,
          textTransform: 'none',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #9d4edd 0%, #c77dff 100%)',
          boxShadow: '0 4px 12px rgba(157, 78, 221, 0.3)',
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #9d4edd 0%, #7b2cbf 100%)',
        },
        containedSecondary: {
          background: 'linear-gradient(45deg, #ff9e00 0%, #f57c00 100%)',
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1a1d2b',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(26, 29, 43, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(157, 78, 221, 0.2)',
            '&:hover': {
              backgroundColor: 'rgba(157, 78, 221, 0.3)',
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 36,
          transition: 'color 0.2s ease-in-out',
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: 'separate',
          borderSpacing: '0 8px',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
          '& th, & td': {
            borderBottom: 'none',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '16px',
        },
        head: {
          fontWeight: 600,
          color: 'rgba(255, 255, 255, 0.8)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          padding: '8px 12px',
          fontSize: '0.75rem',
          fontWeight: 500,
          borderRadius: 4,
        },
        arrow: {
          color: 'rgba(0, 0, 0, 0.85)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
        },
      },
    },
  },
});

export default theme;

export const globalStyles = `
  body {
    background-color: ${theme.palette.background.default};
    color: ${theme.palette.text.primary};
    margin: 0;
    padding: 0;
    font-family: ${theme.typography.fontFamily};
  }

  .ant-layout {
    background: ${theme.palette.background.default} !important;
  }

  .ant-layout-sider {
    background: ${theme.palette.background.default} !important;
  }

  .ant-menu {
    background: ${theme.palette.background.default} !important;
  }

  .ant-card {
    background: ${theme.palette.background.paper} !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
  }

  .ant-menu-item {
    color: ${theme.palette.text.primary} !important;
  }

  .ant-menu-item-selected {
    background-color: rgba(157, 78, 221, 0.2) !important;
  }

  .ant-menu-item:hover {
    color: ${theme.palette.primary.main} !important;
  }

  .ant-statistic-title {
    color: ${theme.palette.text.primary} !important;
  }

  .ant-statistic-content {
    color: ${theme.palette.text.primary} !important;
  }

  .ant-timeline-item-content {
    color: ${theme.palette.text.primary} !important;
  }

  .ant-progress-text {
    color: ${theme.palette.text.primary} !important;
  }
`;