import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Dialog,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import QuestionTopicList from "../components/QuestionTopicList";
import QuestionTopicForm from "../components/QuestionTopicForm";
import { useQuestionTopicList } from "../hooks";
import type { QuestionTopic } from "../types/questionTopic";
import { useToast } from "../../../../contexts/toastContext";
import { toggleActive } from "../services/questionTopicService";
import {
  useCreateQuestionTopic,
  useUpdateQuestionTopic,
  useDeleteQuestionTopic,
} from "../hooks/crud";
import type {
  CreateQuestionTopicInput,
  UpdateQuestionTopicInput,
} from "../schemas/questionTopic.schema";
import QuestionTopicDetailPopup from "../components/QuestionTopicDetailPopup";
import ConfirmDeleteDialog from "../../../../components/ConfirmDeleteDialog";
import type { BatchDeleteResponse } from "../services/questionTopicService";
import { useQueryClient } from "@tanstack/react-query";

interface FailedItem {
  id: number;
  reason: string;
}

// Định nghĩa interface Message cho response xóa nhiều
interface Message {
  id: number;
  status: "success" | "error";
  msg: string;
}

const QuestionTopicsPage: React.FC = () => {
  const { loading, error, refresh } = useQuestionTopicList();
  const [selectedQuestionTopic, setSelectedQuestionTopic] =
    useState<QuestionTopic | null>(null);
  const [isDetailPopupOpen, setDetailPopupOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { handleCreate: createQuestionTopic, isCreating } =
    useCreateQuestionTopic();
  const { handleUpdate: updateQuestionTopic, isUpdating } =
    useUpdateQuestionTopic();
  const { handleDeleteSelected } = useDeleteQuestionTopic();

  // Hiển thị lỗi từ api nếu có
  React.useEffect(() => {
    if (error) {
      showToast(error, "error");
    }
  }, [error, showToast]);

  // Xử lý khi người dùng nhấn nút xem chi tiết
  const handleViewDetail = (questionTopic: QuestionTopic) => {
    setSelectedQuestionTopic(questionTopic);
    setDetailPopupOpen(true);
  };

  useEffect(() => {
    document.title = "Quản lý chủ đề câu hỏi";
  }, []);

  // Xử lý khi người dùng nhấn nút sửa
  const handleEdit = (questionTopic: QuestionTopic) => {
    setSelectedQuestionTopic(questionTopic);
    setEditDialogOpen(true);
  };

  // Xử lý khi người dùng nhấn nút thêm mới
  const handleCreateClick = () => {
    setCreateDialogOpen(true);
  };

  // Xử lý khi đóng dialog
  const handleCloseDialog = () => {
    setDetailPopupOpen(false);
    setEditDialogOpen(false);
    setCreateDialogOpen(false);
    setSelectedQuestionTopic(null);
  };

  // Xử lý khi người dùng nhấn nút xóa
  const handleDelete = (ids: number[]) => {
    setSelectedIds(ids);
    setOpenConfirmDelete(true);
  };

  // Xử lý khi người dùng xác nhận xóa
  const handleConfirmDelete = async () => {
    try {
      const response = await handleDeleteSelected(selectedIds);

      if (response && typeof response === "object" && "data" in response) {
        const res = response as BatchDeleteResponse;
        if (res.data.failedIds.length > 0) {
          res.data.failedIds.forEach((item: FailedItem) => {
            showToast(`ID ${item.id}: ${item.reason}`, "error");
          });
        }
        if (res.data.successfulIds.length > 0) {
          res.data.successfulIds.forEach((id: number) => {
            showToast(`ID ${id}: Xóa thành công`, "success");
          });
        }
      } else if (response === true) {
        showToast("Xóa chủ đề thành công", "success");
      }

      refresh();

      // Invalidate question topics cache để other pages có thể nhận data mới
      queryClient.invalidateQueries({ queryKey: ["questionTopics"] });
    } catch (error) {
      if (error && typeof error === "object" && "messages" in error) {
        const messages = (error as { messages: Message[] }).messages;
        messages.forEach(item => {
          if (item.status === "error") {
            showToast(item.msg, "error");
          } else {
            showToast(item.msg, "success");
          }
        });
      } else {
        showToast("Xóa chủ đề thất bại", "error");
      }
    } finally {
      setOpenConfirmDelete(false);
      setSelectedIds([]);
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      await toggleActive(id);
      showToast("Cập nhật trạng thái chủ đề thành công", "success");
      refresh();

      // Invalidate question topics cache để other pages có thể nhận data mới
      queryClient.invalidateQueries({ queryKey: ["questionTopics"] });
    } catch (error) {
      showToast("Có lỗi xảy ra khi cập nhật trạng thái chủ đề", "error");
    }
  };

  // Xử lý khi submit form tạo mới
  const handleCreateSubmit = async (data: CreateQuestionTopicInput) => {
    try {
      await createQuestionTopic(data);
      showToast("Tạo chủ đề mới thành công", "success");
      handleCloseDialog();
      refresh();

      // Invalidate question topics cache để other pages có thể nhận data mới
      queryClient.invalidateQueries({ queryKey: ["questionTopics"] });
    } catch {
      showToast("Có lỗi xảy ra khi tạo chủ đề mới", "error");
    }
  };

  // Xử lý khi submit form cập nhật
  const handleUpdateSubmit = async (data: UpdateQuestionTopicInput) => {
    if (!selectedQuestionTopic) return;
    try {
      await updateQuestionTopic(selectedQuestionTopic.id, data);
      showToast("Cập nhật chủ đề thành công", "success");
      handleCloseDialog();
      refresh();

      // Invalidate question topics cache để other pages có thể nhận data mới
      queryClient.invalidateQueries({ queryKey: ["questionTopics"] });
    } catch {
      showToast("Có lỗi xảy ra khi cập nhật chủ đề", "error");
    }
  };

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1">
          Quản lý chủ đề câu hỏi
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
        >
          Thêm chủ đề mới
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <QuestionTopicList
            onViewDetail={handleViewDetail}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
        )}
      </Paper>

      <Dialog
        open={isDetailPopupOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedQuestionTopic && (
          <QuestionTopicDetailPopup
            questionTopic={selectedQuestionTopic}
            open={isDetailPopupOpen}
            onClose={handleCloseDialog}
          />
        )}
      </Dialog>

      <Dialog
        open={isCreateDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <QuestionTopicForm
          onSubmit={handleCreateSubmit}
          onCancel={handleCloseDialog}
          isSubmitting={isCreating}
          mode="create"
        />
      </Dialog>

      <Dialog
        open={isEditDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedQuestionTopic && (
          <QuestionTopicForm
            questionTopic={selectedQuestionTopic}
            onSubmit={handleUpdateSubmit}
            onCancel={handleCloseDialog}
            isSubmitting={isUpdating}
            mode="edit"
          />
        )}
      </Dialog>

      <ConfirmDeleteDialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa chủ đề"
        content="Bạn có chắc chắn muốn xóa chủ đề này không?"
      />
    </Box>
  );
};

export default QuestionTopicsPage;
