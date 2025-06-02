import React from 'react';
import { Box, Container, Alert } from '@mui/material';

interface ErrorStateProps {
  message?: string;
  fullPage?: boolean;
}

/**
 * Component hiển thị thông báo lỗi
 */
const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Đã xảy ra lỗi',
  fullPage = false
}) => {
  const content = (
    <Box sx={{ py: 4, textAlign: 'center' }}>
      <Alert severity="error" sx={{ display: 'inline-flex', textAlign: 'left' }}>
        {message}
      </Alert>
    </Box>
  );

  if (fullPage) {
    return <Container maxWidth="lg">{content}</Container>;
  }

  return content;
};

export default ErrorState; 