import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter } from 'react-router-dom';
import { GlobalProvider } from './business/GlobalContext.jsx';
import theme from './business/theme.js';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

createRoot(document.getElementById('root')).render(
    <GlobalProvider>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
          <SpeedInsights />
          <Analytics />
        </ThemeProvider>
      </BrowserRouter>
    </GlobalProvider>
);
