// src/features/admin/rescues/components/RescueControlPanel.tsx
import React, { useState, useMemo } from 'react';
import {
    Box, Typography, Paper, Button, TextField, List, ListItem, ListItemText,
    IconButton, ListItemAvatar, Avatar, Select, MenuItem, FormControl, InputLabel, Stack, CircularProgress,
    Chip
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
            data: { contestantIds, currentQuestionOrder, rescueId: selectedRescueId }
        }, {
            onSuccess: (response) => {
                // Cập nhật lại cache rescue để cập nhật trạng thái "used" ngay lập tức
                if (response?.rescueUpdated) {
                    queryClient.setQueryData(
                        ['rescuesByMatchIdAndType', matchId, 'resurrected'],
                        (oldData: { data: RescueFromAPI[] } | undefined) => {
                            if (!oldData?.data) return oldData;
                            return {
                                ...oldData,
                                data: oldData.data.map((rescue: RescueFromAPI) =>
                                    rescue.id === selectedRescueId
                                        ? { ...rescue, status: 'used' }
                                        : rescue
                                )
                            };
                        }
                    );
                }
                
                // Invalidate để refresh dữ liệu từ server
                queryClient.invalidateQueries({
                    queryKey: ['rescuesByMatchIdAndType'],
                    exact: false
                });
                queryClient.invalidateQueries({
                    queryKey: ['rescuedContestants'],
                    exact: false
                });
            }
        });
    };
    const selectedRescueInfo = useMemo(() => {
        if (!selectedRescueId || !rescues) return null;
        return rescues.find((r: RescueFromAPI) => r.id === selectedRescueId);
    }, [selectedRescueId, rescues]);

    // Kiểm tra xem rescue hiện tại đã được sử dụng chưa
    const isRescueUsed = useMemo(() => {
        return selectedRescueInfo?.status === 'used';
    }, [selectedRescueInfo]);

    return (
        <Paper sx={{ p: 3, mt: 3 }} elevation={3}>
            <Typography variant="h5" component="h2" gutterBottom>
                🚀 Cứu Trợ Hồi Sinh
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
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'space-between', 
                                            width: '100%' 
                                        }}>
                                            <Typography variant="body2">
                                                {r.index}: {r.name}
                                            </Typography>
                                            <Chip
                                                label={r.status === 'used' ? 'Đã sử dụng' : 'Chưa sử dụng'}
                                                color={r.status === 'used' ? 'success' : 'warning'}
                                                variant="filled"
                                                size="small"
                                                sx={{ 
                                                    ml: 1,
                                                    fontSize: '0.7rem',
                                                    height: '20px'
                                                }}
                                            />
                                        </Box>
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
                            disabled={!selectedRescueId || isRescueUsed}
                        />
                        <Button
                            variant="contained"
                            color="info"
                            startIcon={isLoadingSuggest ? <CircularProgress size={20} color="inherit" /> : <AutoFixHighIcon />}
                            onClick={handleSuggest}
                            disabled={!selectedRescueId || isLoadingSuggest || isRescueUsed}
                        >
                            Đề xuất tự động
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => setIsDialogOpen(true)}
                            disabled={!selectedRescueId || isRescueUsed}
                        >
                            Thêm thủ công...
                        </Button>
                        {/* Thêm Hướng dẫn sử dụng */}


                    </Stack>
                </Box>

                {/* Cột 2: Danh sách được cứu */}
                <Box sx={{ flex: 2, minWidth: 400 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="h6">
                            Danh sách thí sinh được cứu trợ
                            <Box component="span" color="primary.main" fontWeight="bold">
                                {!selectedRescueInfo ? ' (Chưa chọn)' : ``}
                            </Box>
                        </Typography>
                        {selectedRescueInfo && (
                            <Chip
                                label={selectedRescueInfo.status === 'used' ? 'Đã sử dụng' : 'Chưa sử dụng'}
                                color={selectedRescueInfo.status === 'used' ? 'success' : 'warning'}
                                variant="filled"
                                size="small"
                                sx={{
                                    fontWeight: 'bold',
                                    fontSize: '0.75rem'
                                }}
                            />
                        )}
                    </Box>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                        Tổng số: {rescuedList.length} thí sinh
                    </Typography>
                    <Paper variant="outlined" sx={{
                        minHeight: 300,
                        maxHeight: 350,
                        mt: 1,
                        p: 1,
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        opacity: isRescueUsed ? 0.6 : 1,
                        backgroundColor: isRescueUsed ? '#f5f5f5' : 'inherit'
                    }}>
                        {(isLoadingContestants || removeMutation.isPending) &&
                            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(255,255,255,0.7)', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress /></Box>
                        }
                        {rescuedList.length === 0 ? (
                            <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                                {selectedRescueId ? 'Không có thí sinh nào trong danh sách này.' : 'Vui lòng chọn một đợt cứu trợ.'}
                            </Typography>
                        ) : (
                            <>
                                {isRescueUsed && (
                                    <Box sx={{ 
                                        p: 2, 
                                        mb: 1, 
                                        backgroundColor: '#e8f5e8', 
                                        borderRadius: 1, 
                                        border: '1px solid #4caf50', 
                                        overflow: 'hidden',
                                    }}>
                                        <Typography variant="body2" color="success.main" fontWeight="bold">
                                            Rescue này đã được sử dụng - Không thể chỉnh sửa
                                        </Typography>
                                    </Box>
                                )}
                                <Box sx={{
                                flex: 1,
                                overflow: 'auto',
                                '&::-webkit-scrollbar': {
                                    width: '6px',
                                },
                                '&::-webkit-scrollbar-track': {
                                    background: '#f1f1f1',
                                    borderRadius: '4px',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    background: '#c1c1c1',
                                    borderRadius: '4px',
                                },
                                '&::-webkit-scrollbar-thumb:hover': {
                                    background: '#a8a8a8',
                                },
                            }}>
                                <List dense>
                                    {rescuedList.map((c: RescuedContestant) => (
                                        <ListItem key={c.contestantId} secondaryAction={
                                            <IconButton 
                                                edge="end" 
                                                onClick={() => handleRemove(c.contestantId)} 
                                                size="small"
                                                disabled={isRescueUsed}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        }>
                                            <ListItemAvatar>
                                                <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem' }}>
                                                    {c.registrationNumber}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="body2" fontWeight="medium" noWrap>
                                                        {c.fullName}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Typography variant="caption" color="text.secondary">
                                                        Số câu đúng: {c.correctAnswers} | Bị loại ở câu: {c.eliminatedAtQuestionOrder || 'N/A'}
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                            </>
                        )}
                    </Paper>
                </Box>
            </Stack>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    size="large"
                    disabled={!selectedRescueId || rescuedList.length === 0 || confirmMutation.isPending || isRescueUsed}
                    onClick={handleConfirm}
                    startIcon={confirmMutation.isPending ? <CircularProgress size={24} color="inherit" /> : <CheckCircleIcon />}
                >
                    {isRescueUsed ? 'Rescue đã được sử dụng' : `Chốt và Cứu trợ ${rescuedList.length} thí sinh`}
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