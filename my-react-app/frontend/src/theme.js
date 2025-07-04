import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#b71c1c',
    },
    secondary: {
      main: '#ffffff',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
