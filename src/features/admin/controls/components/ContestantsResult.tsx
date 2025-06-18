import React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { GridItem } from '../../../../components/Grid';

interface ContestantsResultProps {
  className?: string;
}

const ContestantsResult: React.FC<ContestantsResultProps> = () => {
  return (
    <Box>
      <Grid container spacing={2}>
        <GridItem xs={6}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ height: '50px' }}
          >
            Cập nhật
          </Button>
        </GridItem>
        
        <GridItem xs={6}>
          <Button
            fullWidth
            variant="contained"
            color="error"
            sx={{ height: '50px' }}
          >
            Show
          </Button>
        </GridItem>
        
        <GridItem xs={12}>
          <Box sx={{ 
            mt: 2, 
            p: 1, 
            bgcolor: '#fff3cd', 
            borderRadius: 1,
            border: '1px solid #ffeeba',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Box sx={{ color: '#856404', mr: 1, fontSize: '20px' }}>⚠</Box>
            <Typography variant="body2" color="#856404">
              Cập nhật trong thời thí sinh qua vòng
            </Typography>
          </Box>
        </GridItem>
        
        <GridItem xs={12}>
          <Box sx={{ 
            mt: 2, 
            p: 1, 
            bgcolor: '#fff3cd', 
            borderRadius: 1,
            border: '1px solid #ffeeba',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Box sx={{ color: '#856404', mr: 1, fontSize: '20px' }}>⚠</Box>
            <Typography variant="body2" color="#856404">
              Show danh sách thí sinh qua vòng
            </Typography>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default ContestantsResult; 