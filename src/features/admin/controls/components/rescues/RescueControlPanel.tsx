// src/features/admin/rescues/components/RescueControlPanel.tsx
import React, { useState, useMemo, useEffect } from 'react';
import {
    Box, Typography, Paper, Button, TextField, List, ListItem, ListItemText,
    IconButton, ListItemAvatar, Avatar, Select, MenuItem, FormControl, InputLabel, Stack, CircularProgress,
    Chip, Alert, Snackbar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SyncIcon from '@mui/icons-material/Sync';
import EliminatedContestantDialog from './EliminatedContestantDialog';

// Import các hooks đã tạo
import {
    useRescuedContestantsByRescueId,
    useRescueManyContestants,
    useRemoveStudentFromRescue,
    useRescuesByMatchIdAndType,
    useRescueSocket,
} from '../../hook';
import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { useSocket } from '@contexts/SocketContext';
import axiosInstance from '@config/axiosInstance';
import { useParams } from 'react-router-dom';

// Type cho rescue từ API mới
type RescueFromAPI = {
    id: number;
    name: string;
    rescueType: string;
    status: string;
    questionOrder: number | null;
    index: number | null;
    studentIds: number[];
    questionFrom: number;
    questionTo: number;
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
    const { match } = useParams();
    const [selectedRescueId, setSelectedRescueId] = useState<number | null>(null);
    const [suggestCount, setSuggestCount] = useState<number>(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoadingSuggest, setIsLoadingSuggest] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
    const queryClient = useQueryClient();

    // Helper functions for status display
    const getRescueStatusText = (status: string): string => {
        switch (status) {
            case 'used': return 'Đã sử dụng';
            case 'notUsed': return 'Sẵn sàng';
            case 'passed': return 'Đã qua';
            case 'notEligible': return 'Chưa đến';
            default: return status;
        }
    };

    const getRescueStatusColor = (status: string): 'success' | 'info' | 'secondary' | 'warning' | 'default' => {
        switch (status) {
            case 'used': return 'success';
            case 'notUsed': return 'info';
            case 'passed': return 'secondary';
            case 'notEligible': return 'warning';
            default: return 'default';
        }
    };

    // Socket hook để cập nhật trạng thái rescue
    const { updateRescueStatusByQuestion, sendLatestRescueStatus, isUpdating } = useRescueSocket();
    // const { socket } = useSocket();

    // API Hooks - sử dụng hook mới để lấy rescue resurrected theo matchId
    const { data: rescueResponse, isLoading: isLoadingRescues } = useRescuesByMatchIdAndType(matchId, 'resurrected');
    const rescues = useMemo(() => rescueResponse?.data || [], [rescueResponse?.data]);
    const { data: rescuedData, isLoading: isLoadingContestants } = useRescuedContestantsByRescueId(selectedRescueId || "");
    const removeMutation = useRemoveStudentFromRescue();
    const confirmMutation = useRescueManyContestants();

    const rescuedList: RescuedContestant[] = useMemo(() => rescuedData?.contestants || [], [rescuedData]);

    // Hàm xử lý cập nhật trạng thái rescue dựa vào câu hỏi hiện tại
    const handleSyncRescueStatus = async () => {
        try {
            // setStatusMessage({ type: 'info', text: 'Đang đồng bộ trạng thái cứu trợ...' });
            const result = await updateRescueStatusByQuestion(matchId, currentQuestionOrder, match);
            setStatusMessage({
                type: 'success',
                //text: `Đồng bộ thành công! Đã cập nhật ${result.totalUpdated} rescue. (${result.summary.notUsed} ${getRescueStatusText('notUsed')}, ${result.summary.passed} ${getRescueStatusText('passed')}, ${result.summary.notEligible} ${getRescueStatusText('notEligible')})`
                text: `Đồng bộ thành công!`
            });

            // Tìm rescue phù hợp với câu hỏi hiện tại (lấy dòng đầu tiên nếu có nhiều kết quả)
            // Tìm rescue phù hợp với câu hỏi hiện tại - chỉ lấy resurrected
            const eligibleRescues = result.updatedRescues.filter((r) =>
                r.rescueType === 'resurrected' &&
                r.questionFrom <= currentQuestionOrder &&
                r.questionTo >= currentQuestionOrder
            );

            let currentRescue = null;

            if (eligibleRescues.length > 0) {
                // Ưu tiên rescue có status 'notUsed' trước
                currentRescue = eligibleRescues.find((r) => r.status === 'notUsed');

                // Nếu không có rescue 'notUsed', lấy rescue đầu tiên trong danh sách eligible
                // (bao gồm cả rescue đã used, passed, notEligible)
                if (!currentRescue) {
                    currentRescue = eligibleRescues[0];
                }
            }

            // Luôn select rescue phù hợp với câu hỏi hiện tại (dù là bất kỳ trạng thái nào)
            if (currentRescue) {
                setSelectedRescueId(currentRescue.id);
            }
            // Nếu không có rescue nào phù hợp với câu hỏi hiện tại
            else if (eligibleRescues.length === 0) {
                // Fallback: tìm rescue có status = 'notUsed' bất kể range - chỉ resurrected
                const availableRescue = result.updatedRescues.find((r) =>
                    r.rescueType === 'resurrected' && r.status === 'notUsed'
                );
                if (availableRescue) {
                    setSelectedRescueId(availableRescue.id);
                } else {
                    // Lấy rescue resurrected đầu tiên nếu có
                    const firstResurrectedRescue = result.updatedRescues.find((r) =>
                        r.rescueType === 'resurrected'
                    );
                    if (firstResurrectedRescue) {
                        setSelectedRescueId(firstResurrectedRescue.id);
                    } else {
                        // Nếu không có rescue resurrected nào, clear selection
                        setSelectedRescueId(null);
                    }
                }
            }

        } catch (err) {
            // setStatusMessage({
            //     type: 'error',
            //     text: `Lỗi khi đồng bộ: ${err instanceof Error ? err.message : 'Đã xảy ra lỗi'}`
            // });
            console.error('Error syncing rescue status:', err);
        }
    };

    // // Lắng nghe sự kiện cập nhật từ server
    // useEffect(() => {
    //     if (!socket) return;

    //     const handleRescueStatusUpdated = (data: { success: boolean; data: { totalUpdated: number; updatedRescues: RescueFromAPI[] } }) => {
    //         if (data.success) {
    //             queryClient.invalidateQueries({ queryKey: ['rescuesByMatchIdAndType', matchId] });

    //             // Hiển thị thông báo cập nhật
    //             setStatusMessage({
    //                 type: 'info',
    //                 text: `Trạng thái rescue đã được cập nhật tự động (${data.data.totalUpdated} thay đổi)`
    //             });

    //             // Auto-select rescue có status = 'notUsed' (nếu có)
    //             // Lấy tất cả rescue phù hợp với câu hỏi hiện tại
    //             const eligibleRescues = data.data.updatedRescues.filter((r: RescueFromAPI) =>
    //                 r.questionFrom <= currentQuestionOrder &&
    //                 r.questionTo >= currentQuestionOrder
    //             );

    //             let currentRescue = null;

    //             if (eligibleRescues.length > 0) {
    //                 // Ưu tiên rescue có status 'notUsed'
    //                 currentRescue = eligibleRescues.find((r: RescueFromAPI) => r.status === 'notUsed');

    //                 // Nếu không có rescue 'notUsed', lấy rescue đầu tiên trong danh sách
    //                 if (!currentRescue) {
    //                     currentRescue = eligibleRescues[0];
    //                 }
    //             }

    //             // Nếu có rescue phù hợp với câu hỏi hiện tại và rescue đó khác với rescue đang chọn
    //             if (currentRescue && (!selectedRescueId || selectedRescueId !== currentRescue.id)) {
    //                 setSelectedRescueId(currentRescue.id);
    //             }
    //             // Nếu không tìm thấy rescue phù hợp và không có rescue nào được chọn
    //             else if (!currentRescue && !selectedRescueId && data.data.updatedRescues.length > 0) {
    //                 // Tìm rescue có status = 'notUsed' (fallback)
    //                 const availableRescue = data.data.updatedRescues.find((r: RescueFromAPI) => r.status === 'notUsed');
    //                 if (availableRescue) {
    //                     setSelectedRescueId(availableRescue.id);
    //                 }
    //             }
    //         }
    //     };

    //     socket.on('rescue:statusUpdated', handleRescueStatusUpdated);

    //     return () => {
    //         socket.off('rescue:statusUpdated', handleRescueStatusUpdated);
    //     };
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [socket, queryClient, matchId, selectedRescueId]);

    // Tự động cập nhật trạng thái rescue khi câu hỏi thay đổi
    useEffect(() => {
        if (matchId && currentQuestionOrder) {
            handleSyncRescueStatus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentQuestionOrder, matchId]);

    const mutationAdd = useMutation({
        mutationFn: async () => {
            const url = `/contestant/rescue-candidates/${matchId}`;
            const response = await axiosInstance.get(url, {
                params: { rescueId: selectedRescueId, limit: suggestCount }
            });
            // const response = await fetch(`/api/contestant/rescue-candidates/${matchId}?rescueId=${selectedRescueId}&limit=${suggestCount}`);
            return response.data;
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
            onSuccess: async (response) => {
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

                await sendLatestRescueStatus(matchId, currentQuestionOrder, match);

                // Invalidate để refresh dữ liệu từ server
                queryClient.invalidateQueries({
                    queryKey: ['rescuesByMatchIdAndType'],
                    exact: false
                });
                queryClient.invalidateQueries({
                    queryKey: ['rescuedContestants'],
                    exact: false
                });
                queryClient.invalidateQueries({
                    queryKey: ['ListContestant', match],
                    exact: false
                });
            }
        });
    };
    const selectedRescueInfo = useMemo(() => {
        if (!selectedRescueId || !rescues) return null;
        return rescues.find((r: RescueFromAPI) => r.id === selectedRescueId);
    }, [selectedRescueId, rescues]);

    // Kiểm tra xem rescue hiện tại có bị vô hiệu hóa không (used, passed, notEligible)
    const isRescueDisabled = useMemo(() => {
        if (!selectedRescueInfo) return false;
        return ['used', 'passed', 'notEligible'].includes(selectedRescueInfo.status);
    }, [selectedRescueInfo]);

    return (
        <Paper sx={{ p: 3, mb: "calc(var(--spacing) * 8)" }} elevation={3}>
            <Typography variant="h5" component="h2" gutterBottom>
                🚀 Cứu Trợ Hồi Sinh
            </Typography>

            {/* Status message display */}
            {/* {statusMessage && (
                <Alert
                    severity={statusMessage.type}
                    sx={{ mb: 2 }}
                    onClose={() => setStatusMessage(null)}
                >
                    {statusMessage.text}
                </Alert>
            )} */}

            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    Câu hỏi hiện tại: <b>{currentQuestionOrder}</b>
                </Typography>
                <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={handleSyncRescueStatus}
                    startIcon={<SyncIcon />}
                    disabled={isUpdating}
                >
                    {isUpdating ? 'Đang đồng bộ...' : 'Đồng bộ trạng thái'}
                </Button>
            </Box>

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
                                {rescues?.map((r: RescueFromAPI, index) => (
                                    <MenuItem key={r.id} value={r.id}>
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            width: '100%'
                                        }}>
                                            <Typography variant="body2">
                                                {index + 1}: {r.name}
                                            </Typography>
                                            <Chip
                                                label={getRescueStatusText(r.status)}
                                                color={getRescueStatusColor(r.status)}
                                                variant="filled"
                                                size="small"
                                                sx={{
                                                    ml: 1,
                                                    fontSize: '0.7rem',
                                                    height: '20px',
                                                    pointerEvents: 'none'
                                                }}
                                            />
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Hiển thị chú thích về các trạng thái */}
                        <Box sx={{ mt: 1, p: 1, bgcolor: 'background.paper', borderRadius: 1, border: '1px dashed #ccc' }}>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                Giải thích trạng thái:
                            </Typography>
                            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap gap={0.5}>
                                {Object.entries({ used: 'success', notUsed: 'info', passed: 'secondary', notEligible: 'warning' })
                                    .map(([status, color]) => (
                                        <Chip
                                            key={status}
                                            label={`${getRescueStatusText(status)}`}
                                            color={color as 'success' | 'info' | 'secondary' | 'warning'}
                                            size="small"
                                            variant="outlined"
                                            sx={{ fontSize: '0.65rem', height: '18px' }}
                                        />
                                    ))}
                            </Stack>
                        </Box>

                        <TextField
                            fullWidth
                            label="Số lượng đề xuất tự động"
                            type="number"
                            value={suggestCount}
                            onChange={e => setSuggestCount(Math.max(1, parseInt(e.target.value, 10)))}
                            disabled={!selectedRescueId || isRescueDisabled}
                        />
                        <Button
                            variant="contained"
                            color="info"
                            startIcon={isLoadingSuggest ? <CircularProgress size={20} color="inherit" /> : <AutoFixHighIcon />}
                            onClick={handleSuggest}
                            disabled={!selectedRescueId || isLoadingSuggest || isRescueDisabled}
                        >
                            Đề xuất tự động
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => setIsDialogOpen(true)}
                            disabled={!selectedRescueId || isRescueDisabled}
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
                        {/* {selectedRescueInfo && (
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
                        )} */}
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
                        opacity: isRescueDisabled ? 0.6 : 1,
                        backgroundColor: isRescueDisabled ? '#f5f5f5' : 'inherit'
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
                                {isRescueDisabled && (
                                    <Box sx={{
                                        p: 2,
                                        mb: 1,
                                        backgroundColor: selectedRescueInfo?.status === 'used' ? '#e8f5e8' :
                                            selectedRescueInfo?.status === 'passed' ? '#f3e5f5' :
                                                selectedRescueInfo?.status === 'notEligible' ? '#fff3e0' : '#f5f5f5',
                                        borderRadius: 1,
                                        border: selectedRescueInfo?.status === 'used' ? '1px solid #4caf50' :
                                            selectedRescueInfo?.status === 'passed' ? '1px solid #9c27b0' :
                                                selectedRescueInfo?.status === 'notEligible' ? '1px solid #ff9800' : '1px solid #ccc',
                                        overflow: 'hidden',
                                    }}>
                                        <Typography variant="body2"
                                            color={selectedRescueInfo?.status === 'used' ? 'success.main' :
                                                selectedRescueInfo?.status === 'passed' ? 'secondary.main' :
                                                    selectedRescueInfo?.status === 'notEligible' ? 'warning.main' : 'text.primary'}
                                            fontWeight="bold">
                                            {selectedRescueInfo?.status === 'used' && `Rescue này đã được ${getRescueStatusText('used')} - Không thể chỉnh sửa`}
                                            {selectedRescueInfo?.status === 'passed' && `Rescue này đã ${getRescueStatusText('passed')} - Không thể sử dụng`}
                                            {selectedRescueInfo?.status === 'notEligible' && `Rescue này ${getRescueStatusText('notEligible')} - Chưa thể sử dụng`}
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
                                                    disabled={isRescueDisabled}
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
                    disabled={!selectedRescueId || rescuedList.length === 0 || confirmMutation.isPending || isRescueDisabled}
                    onClick={handleConfirm}
                    startIcon={confirmMutation.isPending ? <CircularProgress size={24} color="inherit" /> : <CheckCircleIcon />}
                >
                    {isRescueDisabled ?
                        `Rescue ${getRescueStatusText(selectedRescueInfo?.status || '')}` :
                        `Chốt và Cứu trợ ${rescuedList.length} thí sinh`
                    }
                </Button>
            </Box>

            {selectedRescueId &&
                <EliminatedContestantDialog
                    open={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    matchId={matchId}
                    rescueId={selectedRescueId}
                    existingRescuedIds={rescuedList.map((c: RescuedContestant) => c.contestantId)}
                    rescueStatus={selectedRescueInfo?.status}
                />
            }

            {/* Thông báo trạng thái */}
            <Snackbar
                open={!!statusMessage}
                autoHideDuration={6000}
                onClose={() => setStatusMessage(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <div>
                    {statusMessage && (
                        <Alert
                            onClose={() => setStatusMessage(null)}
                            severity={statusMessage.type}
                            sx={{ width: '100%' }}
                        >
                            {statusMessage.text}
                        </Alert>
                    )}
                </div>
            </Snackbar>
        </Paper>
    );
};

export default RescueControlPanel;