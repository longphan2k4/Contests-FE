import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Button, TextField, List, ListItem, ListItemText,
    IconButton, ListItemAvatar, Avatar, Stack, CircularProgress, Dialog,
    DialogTitle, DialogContent, DialogContentText, DialogActions, Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EliminatedContestantDialog, { type EliminatedContestant } from './EliminatedContestantDialog';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@config/axiosInstance';
import { useCompletedContestants, useUpdateToCompleted, useUpdateAllCompletedToEliminated } from '../../hook/useControls';
import { useParams } from 'react-router-dom';
import { useSocket } from '@/contexts/SocketContext';

//tuankiet
import {useUpdate} from "../../../../contest/contestant/hook/useContestant"

// CSS for shimmer animation
const shimmerKeyframes = `
  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }
`;

// Add the keyframes to the document head
if (typeof document !== 'undefined') {
    const styleElement = document.createElement('style');
    styleElement.textContent = shimmerKeyframes;
    document.head.appendChild(styleElement);
}
// Type cho thí sinh trong rescue
type WinnerContestants = {
    contestantId: number;
    fullName: string;
    studentCode: string;
    schoolName: string;
    correctAnswers: number;
    eliminatedAtQuestionOrder: number | null;
    registrationNumber?: string;
};

interface WinnerProps {
    matchId: number;
    //tuankiet
    matchInfoRes: any;
}

