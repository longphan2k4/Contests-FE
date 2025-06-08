import React from 'react';
import { Box } from '@mui/material';
import QuestionPackageList from '../components/QuestionPackageList';
import type { QuestionPackage } from '../types/questionPackage';

const QuestionPackageListPage: React.FC = () => {
  const handleView = (questionPackage: QuestionPackage) => {
    // TODO: Xử lý xem chi tiết gói câu hỏi
    console.log('View question package:', questionPackage);
  };

  return (
    <Box sx={{ p: 3 }}>
      <QuestionPackageList onView={handleView} />
    </Box>
  );
};

export default QuestionPackageListPage; 