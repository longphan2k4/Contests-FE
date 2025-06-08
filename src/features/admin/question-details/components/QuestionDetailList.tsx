import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  InputAdornment,
  IconButton,
  Stack,
  Switch,
  FormControlLabel,
  Button
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { 
  Visibility as VisibilityIcon, 
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useQuestionDetails } from '../hooks';
import type { QuestionDetail } from '../types/questionDetail';

interface QuestionDetailListProps {
  packageId?: number;
  onView?: (questionDetail: QuestionDetail) => void;
  onEdit?: (questionDetail: QuestionDetail) => void;
  onDelete?: (questionDetail: QuestionDetail) => void;
  onAdd?: () => void;
  onReorder?: (questionDetails: QuestionDetail[]) => void;
}

const QuestionDetailList: React.FC<QuestionDetailListProps> = ({
  packageId,
  onView,
  onEdit,
  onDelete,
  onAdd,
  onReorder
}) => {
  const [search, setSearch] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  });

  const { 
    questionDetails, 
    pagination, 
    loading, 
    updateFilter 
  } = useQuestionDetails({
    questionPackageId: packageId,
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    isActive: showInactive ? undefined : true,
    search: search || undefined
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearch = () => {
    updateFilter({ search });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearch('');
    updateFilter({ search: '' });
  };

  const handleActiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowInactive(e.target.checked);
    updateFilter({ isActive: e.target.checked ? undefined : true });
  };

  const columns: GridColDef[] = [
    {
      field: 'questionOrder',
      headerName: 'Thứ tự',
      width: 100,
      sortable: false
    },
    {
      field: 'question',
      headerName: 'Câu hỏi',
      flex: 1,
      valueGetter: (params: GridRenderCellParams<QuestionDetail>) => params.row.question?.title || '',
      sortable: false
    },
    {
      field: 'isActive',
      headerName: 'Trạng thái',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <FormControlLabel
          control={
            <Switch
              checked={params.value}
              onChange={(e) => {
                // TODO: Implement status change
                console.log('Status change:', params.row, e.target.checked);
              }}
              size="small"
            />
          }
          label={params.value ? 'Đang hoạt động' : 'Không hoạt động'}
        />
      ),
      sortable: false
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 200,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" spacing={1}>
          {onView && (
            <IconButton
              size="small"
              onClick={() => onView(params.row)}
              title="Xem chi tiết"
            >
              <VisibilityIcon />
            </IconButton>
          )}
          {onEdit && (
            <IconButton
              size="small"
              onClick={() => onEdit(params.row)}
              title="Chỉnh sửa"
            >
              <EditIcon />
            </IconButton>
          )}
          {onDelete && (
            <IconButton
              size="small"
              onClick={() => onDelete(params.row)}
              title="Xóa"
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Stack>
      )
    }
  ];

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Tìm kiếm câu hỏi..."
            value={search}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: search && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleClearSearch}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ flex: 1 }}
          />
          {onAdd && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAdd}
              size="small"
            >
              Thêm mới
            </Button>
          )}
          <FormControlLabel
            control={
              <Switch
                checked={showInactive}
                onChange={handleActiveChange}
                size="small"
              />
            }
            label="Hiển thị câu hỏi không hoạt động"
          />
        </Box>

        <DataGrid
          rows={questionDetails}
          columns={columns}
          getRowId={(row) => `${row.questionId}-${row.questionPackageId}`}
          rowCount={pagination?.totalItems || 0}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          paginationMode="server"
          disableRowSelectionOnClick
          checkboxSelection={!!onReorder}
          slots={{
            noRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                <Typography variant="body2" color="text.secondary">
                  Không có dữ liệu
                </Typography>
              </Stack>
            )
          }}
        />
      </CardContent>
    </Card>
  );
};

export default QuestionDetailList; 