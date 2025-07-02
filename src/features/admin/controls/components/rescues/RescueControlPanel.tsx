// src/features/admin/rescues/components/RescueControlPanel.tsx
import React, { useState, useMemo } from 'react';
import {
    Box, Typography, Paper, Button, TextField, List, ListItem, ListItemText,
    IconButton, ListItemAvatar, Avatar, Select, MenuItem, FormControl, InputLabel, Stack, CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EliminatedContestantDialog from './EliminatedContestantDialog';

// Import các hooks đã tạo
import {
    useRescuedContestantsByRescueId,
    useRescueManyContestants,
    useRemoveStudentFromRescue,
    useRescuesByMatchIdAndType
} from '../../hook/useRescues';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Type cho rescue từ API mới
type RescueFromAPI = {
    id: number;
    name: string;
    rescueType: string;
    status: string;
    questionOrder: number | null;
    index: number | null;
    studentIds: number[];
};

// Type cho rescue cũ (deprecated)
// type Rescue = {
//     id: number;
//     status: string;
//     matchId: number;
//     questionOrder: number;
//     studentIds: number[];
// };

// Type cho thí sinh trong rescue
type RescuedContestant = {
    contestantId: number;
    fullName: string;
    studentCode: string;
    schoolName: string;
    correctAnswers: number;
    eliminatedAtQuestionOrder: number | null;
    registrationNumber?: string; 
};

interface RescueControlPanelProps {
    matchId: number;
    currentQuestionOrder: number;
}

const RescueControlPanel: React.FC<RescueControlPanelProps> = ({ matchId, currentQuestionOrder }) => {
    const [selectedRescueId, setSelectedRescueId] = useState<number | null>(null);
    const [suggestCount, setSuggestCount] = useState<number>(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoadingSuggest, setIsLoadingSuggest] = useState(false);
    const queryClient = useQueryClient();
    // API Hooks - sử dụng hook mới để lấy rescue resurrected theo matchId
    const { data: rescueResponse, isLoading: isLoadingRescues } = useRescuesByMatchIdAndType(matchId, 'resurrected');
    const rescues = useMemo(() => rescueResponse?.data || [], [rescueResponse?.data]);
    const { data: rescuedData, isLoading: isLoadingContestants } = useRescuedContestantsByRescueId(selectedRescueId || "");
    const removeMutation = useRemoveStudentFromRescue();
    const confirmMutation = useRescueManyContestants();

    const rescuedList: RescuedContestant[] = useMemo(() => rescuedData?.contestants || [], [rescuedData]);
    const mutationAdd = useMutation({
        mutationFn: async () => {
            const response = await fetch(`/api/contestant/rescue-candidates/${matchId}?rescueId=${selectedRescueId}&limit=${suggestCount}`);
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['rescuedContestants'],
                exact: false
            });
            setIsLoadingSuggest(false);
        },
        onError: (error) => {
            setIsLoadingSuggest(false);
            console.error('Error adding contestants:', error);
        }
    })

    const handleSuggest = async () => {
        if (!selectedRescueId) return;
        setIsLoadingSuggest(true);
        mutationAdd.mutate();
    };

    const handleRemove = (studentId: number) => {
        if (!selectedRescueId) return;
        removeMutation.mutate({ rescueId: selectedRescueId, studentId }, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ['rescuedContestants'],
                    exact: false
                });
            },
            onError: (error) => {
                console.error('Error removing contestant:', error);
            }
        });
    };

    const handleConfirm = () => {
        if (!selectedRescueId || rescuedList.length === 0) return;
        const contestantIds = rescuedList.map((c: RescuedContestant) => c.contestantId);
        confirmMutation.mutate({
            matchId,
            data: { contestantIds, currentQuestionOrder }
        }, {
            onSuccess: () => {
                alert('Cứu trợ thành công!');
            }
        });
    };
    const selectedRescueInfo = useMemo(() => {
        if (!selectedRescueId || !rescues) return null;
        return rescues.find((r: RescueFromAPI) => r.id === selectedRescueId);
    }, [selectedRescueId, rescues]);

    return (
        <Paper sx={{ p: 3, mt: 3 }} elevation={3}>
            <Typography variant="h5" component="h2" gutterBottom>
                🚀 Module Cứu Trợ Trực Tiếp
            </Typography>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                {/* Cột 1: Điều khiển */}
                <Box sx={{ flex: 1, minWidth: 300 }}>
                    <Stack spacing={2.5}>
                        <FormControl fullWidth disabled={isLoadingRescues}>
                            <InputLabel id="rescue-select-label">Chọn đợt cứu trợ</InputLabel>
                            <Select
                                labelId="rescue-select-label"
                                label="Chọn đợt cứu trợ"
                                value={selectedRescueId || ''}
                                onChange={(e) => setSelectedRescueId(Number(e.target.value))}
                            >
                                {rescues?.map((r: RescueFromAPI) => (
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
                            startIcon={isLoadingSuggest ? <CircularProgress size={20} color="inherit" /> : <AutoFixHighIcon />}
                            onClick={handleSuggest}
                            disabled={!selectedRescueId || isLoadingSuggest}
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
                </Box>

                {/* Cột 2: Danh sách được cứu */}
                <Box sx={{ flex: 2, minWidth: 400 }}>
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
                            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(255,255,255,0.7)', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress /></Box>
                        }
                        {rescuedList.length === 0 ? (
                            <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                                {selectedRescueId ? 'Không có thí sinh nào trong danh sách này.' : 'Vui lòng chọn một đợt cứu trợ.'}
                            </Typography>
                        ) : (
                            <List>
                                {rescuedList.map((c: RescuedContestant) => (
                                    <ListItem key={c.contestantId} secondaryAction={
                                        <IconButton edge="end" onClick={() => handleRemove(c.contestantId)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }>
                                        <ListItemAvatar><Avatar>{c.registrationNumber}</Avatar></ListItemAvatar>
                                        <ListItemText
                                            primary={c.fullName}
                                            secondary={`Số câu đúng: ${c.correctAnswers} | Bị loại ở câu: ${c.eliminatedAtQuestionOrder || 'N/A'}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Paper>
                </Box>
            </Stack>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    size="large"
                    disabled={!selectedRescueId || rescuedList.length === 0 || confirmMutation.isPending}
                    onClick={handleConfirm}
                    startIcon={confirmMutation.isPending ? <CircularProgress size={24} color="inherit" /> : <CheckCircleIcon />}
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
                    existingRescuedIds={rescuedList.map((c: RescuedContestant) => c.contestantId)}
                />
            }
        </Paper>
    );
};

export default RescueControlPanel;