const WinnerControlPanel: React.FC<WinnerProps> = ({ matchId,matchInfoRes }) => {
    const { match } = useParams();
    const { socket } = useSocket();
    const [suggestCount, setSuggestCount] = useState<number>(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoadingSuggest, setIsLoadingSuggest] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
    const [goldId, setGoldId] = useState<number | null>(null);
    const [isShowingTop20, setIsShowingTop20] = useState(false);
    const [isLoadingTop20, setIsLoadingTop20] = useState(false);
    const queryClient = useQueryClient();

    //tuankiet su dung cap nhat thisinh- constant
    const { mutate: mutateUpdate } = useUpdate();

    // dữ liệu thí sinh đã hoàn thành (completed) trong trận đấu nếu có
    const { data: contestantCompletedData } = useCompletedContestants(matchId || null);

    // Hook để cập nhật trạng thái thành completed cho các thí sinh
    const updateToCompletedMutation = useUpdateToCompleted();

    // Hook để reset tất cả thí sinh từ completed về eliminated
    const resetAllCompletedMutation = useUpdateAllCompletedToEliminated();

    // cập nhật trạng thái thành completed cho các thí sinh trong trận đấu
    useEffect(() => {
        if (contestantCompletedData && contestantCompletedData.data.candidates.length > 0) {
            setContestantData(contestantCompletedData.data.candidates || []);
            setIsDisabled(true); // Cập nhật trạng thái disabled nếu đã cập nhật
        }
    }, [contestantCompletedData]);

    const [contestantData, setContestantData] = useState<WinnerContestants[]>([]);
    const mutationAdd = useMutation({
        mutationFn: async () => {
            const url = `/contestant/candidates-list/${matchId}`;
            const response = await axiosInstance.get(url, {
                params: { limit: suggestCount }
            });
            console.log('Đề xuất thí sinh:', response.data);
            return response.data;
        },
        onSuccess: (data) => {
            const newContestants = data.data.candidates || [];
            setGoldId(data.data.meta.goldContestantId || null); // Lưu goldId nếu có
            addContestantsToTemp(newContestants, true); // Thêm vào danh sách tạm thời
            queryClient.invalidateQueries({
                queryKey: ['CompletedContestants', matchId],
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
        setIsLoadingSuggest(true);
        mutationAdd.mutate();
    };

    // Thêm thí sinh vào danh sách tạm thời (tránh trùng lặp)
    // Thêm tham số replace để kiểm soát việc thay thế hay thêm vào
    const addContestantsToTemp = (
        newContestants: WinnerContestants[] | EliminatedContestant[],
        replace: boolean = false
    ) => {
        if (replace) {
            // Thay thế hoàn toàn dữ liệu hiện tại
            const convertedContestants = newContestants.map((c: WinnerContestants | EliminatedContestant): WinnerContestants => ({
                contestantId: c.contestantId,
                fullName: c.fullName,
                studentCode: c.studentCode || '',
                schoolName: c.schoolName,
                correctAnswers: 'correctAnswers' in c ? c.correctAnswers : 0,
                eliminatedAtQuestionOrder: c.eliminatedAtQuestionOrder,
                registrationNumber: c.registrationNumber
            }));

            setContestantData(convertedContestants); // Thay thế hoàn toàn
        } else {
            // Logic cũ - thêm vào và tránh trùng lặp
            setContestantData(prev => {
                const existingIds = prev.map(c => c.contestantId);
                const convertedContestants = newContestants.map((c: WinnerContestants | EliminatedContestant): WinnerContestants => ({
                    contestantId: c.contestantId,
                    fullName: c.fullName,
                    studentCode: c.studentCode || '',
                    schoolName: c.schoolName,
                    correctAnswers: 'correctAnswers' in c ? c.correctAnswers : 0,
                    eliminatedAtQuestionOrder: c.eliminatedAtQuestionOrder,
                    registrationNumber: c.registrationNumber
                }));
                const uniqueNewContestants = convertedContestants.filter(c => !existingIds.includes(c.contestantId));
                return [...prev, ...uniqueNewContestants];
            });
        }
    };

    // Xóa một thí sinh khỏi danh sách tạm thời
    const handleRemoveContestant = (contestantId: number) => {
        setContestantData(prev => prev.filter(c => c.contestantId !== contestantId));
    };

    // Xóa tất cả thí sinh khỏi danh sách tạm thời
    const handleClearAll = () => {
        setContestantData([]);
    };

    // Đồng bộ trạng thái từ server
    const handleSync = async () => {
        setIsSyncing(true);

        try {
            await queryClient.invalidateQueries({
                queryKey: ['CompletedContestants', matchId],
                exact: false
            });
            console.log('Đã đồng bộ trạng thái');
        } catch (error) {
            console.error('Lỗi khi đồng bộ:', error);
        } finally {
            setIsSyncing(false);
        }

        if (contestantCompletedData.data.candidates.length > 0) {
            setContestantData([]);
            setIsDisabled(false); // Reset trạng thái disabled sau khi đồng bộ
        }
    };

    const handleConfirm = () => {
        if (contestantData.length === 0) return;
        setIsConfirmDialogOpen(true);
    };

    const handleConfirmUpdate = async() => {
        console.log("contestantData at confirm:", contestantData);
        const contestantIds = contestantData.map(c => c.contestantId);

        updateToCompletedMutation.mutate(
            { matchId, contestantIds },
            {
                onSuccess: (data) => {
                    console.log('Cập nhật thành công:', data);
                    setIsDisabled(true); // Disable UI sau khi cập nhật thành công
                    setIsConfirmDialogOpen(false); // Đóng popup xác nhận

                    // Refresh data để cập nhật UI
                    queryClient.invalidateQueries({
                        queryKey: ['CompletedContestants', matchId],
                        exact: false
                    });
                    queryClient.invalidateQueries({
                        queryKey: ['ListContestant', match],
                        exact: false
                    });

                },
                onError: (error) => {
                    console.error('Lỗi khi cập nhật:', error);
                    setIsConfirmDialogOpen(false); // Đóng popup xác nhận ngay cả khi lỗi
                    // Có thể thêm thông báo lỗi cho user ở đây
                }
            }
        );
        //tuankiet: Cập nhật trạng thái hoàn thành vòng đấu cho thí sinh
            contestantData.forEach(c=>{
            mutateUpdate(
            {   id: c.contestantId,
                payload:{
                    status: "advanced",
                    roundId: matchInfoRes.data.roundId,//gan cung
                } 
            },
            {
            onSuccess: () => {
                console.log('Cập nhật constestant thành công:',contestantData);
                console.log("contestantCompletedData:",contestantCompletedData);
                // setSelectedId(null);
                // refetchs();
            },
            onError: (err: any) => {
                if (err.response?.data?.message)
                console.log(err.response?.data?.message, "error");
            },
            }
            );
        })

    };

    // Reset tất cả thí sinh completed về eliminated
    const handleReset = () => {
        if (contestantCompletedData?.data?.candidates?.length > 0) {
            setIsResetDialogOpen(true);
        }
    };

    const handleConfirmReset = () => {
        resetAllCompletedMutation.mutate(
            matchId,
            {
                onSuccess: (data) => {
                    console.log('Reset thành công:', data);
                    setIsResetDialogOpen(false);
                    setIsDisabled(false); // Enable UI lại sau khi reset
                    setContestantData([]); // Clear danh sách hiện tại

                    // Refresh data để cập nhật UI
                    queryClient.invalidateQueries({
                        queryKey: ['CompletedContestants', matchId],
                        exact: false
                    });
                    queryClient.invalidateQueries({
                        queryKey: ['ListContestant', match],
                        exact: false
                    });
                },
                onError: (error) => {
                    console.error('Lỗi khi reset:', error);
                    setIsResetDialogOpen(false);
                    // Có thể thêm thông báo lỗi cho user ở đây
                }
            }
        );
    };

    // Xử lý hiển thị/ẩn Top20 Winner trên màn chiếu
    const handleToggleTop20 = () => {
        if (!socket) return;

        setIsLoadingTop20(true);

        if (isShowingTop20) {
            // Ẩn Top20 Winner
            socket.emit("winner:hideTop20",
                {
                    matchId,
                    match
                },
                (error: unknown, response: { success?: boolean; message?: string }) => {
                    setIsLoadingTop20(false);
                    if (error) {
                        console.error('Lỗi khi ẩn Top20:', error);
                        return;
                    }

                    if (response?.success) {
                        setIsShowingTop20(false);
                        console.log('Đã ẩn Top20 Winner:', response.message);
                    } else {
                        console.error('Lỗi khi ẩn Top20:', response?.message);
                    }
                }
            );
        } else {
            // Hiển thị Top20 Winner
            socket.emit("winner:showTop20",
                {
                    matchId,
                    match,
                    limit: contestantData.length
                },
                (error: unknown, response: { success?: boolean; message?: string }) => {
                    setIsLoadingTop20(false);
                    if (error) {
                        console.error('Lỗi khi hiển thị Top20:', error);
                        return;
                    }

                    if (response?.success) {
                        setIsShowingTop20(true);
                        console.log('Đã hiển thị Top20 Winner:', response.message);
                    } else {
                        console.error('Lỗi khi hiển thị Top20:', response?.message);
                    }
                }
            );
        }
    };
    return (
        <Paper sx={{ p: 3, mb: "calc(var(--spacing) * 8)" }} elevation={3}>
            <Typography variant="h5" component="h2" gutterBottom>
                Thí Sinh Qua Vòng
                {isShowingTop20 && (
                    <Box component="span" sx={{
                        ml: 1,
                        px: 1.5,
                        py: 0.5,
                        backgroundColor: 'success.light',
                        color: 'success.contrastText',
                        borderRadius: '12px',
                        fontSize: '0.80rem',
                        fontWeight: 'bold',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                            '0%': {
                                opacity: 1,
                                transform: 'scale(1)'
                            },
                            '50%': {
                                opacity: 0.8,
                                transform: 'scale(1.02)'
                            },
                            '100%': {
                                opacity: 1,
                                transform: 'scale(1)'
                            }
                        }
                    }}>
                        🔴 Đang hiển thị - không thể chỉnh sửa
                    </Box>
                )}
            </Typography>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                <Box sx={{ flex: 1, minWidth: 300 }}>
                    <Stack spacing={2.5}>
                        <TextField
                            fullWidth
                            label="Số lượng đề xuất tự động"
                            type="number"
                            value={suggestCount}
                            onChange={e => setSuggestCount(Math.max(1, parseInt(e.target.value, 10)))}
                            disabled={isDisabled}
                        />
                        <Button
                            variant="contained"
                            color="info"
                            startIcon={isLoadingSuggest ? <CircularProgress size={20} color="inherit" /> : <AutoFixHighIcon />}
                            onClick={handleSuggest}
                            disabled={isDisabled || isLoadingSuggest}
                        >
                            Đề xuất tự động
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => setIsDialogOpen(true)}
                            disabled={isDisabled}
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
                            Danh sách thí sinh qua vòng
                        </Typography>
                        {isDisabled && (
                            <>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    onClick={handleSync}
                                    disabled={isSyncing || isShowingTop20}
                                    startIcon={isSyncing ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
                                    sx={{ ml: 'auto' }}
                                >
                                    Đồng bộ
                                </Button>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    onClick={handleReset}
                                    disabled={resetAllCompletedMutation.isPending || !contestantCompletedData?.data?.candidates?.length || isShowingTop20}
                                    startIcon={resetAllCompletedMutation.isPending ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon />}
                                >
                                    Reset
                                </Button>
                            </>
                        )}
                        {contestantData.length > 0 && (
                            <Button
                                size="small"
                                color="error"
                                onClick={handleClearAll}
                                disabled={isDisabled}
                                sx={{ ml: !isDisabled ? 'auto' : '' }}
                            >
                                Xóa tất cả
                            </Button>
                        )}
                    </Box>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                        Tổng số: {contestantData.length} thí sinh
                        {goldId && contestantData.some(c => c.contestantId === goldId) && (
                            <Box component="span" sx={{
                                ml: 2,
                                color: '#FFD700',
                                fontWeight: 'bold',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.5
                            }}>
                                🏆 Có thí sinh gold
                            </Box>
                        )}
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
                    }}>
                        {/* {(isLoadingContestants || removeMutation.isPending) &&
                            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(255,255,255,0.7)', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress /></Box>
                        } */}
                        {contestantData.length === 0 ? (
                            <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                                Chưa có thí sinh nào qua vòng
                            </Typography>
                        ) : (
                            <>
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
                                        {contestantData.map((c: WinnerContestants) => {
                                            const isGold = goldId === c.contestantId;
                                            return (
                                                <ListItem
                                                    key={c.contestantId}
                                                    secondaryAction={
                                                        <IconButton
                                                            edge="end"
                                                            onClick={() => handleRemoveContestant(c.contestantId)}
                                                            size="small"
                                                            color="error"
                                                            disabled={isDisabled}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    }
                                                    sx={isGold ? {
                                                        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                                        borderRadius: '8px',
                                                        mb: 1,
                                                        position: 'relative',
                                                        overflow: 'hidden',
                                                        boxShadow: '0 2px 8px rgba(255, 215, 0, 0.3)',
                                                        border: '1px solid #FFD700',
                                                        '&::before': {
                                                            content: '""',
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: '-100%',
                                                            width: '100%',
                                                            height: '100%',
                                                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                                                            animation: 'shimmer 2s infinite',
                                                            zIndex: 1,
                                                        },
                                                        '& .MuiListItemText-root': {
                                                            position: 'relative',
                                                            zIndex: 2,
                                                        },
                                                        '& .MuiListItemAvatar-root': {
                                                            position: 'relative',
                                                            zIndex: 2,
                                                        },
                                                        '& .MuiIconButton-root': {
                                                            position: 'relative',
                                                            zIndex: 2,
                                                        },
                                                    } : {}}
                                                >
                                                    <ListItemAvatar>
                                                        <Tooltip
                                                            title={isGold ? "🏆 Thí sinh gold - Được ưu tiên qua vòng" : ""}
                                                            placement="top"
                                                            arrow
                                                        >
                                                            <Avatar sx={{
                                                                width: 32,
                                                                height: 32,
                                                                fontSize: '0.8rem',
                                                                ...(isGold && {
                                                                    backgroundColor: '#8B4513',
                                                                    color: '#FFD700',
                                                                    fontWeight: 'bold',
                                                                    border: '2px solid #FFD700',
                                                                    boxShadow: '0 0 15px rgba(255, 215, 0, 0.6)',
                                                                    animation: 'pulse 2s infinite',
                                                                    '@keyframes pulse': {
                                                                        '0%': {
                                                                            boxShadow: '0 0 15px rgba(255, 215, 0, 0.6)',
                                                                            transform: 'scale(1)'
                                                                        },
                                                                        '50%': {
                                                                            boxShadow: '0 0 25px rgba(255, 215, 0, 0.8)',
                                                                            transform: 'scale(1.05)'
                                                                        },
                                                                        '100%': {
                                                                            boxShadow: '0 0 15px rgba(255, 215, 0, 0.6)',
                                                                            transform: 'scale(1)'
                                                                        }
                                                                    }
                                                                })
                                                            }}>
                                                                {c.registrationNumber}
                                                            </Avatar>
                                                        </Tooltip>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={
                                                            <Typography
                                                                variant="body2"
                                                                fontWeight="medium"
                                                                noWrap
                                                                sx={isGold ? {
                                                                    color: '#8B4513',
                                                                    fontWeight: 'bold',
                                                                    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                                                    '&::after': {
                                                                        content: '" 🏆"',
                                                                        marginLeft: '4px',
                                                                    }
                                                                } : {}}
                                                            >
                                                                {c.fullName}
                                                            </Typography>
                                                        }
                                                        secondary={
                                                            <Typography
                                                                variant="caption"
                                                                sx={isGold ? {
                                                                    color: '#A0522D',
                                                                    fontWeight: 'medium',
                                                                } : {
                                                                    color: 'text.secondary'
                                                                }}
                                                            >
                                                                {isGold && '⭐ THÍ SINH GOLD ⭐ | '}
                                                                Số câu đúng: {c.correctAnswers} | Bị loại ở câu: {c.eliminatedAtQuestionOrder || 'N/A'}
                                                            </Typography>
                                                        }
                                                    />
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                </Box>
                            </>
                        )}
                    </Paper>
                </Box>
            </Stack >

            <Box sx={{ mt: 4, display: 'flex', justifyContent: isDisabled ? 'space-between' : 'flex-end', alignItems: 'center', gap: 2 }}>
                {/* Nút hiển thị Top Winner */}
                {isDisabled && <Button
                    variant={isShowingTop20 ? "contained" : "outlined"}
                    color={isShowingTop20 ? "success" : "primary"}
                    onClick={handleToggleTop20}
                    disabled={isLoadingTop20 || contestantData.length === 0}
                    startIcon={
                        isLoadingTop20 ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : isShowingTop20 ? (
                            <VisibilityOffIcon />
                        ) : (
                            <VisibilityIcon />
                        )
                    }
                    sx={{ minWidth: 200 }}
                >
                    {isLoadingTop20
                        ? 'Đang xử lý...'
                        : isShowingTop20
                            ? 'Ẩn Top Winner'
                            : 'Hiển thị Top Winner'
                    }
                </Button>
                }

                {/* Nút xác nhận */}
                <Button
                    variant="contained"
                    size="large"
                    onClick={handleConfirm}
                    disabled={contestantData.length === 0 || isDisabled}
                >
                    {isDisabled
                        ? `Đã xác nhận (${contestantData.length} thí sinh)`
                        : `Xác nhận (${contestantData.length} thí sinh)`
                    }
                </Button>
            </Box>

            {
                isDialogOpen && !isDisabled &&
                <EliminatedContestantDialog
                    open={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    matchId={matchId}
                    existingRescuedIds={contestantData.map((c: WinnerContestants) => c.contestantId)}
                    onAddContestants={addContestantsToTemp} // Callback để thêm thí sinh vào danh sách tạm thời
                />
            }

            {/* Popup xác nhận */}
            <Dialog
                open={isConfirmDialogOpen}
                onClose={() => setIsConfirmDialogOpen(false)}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <DialogTitle id="confirm-dialog-title">
                    Xác nhận cập nhật thí sinh qua vòng
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                        Bạn có chắc chắn muốn <strong>{contestantData.length} thí sinh</strong> này qua vòng không?
                        <br /><br />
                        <em>Lưu ý: Sau khi xác nhận, bạn sẽ không thể chỉnh sửa danh sách này nữa.</em>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setIsConfirmDialogOpen(false)}
                        color="inherit"
                        disabled={updateToCompletedMutation.isPending}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleConfirmUpdate}
                        variant="contained"
                        color="primary"
                        disabled={updateToCompletedMutation.isPending}
                        startIcon={updateToCompletedMutation.isPending && <CircularProgress size={20} color="inherit" />}
                    >
                        {updateToCompletedMutation.isPending ? 'Đang cập nhật...' : 'Xác nhận'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Popup xác nhận reset */}
            <Dialog
                open={isResetDialogOpen}
                onClose={() => setIsResetDialogOpen(false)}
                aria-labelledby="reset-dialog-title"
                aria-describedby="reset-dialog-description"
            >
                <DialogTitle id="reset-dialog-title">
                    Xác nhận reset thí sinh qua vòng
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="reset-dialog-description">
                        Bạn có chắc chắn muốn <strong>reset tất cả thí sinh</strong> đã qua vòng về trạng thái đã bị loại không?
                        <br /><br />
                        <em>Lưu ý: Hành động này sẽ đưa tất cả thí sinh có trạng thái "completed" về trạng thái "eliminated" và không thể hoàn tác.</em>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setIsResetDialogOpen(false)}
                        color="inherit"
                        disabled={resetAllCompletedMutation.isPending}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleConfirmReset}
                        variant="contained"
                        color="error"
                        disabled={resetAllCompletedMutation.isPending}
                        startIcon={resetAllCompletedMutation.isPending && <CircularProgress size={20} color="inherit" />}
                    >
                        {resetAllCompletedMutation.isPending ? 'Đang reset...' : 'Xác nhận reset'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper >
    );
};

export default WinnerControlPanel;