import React, { useState, useEffect, useMemo } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    TextField,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Pagination,
    Stack,
    InputAdornment,
    Alert,
    Typography,
    Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// Giả định các hooks này đã được tạo và export từ file hook của bạn
import {
    useEliminatedContestants,
    useAddStudentsToRescue
} from '../../hook/useRescues';
import { useQueryClient } from '@tanstack/react-query';

// Định nghĩa type cho raw data từ API
type RawContestantData = {
    id?: number;
    contestantId?: number;
    fullName: string;
    studentCode: string;
    schoolName: string;
    className: string;
    eliminatedAtQuestionOrder: number | null;
    registrationNumber?: string;
};

// Định nghĩa kiểu dữ liệu cho thí sinh để sử dụng trong component
// Bạn nên đặt type này ở một file dùng chung (ví dụ: types.ts)
export type EliminatedContestant = {
    contestantId: number;
    fullName: string;
    studentCode: string | null;
    schoolName: string;
    className: string;
    eliminatedAtQuestionOrder: number | null;
    registrationNumber?: string;
};

// Định nghĩa props cho component
interface EliminatedContestantDialogProps {
    open: boolean;
    onClose: () => void;
    matchId: number;
    rescueId: number; // Cần rescueId để biết thêm thí sinh vào đợt cứu trợ nào
    existingRescuedIds: number[]; // Mảng các ID đã có sẵn để vô hiệu hóa checkbox
    rescueStatus?: string; // Trạng thái của rescue để vô hiệu hóa dialog nếu cần
}

