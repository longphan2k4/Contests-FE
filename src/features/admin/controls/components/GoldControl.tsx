import React from 'react';
import { Box, Button, Grid, MenuItem, Select, Typography } from '@mui/material';
import { GridItem } from '../../../../components/Grid';

interface GoldControlProps {
  className?: string;
}

const GoldControl: React.FC<GoldControlProps> = () => {
  return (
    <Box>
      <Grid container spacing={2}>
        <GridItem xs={12}>
          <Select
            fullWidth
            displayEmpty
            value=""
            sx={{ mb: 2 }}
          >
            <MenuItem value="" disabled>
              -- Chọn thí sinh --
            </MenuItem>
          </Select>
        </GridItem>
        
        <GridItem xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="success"
            sx={{ height: '50px' }}
          >
            Xác nhận
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
              Cập nhật thí sinh gold và Lấy 20 thí sinh qua vòng
            </Typography>
          </Box>
        </GridItem>
        
        <GridItem xs={12}>
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
              Show thí sinh Gold lên màn hình
            </Typography>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default GoldControl; 