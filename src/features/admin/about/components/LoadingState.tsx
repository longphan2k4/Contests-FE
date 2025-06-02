import React from 'react';
import { Box, Typography, CircularProgress, Container } from '@mui/material';

interface LoadingStateProps {
  message?: string;
  fullPage?: boolean;
}

/**
 * Component hiển thị trạng thái đang tải
 */
const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Đang tải thông tin...', 
  fullPage = false 
}) => {
  const content = (
    <Box sx={{ 
      py: 4, 
      textAlign: 'center', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: 2 
    }}>
      <CircularProgress size={40} />
      <Typography>{message}</Typography>
    </Box>
  );

  if (fullPage) {
    return <Container maxWidth="lg">{content}</Container>;
  }

  return content;
};

export default LoadingState;
