import React from 'react';
import { Box, Typography } from '@mui/material';

interface MapDisplayProps {
  mapEmbedCode?: string | null;
  height?: number;
  emptyMessage?: string;
}

/**
 * Component hiển thị bản đồ từ mã nhúng HTML
 */
const MapDisplay: React.FC<MapDisplayProps> = ({ 
  mapEmbedCode, 
  height = 300, 
  emptyMessage = 'Chưa có thông tin bản đồ' 
}) => {
  if (!mapEmbedCode) {
    return <Typography>{emptyMessage}</Typography>;
  }

  return (
    <Box
      sx={{
        width: '100%',
        height,
        '& iframe': {
          width: '100%',
          height: '100%',
          border: 0,
        },
      }}
      dangerouslySetInnerHTML={{ __html: mapEmbedCode }}
    />
  );
};

export default MapDisplay; 