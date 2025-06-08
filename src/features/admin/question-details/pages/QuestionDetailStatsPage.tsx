import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Breadcrumbs, 
  Link, 
  Paper
} from '@mui/material';
import { 
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { QuestionDetailStats } from '../components';

const QuestionDetailStatsPage: React.FC = () => {
  const { packageId } = useParams<{ packageId?: string }>();
  const packageIdNumber = packageId ? parseInt(packageId) : undefined;

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />} 
          aria-label="breadcrumb"
          sx={{ mb: 2 }}
        >
          <Link 
            color="inherit" 
            href="/admin/dashboard"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
            Trang chủ
          </Link>
          {packageId ? (
            <>
              <Link color="inherit" href="/admin/question-packages">
                Gói câu hỏi
              </Link>
              <Link color="inherit" href={`/admin/question-packages/${packageId}`}>
                Chi tiết gói
              </Link>
              <Typography color="text.primary">Thống kê</Typography>
            </>
          ) : (
            <>
              <Link color="inherit" href="/admin/question-details">
                Quản lý câu hỏi
              </Link>
              <Typography color="text.primary">Thống kê</Typography>
            </>
          )}
        </Breadcrumbs>

        {/* Tiêu đề trang */}
        <Typography variant="h4" component="h1" gutterBottom>
          {packageId ? 'Thống kê câu hỏi trong gói' : 'Thống kê tổng quan về câu hỏi'}
        </Typography>

        {/* Thống kê */}
        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          <QuestionDetailStats packageId={packageIdNumber} />
        </Paper>
      </Box>
    </Container>
  );
};

export default QuestionDetailStatsPage; 