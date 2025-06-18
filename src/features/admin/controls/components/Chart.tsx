import React from 'react';
import { Box, Button, Grid } from '@mui/material';
import { GridItem } from '../../../../components/Grid';

interface ChartProps {
  className?: string;
}

const Chart: React.FC<ChartProps> = () => {
  return (
    <Box>
      <Grid container spacing={2}>
        <GridItem xs={6}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ height: '50px', bgcolor: '#3f51b5' }}
          >
            Số lượng thí sinh đúng theo từng câu
          </Button>
        </GridItem>
        
        <GridItem xs={6}>
          <Button
            fullWidth
            variant="contained"
            color="success"
            sx={{ height: '50px' }}
          >
            Số lượng thí sinh đúng theo từng lớp
          </Button>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Chart; 