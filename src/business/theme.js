// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#414770',
    },
    background: {
      default: '#f4f6f8',
      important: '#F46036'
    }
  },
  typography: {
    fontFamily: '"Fredoka", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
    
  },
  components: {
    MuiButton: {
      variants: [
        {
            props: { color: 'primary' },
            style: {
              backgroundColor: '#372248',
              boxShadow: '2px 2px 9px 0px #0000005e',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#414770',
              },
            },
          },
        {
          props: { color: 'important' },
          style: {
            backgroundColor: '#F46036',
            boxShadow: '2px 2px 9px 0px #0000005e',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#b71c1c',
            },
          },
        },
        {
            props: { color: 'disabled' },
            style: {
              backgroundColor: '#f1dac4',
              boxShadow: '2px 2px 9px 0px #0000005e',
              color: '#fff',
              opacity: 0.5,
              '&:hover': {
                backgroundColor: '#414770',
              },
            },
          },
      ],
    },
  },
});

export default theme;
