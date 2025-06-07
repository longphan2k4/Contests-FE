import React from 'react';
import { Snackbar, Alert, AlertTitle } from '@mui/material';
import { useNotification } from '../../contexts/NotificationContext';

const Notification: React.FC = () => {
  const { notificationState, hideNotification } = useNotification();

  return (
    <Snackbar
      open={notificationState.open}
      autoHideDuration={6000}
      onClose={hideNotification}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert 
        onClose={hideNotification} 
        severity={notificationState.severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {notificationState.title && (
          <AlertTitle>{notificationState.title}</AlertTitle>
        )}
        {notificationState.message}
      </Alert>
    </Snackbar>
  );
};

export default Notification; 