import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2f5d50',
    },
    secondary: {
      main: '#6d7d86',
    },
    background: {
      default: '#f4f1ea',
      paper: '#fffdf9',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#4a4a4a',
    },
    divider: '#d7dcd6',
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
      color: '#5f6b72',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f4f1ea',
        },
        a: {
          color: 'inherit',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #d7dcd6',
          boxShadow: 'none',
          backgroundColor: '#fffdf9',
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
