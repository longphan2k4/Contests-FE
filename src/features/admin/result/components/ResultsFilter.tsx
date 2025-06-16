import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Box,
  Typography
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import type { ResultFilterParams } from '../types';

interface ResultsFilterProps {
  onFilter: (params: ResultFilterParams) => void;
}

const ResultsFilter: React.FC<ResultsFilterProps> = ({ onFilter }) => {
  const [matchId, setMatchId] = useState<string>('');
  const [contestantId, setContestantId] = useState<string>('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    const params: ResultFilterParams = {};
    
    if (matchId) {
      params.matchId = parseInt(matchId, 10);
    }
    
    if (contestantId) {
      params.contestantId = parseInt(contestantId, 10);
    }
    
    onFilter(params);
  };

  const handleClear = () => {
    setMatchId('');
    setContestantId('');
    onFilter({});
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Bộ lọc kết quả
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2,
          alignItems: 'center'
        }}>
          <Box sx={{ flex: '1 1 40%', minWidth: '200px' }}>
            <TextField
              fullWidth
              label="ID Trận đấu"
              variant="outlined"
              size="small"
              value={matchId}
              onChange={(e) => setMatchId(e.target.value)}
              type="number"
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Box>
          <Box sx={{ flex: '1 1 40%', minWidth: '200px' }}>
            <TextField
              fullWidth
              label="ID Thí sinh"
              variant="outlined"
              size="small"
              value={contestantId}
              onChange={(e) => setContestantId(e.target.value)}
              type="number"
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Box>
          <Box sx={{ 
            flex: '0 0 auto',
            display: 'flex',
            gap: 1,
            minWidth: '150px'
          }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              startIcon={<FilterAltIcon />}
              fullWidth
            >
              Lọc
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleClear}
            >
              Xóa
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default ResultsFilter; 