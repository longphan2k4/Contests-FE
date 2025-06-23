import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Paper,
  List,
  CircularProgress,
} from "@mui/material";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { questionDetailService } from "../services/questionDetailService";
import { useNotification } from "../../../../contexts/NotificationContext";
import type { QuestionDetail } from "../types";

interface ReorderQuestionsDialogProps {
  open: boolean;
  onClose: () => void;
  packageId: number;
  refreshQuestions: () => Promise<void>;
}

export const ReorderQuestionsDialog: React.FC<ReorderQuestionsDialogProps> = ({
  open,
  onClose,
  packageId,
  refreshQuestions,
}) => {
  const [questions, setQuestions] = useState<QuestionDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { showSuccessNotification, showErrorNotification } = useNotification();
  const dialogRef = React.useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await questionDetailService.getQuestionDetailsByPackage(
        packageId,
        {
          limit: 100,
          sortBy: "questionOrder",
          sortOrder: "asc",
        }
      );
      if (response.data.questions) {
        const questionsWithIds = response.data.questions.map(
          (q: QuestionDetail, index: number) => ({
            ...q,
            uniqueId: `item-${index}`,
          })
        );
        setQuestions(questionsWithIds);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách câu hỏi:", error);
      showErrorNotification("Không thể tải danh sách câu hỏi");
    } finally {
      setLoading(false);
    }
  }, [packageId, showErrorNotification]);

  // Tải danh sách câu hỏi khi dialog mở
  React.useEffect(() => {
    if (open && packageId) {
      fetchQuestions();
    }
  }, [open, packageId, fetchQuestions]);

  // Xử lý đóng dialog và blur focus
  const handleClose = useCallback(() => {
    // Tìm tất cả elements có thể focus trong dialog và blur chúng
    if (dialogRef.current) {
      const focusableElements = dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusableElements.forEach((element) => {
        if (element instanceof HTMLElement) {
          element.blur();
        }
      });
    }

    // Blur document.activeElement nếu có
    if (
      document.activeElement &&
      document.activeElement instanceof HTMLElement
    ) {
      document.activeElement.blur();
    }

    // Sử dụng setTimeout để đảm bảo blur xảy ra trước khi dialog đóng hoàn toàn
    setTimeout(() => {
      onClose();
    }, 0);
  }, [onClose]);

  // Xử lý kéo thả hoàn tất
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setQuestions((items) => {
      const oldIndex = items.findIndex((item) => item.uniqueId === active.id);
      const newIndex = items.findIndex((item) => item.uniqueId === over.id);

      if (oldIndex === -1 || newIndex === -1) {
        return items;
      }

      const newItems = arrayMove(items, oldIndex, newIndex);

      // Cập nhật thứ tự mới và ID
      return newItems.map((item, index) => ({
        ...item,
        questionOrder: index + 1,
        uniqueId: `item-${index}`,
      }));
    });
  };

  // Lưu thứ tự mới
  const handleSave = useCallback(async () => {
    try {
      setSaving(true);
      const questionsToSync = questions.map(
        (q: QuestionDetail, index: number) => ({
          questionId: q.questionId,
          questionOrder: index + 1,
        })
      );

      await questionDetailService.syncQuestionDetails(
        packageId,
        questionsToSync
      );

      showSuccessNotification("Đã cập nhật thứ tự câu hỏi thành công");
      handleClose();
      await refreshQuestions();
    } catch (error) {
      console.error("Lỗi khi cập nhật thứ tự câu hỏi:", error);
      showErrorNotification("Không thể cập nhật thứ tự câu hỏi");
    } finally {
      setSaving(false);
    }
  }, [
    questions,
    packageId,
    handleClose,
    refreshQuestions,
    showSuccessNotification,
    showErrorNotification,
  ]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      ref={dialogRef}
    >
      <DialogTitle>Sắp xếp thứ tự câu hỏi</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : questions.length === 0 ? (
          <Typography sx={{ p: 2 }}>Không có câu hỏi để sắp xếp</Typography>
        ) : (
          <Paper variant="outlined" sx={{ mt: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{ p: 2, bgcolor: "background.default" }}
            >
              Kéo và thả để sắp xếp thứ tự câu hỏi
            </Typography>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={questions.map((q) => q.uniqueId || "")}
                strategy={verticalListSortingStrategy}
              >
                <List
                  sx={{
                    width: "100%",
                    maxHeight: "400px",
                    overflow: "auto",
                    p: 2,
                  }}
                >
                  {questions.map((question) => (
                    <SortableItem
                      key={question.uniqueId}
                      id={question.uniqueId || ""}
                      question={question}
                    />
                  ))}
                </List>
              </SortableContext>
            </DndContext>
          </Paper>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading || saving || questions.length === 0}
        >
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
