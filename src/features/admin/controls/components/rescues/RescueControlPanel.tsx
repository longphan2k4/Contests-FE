// src/features/admin/rescues/components/RescueControlPanel.tsx (File mới thay thế file cũ)
import React, { useState, useMemo } from 'react';
import {
  Box, Typography, Paper, Button, TextField, List, ListItem, ListItemText,
  IconButton, Alert, ListItemAvatar, Avatar, Select, MenuItem, FormControl, InputLabel, Grid, Stack, CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EliminatedContestantDialog from './EliminatedContestantDialog';

// Import các hooks đã tạo
import {
  useListRescues,
  useRescuedContestants,
  useSuggestCandidates,
  useRemoveStudentFromRescue,
  useConfirmRescueMany
} from '../hook/useRescue';

interface RescueControlPanelProps {
    matchId: number;
    currentQuestionOrder: number; // Cần cho API cuối cùng
}

const RescueControlPanel: React.FC<RescueControlPanelProps> = ({ matchId, currentQuestionOrder }) => {
    const [selectedRescueId, setSelectedRescueId] = useState<number | null>(null);
    const [suggestCount, setSuggestCount] = useState<number>(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // API Hooks
    const { data: rescues, isLoading: isLoadingRescues } = useListRescues(matchId);
    const { data: rescuedData, isLoading: isLoadingContestants } = useRescuedContestants(selectedRescueId);
    const suggestMutation = useSuggestCandidates();
    const removeMutation = useRemoveStudentFromRescue();
    const confirmMutation = useConfirmRescueMany();

    const rescuedList = useMemo(() => rescuedData?.contestants || [], [rescuedData]);

    const handleSuggest = () => {
        if (!selectedRescueId) return;
        // Logic mới: `getRescueCandidates` giờ sẽ tự cập nhật DB
        suggestMutation.mutate({ matchId, rescueId: selectedRescueId /*, count: suggestCount */});
        // count có thể thêm vào API nếu cần
    };

    const handleRemove = (studentId: number) => {
        if (!selectedRescueId) return;
        removeMutation.mutate({ rescueId: selectedRescueId, studentId });
    };

    const handleConfirm = () => {
        if (!selectedRescueId || rescuedList.length === 0) return;
        const contestantIds = rescuedList.map(c => c.contestantId);
        confirmMutation.mutate({ matchId, contestantIds, currentQuestionOrder }, {
          onSuccess: () => {
            // Có thể thêm toast thông báo thành công
            alert('Cứu trợ thành công!');
          }
        });
    };

    const selectedRescueInfo = useMemo(() => {
        if (!selectedRescueId || !rescues) return null;
        return rescues.find(r => r.id === selectedRescueId);
    }, [selectedRescueId, rescues]);


    return (
        <Paper sx={{ p: 3, mt: 3 }} elevation={3}>
            <Typography variant="h5" component="h2" gutterBottom>
              🚀 Module Cứu Trợ Trực Tiếp
            </Typography>
            <Grid container spacing={4}>
                {/* Cột 1: Điều khiển */}
                <Grid item xs={12} md={4}>
                    <Stack spacing={2.5}>
                        <FormControl fullWidth disabled={isLoadingRescues}>
                            <InputLabel id="rescue-select-label">Chọn đợt cứu trợ</InputLabel>
                            <Select
                                labelId="rescue-select-label"
                                label="Chọn đợt cứu trợ"
                                value={selectedRescueId || ''}
                                onChange={(e) => setSelectedRescueId(Number(e.target.value))}
                            >
                                {rescues?.map(r => (
                                    <MenuItem key={r.id} value={r.id}>
                                      {r.id}: {r.status}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Số lượng đề xuất tự động"
                            type="number"
                            value={suggestCount}
                            onChange={e => setSuggestCount(Math.max(1, parseInt(e.target.value, 10)))}
                            disabled={!selectedRescueId}
                        />
                         <Button
                            variant="contained"
                            color="info"
                            startIcon={suggestMutation.isPending ? <CircularProgress size={20} color="inherit" /> : <AutoFixHighIcon />}
                            onClick={handleSuggest}
                            disabled={!selectedRescueId || suggestMutation.isPending}
                        >
                            Đề xuất tự động
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => setIsDialogOpen(true)}
                            disabled={!selectedRescueId}
                        >
                            Thêm thủ công...
                        </Button>
                    </Stack>
                </Grid>

                {/* Cột 2: Danh sách được cứu */}
                <Grid item xs={12} md={8}>
                     <Typography variant="h6">
                        Danh sách cứu trợ cho: 
                        <Box component="span" color="primary.main" fontWeight="bold">
                           {selectedRescueInfo ? ` ${selectedRescueInfo.id} - ${selectedRescueInfo.status}` : ' (Chưa chọn)'}
                        </Box>
                    </Typography>
                     <Typography variant="body1" color="text.secondary" gutterBottom>
                        Tổng số: {rescuedList.length} thí sinh
                    </Typography>
                    <Paper variant="outlined" sx={{ minHeight: 300, mt: 1, p: 1, position: 'relative' }}>
                       {(isLoadingContestants || removeMutation.isPending) && 
                          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(255,255,255,0.7)', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><CircularProgress /></Box>
                       }
                        {rescuedList.length === 0 ? (
                             <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4}}>
                                 {selectedRescueId ? 'Không có thí sinh nào trong danh sách này.' : 'Vui lòng chọn một đợt cứu trợ.'}
                             </Typography>
                        ) : (
                            <List>
                                {rescuedList.map(c => (
                                    <ListItem key={c.contestantId} secondaryAction={
                                        <IconButton edge="end" onClick={() => handleRemove(c.contestantId)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }>
                                        <ListItemAvatar><Avatar>{c.fullName.charAt(0)}</Avatar></ListItemAvatar>
                                        <ListItemText 
                                          primary={c.fullName} 
                                          secondary={`Số câu đúng: ${c.correctAnswers} | Bị loại ở câu: ${c.eliminatedAtQuestionOrder || 'N/A'}`} 
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Paper>
                </Grid>
            </Grid>
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                 <Button 
                    variant="contained"
                    size="large"
                    disabled={!selectedRescueId || rescuedList.length === 0 || confirmMutation.isPending}
                    onClick={handleConfirm}
                    startIcon={confirmMutation.isPending ? <CircularProgress size={24} color="inherit" /> :<CheckCircleIcon />}
                >
                    Chốt và Cứu trợ {rescuedList.length} thí sinh
                </Button>
            </Box>

            {selectedRescueId && 
              <EliminatedContestantDialog
                  open={isDialogOpen}
                  onClose={() => setIsDialogOpen(false)}
                  matchId={matchId}
                  rescueId={selectedRescueId}
                  existingRescuedIds={rescuedList.map(c => c.contestantId)}
              />
            }
        </Paper>
    );
};

export default RescueControlPanel;