import React, { useState } from "react";
import { useParams } from "react-router-dom";
import type { SelectChangeEvent } from "@mui/material";
import {
  Box,
  Button,
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  InputAdornment,
  Stack,
  Checkbox,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Chip,
  Breadcrumbs,
  Link,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  DragIndicator as DragIcon,
} from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import { useQuestionDetails } from "../hooks/useQuestionDetails";
import { QuestionDetailDialog } from "../components/QuestionDetailDialog";
import { ReorderQuestionsDialog } from "../components/ReorderQuestionsDialog";
import QuestionDetailViewDialog from "../components/QuestionDetailViewDialog";
import type { QuestionDetail } from "../types";
import ConfirmDeleteDialog from "../../../../components/ConfirmDeleteDialog";
// import { useNotification } from '../../../../contexts/NotificationContext';

const QuestionDetailListPage: React.FC = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [reorderDialogOpen, setReorderDialogOpen] = useState(false);
  const [viewingQuestion, setViewingQuestion] = useState<QuestionDetail | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<QuestionDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editingQuestion] = useState<QuestionDetail | undefined>(undefined);

  const {
    questionDetails,
    loading,
    error,
    selectedIds,
    setSelectedIds,
    total,
    totalPages,
    filter,
    updateFilter,
    handleDeleteSelected,
    fetchQuestionDetails,
    packageName,
    handleDelete,
  } = useQuestionDetails();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    updateFilter({ page });
  };

  const handleChangeRowsPerPage = (event: SelectChangeEvent<string>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    updateFilter({ limit: newRowsPerPage, page: 1 });
  };

  const handleQuestionTypeChange = (event: SelectChangeEvent<string>) => {
    updateFilter({ questionType: event.target.value });
  };

  const handleDifficultyChange = (event: SelectChangeEvent<string>) => {
    updateFilter({ difficulty: event.target.value });
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    updateFilter({
      isActive:
        value === "active" ? true : value === "inactive" ? false : undefined,
    });
  };

  const handleAdd = () => {
    setDialogOpen(true);
  };

  const handleView = async (record: QuestionDetail) => {
    setDetailLoading(true);
    setViewingQuestion(record);
    setViewDialogOpen(true);
    setDetailLoading(false);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
    setViewingQuestion(null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    updateFilter({ search: event.target.value });
  };

  const handleOpenReorderDialog = () => {
    setReorderDialogOpen(true);
  };

  const handleCloseReorderDialog = () => {
    setReorderDialogOpen(false);
  };

  const handleOpenDelete = (record: QuestionDetail) => {
    setDeleteTarget(record);
    setOpenConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      await handleDelete(deleteTarget);
      setOpenConfirmDelete(false);
      setDeleteTarget(null);
    }
  };

  // Thêm hàm chuyển đổi HTML thành text
  const stripHtml = (html: string | undefined) => {
    if (!html) return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 2 }}
      >
        <Link color="inherit" href="/admin/question-packages">
          Danh sách gói câu hỏi
        </Link>
        <Typography color="text.primary">
          {`Chi tiết gói câu hỏi ${packageName}`}
        </Typography>
      </Breadcrumbs>

      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
        >
          {packageName || "Chi tiết gói câu hỏi"}
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          <Button
            variant="outlined"
            startIcon={<DragIcon />}
            onClick={handleOpenReorderDialog}
            fullWidth={isMobile}
          >
            Sắp xếp thứ tự
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            fullWidth={isMobile}
          >
            Thêm câu hỏi vào gói
          </Button>
        </Stack>
      </Box>

      <Paper sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
        {error && (
          <Box sx={{ mb: 2 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        <Stack spacing={2} sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 2,
            }}
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
              fullWidth
            />

            <FormControl size="small" fullWidth>
              <InputLabel>Loại câu hỏi</InputLabel>
              <Select
                value={filter.questionType || ""}
                onChange={handleQuestionTypeChange}
                label="Loại câu hỏi"
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="multiple_choice">Trắc nghiệm</MenuItem>
                <MenuItem value="essay">Tự luận</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
              <InputLabel>Độ khó</InputLabel>
              <Select
                value={filter.difficulty || ""}
                onChange={handleDifficultyChange}
                label="Độ khó"
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="Alpha">Alpha</MenuItem>
                <MenuItem value="Beta">Beta</MenuItem>
                <MenuItem value="Gold">Gold</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={
                  filter.isActive === true
                    ? "active"
                    : filter.isActive === false
                    ? "inactive"
                    : ""
                }
                onChange={handleStatusChange}
                label="Trạng thái"
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="active">Đang hoạt động</MenuItem>
                <MenuItem value="inactive">Vô hiệu hóa</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>

        {selectedIds.size > 0 && (
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteSelected}
              startIcon={<DeleteIcon />}
              fullWidth={isMobile}
            >
              Xóa ({selectedIds.size})
            </Button>
          </Box>
        )}

        <Box sx={{ mb: 2, textAlign: { xs: "center", sm: "right" } }}>
          <Typography>Tổng số: {total} câu hỏi</Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : questionDetails.length === 0 ? (
          <Typography sx={{ textAlign: "center", p: 3 }}>
            Không có dữ liệu
          </Typography>
        ) : (
          <>
            <TableContainer
              sx={{
                overflowX: "auto",
                "& .MuiTableCell-root": {
                  whiteSpace: "nowrap",
                  minWidth: { xs: "auto", sm: "100px" },
                },
                "& .question-title-cell": {
                  whiteSpace: "normal",
                  minWidth: "300px",
                  maxWidth: "500px",
                  wordBreak: "break-word",
                },
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={
                          selectedIds.size === questionDetails.length &&
                          questionDetails.length > 0
                        }
                        indeterminate={
                          selectedIds.size > 0 &&
                          selectedIds.size < questionDetails.length
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds(
                              new Set(questionDetails.map((q) => q.questionId))
                            );
                          } else {
                            setSelectedIds(new Set());
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell width={80}>STT</TableCell>
                    <TableCell>Tiêu đề câu hỏi</TableCell>
                    {!isMobile && (
                      <>
                        <TableCell width={120}>Loại câu hỏi</TableCell>
                        <TableCell width={120}>Độ khó</TableCell>
                      </>
                    )}
                    <TableCell width={135} align="center">
                      Trạng thái
                    </TableCell>
                    <TableCell width={150}>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {questionDetails.map((row) => (
                    <TableRow
                      key={`${row.questionId}-${row.questionPackageId}`}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedIds.has(row.questionId)}
                          onChange={(e) => {
                            const newSelectedIds = new Set(selectedIds);
                            if (e.target.checked) {
                              newSelectedIds.add(row.questionId);
                            } else {
                              newSelectedIds.delete(row.questionId);
                            }
                            setSelectedIds(newSelectedIds);
                          }}
                        />
                      </TableCell>
                      <TableCell>{row.questionOrder}</TableCell>
                      <TableCell className="question-title-cell">
                        {stripHtml(row.question?.content) || "Không có tiêu đề"}
                      </TableCell>
                      {!isMobile && (
                        <>
                          <TableCell>
                            {row.question?.questionType === "multiple_choice"
                              ? "Trắc nghiệm"
                              : row.question?.questionType === "essay"
                              ? "Tự luận"
                              : row.question?.questionType}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={row.question?.difficulty || "N/A"}
                              color={
                                row.question?.difficulty === "Alpha"
                                  ? "info"
                                  : row.question?.difficulty === "Beta"
                                  ? "warning"
                                  : row.question?.difficulty === "Gold"
                                  ? "success"
                                  : "default"
                              }
                              size="small"
                            />
                          </TableCell>
                        </>
                      )}
                      <TableCell width={120} align="center">
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 500,
                            color: row.isActive ? "success.main" : "error.main",
                            textAlign: "center",
                            fontSize: 14,
                            lineHeight: 1.4,
                            py: 0.5,
                          }}
                        >
                          {row.isActive ? "Đang hoạt động" : "Vô hiệu hóa"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                        >
                          <Tooltip title="Xem chi tiết">
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => handleView(row)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleOpenDelete(row)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box
              sx={{
                mt: 2,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
              }}
            >
              <FormControl
                variant="outlined"
                size="small"
                sx={{ minWidth: 100 }}
              >
                <InputLabel id="page-size-select-label">Hiển thị</InputLabel>
                <Select
                  labelId="page-size-select-label"
                  value={String(filter.limit)}
                  onChange={handleChangeRowsPerPage}
                  label="Hiển thị"
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </FormControl>
              <Typography>
                Trang {filter.page} / {totalPages}
              </Typography>
            </Box>

            {totalPages > 0 && (
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <Pagination
                  count={totalPages}
                  page={filter.page}
                  onChange={handlePageChange}
                  showFirstButton
                  showLastButton
                  color="primary"
                  size={isMobile ? "small" : "medium"}
                  siblingCount={isMobile ? 0 : 1}
                />
              </Box>
            )}
          </>
        )}
      </Paper>

      <QuestionDetailDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        editingQuestion={editingQuestion}
        totalQuestions={total}
        questionPackageId={Number(packageId)}
        onSuccess={fetchQuestionDetails}
      />

      <QuestionDetailViewDialog
        open={viewDialogOpen}
        onClose={handleViewDialogClose}
        questionDetail={viewingQuestion}
        loading={detailLoading}
      />

      {packageId && (
        <ReorderQuestionsDialog
          open={reorderDialogOpen}
          onClose={handleCloseReorderDialog}
          packageId={Number(packageId)}
          refreshQuestions={fetchQuestionDetails}
        />
      )}

      <ConfirmDeleteDialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        onConfirm={handleConfirmDelete}
        content={`Bạn có chắc chắn muốn xóa câu hỏi số ${deleteTarget?.questionOrder}?`}
      />
    </Box>
  );
};

export default QuestionDetailListPage;
