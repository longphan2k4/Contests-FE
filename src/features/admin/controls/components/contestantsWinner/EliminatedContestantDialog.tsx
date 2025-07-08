import React, { useState, useEffect, useMemo } from 'react';
import {
    Dialog,
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
    useEliminatedContestants
} from '../../hook/useRescues';

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
    existingRescuedIds: number[]; // Mảng các ID đã có sẵn để vô hiệu hóa checkbox
    onAddContestants?: (contestants: EliminatedContestant[]) => void; // Callback để thêm thí sinh vào danh sách tạm thời
}

const EliminatedContestantDialog: React.FC<EliminatedContestantDialogProps> = ({
    open,
    onClose,
    matchId,
    existingRescuedIds,
    onAddContestants,
}) => {
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

    // Xử lý chọn/bỏ chọn thí sinh
    const handleToggleSelect = (contestant: EliminatedContestant) => {
        const isSelected = selected.some(s => s.contestantId === contestant.contestantId);
        if (isSelected) {
            setSelected(prev => prev.filter(s => s.contestantId !== contestant.contestantId));
        } else {
            setSelected(prev => [...prev, contestant]);
        }
    };

    // Xử lý khi nhấn nút "Thêm"
    const handleAdd = () => {
        if (onAddContestants && selected.length > 0) {
            onAddContestants(selected);
            setSelected([]); // Clear selection sau khi thêm
            onClose(); // Đóng dialog
        }
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
            
            <DialogContent dividers>
                <Stack spacing={2}>
                    {/* Khu vực tìm kiếm */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            fullWidth
                            placeholder="Tìm kiếm theo tên, mã sinh viên, trường, lớp..."
                            size="small"
                            value={filters.search}
                            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
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
                        <TableContainer sx={{height: '359px'}} component={Paper} variant="outlined">
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
                                            const isDisabled = existingRescuedIds.includes(c.contestantId);
                                            const tooltipText = isDisabled ? "Thí sinh đã có trong danh sách" : "Nhấn để chọn";
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
                                                        selected={isSelected}
                                                        onClick={() => !isDisabled && handleToggleSelect(c)}
                                                        sx={{
                                                            cursor: isDisabled ? 'not-allowed' : 'pointer',
                                                            opacity: isDisabled ? 0.5 : 1,
                                                        }}
                                                    >
                                                        <TableCell padding="checkbox">
                                                            <Checkbox 
                                                                checked={isSelected} 
                                                                disabled={isDisabled}
                                                            />
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
                    disabled={selected.length === 0}
                >
                    {`Thêm ${selected.length > 0 ? `(${selected.length})` : ''} thí sinh`}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EliminatedContestantDialog;