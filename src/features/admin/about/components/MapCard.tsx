import React from 'react';
import { Paper, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MapDisplay from './MapDisplay';

interface MapCardProps {
  mapEmbedCode?: string | null;
  title?: string;
}

/**
 * Component hiển thị bản đồ trong card
 */
const MapCard: React.FC<MapCardProps> = ({ 
  mapEmbedCode,
  title = 'Bản đồ'
}) => {
  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <LocationOnIcon sx={{ mr: 1 }} /> {title}
      </Typography>

      <MapDisplay mapEmbedCode={mapEmbedCode} />
    </Paper>
  );
};

export default MapCard; 