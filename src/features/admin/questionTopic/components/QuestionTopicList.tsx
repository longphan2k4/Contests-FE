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
  Button,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { DataGrid, type GridRenderCellParams, type GridRowId } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import type { QuestionTopic } from '../types/questionTopic';
import { useQuestionTopicList } from '../hooks/list/useQuestionTopicList';

interface QuestionTopicListProps {
  onViewDetail?: (questionTopic: QuestionTopic) => void;
  onEdit?: (questionTopic: QuestionTopic) => void;
}

const QuestionTopicList: React.FC<QuestionTopicListProps> = ({
  onViewDetail,
  onEdit
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchTerm, setSearchTerm] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [selectionModel, setSelectionModel] = useState<{ type: 'include', ids: Set<GridRowId> }>({ type: 'include', ids: new Set() });

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
      width: 120,
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
      field: 'createdAt',
      headerName: 'Ngày tạo',
      width: 180,
      renderCell: (params: GridRenderCellParams<QuestionTopic>) => (
        <Typography>
          {new Date(params.row.createdAt).toLocaleString('vi-VN')}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 150,
      renderCell: (params: GridRenderCellParams<QuestionTopic>) => (
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => onViewDetail?.(params.row)}
          >
            Chi tiết
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={() => onEdit?.(params.row)}
          >
            Sửa
          </Button>
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
            rowSelectionModel={selectionModel}
            onRowSelectionModelChange={(model) => {
              setSelectionModel(model as { type: 'include', ids: Set<GridRowId> });
            }}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: filter.limit || 10,
                },
              },
            }}
          />

          {totalPages > 1 && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={totalPages}
                page={filter.page || 1}
                onChange={handlePageChange}
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
