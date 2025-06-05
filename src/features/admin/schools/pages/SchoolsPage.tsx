import React from 'react';
import { 
  Box, 
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import SchoolList from '../components/SchoolList';
import { useSchools } from '../hooks';
import type { SchoolFilter } from '../types/school';

const SchoolsPage: React.FC = () => {
  const { schools, loading, error, filter, updateFilter, totalPages } = useSchools();

  const handleFilterChange = (newFilter: SchoolFilter) => {
    updateFilter(newFilter);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Quản lý trường học</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/admin/schools/create"
        >
          Thêm trường học
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, position: 'relative' }}>
        {loading && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 1
          }}>
            <CircularProgress />
          </Box>
        )}

        <SchoolList 
          schools={schools} 
          filter={filter}
          onFilterChange={handleFilterChange}
          totalPages={totalPages}
        />
      </Paper>
    </Box>
  );
};

export default SchoolsPage; 