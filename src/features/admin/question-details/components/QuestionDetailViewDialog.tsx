import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Chip,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import type { QuestionDetail } from '../types';

interface QuestionDetailViewDialogProps {
  open: boolean;
  onClose: () => void;
  questionDetail: QuestionDetail | null;
  loading: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`question-detail-tabpanel-${index}`}
      aria-labelledby={`question-detail-tab-${index}`}
      style={{ width: '100%' }}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `question-detail-tab-${index}`,
    'aria-controls': `question-detail-tabpanel-${index}`,
  };
}

const QuestionDetailViewDialog: React.FC<QuestionDetailViewDialogProps> = ({
  open,
  onClose,
  questionDetail,
  loading
}) => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isFullScreen, setIsFullScreen] = useState(isMobile);
  
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleToggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Reset tab when dialog opens
  React.useEffect(() => {
    if (open) {
      setTabValue(0);
    }
  }, [open]);

  const renderQuestionDetails = () => {
    if (!questionDetail || !questionDetail.question) return null;
    
    const { question } = questionDetail;
    
    return (
      <Box sx={{ p: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Thông tin cơ bản</Typography>
          <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2, mb: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Loại câu hỏi</Typography>
                <Typography variant="body1">
                  {question.questionType === 'multiple_choice' ? 'Trắc nghiệm' : 'Tự luận'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Thứ tự</Typography>
                <Typography variant="body1">{questionDetail.questionOrder}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Độ khó</Typography>
                <Chip 
                  label={question.difficulty} 
                  color={
                    question.difficulty === 'Alpha' ? 'info' :
                    question.difficulty === 'Beta' ? 'warning' :
                    question.difficulty === 'Gold' ? 'success' : 'default'
                  }
                  size="small" 
                />
              </Box>
            </Box>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mb: 2 }}>
              {/* <Box>
                <Typography variant="subtitle2" color="text.secondary">Điểm số</Typography>
                <Typography variant="body1">{question.score || 'N/A'} điểm</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Thời gian làm bài</Typography>
                <Typography variant="body1">{question.defaultTime || 'N/A'} giây</Typography>
              </Box> */}
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Trạng thái</Typography>
              <Chip 
                label={questionDetail.isActive ? 'Đang hoạt động' : 'Vô hiệu hóa'} 
                color={questionDetail.isActive ? "success" : "error"}
                size="small" 
              />
            </Box>
          </Paper>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Nội dung câu hỏi</Typography>
          <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
            <Box 
              dangerouslySetInnerHTML={{ __html: question.content || '' }}
              sx={{ 
                '& img': { maxWidth: '100%', height: 'auto' },
                '& p': { margin: '0.5em 0' },
                '& ul, & ol': { paddingLeft: '1.5em' }
              }}
            />
          </Paper>
        </Box>
        
        {/* {question.questionType === 'multiple_choice' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>Đáp án</Typography>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
              {Array.isArray(question.options) && question.options.map((option: string, index: number) => (
                <Box 
                  key={index}
                  sx={{ 
                    p: 1.5, 
                    mb: 1, 
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: option === question.correctAnswer ? 'primary.main' : 'divider',
                    bgcolor: option === question.correctAnswer ? 'primary.light' : 'transparent',
                    color: option === question.correctAnswer ? 'primary.contrastText' : 'text.primary',
                  }}
                >
                  <Typography variant="body1">
                    {option === question.correctAnswer && '✓ '}{option}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Box>
        )}

        {question.questionType === 'essay' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>Đáp án mẫu</Typography>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {question.correctAnswer || 'Không có đáp án mẫu'}
              </Typography>
            </Paper>
          </Box>
        )}
         */}
        {/* {question.explanation && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>Giải thích</Typography>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
              <Box 
                dangerouslySetInnerHTML={{ __html: question.explanation }}
                sx={{ 
                  '& img': { maxWidth: '100%', height: 'auto' },
                  '& p': { margin: '0.5em 0' },
                  '& ul, & ol': { paddingLeft: '1.5em' }
                }}
              />
            </Paper>
          </Box>
        )} */}

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Thông tin thêm</Typography>
          <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">ID câu hỏi</Typography>
                <Typography variant="body1">{questionDetail?.question?.id || 'N/A'}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Ngày tạo</Typography>
                <Typography variant="body1">
                  {questionDetail.createdAt ? new Date(questionDetail.createdAt).toLocaleString() : 'N/A'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Ngày cập nhật</Typography>
                <Typography variant="body1">
                  {questionDetail.updatedAt ? new Date(questionDetail.updatedAt).toLocaleString() : 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    );
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      fullScreen={isFullScreen}
      PaperProps={{
        sx: {
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pr: 1,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Typography variant="h6">Chi tiết câu hỏi</Typography>
        <Box>
          <IconButton onClick={handleToggleFullScreen} size="small">
            {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
          <IconButton 
            aria-label="close" 
            onClick={onClose} 
            size="small"
            sx={{ ml: 1 }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="question detail tabs"
          variant={isMobile ? "fullWidth" : "standard"}
        >
          <Tab label="Chi tiết câu hỏi" {...a11yProps(0)} />
          <Tab label="Thông tin trong gói" {...a11yProps(1)} />
        </Tabs>
      </Box>
      
      <DialogContent 
        dividers 
        sx={{ 
          p: 0, 
          display: 'flex', 
          flexDirection: 'column',
          flex: 1,
          overflow: 'auto'
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TabPanel value={tabValue} index={0}>
              {renderQuestionDetails()}
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Thông tin trong gói</Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">Thứ tự câu hỏi</Typography>
                    <Typography variant="body1">{questionDetail?.questionOrder || 'N/A'}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">Trạng thái</Typography>
                    <Chip 
                      label={questionDetail?.isActive ? 'Đang hoạt động' : 'Vô hiệu hóa'} 
                      color={questionDetail?.isActive ? "success" : "error"}
                      size="small" 
                    />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Gói câu hỏi</Typography>
                    <Typography variant="body1">{questionDetail?.questionPackageId || 'N/A'}</Typography>
                  </Box>
                </Paper>
              </Box>
            </TabPanel>
          </>
        )}
      </DialogContent>
      
      <DialogActions sx={{ borderTop: '1px solid', borderColor: 'divider', p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuestionDetailViewDialog; 