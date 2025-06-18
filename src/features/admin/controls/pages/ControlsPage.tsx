import { Button, Paper, Typography, Box, Drawer, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import React, { useState } from 'react';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

// Import các component từ thư mục components
import {
  QuestionControl,
  AnswerControl,
  ContestantsControl,
  GoldControl,
  RescueControl,
  SupplierVideo,
  ContestantsResult,
  Chart
} from '../components';

const DRAWER_WIDTH = 240;

const ControlsPage: React.FC = () => {
  // Giữ lại state mặc dù chưa sử dụng để sau này có thể cập nhật
  const [currentQuestion] = useState<number>(1);
  const [score] = useState<number>(60);
  
  // Mock data cho danh sách câu hỏi - sau này có thể lấy từ API
  const questions = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    title: `Câu hỏi ${i + 1}`,
    status: i < currentQuestion ? 'completed' : i === currentQuestion - 1 ? 'current' : 'pending'
  }));

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: '#f5f5f5',
            border: 'none',
            position: 'relative'
          },
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="subtitle1" sx={{ p: 0.5, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
            Danh sách câu hỏi
          </Typography>
          <List sx={{ 
            flex: 1, 
            overflow: 'auto',
            py: 0,
            '& .MuiListItem-root': {
              py: 0.25
            }
          }}>
            {questions.map((question) => (
              <ListItem
                key={question.id}
                sx={{
                  bgcolor: question.status === 'current' ? '#e3f2fd' : 'transparent',
                  '&:hover': { bgcolor: '#f5f5f5' },
                  borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <QuestionMarkIcon 
                    fontSize="small"
                    color={question.status === 'completed' ? 'success' : 
                           question.status === 'current' ? 'primary' : 'action'}
                  />
                </ListItemIcon>
                <ListItemText 
                  primary={question.title}
                  secondary={question.status === 'completed' ? 'Đã hoàn thành' : 
                            question.status === 'current' ? 'Đang thực hiện' : 'Chưa bắt đầu'}
                  primaryTypographyProps={{ variant: 'subtitle2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main content */}
      <Box component="main" sx={{ 
        flexGrow: 1, 
        height: '100vh',
        overflow: 'auto',
        bgcolor: '#f5f7fa',
        p: 1,
        textAlign: 'center'
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center' }}>
          {/* Status Controls */}
          <Paper elevation={0} sx={{ p: 0.5, width: '100%' }}>
            <Typography variant="subtitle1" sx={{ mb: 0.5 }} align="center">
              Trạng thái điều khiển
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Box sx={{ flex: 1 }}>
                <Paper variant="outlined" sx={{ p: 0.5, bgcolor: '#e8f5e9', textAlign: 'center' }}>
                  <Typography variant="subtitle2" align="center">Kết nối</Typography>
                  <Typography variant="caption" align="center" display="block">Đã kết nối máy chiếu</Typography>
                </Paper>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Paper variant="outlined" sx={{ p: 0.5, bgcolor: '#e3f2fd', textAlign: 'center' }}>
                  <Typography variant="subtitle2" align="center">Trạng thái</Typography>
                  <Typography variant="caption" align="center" display="block">Sẵn sàng hiển thị</Typography>
                </Paper>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Paper variant="outlined" sx={{ p: 0.5, bgcolor: '#e8f5e9', textAlign: 'center' }}>
                  <Typography variant="subtitle2" align="center">Socket.IO</Typography>
                  <Typography variant="caption" align="center" display="block">Đã kết nối</Typography>
                </Paper>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Paper variant="outlined" sx={{ p: 0.5, bgcolor: '#f3e5f5', textAlign: 'center' }}>
                  <Typography variant="subtitle2" align="center">Đang chiếu</Typography>
                  <Typography variant="caption" align="center" display="block">Câu hỏi {currentQuestion}</Typography>
                </Paper>
              </Box>
            </Box>
          </Paper>

          {/* Display Controls */}
          <Paper elevation={0} sx={{ p: 0.5, width: '100%' }}>
            <Typography variant="subtitle1" sx={{ mb: 0.5 }} align="center">
              Điều khiển hiển thị
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Box sx={{ flex: 1 }}>
                <Button fullWidth variant="contained" color="primary" size="small" sx={{ height: '40px' }}>
                  Màn hình chờ
                </Button>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Button fullWidth variant="contained" color="success" size="small" sx={{ height: '40px' }}>
                  Sơ đồ trận
                </Button>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Button fullWidth variant="contained" color="secondary" size="small" sx={{ height: '40px' }}>
                  Lấy mã trận đấu
                </Button>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Button fullWidth variant="contained" color="error" size="small" sx={{ height: '40px' }}>
                  Kết thúc
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* Question Control and Score */}
          <Box sx={{ display: 'flex', gap: 0.5, width: '100%' }}>
            <Box sx={{ flex: 2 }}>
              <Paper elevation={0} sx={{ p: 0.5 }}>
                <Typography variant="subtitle1" sx={{ mb: 0.5 }} align="center">
                  Điều khiển câu hỏi
                </Typography>
                <Box sx={{ p: 0.5 }}>
                  <QuestionControl />
                </Box>
              </Paper>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Paper elevation={0} sx={{ p: 0.5 }}>
                <Typography variant="subtitle1" sx={{ mb: 0.5 }} align="center">
                  Câu {currentQuestion}
                </Typography>
                <Typography variant="h4" align="center" color="error">
                  {score}/60
                </Typography>
              </Paper>
            </Box>
          </Box>

          {/* Answer Control and Rescue Control */}
          <Box sx={{ display: 'flex', gap: 0.5, width: '100%' }}>
            <Box sx={{ flex: 2 }}>
              <Paper elevation={0} sx={{ p: 0.5 }}>
                <Typography variant="subtitle1" sx={{ mb: 0.5 }} align="center">
                  Điều khiển đáp án
                </Typography>
                <AnswerControl />
              </Paper>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Paper elevation={0} sx={{ p: 0.5 }}>
                <Typography variant="subtitle1" sx={{ mb: 0.5 }} align="center">
                  Điều khiển trợ giúp
                </Typography>
                <RescueControl />
              </Paper>
            </Box>
          </Box>

          {/* Contestants */}
          <Paper elevation={0} sx={{ p: 0.5, width: '100%' }}>
            <Typography variant="subtitle1" sx={{ mb: 0.5 }} align="center">
              Thi sinh trận đấu
            </Typography>
            <ContestantsControl />
          </Paper>

          {/* Gold Question and Results */}
          <Box sx={{ display: 'flex', gap: 0.5, width: '100%' }}>
            <Box sx={{ flex: 1 }}>
              <Paper elevation={0} sx={{ p: 0.5 }}>
                <Typography variant="subtitle1" sx={{ mb: 0.5 }} align="center">
                  Câu hỏi Gold
                </Typography>
                <GoldControl />
              </Paper>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Paper elevation={0} sx={{ p: 0.5 }}>
                <Typography variant="subtitle1" sx={{ mb: 0.5 }} align="center">
                  Danh sách 20 thí sinh qua vòng
                </Typography>
                <ContestantsResult />
              </Paper>
            </Box>
          </Box>

          {/* Supplier Video */}
          <Paper elevation={0} sx={{ p: 0.5, width: '100%' }}>
            <Typography variant="subtitle1" sx={{ mb: 0.5 }} align="center">
              Video Nhà Tài Trợ
            </Typography>
            <SupplierVideo />
          </Paper>

          {/* Statistics */}
          <Paper elevation={0} sx={{ p: 0.5, width: '100%' }}>
            <Typography variant="subtitle1" sx={{ mb: 0.5 }} align="center">
              Thống kê
            </Typography>
            <Chart />
          </Paper>

          {/* Back to Home */}
          <Button 
            fullWidth 
            variant="contained" 
            color="error"
            size="small"
            sx={{ height: '40px', mt: 0.5 }}
          >
            Quay lại trang chủ
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ControlsPage; 