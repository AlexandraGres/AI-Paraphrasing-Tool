import { ThemeOptions, createTheme } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#DBDCDF',
    },
    secondary: {
      main: '#3b5aae',
    },
    background: {
      default: '#fff',
    },
    error: {
      main: '#FF3B30',
    },
  },
  typography: {
    fontSize: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '--variant-containedBg': '#EEF0F5',
          fontSize: '14px',
          color: '#76777A',
          textTransform: 'none',

          '&:hover': {
            '--variant-containedBg': '#dee4f3',
          },

          '&:disabled': {
            color: '#fff',
            backgroundColor: '#AEAFB1',
          },
        },
      },
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;
