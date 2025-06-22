import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Chip,
  Paper,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  useTheme,
  useMediaQuery,
  Pagination,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { QuestionDetailDialogProps, AvailableQuestion } from "../types";
import { questionDetailService } from "../services/questionDetailService";
import { useToast } from "../../../../contexts/toastContext";
import { useBatchUpdate } from "../../../../hooks/useStableCallback";

interface QuestionDetail {
  questionId: number;
  question?: {
    content?: string;
    questionType?: string;
    difficulty?: string;
  };
  questionOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface DraggableQuestionItemProps {
  question: AvailableQuestion;
  index: number;
  isSelected: boolean;
  onSelect: (id: number, checked: boolean) => void;
}

const DraggableQuestionItem: React.FC<DraggableQuestionItemProps> = ({
  question,
  index,
  isSelected,
  onSelect,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `question-${question.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
    backgroundColor: isDragging ? "rgba(63, 81, 181, 0.08)" : undefined,
    border: isDragging ? "1px dashed #3f51b5" : undefined,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      hover
      selected={isSelected}
      {...attributes}
      {...listeners}
      sx={{
        cursor: "grab",
        "&:hover": {
          bgcolor: "action.hover",
        },
      }}
    >
      <TableCell padding="checkbox">
        <Checkbox
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onSelect(question.id, e.target.checked);
          }}
        />
      </TableCell>
      <TableCell>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <DragHandleIcon sx={{ mr: 1 }} />
          {index}
        </Box>
      </TableCell>
      <TableCell>
        <Typography
          component="div"
          dangerouslySetInnerHTML={{ __html: question.content || "" }}
          sx={{
            maxWidth: 300,
            whiteSpace: "normal",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }}
        />
      </TableCell>
      <TableCell>
        {question.questionType === "multiple_choice"
          ? "Trắc nghiệm"
          : "Tự luận"}
      </TableCell>
      <TableCell>
        <Chip
          label={question.difficulty || "N/A"}
          size="small"
          color={
            question.difficulty === "Alpha"
              ? "info"
              : question.difficulty === "Beta"
              ? "warning"
              : question.difficulty === "Gold"
              ? "success"
              : "default"
          }
        />
      </TableCell>
    </TableRow>
  );
};

// Компонент для выбранных вопросов
interface SortableQuestionItemProps {
  id: string;
  question: AvailableQuestion;
  index: number;
  onRemove: (id: number) => void;
  tempIndex: number | null;
  tempOrder: number | null;
  activeId: string | null;
  overId: string | null;
}

const ContentTypography = ({
  content,
  ...props
}: { content?: string } & Omit<
  React.ComponentProps<typeof Typography>,
  "ref" | "component" | "dangerouslySetInnerHTML"
>) => (
  <Typography
    component="div"
    dangerouslySetInnerHTML={{ __html: content || "" }}
    {...props}
  />
);

// Thêm hàm để cập nhật thứ tự câu hỏi
const updateQuestionOrders = (questions: AvailableQuestion[]) => {
  return questions.map((question, index) => ({
    ...question,
    questionOrder: index + 1,
  }));
};

const SortableQuestionItem: React.FC<SortableQuestionItemProps> = ({
  id,
  question,
  index,
  onRemove,
  tempIndex,
  tempOrder,
  activeId,
  overId,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const isOver = overId === id;
  const isActive = activeId === id;

  // Tính toán số thứ tự hiển thị
  let displayIndex = question.questionOrder || index;
  if (tempIndex !== null && tempOrder !== null) {
    if (index > tempIndex) {
      displayIndex = (question.questionOrder || index) + 1;
    } else if (index === tempIndex) {
      displayIndex = tempOrder;
    }
  }

  return (
    <Box
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isDragging
          ? "rgba(63, 81, 181, 0.08)"
          : isOver
          ? "rgba(63, 81, 181, 0.12)"
          : undefined,
        border: isDragging
          ? "1px dashed #3f51b5"
          : isOver
          ? "1px solid #3f51b5"
          : "1px solid",
        borderColor: isOver ? "#3f51b5" : "divider",
        width: "100%",
        position: "relative" as const,
      }}
      sx={{
        p: 1.5,
        mb: 1.5,
        borderRadius: 2,
        bgcolor: "background.default",
        "&:hover": {
          boxShadow: 1,
          cursor: "grab",
        },
      }}
    >
      {isOver && !isActive && (
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            height: "4px",
            bgcolor: "primary.main",
            top: isOver ? 0 : "100%",
            transform: "translateY(-50%)",
            zIndex: 1,
            borderRadius: "2px",
          }}
        />
      )}
      <Box
        {...attributes}
        {...listeners}
        sx={{
          position: "absolute",
          left: 4,
          top: 4,
          cursor: "grab",
          display: "flex",
          alignItems: "center",
          width: "calc(100% - 60px)", // Để tránh conflict với nút xóa
          height: "30px",
          zIndex: 2,
        }}
      >
        <DragHandleIcon fontSize="small" />
      </Box>
      <IconButton
        size="small"
        onClick={() => onRemove(question.id)}
        sx={{
          position: "absolute",
          right: 4,
          top: 4,
          color: "error.main",
          "&:hover": {
            bgcolor: "error.lighter",
          },
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
      <Typography
        variant="subtitle2"
        gutterBottom
        sx={{ fontWeight: 600, pl: 4, pt: 1 }}
      >
        Câu {displayIndex}
      </Typography>
      <ContentTypography
        content={question.content}
        sx={{
          fontSize: "0.875rem",
          mb: 1.5,
          whiteSpace: "normal",
          overflowWrap: "break-word",
          wordBreak: "break-word",
        }}
      />
      <Box sx={{ display: "flex", gap: 1 }}>
        <Chip
          label={
            question.questionType === "multiple_choice"
              ? "Trắc nghiệm"
              : "Tự luận"
          }
          size="small"
          color={
            question.questionType === "multiple_choice"
              ? "primary"
              : "secondary"
          }
        />
        <Chip
          label={question.difficulty || "N/A"}
          size="small"
          color={
            question.difficulty === "Alpha"
              ? "info"
              : question.difficulty === "Beta"
              ? "warning"
              : question.difficulty === "Gold"
              ? "success"
              : "default"
          }
        />
      </Box>
    </Box>
  );
};

// Thêm component mới để hiển thị vùng thả
const DropZone: React.FC<{
  children: React.ReactNode;
  isDraggingOver?: boolean;
  isEmpty?: boolean;
  id: string;
}> = ({ children, isDraggingOver = false, isEmpty = false, id }) => {
  return (
    <Box
      id={id}
      sx={{
        height: "100%",
        minHeight: 200,
        border: "2px dashed",
        borderColor: isDraggingOver ? "primary.main" : "divider",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        width: "100%",
        p: 2,
        bgcolor: isDraggingOver
          ? "primary.lighter"
          : isEmpty
          ? "background.default"
          : "background.paper",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "primary.main",
          bgcolor: isEmpty ? "primary.lighter" : "background.paper",
        },
        position: "relative",
      }}
    >
      {isDraggingOver && isEmpty && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <Typography
            variant="h6"
            color="primary.main"
            sx={{ fontWeight: 600 }}
          >
            Thả vào đây
          </Typography>
        </Box>
      )}
      {children}
    </Box>
  );
};

export const QuestionDetailDialog: React.FC<QuestionDetailDialogProps> = ({
  open,
  onClose,
  editingQuestion,
  totalQuestions,
  questionPackageId,
  onSuccess,
}) => {
  // console.debug('🔄 [QuestionDetailDialog] Component rendered:', {
  //   open,
  //   editingQuestion: !!editingQuestion,
  //   totalQuestions,
  //   questionPackageId
  // });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isFullScreen, setIsFullScreen] = useState(isMobile);
  const { showToast } = useToast();
  const [questions, setQuestions] = useState<AvailableQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectedQuestions, setSelectedQuestions] = useState<
    AvailableQuestion[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    difficulty: "",
    questionType: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Cấu hình sensors cho DnD
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // Thêm state cho tìm kiếm câu hỏi đã chọn
  const [selectedQuestionSearchTerm, setSelectedQuestionSearchTerm] =
    useState("");

  // ✅ Fix: Sử dụng batch update để giảm re-renders
  const batchUpdate = useBatchUpdate();

  const fetchQuestions = useCallback(async () => {
    // console.log('📥 [DEBUG] Bắt đầu fetchQuestions');
    setLoading(true);
    try {
      const response = await questionDetailService.getAvailableQuestions(
        questionPackageId,
        {
          page,
          limit: pageSize,
          isActive: true,
          difficulty: filters.difficulty || undefined,
          questionType: filters.questionType || undefined,
          search: searchTerm || undefined,
        }
      );

      // console.log('✅ [DEBUG] fetchQuestions thành công:', {
      //   totalQuestions: response.data?.questions?.length,
      //   totalPages: response.pagination?.totalPages
      // });

      if (response.data?.questions) {
        setQuestions(response.data.questions);
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages || 0);
        }
      }
    } catch (error) {
      console.error("❌ [DEBUG] fetchQuestions thất bại:", error);
      showToast("Không thể lấy danh sách câu hỏi", "error");
    } finally {
      setLoading(false);
    }
  }, [questionPackageId, page, pageSize, filters, searchTerm, showToast]);

  // Fetch question details khi mở dialog
  const fetchQuestionDetails = useCallback(async () => {
    if (!open || !questionPackageId) return;

    // console.log('📥 [DEBUG] Bắt đầu fetchQuestionDetails');
    try {
      const response = await questionDetailService.getQuestionDetailsByPackage(
        questionPackageId,
        {
          limit: 100,
          sortBy: "questionOrder",
          sortOrder: "asc",
        }
      );

      // console.log('✅ [DEBUG] fetchQuestionDetails thành công:', {
      //   totalQuestions: response.data?.questions?.length
      // });

      if (response.data?.questions) {
        const existingQuestions = response.data.questions
          .filter((qd: QuestionDetail) => qd.question)
          .sort(
            (a: QuestionDetail, b: QuestionDetail) =>
              (a.questionOrder || 0) - (b.questionOrder || 0)
          )
          .map(
            (qd: QuestionDetail) =>
              ({
                id: qd.questionId,
                content: qd.question?.content || "",
                questionType: qd.question?.questionType || "",
                difficulty: qd.question?.difficulty || "",
                questionOrder: qd.questionOrder || 0,
                isActive: qd.isActive || true,
                createdAt: qd.createdAt || new Date().toISOString(),
                updatedAt: qd.updatedAt || new Date().toISOString(),
              } as AvailableQuestion)
          );

        setSelectedQuestions(existingQuestions);
        setSelectedIds(
          new Set(existingQuestions.map((q: AvailableQuestion) => q.id))
        );
      }
    } catch (error) {
      console.error("❌ [DEBUG] fetchQuestionDetails thất bại:", error);
      showToast("Không thể lấy danh sách câu hỏi hiện tại", "error");
    }
  }, [open, questionPackageId, showToast]); // ✅ Fix: Include all dependencies

  // Thay thế 2 useEffect cũ bằng 3 useEffect mới
  useEffect(() => {
    if (open && questionPackageId && isInitialLoad) {
      // console.log('🔍 [DEBUG] Dialog mở - Bắt đầu fetch dữ liệu lần đầu');
      fetchQuestionDetails();
      fetchQuestions();
      setIsInitialLoad(false);
    }
  }, [
    open,
    questionPackageId,
    isInitialLoad,
    fetchQuestionDetails,
    fetchQuestions,
  ]); // ✅ Fix: Include missing deps

  // Tách riêng effect cho các thao tác của người dùng
  useEffect(() => {
    if (!open || !questionPackageId || isInitialLoad) {
      return;
    }

    const timeoutId = setTimeout(() => {
      // console.log('🔍 [DEBUG] Trigger fetchQuestions do thay đổi điều kiện:', {
      //   page,
      //   pageSize,
      //   filters,
      //   searchTerm
      // });
      fetchQuestions();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    page,
    pageSize,
    filters,
    searchTerm,
    open,
    questionPackageId,
    isInitialLoad,
    fetchQuestions,
  ]); // ✅ Fix: Include fetchQuestions

  // Reset isInitialLoad khi đóng dialog
  useEffect(() => {
    if (!open) {
      // ✅ Fix: Batch tất cả state updates để giảm re-renders từ 6 xuống 1
      batchUpdate([
        () => setIsInitialLoad(true),
        () => setSelectedIds(new Set()),
        () => setSelectedQuestions([]),
        () => setSearchTerm(""),
        () => setFilters({ difficulty: "", questionType: "" }),
        () => setPage(1),
      ]);
    }
  }, [open, batchUpdate]);

  const handleToggleFullScreen = () => {
    // console.debug('🔄 [QuestionDetailDialog] Toggle fullscreen:', !isFullScreen);
    setIsFullScreen(!isFullScreen);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedQuestions.length === 0) {
      showToast("Vui lòng chọn ít nhất một câu hỏi", "warning");
      return;
    }

    try {
      // console.log('📤 [DEBUG] Bắt đầu sync câu hỏi:', selectedQuestions);

      // Tạo mảng questions với thứ tự từ 1 đến n
      const questionsToSync = selectedQuestions.map((question, index) => ({
        questionId: question.id,
        questionOrder: index + 1,
      }));

      // Gọi API sync với thứ tự mới
      await questionDetailService.syncQuestionDetails(
        questionPackageId,
        questionsToSync
      );
      // console.log('✅ [DEBUG] Sync thành công:', response);

      // Hiển thị thông báo thành công
      showToast("Đã cập nhật thành công thứ tự câu hỏi", "success");

      // Gọi callback để cập nhật danh sách câu hỏi trong gói
      if (onSuccess) {
        // console.log('🔄 [DEBUG] Gọi onSuccess để cập nhật danh sách');
        await onSuccess();
        // console.log('✅ [DEBUG] onSuccess hoàn thành');
      }

      // Đóng dialog
      // console.log('👋 [DEBUG] Đóng dialog');
      onClose();
    } catch (error) {
      console.error("❌ [DEBUG] Lỗi khi sync câu hỏi:", error);
      showToast("Đã xảy ra lỗi khi cập nhật câu hỏi", "error");
    }
  };

  // ✅ Fix: Debounced search handler để giảm API calls
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);
      // Tự động reset page khi search (debounced trong hook)
    },
    []
  );

  // ✅ Fix: Optimized filter change handler
  const handleFilterChange = useCallback((name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    // Tự động reset page khi filter change (debounced trong hook)
  }, []);

  // ✅ Fix: Optimized select handlers để giảm re-renders
  const handleSelectOne = useCallback(
    (id: number, checked: boolean) => {
      setSelectedIds((prev) => {
        const newSelectedIds = new Set(prev);
        if (checked) {
          newSelectedIds.add(id);
        } else {
          newSelectedIds.delete(id);
        }
        return newSelectedIds;
      });

      if (checked) {
        // Thêm câu hỏi vào danh sách khi được chọn
        const questionToAdd = questions.find((q) => q.id === id);
        if (questionToAdd && !selectedQuestions.some((q) => q.id === id)) {
          setSelectedQuestions((prev) =>
            updateQuestionOrders([...prev, questionToAdd])
          );
        }
      } else {
        // Xóa khỏi selectedQuestions khi bỏ chọn
        setSelectedQuestions((prev) =>
          updateQuestionOrders(prev.filter((q) => q.id !== id))
        );
      }
    },
    [questions, selectedQuestions]
  );

  // ✅ Fix: Optimized select all handler
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        batchUpdate([
          () => setSelectedIds(new Set(questions.map((q) => q.id))),
          () => {
            // Thêm tất cả câu hỏi chưa có vào danh sách
            const questionsToAdd = questions.filter(
              (question) =>
                !selectedQuestions.some((sq) => sq.id === question.id)
            );
            if (questionsToAdd.length > 0) {
              setSelectedQuestions((prev) =>
                updateQuestionOrders([...prev, ...questionsToAdd])
              );
            }
          },
        ]);
      } else {
        batchUpdate([
          () => setSelectedIds(new Set()),
          () =>
            setSelectedQuestions((prev) =>
              updateQuestionOrders(
                prev.filter(
                  (q) => !questions.some((question) => question.id === q.id)
                )
              )
            ),
        ]);
      }
    },
    [questions, selectedQuestions, batchUpdate]
  );

  // ✅ Fix: Optimized remove handler
  const handleRemoveSelected = useCallback(
    (id: number) => {
      // console.log('🗑️ [DEBUG] Bắt đầu xóa câu hỏi:', id);

      // ✅ Fix: Batch cả 2 state updates để giảm re-renders
      batchUpdate([
        () =>
          setSelectedIds((prev) => {
            const newIds = new Set(prev);
            newIds.delete(id);
            return newIds;
          }),
        () =>
          setSelectedQuestions((prev) => {
            const newQuestions = prev.filter((q) => q.id !== id);
            return updateQuestionOrders(newQuestions);
          }),
      ]);
    },
    [batchUpdate]
  );

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      fetchQuestions();
    }
  };

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    if (value !== page) {
      setPage(value);
    }
  };

  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

  // Thêm state để theo dõi vị trí tạm thời khi kéo thả
  const [tempOrder, setTempOrder] = useState<number | null>(null);
  const [tempIndex, setTempIndex] = useState<number | null>(null);
  // Thêm state để theo dõi vị trí đang hover khi kéo
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [dropTarget, setDropTarget] = useState<"list" | "selected" | null>(
    null
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id.toString());
    setTempOrder(null);
    setTempIndex(null);
    setIsDraggingOver(false);
    setDropTarget(null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) {
      setOverId(null);
      setTempOrder(null);
      setTempIndex(null);
      setIsDraggingOver(false);
      setDropTarget(null);
      return;
    }

    setOverId(over.id.toString());

    // Xác định dropTarget
    if (over.id.toString() === "selected-dropzone") {
      setDropTarget("selected");
      setIsDraggingOver(true);
    } else if (over.id.toString().startsWith("selected-")) {
      setDropTarget("selected");
    } else {
      setDropTarget("list");
    }

    // Tính toán số thứ tự tạm thời khi kéo
    if (active.id.toString().includes("question-")) {
      // Nếu kéo từ danh sách câu hỏi vào dropzone
      if (over.id.toString() === "selected-dropzone") {
        setTempIndex(selectedQuestions.length);
        setTempOrder(selectedQuestions.length + 1);
        return;
      }

      // Nếu kéo từ danh sách câu hỏi vào một câu hỏi đã chọn
      const overQuestionId = over.id.toString().replace("selected-", "");
      const overIndex = selectedQuestions.findIndex(
        (q) => q.id.toString() === overQuestionId
      );

      if (overIndex !== -1) {
        setTempIndex(overIndex);
        setTempOrder(overIndex + 1);
      } else {
        // Nếu kéo vào cuối danh sách
        setTempIndex(selectedQuestions.length);
        setTempOrder(selectedQuestions.length + 1);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setTempOrder(null);
      setTempIndex(null);
      setIsDraggingOver(false);
      setDropTarget(null);
      setActiveId(null);
      setOverId(null);
      return;
    }

    // Nếu kéo từ danh sách câu hỏi sang danh sách đã chọn
    if (active.id.toString().includes("question-")) {
      const questionId = Number(active.id.toString().replace("question-", ""));
      const question = questions.find((q) => q.id === questionId);

      if (question) {
        const newSelectedIds = new Set(selectedIds);
        newSelectedIds.add(questionId);
        setSelectedIds(newSelectedIds);

        // Nếu thả vào dropzone hoặc một câu hỏi đã chọn
        if (over.id.toString() === "selected-dropzone") {
          // Thêm vào cuối danh sách
          setSelectedQuestions((prev) =>
            updateQuestionOrders([...prev, question])
          );
        } else if (over.id.toString().startsWith("selected-")) {
          // Thêm vào vị trí cụ thể
          const overQuestionId = over.id.toString().replace("selected-", "");
          const overIndex = selectedQuestions.findIndex(
            (q) => q.id.toString() === overQuestionId
          );

          if (overIndex !== -1) {
            const newQuestions = [...selectedQuestions];
            newQuestions.splice(overIndex, 0, question);
            setSelectedQuestions(updateQuestionOrders(newQuestions));
          } else {
            setSelectedQuestions((prev) =>
              updateQuestionOrders([...prev, question])
            );
          }
        }
      }
    }
    // Nếu kéo giữa các câu hỏi đã chọn
    else if (
      active.id.toString().startsWith("selected-") &&
      over.id.toString().startsWith("selected-") &&
      active.id !== over.id
    ) {
      setSelectedQuestions((items) => {
        const oldIndex = items.findIndex(
          (item) => `selected-${item.id}` === active.id
        );
        const newIndex = items.findIndex(
          (item) => `selected-${item.id}` === over.id
        );

        if (oldIndex !== -1 && newIndex !== -1) {
          const newItems = arrayMove(items, oldIndex, newIndex);
          return updateQuestionOrders(newItems);
        }
        return items;
      });
    }
    // Nếu kéo từ câu hỏi đã chọn vào dropzone
    else if (
      active.id.toString().startsWith("selected-") &&
      over.id.toString() === "selected-dropzone"
    ) {
      // Không cần làm gì vì đã ở trong danh sách rồi
    }

    // Reset các state tạm thời
    setTempOrder(null);
    setTempIndex(null);
    setActiveId(null);
    setOverId(null);
    setIsDraggingOver(false);
    setDropTarget(null);
  };

  // Lọc danh sách câu hỏi đã chọn dựa trên từ khóa tìm kiếm
  const filteredSelectedQuestions = selectedQuestions.filter((question) => {
    const searchTerm = selectedQuestionSearchTerm.toLowerCase().trim();
    if (!searchTerm) return true;

    const content = question.content?.toLowerCase() || "";
    const type = question.questionType?.toLowerCase() || "";
    const difficulty = question.difficulty?.toLowerCase() || "";

    return (
      content.includes(searchTerm) ||
      type.includes(searchTerm) ||
      difficulty.includes(searchTerm)
    );
  });

  // Thêm hàm xử lý tìm kiếm câu hỏi đã chọn
  const handleSelectedQuestionSearch = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedQuestionSearchTerm(e.target.value);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      fullScreen={isFullScreen}
      disableEnforceFocus={false}
      disableAutoFocus={false}
      disableRestoreFocus={false}
      keepMounted={false}
      aria-labelledby="question-dialog-title"
      aria-describedby="question-dialog-description"
      PaperProps={{
        sx: {
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          boxShadow: theme.shadows[24],
        },
      }}
    >
      <form onSubmit={handleSubmit} noValidate>
        <Box
          id="question-dialog-description"
          sx={{
            position: "absolute",
            left: -10000,
            width: 1,
            height: 1,
            overflow: "hidden",
          }}
        >
          {editingQuestion
            ? "Chỉnh sửa câu hỏi trong gói"
            : "Thêm câu hỏi mới vào gói câu hỏi"}
        </Box>
        <DialogTitle
          id="question-dialog-title"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pr: 1,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            py: 2,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {editingQuestion ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}
            </Typography>
            {!editingQuestion && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Tổng số câu hỏi trong gói: {totalQuestions}
              </Typography>
            )}
          </Box>
          <Box>
            <IconButton
              onClick={handleToggleFullScreen}
              size="small"
              sx={{ mr: 1 }}
            >
              {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                color: (theme) => theme.palette.grey[500],
                "&:hover": {
                  color: (theme) => theme.palette.grey[700],
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            p: 0,
            display: "flex",
            flexDirection: "column",
            flex: 1,
            overflow: "auto",
            bgcolor: "background.default",
          }}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            autoScroll={{ threshold: { x: 0, y: 0.2 } }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
                gap: 2,
                p: 2,
              }}
            >
              {/* Cột trái - Danh sách câu hỏi */}
              <Box>
                <Box sx={{ mb: 3 }}>
                  {editingQuestion && editingQuestion.question && (
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        mb: 3,
                        borderRadius: 2,
                        bgcolor: "background.paper",
                      }}
                    >
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 600 }}
                      >
                        Câu hỏi hiện tại
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Nội dung:
                        </Typography>
                        <Box
                          dangerouslySetInnerHTML={{
                            __html: editingQuestion.question.content || "",
                          }}
                          sx={{
                            mt: 1,
                            p: 1.5,
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 1,
                            bgcolor: "background.default",
                            "& img": { maxWidth: "100%" },
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, 1fr)",
                          gap: 2,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Loại câu hỏi:
                          </Typography>
                          <Typography>
                            {editingQuestion.question.questionType ===
                            "multiple_choice"
                              ? "Trắc nghiệm"
                              : "Tự luận"}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Độ khó:
                          </Typography>
                          <Chip
                            label={editingQuestion.question.difficulty || "N/A"}
                            size="small"
                            color={
                              editingQuestion.question.difficulty === "Alpha"
                                ? "info"
                                : editingQuestion.question.difficulty === "Beta"
                                ? "warning"
                                : editingQuestion.question.difficulty === "Gold"
                                ? "success"
                                : "default"
                            }
                          />
                        </Box>
                      </Box>
                    </Paper>
                  )}

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <TextField
                      placeholder="Tìm kiếm câu hỏi..."
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={searchTerm}
                      onChange={handleSearchChange}
                      onKeyPress={handleKeyPress}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={fetchQuestions} edge="end">
                              <SearchIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <IconButton
                      onClick={toggleFilters}
                      sx={{
                        ml: 1,
                        bgcolor: showFilters ? "primary.main" : "transparent",
                        color: showFilters ? "primary.contrastText" : "inherit",
                        "&:hover": {
                          bgcolor: showFilters
                            ? "primary.dark"
                            : "action.hover",
                        },
                      }}
                    >
                      <FilterListIcon />
                    </IconButton>
                  </Box>

                  {showFilters && (
                    <Paper
                      sx={{
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "background.paper",
                      }}
                    >
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
                        <Box>
                          <FormControl fullWidth size="small">
                            <InputLabel>Độ khó</InputLabel>
                            <Select
                              value={filters.difficulty}
                              onChange={(e) =>
                                handleFilterChange("difficulty", e.target.value)
                              }
                              label="Độ khó"
                            >
                              <MenuItem value="">Tất cả</MenuItem>
                              <MenuItem value="Alpha">Alpha</MenuItem>
                              <MenuItem value="Beta">Beta</MenuItem>
                              <MenuItem value="Gold">Gold</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                        <Box>
                          <FormControl fullWidth size="small">
                            <InputLabel>Loại câu hỏi</InputLabel>
                            <Select
                              value={filters.questionType}
                              onChange={(e) =>
                                handleFilterChange(
                                  "questionType",
                                  e.target.value
                                )
                              }
                              label="Loại câu hỏi"
                            >
                              <MenuItem value="">Tất cả</MenuItem>
                              <MenuItem value="multiple_choice">
                                Trắc nghiệm
                              </MenuItem>
                              <MenuItem value="essay">Tự luận</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                      </Box>
                    </Paper>
                  )}

                  {loading ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", p: 3 }}
                    >
                      <CircularProgress size={24} />
                    </Box>
                  ) : (
                    <>
                      <Paper
                        sx={{
                          borderRadius: 2,
                          bgcolor: "background.paper",
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            p: 2,
                            bgcolor: "background.default",
                            borderTopLeftRadius: 2,
                            borderTopRightRadius: 2,
                          }}
                        >
                          Kéo câu hỏi để thêm vào danh sách đã chọn, hoặc dùng
                          checkbox để chọn
                        </Typography>
                        <TableContainer
                          sx={{
                            maxHeight: "calc(100vh - 400px)",
                          }}
                        >
                          <Table stickyHeader size="small">
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
                                    onChange={(e) =>
                                      handleSelectAll(e.target.checked)
                                    }
                                  />
                                </TableCell>
                                <TableCell>STT</TableCell>
                                <TableCell>Nội dung</TableCell>
                                <TableCell>Loại câu hỏi</TableCell>
                                <TableCell>Độ khó</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {questions.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={5} align="center">
                                    Không tìm thấy câu hỏi nào
                                  </TableCell>
                                </TableRow>
                              ) : (
                                questions.map((question, index) => (
                                  <DraggableQuestionItem
                                    key={`question-${question.id}`}
                                    question={question}
                                    index={(page - 1) * pageSize + index + 1}
                                    isSelected={selectedIds.has(question.id)}
                                    onSelect={handleSelectOne}
                                  />
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Paper>

                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          bgcolor: "background.paper",
                          p: 2,
                          borderRadius: 2,
                        }}
                      >
                        <FormControl
                          variant="outlined"
                          size="small"
                          sx={{ minWidth: 100 }}
                        >
                          <InputLabel id="page-size-select-label">
                            Hiển thị
                          </InputLabel>
                          <Select
                            labelId="page-size-select-label"
                            value={pageSize}
                            onChange={handlePageSizeChange}
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
                        <Box
                          sx={{
                            mt: 2,
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            showFirstButton
                            showLastButton
                            color="primary"
                            size={isMobile ? "small" : "medium"}
                            sx={{
                              "& .MuiPaginationItem-root": {
                                borderRadius: 1,
                              },
                            }}
                          />
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              </Box>

              {/* Cột phải - Danh sách câu hỏi đã chọn */}
              <Box>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      Câu hỏi đã chọn ({selectedQuestions.length})
                    </Typography>
                    {selectedQuestions.length > 0 && (
                      <TextField
                        placeholder="Tìm kiếm trong danh sách đã chọn..."
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={selectedQuestionSearchTerm}
                        onChange={handleSelectedQuestionSearch}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon fontSize="small" />
                            </InputAdornment>
                          ),
                          endAdornment: selectedQuestionSearchTerm && (
                            <InputAdornment position="end">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  setSelectedQuestionSearchTerm("")
                                }
                                edge="end"
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 2 }}
                      />
                    )}
                  </Box>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "background.paper",
                    }}
                  >
                    {selectedQuestions.length === 0 ? (
                      <DropZone
                        isEmpty={true}
                        isDraggingOver={
                          isDraggingOver && dropTarget === "selected"
                        }
                        id="selected-dropzone"
                      >
                        <Typography color="text.secondary" align="center">
                          Kéo câu hỏi vào đây hoặc dùng checkbox để chọn
                        </Typography>
                      </DropZone>
                    ) : (
                      <Box
                        sx={{
                          maxHeight: "calc(100vh - 400px)",
                          overflow: "auto",
                          width: "100%",
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ mb: 2 }}>
                          Kéo để sắp xếp lại thứ tự câu hỏi
                        </Typography>
                        <DropZone
                          isEmpty={false}
                          isDraggingOver={
                            isDraggingOver && dropTarget === "selected"
                          }
                          id="selected-dropzone"
                        >
                          <SortableContext
                            items={filteredSelectedQuestions.map(
                              (q) => `selected-${q.id}`
                            )}
                            strategy={verticalListSortingStrategy}
                          >
                            {filteredSelectedQuestions.map((question) => (
                              <SortableQuestionItem
                                key={`selected-${question.id}`}
                                id={`selected-${question.id}`}
                                question={question}
                                index={
                                  question.questionOrder ||
                                  selectedQuestions.indexOf(question) + 1
                                }
                                onRemove={handleRemoveSelected}
                                tempIndex={tempIndex}
                                tempOrder={tempOrder}
                                activeId={activeId}
                                overId={overId}
                              />
                            ))}
                          </SortableContext>
                          {selectedQuestionSearchTerm &&
                            filteredSelectedQuestions.length === 0 && (
                              <Typography
                                color="text.secondary"
                                align="center"
                                sx={{ py: 4 }}
                              >
                                Không tìm thấy câu hỏi nào phù hợp
                              </Typography>
                            )}
                        </DropZone>
                      </Box>
                    )}
                  </Paper>
                </Box>
              </Box>
            </Box>
          </DndContext>
        </DialogContent>

        <DialogActions
          sx={{
            borderTop: "1px solid",
            borderColor: "divider",
            p: 2,
            bgcolor: "background.paper",
          }}
        >
          <Button
            onClick={onClose}
            color="inherit"
            sx={{
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={selectedIds.size === 0 && !editingQuestion}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              px: 3,
            }}
          >
            Lưu
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
