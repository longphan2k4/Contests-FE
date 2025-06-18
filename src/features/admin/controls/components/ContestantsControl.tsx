import React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { GridItem } from '../../../../components/Grid';

interface ContestantsControlProps {
  className?: string; 
}

const ContestantsControl: React.FC<ContestantsControlProps> = () => {
  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Thi sinh trận đấu - Câu 1
      </Typography>
      
      <Grid container spacing={1}>
        <GridItem xs={4}>
          <Box sx={{ border: '1px solid #e0e0e0', p: 1, borderRadius: '4px' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Nhóm 1
            </Typography>
            
            <Grid container spacing={0.5}>
              {[...Array(10)].map((_, rowIndex) => (
                <React.Fragment key={`row-${rowIndex}`}>
                  <GridItem xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ mb: 0.5, bgcolor: '#6366f1', height: '32px' }}
                    >
                      {rowIndex * 2 + 1}
                    </Button>
                  </GridItem>
                  <GridItem xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary" 
                      size="small"
                      sx={{ mb: 0.5, bgcolor: '#6366f1', height: '32px' }}
                    >
                      {rowIndex * 2 + 2}
                    </Button>
                  </GridItem>
                </React.Fragment>
              ))}
            </Grid>
            
            <Typography variant="caption" color="error" align="center" sx={{ display: 'block', mt: 0.5 }}>
              Nhóm 1: Chưa chốt
            </Typography>
          </Box>
        </GridItem>
        
        <GridItem xs={4}>
          <Box sx={{ border: '1px solid #e0e0e0', p: 1, borderRadius: '4px' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Nhóm 2
            </Typography>
            
            <Grid container spacing={0.5}>
              {[...Array(10)].map((_, rowIndex) => (
                <React.Fragment key={`row-${rowIndex}`}>
                  <GridItem xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ mb: 0.5, bgcolor: '#6366f1', height: '32px' }}
                    >
                      {rowIndex * 2 + 21}
                    </Button>
                  </GridItem>
                  <GridItem xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ mb: 0.5, bgcolor: '#6366f1', height: '32px' }}
                    >
                      {rowIndex * 2 + 22}
                    </Button>
                  </GridItem>
                </React.Fragment>
              ))}
            </Grid>
            
            <Typography variant="caption" color="error" align="center" sx={{ display: 'block', mt: 0.5 }}>
              Nhóm 2: Chưa chốt
            </Typography>
          </Box>
        </GridItem>
        
        <GridItem xs={4}>
          <Box sx={{ border: '1px solid #e0e0e0', p: 1, borderRadius: '4px' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Nhóm 3
            </Typography>
            
            <Grid container spacing={0.5}>
              {[...Array(10)].map((_, rowIndex) => (
                <React.Fragment key={`row-${rowIndex}`}>
                  <GridItem xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ mb: 0.5, bgcolor: '#6366f1', height: '32px' }}
                    >
                      {rowIndex * 2 + 41}
                    </Button>
                  </GridItem>
                  <GridItem xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ mb: 0.5, bgcolor: '#6366f1', height: '32px' }}
                    >
                      {rowIndex * 2 + 42}
                    </Button>
                  </GridItem>
                </React.Fragment>
              ))}
            </Grid>
            
            <Typography variant="caption" color="error" align="center" sx={{ display: 'block', mt: 0.5 }}>
              Nhóm 3: Chưa chốt
            </Typography>
          </Box>
        </GridItem>
      </Grid>
      
      <Box sx={{ mt: 1, mb: 1, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Chưa có thí sinh nào được chọn
        </Typography>
      </Box>
      
      <Grid container spacing={1}>
        <GridItem xs={2}>
          <Box sx={{ 
            p: 0.5, 
            borderRadius: '4px',
            bgcolor: '#6366f1',
            color: 'white',
            textAlign: 'center'
          }}>
            <Typography variant="caption">
              Đang thi
            </Typography>
          </Box>
        </GridItem>
        <GridItem xs={2}>
          <Box sx={{ 
            p: 0.5, 
            borderRadius: '4px',
            bgcolor: '#f59e0b',
            color: 'white',
            textAlign: 'center'
          }}>
            <Typography variant="caption">
              Xác nhận 1
            </Typography>
          </Box>
        </GridItem>
        <GridItem xs={2}>
          <Box sx={{ 
            p: 0.5, 
            borderRadius: '4px',
            bgcolor: '#f59e0b',
            color: 'white',
            textAlign: 'center'
          }}>
            <Typography variant="caption">
              Xác nhận 2
            </Typography>
          </Box>
        </GridItem>
        <GridItem xs={2}>
          <Box sx={{ 
            p: 0.5, 
            borderRadius: '4px',
            bgcolor: '#10b981',
            color: 'white',
            textAlign: 'center'
          }}>
            <Typography variant="caption">
              Đã loại
            </Typography>
          </Box>
        </GridItem>
        <GridItem xs={2}>
          <Box sx={{ 
            p: 0.5, 
            borderRadius: '4px',
            bgcolor: '#10b981',
            color: 'white',
            textAlign: 'center'
          }}>
            <Typography variant="caption">
              Đúng câu
            </Typography>
          </Box>
        </GridItem>
        <GridItem xs={2}>
          <Box sx={{ 
            p: 0.5, 
            borderRadius: '4px',
            bgcolor: '#6b7280',
            color: 'white',
            textAlign: 'center'
          }}>
            <Typography variant="caption">
              Qua vòng
            </Typography>
          </Box>
        </GridItem>
      </Grid>
      
      <Grid container spacing={1} sx={{ mt: 1 }}>
        <GridItem xs={6}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="small"
            sx={{ height: '40px' }}
          >
            Hiển thị sơ đồ
          </Button>
        </GridItem>
        <GridItem xs={6}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="small"
            sx={{ height: '40px' }}
          >
            Hiển thị ứng dụng & Cập nhật sơ liệu câu trả lời
          </Button>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default ContestantsControl; 