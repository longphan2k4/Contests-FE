import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import AppRoutes from './routes';
import { theme } from './common/theme';
import './index.css';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoutes />
    </ThemeProvider>
  );
};

export default App;
