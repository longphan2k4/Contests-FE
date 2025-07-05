import React, { useState } from "react";
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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import type { SelectChangeEvent } from "@mui/material";
import type { AxiosError } from "axios";
import type {
  Question,
  QuestionType,
  BatchDeleteResponseData,
  BatchDeleteError,
} from "../types";
import { useGetQuestions } from "../hooks/crud/useGetQuestions";
import { QuestionDialog } from "../components";
import { useQuestionCrud } from "../hooks/useQuestionCrud";
import { useQuestionTopics } from "../hooks/useQuestionTopics";
import ConfirmDeleteDialog from "../../../../components/ConfirmDeleteDialog";
import { useToast } from "../../../../contexts/toastContext";

const QuestionsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [questionType, setQuestionType] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [openConfirmBatchDelete, setOpenConfirmBatchDelete] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { showToast } = useToast();
  const { data, isLoading, error } = useGetQuestions({
    page,
    limit,
    search,
    questionType: questionType as QuestionType | undefined,
    difficulty: difficulty as Question["difficulty"] | undefined,
    isActive,
    sortBy,
    sortOrder,
  });

  const {
    selectedQuestion,
    dialogOpen,
    dialogMode,
    isLoading: isCrudLoading,
    openCreateDialog,
    openEditDialog,
    openViewDialog,
    closeDialog,
    handleSubmit,
    handleDelete,
    handleBatchDelete,
  } = useQuestionCrud();

  const { data: topics = [] } = useQuestionTopics();

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleChangeRowsPerPage = (event: SelectChangeEvent<string>) => {
    setLimit(Number(event.target.value));
    setPage(1);
  };

  const handleQuestionTypeChange = (event: SelectChangeEvent<string>) => {
    setQuestionType(event.target.value);
    setPage(1);
  };

  const handleDifficultyChange = (event: SelectChangeEvent<string>) => {
    setDifficulty(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setIsActive(
      value === "active" ? true : value === "inactive" ? false : undefined
    );
    setPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const getDifficultyColor = (difficulty: Question["difficulty"]) => {
    switch (difficulty) {
      case "Alpha":
        return "success";
      case "Beta":
        return "info";
      case "Rc":
        return "warning";
      case "Gold":
        return "error";
      default:
        return "default";
    }
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortBy(event.target.value);
  };

  const handleSortOrderChange = (event: SelectChangeEvent<string>) => {
    setSortOrder(event.target.value as "asc" | "desc");
  };

  const questions = data?.data.questions || [];
  const totalPages = data?.data.pagination.totalPages || 0;
  const handleAdd = () => {
    openCreateDialog();
  };

  const handleEdit = (question: Question) => {
    openEditDialog(question);
  };

  const handleView = (question: Question) => {
    openViewDialog(question);
  };

  const handleOpenDelete = (id: number) => {
    setDeleteTarget(id);
    setOpenConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (deleteTarget !== null) {
        const response = await handleDelete(deleteTarget);
        showToast(response.message, "success");
        setOpenConfirmDelete(false);
        setDeleteTarget(null);
      } else {
        showToast("Không có câu hỏi được chọn", "error");
      }
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "isAxiosError" in error &&
        (error as AxiosError<{ message?: string }>).isAxiosError
      ) {
        const axiosError = error as AxiosError<{ message?: string }>;
        showToast(
          axiosError.response?.data?.message || "Có lỗi xảy ra khi xóa câu hỏi",
          "error"
        );
      } else {
        showToast("Có lỗi xảy ra khi xóa câu hỏi", "error");
      }
    }
  };

  const handleOpenBatchDelete = () => {
    if (selectedIds.size > 0) {
      setOpenConfirmBatchDelete(true);
    }
  };

  const handleConfirmBatchDelete = async () => {
    try {
      const response = (await handleBatchDelete(
        Array.from(selectedIds)
      )) as BatchDeleteResponseData;
      showToast(
        response.successIds && response.successIds.length > 0
          ? `Xóa thành công ${response.successIds.length} câu hỏi`
          : "Không có câu hỏi nào được xóa",
        response.successIds && response.successIds.length > 0
          ? "success"
          : "warning"
      );
      if (Array.isArray(response.errors) && response.errors.length > 0) {
        response.errors.forEach((err: BatchDeleteError) => {
          showToast(`ID ${err.id}: ${err.error}`, "error");
        });
      }
      setOpenConfirmBatchDelete(false);
      setSelectedIds(new Set());
    } catch (error: unknown) {
      showToast(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi xóa nhiều câu hỏi",
        "error"
      );
    }
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
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
          Quản lý câu hỏi
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          fullWidth={isMobile}
        >
          Thêm câu hỏi mới
        </Button>
      </Box>

      <Paper sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
        {error && (
          <Box sx={{ mb: 2 }}>
            <Typography color="error">{error.message}</Typography>
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
              value={search}
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
                value={questionType}
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
                value={difficulty}
                onChange={handleDifficultyChange}
                label="Độ khó"
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="Alpha">Alpha</MenuItem>
                <MenuItem value="Beta">Beta</MenuItem>
                <MenuItem value="Rc">Rc</MenuItem>
                <MenuItem value="Gold">Gold</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={
                  isActive === true
                    ? "active"
                    : isActive === false
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

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
              },
              gap: 2,
            }}
          >
            <FormControl size="small" fullWidth>
              <InputLabel>Sắp xếp theo</InputLabel>
              <Select
                value={sortBy}
                onChange={handleSortChange}
                label="Sắp xếp theo"
              >
                <MenuItem value="createdAt">Ngày tạo</MenuItem>
                <MenuItem value="updatedAt">Ngày cập nhật</MenuItem>
                <MenuItem value="score">Điểm số</MenuItem>
                <MenuItem value="defaultTime">Thời gian làm bài</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
              <InputLabel>Thứ tự</InputLabel>
              <Select
                value={sortOrder}
                onChange={handleSortOrderChange}
                label="Thứ tự"
              >
                <MenuItem value="asc">Tăng dần</MenuItem>
                <MenuItem value="desc">Giảm dần</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>

        {selectedIds.size > 0 && (
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleOpenBatchDelete}
              startIcon={<DeleteIcon />}
              fullWidth={isMobile}
            >
              Xóa ({selectedIds.size})
            </Button>
          </Box>
        )}

        <Box sx={{ mb: 2, textAlign: { xs: "center", sm: "right" } }}>
          <Typography>
            Tổng số: {data?.data.pagination.total || 0} câu hỏi
          </Typography>
        </Box>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : questions.length === 0 ? (
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
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={
                          selectedIds.size === questions.length &&
                          questions.length > 0
                        }
                        indeterminate={
                          selectedIds.size > 0 &&
                          selectedIds.size < questions.length
                        }
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedIds(new Set(questions.map(q => q.id)));
                          } else {
                            setSelectedIds(new Set());
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>Id</TableCell>
                    <TableCell>Nội dung</TableCell>
                    {!isMobile && (
                      <>
                        <TableCell>Loại câu hỏi</TableCell>
                        <TableCell>Độ khó</TableCell>
                        <TableCell>Chủ đề</TableCell>
                      </>
                    )}
                    <TableCell align="center">Trạng thái</TableCell>
                    <TableCell>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {questions.map(question => (
                    <TableRow key={question.id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedIds.has(question.id)}
                          onChange={e => {
                            const newSelectedIds = new Set(selectedIds);
                            if (e.target.checked) {
                              newSelectedIds.add(question.id);
                            } else {
                              newSelectedIds.delete(question.id);
                            }
                            setSelectedIds(newSelectedIds);
                          }}
                        />
                      </TableCell>
                      <TableCell>{question.id}</TableCell>
                      <TableCell>
                        <Typography
                          dangerouslySetInnerHTML={{ __html: question.content }}
                          sx={{
                            maxWidth: 300,
                            // Cho phép xuống dòng bình thường
                            whiteSpace: "normal",
                            // Bẻ từ ở giữa nếu quá dài
                            overflowWrap: "break-word",
                            wordBreak: "break-word",
                            // Tùy chọn: nếu bạn muốn 3 dòng rồi mới cắt
                            // display: '-webkit-box',
                            // WebkitLineClamp: 3,
                            // WebkitBoxOrient: 'vertical',
                            // overflow: 'hidden',
                          }}
                        />
                      </TableCell>
                      {!isMobile && (
                        <>
                          <TableCell>
                            {question.questionType === "multiple_choice"
                              ? "Trắc nghiệm"
                              : "Tự luận"}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={question.difficulty}
                              color={getDifficultyColor(question.difficulty)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{question.questionTopic?.name}</TableCell>
                        </>
                      )}
                      <TableCell align="center">
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 500,
                            color: question.isActive
                              ? "success.main"
                              : "error.main",
                            textAlign: "center",
                            fontSize: 14,
                            lineHeight: 1.4,
                            py: 0.5,
                          }}
                        >
                          {question.isActive ? "Đang hoạt động" : "Vô hiệu hóa"}
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
                              onClick={() => handleView(question)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Chỉnh sửa">
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => handleEdit(question)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleOpenDelete(question.id)}
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
                  value={String(limit)}
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
                Trang {page} / {totalPages}
              </Typography>
            </Box>

            {totalPages > 0 && (
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <Pagination
                  count={totalPages}
                  page={page}
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

      <QuestionDialog
        open={dialogOpen}
        onClose={closeDialog}
        onSubmit={handleSubmit}
        question={selectedQuestion}
        isLoading={isCrudLoading}
        mode={dialogMode}
        topics={topics}
      />

      <ConfirmDeleteDialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        onConfirm={handleConfirmDelete}
        content="Bạn có chắc chắn muốn xóa câu hỏi này không?"
      />

      <ConfirmDeleteDialog
        open={openConfirmBatchDelete}
        onClose={() => setOpenConfirmBatchDelete(false)}
        onConfirm={handleConfirmBatchDelete}
        content={`Bạn có chắc chắn muốn xóa ${selectedIds.size} câu hỏi đã chọn không?`}
      />
    </Box>
  );
};

export default QuestionsPage;
