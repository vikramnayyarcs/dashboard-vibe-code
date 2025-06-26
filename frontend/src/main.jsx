import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './style.css';
import { ThemeProvider } from './theme.jsx';

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
