import React, { useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { GridItem } from '../../../../components/Grid';

interface SupplierVideoProps {
  // Định nghĩa rõ props nếu cần
  className?: string;
}

const SupplierVideo: React.FC<SupplierVideoProps> = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  
  const videos = [
    "Giới thiệu EnGenius & Wifi 7",
    "Lexar",
    "Nvidia"
  ];

  return (
    <Box>
      <Grid container spacing={2}>
        <GridItem xs={4}>
          <Box sx={{ 
            bgcolor: '#1e2a38', 
            p: 2, 
            borderRadius: '4px',
            height: '100%'
          }}>
            <Typography variant="subtitle1" color="white" gutterBottom>
              Danh Sách Video
            </Typography>
            <Box sx={{ 
              maxHeight: '120px', 
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#555',
              },
            }}>
              {videos.map((video, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    p: 1.5, 
                    mb: 1, 
                    bgcolor: '#f5f5f5', 
                    borderRadius: '4px',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: '#e0e0e0',
                    }
                  }}
                  onClick={() => setSelectedVideo(video)}
                >
                  <Typography variant="body2">
                    {video}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </GridItem>
        
        <GridItem xs={4}>
          <Box sx={{ 
            bgcolor: '#1e2a38', 
            p: 2, 
            borderRadius: '4px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <Typography variant="subtitle1" color="white" gutterBottom>
              Video Preview
            </Typography>
            <Box sx={{ 
              bgcolor: '#f5f5f5', 
              p: 2, 
              borderRadius: '4px',
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography variant="body2" color="text.secondary">
                {selectedVideo ? selectedVideo : "Chọn video để xem trước"}
              </Typography>
            </Box>
          </Box>
        </GridItem>
        
        <GridItem xs={4}>
          <Box sx={{ 
            bgcolor: '#1e2a38', 
            p: 2, 
            borderRadius: '4px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <Typography variant="subtitle1" color="white" gutterBottom>
              Điều Khiển
            </Typography>
            
            <Grid container spacing={1}>
              <GridItem xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mb: 1 }}
                >
                  Team
                </Button>
              </GridItem>
              <GridItem xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mb: 1 }}
                >
                  Sponsor
                </Button>
              </GridItem>
              <GridItem xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  sx={{ mb: 1 }}
                >
                  Show
                </Button>
              </GridItem>
              <GridItem xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mb: 1 }}
                >
                  Play
                </Button>
              </GridItem>
              <GridItem xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="warning"
                >
                  Pause
                </Button>
              </GridItem>
              <GridItem xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                >
                  Restart
                </Button>
              </GridItem>
            </Grid>
          </Box>
        </GridItem>
      </Grid>
      
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
          Chọn video trước khi show và play
        </Typography>
      </Box>
    </Box>
  );
};

export default SupplierVideo; 