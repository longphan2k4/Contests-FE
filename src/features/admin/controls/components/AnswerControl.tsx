import React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { GridItem } from '../../../../components/Grid';

interface AnswerControlProps {
  className?: string;
}

const AnswerControl: React.FC<AnswerControlProps> = () => {
  return (
    <Box>
      <Grid container spacing={2}>
        <GridItem xs={12}>
          <Typography variant="h5" align="center" color="error" gutterBottom>
            Con Vịt
          </Typography>
        </GridItem>
        
        <GridItem xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ height: '50px' }}
          >
            Kết quả
          </Button>
        </GridItem>
        
        <Typography variant="subtitle1" sx={{ width: '100%', mt: 2, mb: 1, px: 2 }}>
          Điều khiển video/Audio
        </Typography>
        
        <Grid container spacing={2} sx={{ px: 2 }}>
          <GridItem xs={4}>
            <Button
              fullWidth
              variant="contained"
              color="inherit"
              sx={{ height: '50px', bgcolor: '#757575' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5V19L19 12L8 5Z" fill="white" />
              </svg>
            </Button>
          </GridItem>
          <GridItem xs={4}>
            <Button
              fullWidth
              variant="contained"
              color="inherit"
              sx={{ height: '50px', bgcolor: '#757575' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="white" />
              </svg>
            </Button>
          </GridItem>
          <GridItem xs={4}>
            <Button
              fullWidth
              variant="contained"
              color="inherit"
              sx={{ height: '50px', bgcolor: '#757575' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" fill="white" />
              </svg>
            </Button>
          </GridItem>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 1, px: 2 }}>
          <GridItem xs={6}>
            <Button
              fullWidth
              variant="contained"
              color="inherit"
              sx={{ height: '50px', bgcolor: '#757575' }}
            >
              Open
            </Button>
          </GridItem>
          <GridItem xs={6}>
            <Button
              fullWidth
              variant="contained"
              color="inherit"
              sx={{ height: '50px', bgcolor: '#757575' }}
            >
              Close ✕
            </Button>
          </GridItem>
        </Grid>
        
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
              Close câu hỏi rồi mới show đáp án và close đáp án trước khi qua câu khác
            </Typography>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default AnswerControl; 