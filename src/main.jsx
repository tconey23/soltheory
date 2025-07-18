import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter } from 'react-router-dom';
import theme from './business/theme.js';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import 'react-chat-elements/dist/main.css';

createRoot(document.getElementById('root')).render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
          <SpeedInsights/>
          <Analytics />
          <SpeedInsights />
          <Analytics />
        </ThemeProvider>
      </BrowserRouter>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.getRegistration().then(reg => {
      if (reg?.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }

      reg?.addEventListener('updatefound', () => {
        const newSW = reg.installing;
        newSW?.addEventListener('statechange', () => {
          if (
            newSW.state === 'installed' &&
            navigator.serviceWorker.controller
          ) {
            // Optionally show a modal instead of auto reload:
            newSW.postMessage({ type: 'SKIP_WAITING' });
            window.location.reload();
          }
        });
      });
    });
  });
}
