import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { GridItem } from '../../../../components/Grid';

interface QuestionControlProps {
  className?: string;
}

const QuestionControl: React.FC<QuestionControlProps> = () => {
  const [counter, setCounter] = useState<number>(30);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [inputTime, setInputTime] = useState<string>('30');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && counter > 0) {
      interval = setInterval(() => {
        setCounter((prevCounter) => prevCounter - 1);
      }, 1000);
    } else if (counter === 0) {
      setIsRunning(false);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, counter]);

  const handleStart = () => {
    if (counter > 0) {
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleRestart = () => {
    setCounter(30);
    setIsRunning(false);
  };

  const handleUpdateTime = () => {
    const newTime = parseInt(inputTime);
    if (!isNaN(newTime) && newTime >= 0) {
      setCounter(newTime);
      setIsRunning(false);
    }
  };

  return (
    <Box sx={{ p: 1 }} >
      <Grid container spacing={1}>
        <GridItem xs={4}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="small"
            sx={{ height: '40px' }}
          >
            Intro
          </Button>
        </GridItem>
        <GridItem xs={4}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="small"
            sx={{ height: '40px' }}
          >
            Show
          </Button>
        </GridItem>
        <GridItem xs={4}>
          <Button
            fullWidth
            variant="contained"
            color="success"
            size="small"
            sx={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={handleStart}
            disabled={isRunning}
          >
            <Box component="span" sx={{ mr: 0.5 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5V19L19 12L8 5Z" fill="white" />
              </svg>
            </Box>
            Start
          </Button>
        </GridItem>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2 }}>
        <Typography variant="h3" component="div" color={counter <= 5 ? "error" : "primary"} sx={{ fontWeight: 'bold' }}>
          {counter}
        </Typography>
      </Box>

      <Grid container spacing={1}>
        <GridItem xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="inherit"
            size="small"
            sx={{ height: '40px', bgcolor: '#757575' }}
            onClick={handleRestart}
          >
            Restart
          </Button>
        </GridItem>
      </Grid>

      <Grid container spacing={1} sx={{ mt: 1 }}>
        <GridItem xs={8}>
          <TextField
            fullWidth
            placeholder="Nhập thời gian"
            variant="outlined"
            size="small"
            value={inputTime}
            onChange={(e) => setInputTime(e.target.value)}
            type="number"
          />
        </GridItem>
        <GridItem xs={4}>
          <Button
            fullWidth
            variant="contained"
            color="inherit"
            size="small"
            sx={{ height: '40px', bgcolor: '#757575' }}
            onClick={handleUpdateTime}
          >
            Update
          </Button>
        </GridItem>
      </Grid>

      <Typography variant="subtitle2" sx={{ mt: 1, mb: 0.5 }}>
        Điều khiển video/Audio
      </Typography>

      <Grid container spacing={1}>
        <GridItem xs={4}>
          <Button
            fullWidth
            variant="contained"
            color="inherit"
            size="small"
            sx={{ height: '40px', bgcolor: '#757575' }}
            onClick={handleStart}
            disabled={isRunning}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 5V19L19 12L8 5Z" fill="white" />
            </svg>
          </Button>
        </GridItem>
        <GridItem xs={4}>
          <Button
            fullWidth
            variant="contained"
            color="inherit"
            size="small"
            sx={{ height: '40px', bgcolor: '#757575' }}
            onClick={handlePause}
            disabled={!isRunning}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="white" />
            </svg>
          </Button>
        </GridItem>
        <GridItem xs={4}>
          <Button
            fullWidth
            variant="contained"
            color="inherit"
            size="small"
            sx={{ height: '40px', bgcolor: '#757575' }}
            onClick={handleRestart}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" fill="white" />
            </svg>
          </Button>
        </GridItem>
      </Grid>

      <Grid container spacing={1} sx={{ mt: 1 }}>
        <GridItem xs={6}>
          <Button
            fullWidth
            variant="contained"
            color="inherit"
            size="small"
            sx={{ height: '40px', bgcolor: '#757575' }}
          >
            Open
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
            Close ✕
          </Button>
        </GridItem>
      </Grid>

      <Box sx={{ 
        mt: 1, 
        p: 1, 
        bgcolor: '#fff3cd', 
        borderRadius: 1,
        border: '1px solid #ffeeba',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Box sx={{ color: '#856404', mr: 1, fontSize: '16px' }}>⚠</Box>
        <Typography variant="caption" color="#856404">
          Show câu hỏi trước khi play đối với câu hỏi video và close trước khi qua câu mới
        </Typography>
      </Box>
    </Box>
  );
};

export default QuestionControl; 