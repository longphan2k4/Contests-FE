import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
  Card,
  CardContent,
  Collapse,
  IconButton
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import type { ResultFilterParams, FilterState } from '../types';

interface ResultsFilterProps {
  onFilter: (params: ResultFilterParams) => void;
  uniqueRounds?: { id: number; name: string }[];
  uniqueMatches?: { id: number; name: string }[];
}

const ResultsFilter: React.FC<ResultsFilterProps> = ({ 
  onFilter, 
  uniqueRounds = [], 
  uniqueMatches = [] 
}) => {
  const [filterState, setFilterState] = useState<FilterState>({
    studentName: '',
    matchName: '',
    roundId: '',
    isCorrect: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const [expanded, setExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Cập nhật active filters khi filterState thay đổi
  useEffect(() => {
    const filters: string[] = [];
    if (filterState.studentName) filters.push(`Tên: ${filterState.studentName}`);
    if (filterState.matchName) filters.push(`Trận: ${filterState.matchName}`);
    if (filterState.roundId) {
      const round = uniqueRounds.find(r => r.id.toString() === filterState.roundId);
      if (round) filters.push(`Vòng: ${round.name}`);
    }
    if (filterState.isCorrect !== 'all') {
      filters.push(`Kết quả: ${filterState.isCorrect === 'true' ? 'Đúng' : 'Sai'}`);
    }
    setActiveFilters(filters);
  }, [filterState, uniqueRounds]);

  const handleInputChange = (field: keyof FilterState, value: string) => {
    setFilterState(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    const params: ResultFilterParams = {};
    
    if (filterState.studentName.trim()) {
      params.studentName = filterState.studentName.trim();
    }
    
    if (filterState.matchName.trim()) {
      params.matchName = filterState.matchName.trim();
    }
    
    if (filterState.roundId) {
      params.roundId = parseInt(filterState.roundId, 10);
    }
    
    if (filterState.isCorrect !== 'all') {
      params.isCorrect = filterState.isCorrect === 'true';
    }

    if (filterState.sortBy) {
      params.sortBy = filterState.sortBy as 'createdAt' | 'questionOrder' | 'studentName' | 'matchName';
    }

    if (filterState.sortOrder) {
      params.sortOrder = filterState.sortOrder as 'asc' | 'desc';
    }
    
    onFilter(params);
  };

  const handleClear = () => {
    const clearedState: FilterState = {
      studentName: '',
      matchName: '',
      roundId: '',
      isCorrect: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    setFilterState(clearedState);
    onFilter({});
  };

  const handleRemoveFilter = (filterIndex: number) => {
    const newState = { ...filterState };
    
    if (filterIndex === 0 && filterState.studentName) {
      newState.studentName = '';
    } else if (filterIndex === 1 && filterState.matchName) {
      newState.matchName = '';
    } else if (filterIndex === 2 && filterState.roundId) {
      newState.roundId = '';
    } else if (filterIndex === 3 && filterState.isCorrect !== 'all') {
      newState.isCorrect = 'all';
    }
    
    setFilterState(newState);
  };

  return (
    <Card elevation={2} sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterAltIcon color="primary" />
            Bộ lọc kết quả
          </Typography>
          <IconButton
            onClick={() => setExpanded(!expanded)}
            sx={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Bộ lọc đang áp dụng:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {activeFilters.map((filter, index) => (
                <Chip
                  key={index}
                  label={filter}
                  onDelete={() => handleRemoveFilter(index)}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              ))}
              <Chip
                label="Xóa tất cả"
                onClick={handleClear}
                color="default"
                variant="outlined"
                size="small"
                deleteIcon={<ClearIcon />}
                onDelete={handleClear}
              />
            </Box>
          </Box>
        )}

        <Collapse in={!expanded}>
          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { 
                xs: '1fr', 
                sm: 'repeat(2, 1fr)', 
                md: 'repeat(3, 1fr)' 
              }, 
              gap: 3,
              mb: 3
            }}>
              {/* Tìm kiếm theo tên thí sinh */}
              <TextField
                fullWidth
                label="Tìm theo tên thí sinh"
                variant="outlined"
                size="small"
                value={filterState.studentName}
                onChange={(e) => handleInputChange('studentName', e.target.value)}
                placeholder="Nhập tên thí sinh..."
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />

              {/* Tìm kiếm theo tên trận */}
              <Autocomplete
                options={uniqueMatches}
                getOptionLabel={(option) => option.name}
                value={uniqueMatches.find(m => m.name === filterState.matchName) || null}
                onChange={(_, newValue) => handleInputChange('matchName', newValue?.name || '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Chọn trận đấu"
                    size="small"
                    placeholder="Tất cả trận đấu"
                  />
                )}
                size="small"
              />

              {/* Lọc theo vòng */}
              <FormControl fullWidth size="small">
                <InputLabel id="round-select-label">Vòng thi</InputLabel>
                <Select
                  labelId="round-select-label"
                  value={filterState.roundId}
                  onChange={(e) => handleInputChange('roundId', e.target.value)}
                  label="Vòng thi"
                >
                  <MenuItem value="">Tất cả vòng</MenuItem>
                  {uniqueRounds.map((round) => (
                    <MenuItem key={round.id} value={round.id.toString()}>
                      {round.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Lọc theo kết quả */}
              <FormControl fullWidth size="small">
                <InputLabel id="result-select-label">Kết quả</InputLabel>
                <Select
                  labelId="result-select-label"
                  value={filterState.isCorrect}
                  onChange={(e) => handleInputChange('isCorrect', e.target.value)}
                  label="Kết quả"
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="true">Đúng</MenuItem>
                  <MenuItem value="false">Sai</MenuItem>
                </Select>
              </FormControl>

              {/* Sắp xếp theo */}
              <FormControl fullWidth size="small">
                <InputLabel id="sort-by-label">Sắp xếp theo</InputLabel>
                <Select
                  labelId="sort-by-label"
                  value={filterState.sortBy}
                  onChange={(e) => handleInputChange('sortBy', e.target.value)}
                  label="Sắp xếp theo"
                >
                  <MenuItem value="createdAt">Thời gian tạo</MenuItem>
                  <MenuItem value="questionOrder">Thứ tự câu hỏi</MenuItem>
                  <MenuItem value="studentName">Tên thí sinh</MenuItem>
                  <MenuItem value="matchName">Tên trận đấu</MenuItem>
                </Select>
              </FormControl>

              {/* Thứ tự */}
              <FormControl fullWidth size="small">
                <InputLabel id="sort-order-label">Thứ tự</InputLabel>
                <Select
                  labelId="sort-order-label"
                  value={filterState.sortOrder}
                  onChange={(e) => handleInputChange('sortOrder', e.target.value)}
                  label="Thứ tự"
                >
                  <MenuItem value="desc">Giảm dần</MenuItem>
                  <MenuItem value="asc">Tăng dần</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              gap: 2,
              mt: 3,
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider'
            }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleClear}
                startIcon={<ClearIcon />}
              >
                Xóa bộ lọc
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                startIcon={<FilterAltIcon />}
              >
                Áp dụng
              </Button>
            </Box>
          </Box>
        </Collapse>

        {/* Quick Actions when collapsed */}
        {!expanded && (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Tìm nhanh theo tên thí sinh..."
              value={filterState.studentName}
              onChange={(e) => handleInputChange('studentName', e.target.value)}
              sx={{ flex: 1, maxWidth: 300 }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleSubmit}
              startIcon={<FilterAltIcon />}
            >
              Lọc
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultsFilter; 