const EliminatedContestantDialog: React.FC<EliminatedContestantDialogProps> = ({
    open,
    onClose,
    matchId,
    rescueId,
    existingRescuedIds,
    rescueStatus
}) => {
    const queryClient = useQueryClient();
    // State quản lý các bộ lọc (phân trang, tìm kiếm)
    const [filters, setFilters] = useState({ page: 1, limit: 6, search: '', registrationNumber: '' });
    // State quản lý danh sách các thí sinh được chọn bằng checkbox
    const [selected, setSelected] = useState<EliminatedContestant[]>([]);

    // Sử dụng hook để lấy dữ liệu từ API - enabled when dialog is open
    const {
        data,
        isLoading,
        isError,
        error,
        refetch
    } = useEliminatedContestants(matchId, filters, {
        enabled: open && !!matchId // Only fetch when dialog is open and matchId exists
    });

    // Sử dụng hook mutation để thêm thí sinh vào đợt cứu trợ
    const addMutation = useAddStudentsToRescue();

    // Kiểm tra xem rescue có bị vô hiệu hóa không
    const isRescueDisabled = Boolean(rescueStatus && ['used', 'passed', 'notEligible'].includes(rescueStatus));

    // Dữ liệu và thông tin phân trang được lấy ra từ hook một cách an toàn
    const contestants = useMemo(() => {
        // Data từ useEliminatedContestants có format: { Contestantes: [], pagination: {} }
        const rawContestants = data?.Contestantes || data?.contestants || [];
        return rawContestants.map((c: RawContestantData): EliminatedContestant => ({
            contestantId: c.id || c.contestantId || 0,
            fullName: c.fullName,
            studentCode: c.studentCode,
            schoolName: c.schoolName,
            className: c.className,
            eliminatedAtQuestionOrder: c.eliminatedAtQuestionOrder,
            registrationNumber: c.registrationNumber
        }));
    }, [data]);
    const pagination = useMemo(() => data?.pagination, [data]);

    // Xử lý khi người dùng chọn/bỏ chọn một checkbox
    const handleSelect = (contestant: EliminatedContestant) => {
        if (isRescueDisabled) return; // Không cho phép thay đổi nếu rescue đã bị vô hiệu hóa
        setSelected(prev =>
            prev.some(c => c.contestantId === contestant.contestantId)
                ? prev.filter(c => c.contestantId !== contestant.contestantId)
                : [...prev, contestant]
        );
    };

    // Xử lý khi nhấn nút "Thêm"
    const handleAdd = () => {
        if (selected.length === 0 || isRescueDisabled) return;
        const studentIds = selected.map(c => c.contestantId);
        addMutation.mutate({ rescueId, studentIds }, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ['rescuedContestants'],
                    exact: false
                });
                onClose(); // Đóng dialog sau khi thành công
            },
            onError: (err) => {
                // Thông báo lỗi
                console.error("Lỗi khi thêm thí sinh:", err);
                alert("Có lỗi xảy ra, vui lòng thử lại.");
            }
        });
    };

    // Reset state và refetch khi dialog được mở
    useEffect(() => {
        if (open) {
            setSelected([]);
            setFilters({ page: 1, limit: 6, search: '', registrationNumber: '' });
            // Trigger refetch when dialog opens
            refetch();
        }
    }, [open, refetch]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                Thêm thí sinh vào danh sách cứu trợ
                {isRescueDisabled && (
                    <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
                        ⚠️ Rescue này không thể chỉnh sửa (Trạng thái: {rescueStatus})
                    </Typography>
                )}
            </DialogTitle>
            <DialogContent dividers>
                <Stack spacing={2}>
                    {isRescueDisabled && (
                        <Alert severity="warning">
                            Rescue này không thể sử dụng để thêm thí sinh do trạng thái hiện tại là "{rescueStatus}".
                        </Alert>
                    )}
                    {/* Khu vực tìm kiếm */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            fullWidth
                            placeholder="Tìm kiếm theo tên, mã sinh viên, trường, lớp..."
                            size="small"
                            value={filters.search}
                            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                            disabled={isRescueDisabled}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            sx={{ minWidth: 200 }}
                            placeholder="Tìm theo số vị trí..."
                            size="small"
                            type="number"
                            value={filters.registrationNumber}
                            onChange={e => setFilters(prev => ({ ...prev, registrationNumber: e.target.value, page: 1 }))}
                            disabled={isRescueDisabled}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        #
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    {/* Xử lý các trạng thái của API */}
                    {isError && <Alert severity="error">Lỗi tải dữ liệu: {error?.message || 'Không xác định'}</Alert>}

                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <TableContainer component={Paper} variant="outlined">
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding="checkbox" />
                                        <TableCell>Vị trí</TableCell>
                                        <TableCell>Họ và Tên</TableCell>
                                        <TableCell>Trường</TableCell>
                                        <TableCell>Bị loại ở câu</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {contestants.length > 0 ? (
                                        contestants.map((c: EliminatedContestant) => {
                                            const isSelected = selected.some(s => s.contestantId === c.contestantId);
                                            const isDisabled = existingRescuedIds.includes(c.contestantId) || isRescueDisabled;
                                            const tooltipText = isRescueDisabled ? "Rescue không thể chỉnh sửa" :
                                                             existingRescuedIds.includes(c.contestantId) ? "Thí sinh đã có trong danh sách cứu trợ" : 
                                                             "Nhấn để chọn";
                                            return (
                                                <Tooltip
                                                    key={c.contestantId}
                                                    title={tooltipText}
                                                    placement="top"
                                                    arrow
                                                    sx={{ height: '359px' }}
                                                >
                                                    <TableRow
                                                        hover
                                                        onClick={() => !isDisabled && handleSelect(c)}
                                                        selected={isSelected}
                                                        sx={{
                                                            cursor: isDisabled ? 'not-allowed' : 'pointer',
                                                            opacity: isDisabled ? 0.6 : 1,
                                                        }}
                                                    >
                                                        <TableCell padding="checkbox">
                                                            <Checkbox checked={isSelected} disabled={isDisabled} />
                                                        </TableCell>
                                                        <TableCell component="th" scope="row">
                                                            <Typography variant="body2" fontWeight="medium">{c.registrationNumber}</Typography>
                                                        </TableCell>
                                                        <TableCell component="th" scope="row">
                                                            <Typography variant="body2" fontWeight="medium">{c.fullName}</Typography>
                                                            <Typography variant="caption" color="text.secondary">{c.studentCode}</Typography>
                                                        </TableCell>
                                                        <TableCell>{c.schoolName}</TableCell>
                                                        <TableCell align="center">{c.eliminatedAtQuestionOrder}</TableCell>
                                                    </TableRow>
                                                </Tooltip>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">
                                                <Typography color="text.secondary" sx={{ p: 3 }}>
                                                    Không tìm thấy thí sinh nào.
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {/* Phân trang */}
                    {pagination && pagination.totalPages > 1 && (
                        <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
                            <Pagination
                                count={pagination.totalPages}
                                page={filters.page}
                                onChange={(_, page) => setFilters(prev => ({ ...prev, page }))}
                                color="primary"
                                showFirstButton
                                showLastButton
                                disabled={isRescueDisabled}
                            />
                        </Stack>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: '16px 24px' }}>
                <Button onClick={onClose} color="inherit">Hủy</Button>
                <Button
                    variant="contained"
                    onClick={handleAdd}
                    disabled={selected.length === 0 || addMutation.isPending || isRescueDisabled}
                    startIcon={addMutation.isPending && <CircularProgress size={20} color="inherit" />}
                >
                    {isRescueDisabled ? 'Không thể thêm' : `Thêm ${selected.length > 0 ? `(${selected.length})` : ''} thí sinh`}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EliminatedContestantDialog;