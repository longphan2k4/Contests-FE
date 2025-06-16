import React, { useState } from 'react';
import { 
  Box, 
  Pagination,
  TextField,
  InputAdornment,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Tooltip,
  IconButton,
  Button
} from '@mui/material';
import {
  Delete as DeleteIcon,
} from '@mui/icons-material';
import type { SelectChangeEvent } from '@mui/material';
import { DataGrid, type GridRenderCellParams } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import type { QuestionTopic } from '../types/questionTopic';
import { useQuestionTopicList } from '../hooks/list/useQuestionTopicList';

interface QuestionTopicListProps {
  onViewDetail?: (questionTopic: QuestionTopic) => void;
  onEdit?: (questionTopic: QuestionTopic) => void;
  onDelete?: (ids: number[]) => void;
}

const QuestionTopicList: React.FC<QuestionTopicListProps> = ({
  onViewDetail,
  onEdit,
  onDelete
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchTerm, setSearchTerm] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const {
    questionTopics,
    loading,
    error,
    filter,
    updateFilter,
    total
  } = useQuestionTopicList();

  const totalPages = Math.ceil(total / (filter.limit || 10));

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    updateFilter({ search: event.target.value });
  };

  const handleActiveFilterChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setShowActiveOnly(value === 'active');
    updateFilter({ isActive: value === 'active' ? true : undefined });
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    updateFilter({ page });
  };

  const handleDelete = async (ids: number[]) => {
    onDelete?.(ids);
  };

  const columns = [
    {
      field: 'stt',
      headerName: 'STT',
      width: 70,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const index = params.api.getSortedRowIds().indexOf(params.id);
        return ((filter.page || 1) - 1) * (filter.limit || 10) + index + 1;
      },
    },
    { field: 'name', headerName: 'Tên chủ đề', flex: 1 },
    { field: 'questionsCount', headerName: 'Số câu hỏi', width: 120 },
    {
      field: 'isActive',
      headerName: 'Trạng thái',
      width: 200,
      renderCell: (params: GridRenderCellParams<QuestionTopic, boolean>) => (
        <Typography
          color={params.value ? 'success.main' : 'error.main'}
          fontWeight="medium"
        >
          {params.value ? 'Đang hoạt động' : 'Đã ẩn'}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 300,
      renderCell: (params: GridRenderCellParams<QuestionTopic>) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Xem chi tiết">
            <IconButton
              size="small"
              color="primary"
              onClick={() => onViewDetail?.(params.row)}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <IconButton
              size="small"
              color="primary"
              onClick={() => onEdit?.(params.row)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete([params.row.id])}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Stack
        direction={isMobile ? 'column' : 'row'}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <TextField
          label="Tìm kiếm"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 200 }}
        />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={showActiveOnly ? 'active' : 'all'}
            label="Trạng thái"
            onChange={handleActiveFilterChange}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="active">Đang hoạt động</MenuItem>
            <MenuItem value="inactive">Đã ẩn</MenuItem>
          </Select>
        </FormControl>
        {selectedIds.size > 0 && (
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDelete(Array.from(selectedIds))}
            sx={{ ml: 2 }}
          >
            Xoá ({selectedIds.size})
          </Button>
        )}
        <Box flex={1} />
        <Typography sx={{ alignSelf: 'center' }}>
          Tổng số: {total} chủ đề
        </Typography>
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      ) : questionTopics.length === 0 ? (
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Không có dữ liệu
        </Typography>
      ) : (
        <>
          <DataGrid
            rows={questionTopics}
            columns={columns}
            getRowId={(row) => row.id}
            loading={loading}
            autoHeight
            hideFooter
            disableRowSelectionOnClick
            checkboxSelection
            pageSizeOptions={[10, 25, 50]}
            paginationMode="server"
            rowCount={total}
            paginationModel={{
              page: (filter.page ? filter.page - 1 : 0),
              pageSize: filter.limit || 10,
            }}
            onPaginationModelChange={({ page, pageSize }) => {
              updateFilter({ page: page + 1, limit: pageSize });
            }}
            rowSelectionModel={{ type: 'include', ids: selectedIds }}
            onRowSelectionModelChange={(model) => {
              if (model && typeof model === 'object' && 'ids' in model) {
                setSelectedIds(new Set(model.ids as unknown as number[]));
              }
            }}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: filter.limit || 10,
                },
              },
            }}
          />

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 100 }}>
              <InputLabel id="page-size-select-label">Hiển thị</InputLabel>
              <Select
                labelId="page-size-select-label"
                value={String(filter.limit || 10)}
                onChange={(e) => updateFilter({ limit: Number(e.target.value), page: 1 })}
                label="Hiển thị"
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
            <Typography>
              Trang {filter.page || 1} / {totalPages}
            </Typography>
          </Box>

          {totalPages > 1 && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={totalPages}
                page={filter.page || 1}
                onChange={handlePageChange}
                showFirstButton 
                showLastButton  
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default QuestionTopicList;
