import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  CircularProgress,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  useMediaQuery,
  useTheme
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import useResults from '../hooks/useResults';
import ResultsFilter from '../components/ResultsFilter';
import ResultsChart from '../components/ResultsChart';
import ResultsTable from '../components/ResultsTable';
import type { ResultFilterParams } from '../types';

const ResultsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10
  });

  const { 
    results, 
    isLoading, 
    error, 
    fetchResults,
    getResultSummary,
    totalPages,
    totalResults
  } = useResults();

  const handleFilter = (params: ResultFilterParams) => {
    fetchResults({ ...params, page: filter.page, limit: filter.limit });
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setFilter(prev => ({ ...prev, page: value }));
    fetchResults({ page: value, limit: filter.limit });
  };

  const handleChangeRowsPerPage = (event: SelectChangeEvent<string>) => {
    const newLimit = Number(event.target.value);
    setFilter(prev => ({ ...prev, limit: newLimit, page: 1 }));
    fetchResults({ limit: newLimit, page: 1 });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Kết quả cuộc thi
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Bộ lọc */}
        <Box>
          <ResultsFilter onFilter={handleFilter} />
        </Box>

        {/* Thống kê và biểu đồ */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Thống kê kết quả
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {/* Biểu đồ */}
            <Box sx={{ flex: 2 }}>
              {!isLoading && !error && (
                <ResultsChart 
                  summary={getResultSummary()} 
                  results={results}
                />
              )}
            </Box>
            {/* Thống kê tổng quan */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: { xs: 'flex-start', md: 'center' }, minWidth: 220 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Tổng số kết quả: <strong>{totalResults}</strong>
              </Typography>
              <Typography variant="body1" color="primary" sx={{ mb: 1 }}>
                Số trang: <strong>{totalPages}</strong>
              </Typography>
              <Typography variant="body1" color="success.main" sx={{ mb: 1 }}>
                Đáp án đúng: <strong>{getResultSummary().correctAnswers}</strong>
              </Typography>
              <Typography variant="body1" color="error.main" sx={{ mb: 1 }}>
                Đáp án sai: <strong>{getResultSummary().incorrectAnswers}</strong>
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Tỷ lệ chính xác: <strong>{getResultSummary().accuracy.toFixed(2)}%</strong>
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Bảng kết quả */}
        <Box>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="error">{error}</Typography>
            </Box>
          ) : (
            <>
              <ResultsTable 
                results={results} 
              />
              
              {/* Phân trang */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mt: 2,
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 2
                }}>
                  <FormControl variant="outlined" size="small" sx={{ minWidth: 100 }}>
                    <InputLabel id="page-size-select-label">Hiển thị</InputLabel>
                    <Select
                      labelId="page-size-select-label"
                      value={String(filter.limit)}
                      onChange={handleChangeRowsPerPage}
                      label="Hiển thị"
                    >
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={25}>25</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {totalPages > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <Pagination
                      count={totalPages}
                      page={filter.page}
                      onChange={handlePageChange}
                      showFirstButton 
                      showLastButton  
                      color="primary"
                      size={isMobile ? "small" : "medium"}
                      siblingCount={isMobile ? 0 : 1}
                    />
                    <Typography sx={{ ml: 2, minWidth: 100, textAlign: 'right' }}>
                      Trang {filter.page} / {totalPages}
                    </Typography>
                  </Box>
                )}
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ResultsPage; 