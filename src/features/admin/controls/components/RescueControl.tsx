import React from 'react';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { GridItem } from '../../../../components/Grid';

interface RescueControlProps {
  className?: string;
}

const RescueControl: React.FC<RescueControlProps> = () => {
  return (
    <Grid container spacing={1}>
      {/* Cứu trợ 1 */}
      <GridItem xs={6}>
        <Box sx={{ border: '1px solid #e0e0e0', p: 1, borderRadius: '4px' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Cứu trợ 1
          </Typography>
          
          <Box sx={{ 
            bgcolor: '#f5f5f5', 
            p: 1, 
            borderRadius: '4px',
            mb: 1,
            minHeight: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography variant="caption" color="text.secondary">
              Chưa có thí sinh nào được cứu
            </Typography>
          </Box>
          
          <TextField
            fullWidth
            placeholder="Nhập điểm cứu trợ"
            variant="outlined"
            size="small"
            sx={{ mb: 1 }}
          />
          
          <Grid container spacing={1}>
            <GridItem xs={6}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="small"
                sx={{ height: '40px' }}
              >
                Tính điểm cứu trợ
              </Button>
            </GridItem>
            <GridItem xs={6}>
              <Button
                fullWidth
                variant="contained"
                color="inherit"
                size="small"
                sx={{ height: '40px', bgcolor: '#757575' }}
              >
                0 / 0
                <Box component="span" sx={{ ml: 0.5, fontSize: '0.7rem' }}>
                  Xác nhận
                </Box>
              </Button>
            </GridItem>
          </Grid>
          
          <Box sx={{ 
            mt: 1, 
            p: 0.5, 
            bgcolor: '#fff3cd', 
            borderRadius: 1,
            border: '1px solid #ffeeba',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Box sx={{ color: '#856404', mr: 0.5, fontSize: '14px' }}>⚠</Box>
            <Typography variant="caption" color="#856404">
              Tính điểm cứu trợ sau khi thí sinh vào đó
            </Typography>
          </Box>
          
          <Box sx={{ 
            mt: 1, 
            p: 0.5, 
            bgcolor: '#fff3cd', 
            borderRadius: 1,
            border: '1px solid #ffeeba',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Box sx={{ color: '#856404', mr: 0.5, fontSize: '14px' }}>⚠</Box>
            <Typography variant="caption" color="#856404">
              Lưu ý: khi nhấn cứu trợ sẽ cập nhật trong thời thế sinh thành đang thi
            </Typography>
          </Box>
        </Box>
      </GridItem>
      
      {/* Cứu trợ 2 */}
      <GridItem xs={6}>
        <Box sx={{ border: '1px solid #e0e0e0', p: 1, borderRadius: '4px' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Cứu trợ 2
          </Typography>
          
          <Box sx={{ 
            bgcolor: '#f5f5f5', 
            p: 1, 
            borderRadius: '4px',
            mb: 1,
            minHeight: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography variant="caption" color="text.secondary">
              Chưa có thí sinh nào được cứu
            </Typography>
          </Box>
          
          <TextField
            fullWidth
            placeholder="Nhập điểm cứu trợ"
            variant="outlined"
            size="small"
            sx={{ mb: 1 }}
          />
          
          <Grid container spacing={1}>
            <GridItem xs={6}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="small"
                sx={{ height: '40px' }}
              >
                Tính điểm cứu trợ
              </Button>
            </GridItem>
            <GridItem xs={6}>
              <Button
                fullWidth
                variant="contained"
                color="inherit"
                size="small"
                sx={{ height: '40px', bgcolor: '#757575' }}
              >
                0 / 0
                <Box component="span" sx={{ ml: 0.5, fontSize: '0.7rem' }}>
                  Xác nhận
                </Box>
              </Button>
            </GridItem>
          </Grid>
          
          <Box sx={{ 
            mt: 1, 
            p: 0.5, 
            bgcolor: '#fff3cd', 
            borderRadius: 1,
            border: '1px solid #ffeeba',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Box sx={{ color: '#856404', mr: 0.5, fontSize: '14px' }}>⚠</Box>
            <Typography variant="caption" color="#856404">
              Tính điểm cứu trợ sau khi thí sinh vào đó
            </Typography>
          </Box>
          
          <Box sx={{ 
            mt: 1, 
            p: 0.5, 
            bgcolor: '#fff3cd', 
            borderRadius: 1,
            border: '1px solid #ffeeba',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Box sx={{ color: '#856404', mr: 0.5, fontSize: '14px' }}>⚠</Box>
            <Typography variant="caption" color="#856404">
              Lưu ý: khi nhấn cứu trợ sẽ cập nhật trong thời thế sinh thành đang thi
            </Typography>
          </Box>
        </Box>
      </GridItem>
      
      {/* Phao cứu sinh */}
      <GridItem xs={12}>
        <Box sx={{ 
          bgcolor: '#6c757d', 
          color: 'white',
          p: 1, 
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          <Typography variant="subtitle2">
            Phao cứu sinh
          </Typography>
        </Box>
        
        <Box sx={{ 
          mt: 1, 
          p: 0.5, 
          bgcolor: '#fff3cd', 
          borderRadius: 1,
          border: '1px solid #ffeeba',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Box sx={{ color: '#856404', mr: 0.5, fontSize: '14px' }}>⚠</Box>
          <Typography variant="caption" color="#856404">
            Cập nhật trong thời thế phao cứu sinh cho hai hiển thị
          </Typography>
        </Box>
      </GridItem>
    </Grid>
  );
};

export default RescueControl; 