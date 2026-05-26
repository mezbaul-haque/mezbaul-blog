import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#2f5d50' : '#8bbda7',
    },
    secondary: {
      main: mode === 'light' ? '#6d7d86' : '#aebbc3',
    },
    background: {
      default: mode === 'light' ? '#f4f1ea' : '#121212',
      paper: mode === 'light' ? '#fffdf9' : '#1e1e1e',
    },
    text: {
      primary: mode === 'light' ? '#1a1a1a' : '#e0e0e0',
      secondary: mode === 'light' ? '#4a4a4a' : '#b0b0b0',
    },
    divider: mode === 'light' ? '#d7dcd6' : '#333333',
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    h1: {
      fontSize: 'clamp(2.9rem, 7vw, 5rem)',
      fontWeight: 400,
      lineHeight: 1.08,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 400,
      lineHeight: 1.12,
    },
    h3: {
      fontSize: '1.45rem',
      fontWeight: 400,
      lineHeight: 1.2,
    },
    body1: {
      fontSize: '1.04rem',
      lineHeight: 1.9,
    },
    body2: {
      lineHeight: 1.8,
    },
    button: {
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
    overline: {
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontSize: '0.78rem',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: mode === 'light' ? '#5f6b72' : '#8a96a0',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: mode === 'light' ? '#f4f1ea' : '#121212',
        },
        a: {
          color: 'inherit',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid',
          borderColor: mode === 'light' ? '#d7dcd6' : '#333333',
          boxShadow: 'none',
          backgroundColor: mode === 'light' ? '#fffdf9' : '#1e1e1e',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 46,
          borderRadius: 8,
          paddingInline: 18,
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: 'none',
      },
    },
  },
});
