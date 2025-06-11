import { useState, useEffect } from 'react';
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
  ListItem,
  ListItemText,
  Chip,
  CircularProgress
} from '@mui/material';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { QuestionDetail } from '../types';
import { questionDetailService } from '../services';
import { useNotification } from '../../../../contexts/NotificationContext';

interface ReorderQuestionsDialogProps {
  open: boolean;
  onClose: () => void;
  packageId: number;
  refreshQuestions: () => Promise<void>;
}

interface SortableItemProps {
  id: string;
  question: QuestionDetail;
}

const SortableItem = ({ id, question }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      sx={{
        bgcolor: 'background.paper',
        '&:hover': { bgcolor: 'action.hover' },
        mb: 1,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        cursor: 'grab'
      }}
    >
      <Box 
        {...attributes} 
        {...listeners}
        sx={{ 
          mr: 2, 
          color: 'text.secondary', 
          display: 'flex',
          alignItems: 'center',
          cursor: 'grab'
        }}
      >
        <DragHandleIcon />
        <Box sx={{ ml: 1, fontWeight: 'bold', width: 30 }}>
          {question.questionOrder}
        </Box>
      </Box>
      <ListItemText
        primary={question.question?.plainText || question.question?.title || 'Không có tiêu đề'}
        secondary={
          <Box sx={{ display: 'flex', gap: 1, mt: 0.5, alignItems: 'center' }}>
            <Chip
              size="small"
              label={
                question.question?.questionType === 'multiple_choice' 
                  ? 'Trắc nghiệm' 
                  : 'Tự luận'
              }
              color={
                question.question?.questionType === 'multiple_choice' 
                  ? 'primary' 
                  : 'secondary'
              }
            />
            <Chip
              size="small"
              label={question.question?.difficulty}
              color={
                question.question?.difficulty === 'Alpha' ? 'info' :
                question.question?.difficulty === 'Beta' ? 'warning' :
                question.question?.difficulty === 'Gold' ? 'success' : 'default'
              }
            />
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: question.isActive ? 'success.main' : 'error.main',
                ml: 1
              }}
            >
              {question.isActive ? 'Đang hoạt động' : 'Vô hiệu hóa'}
            </Typography>
          </Box>
        }
      />
    </ListItem>
  );
};

export const ReorderQuestionsDialog: React.FC<ReorderQuestionsDialogProps> = ({
  open,
  onClose,
  packageId,
  refreshQuestions
}) => {
  const [questions, setQuestions] = useState<QuestionDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { showSuccessNotification, showErrorNotification } = useNotification();

  // Lưu trữ tạm thời mảng câu hỏi
  const [tempQuestions, setTempQuestions] = useState<QuestionDetail[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Tải danh sách câu hỏi khi dialog mở
  useEffect(() => {
    if (open && packageId) {
      fetchQuestions();
    }
  }, [open, packageId]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await questionDetailService.getQuestionDetailsByPackage(packageId, {
        limit: 100,
        sortBy: 'questionOrder',
        sortOrder: 'asc'
      });
      if (response.data.questions) {
        const questionsWithIds = response.data.questions.map((q, index) => ({
          ...q,
          uniqueId: `item-${index}`
        }));
        setQuestions(questionsWithIds);
        setTempQuestions(questionsWithIds); // Lưu trữ tạm thời
        console.log('Danh sách câu hỏi ban đầu:', questionsWithIds);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách câu hỏi:', error);
      showErrorNotification('Không thể tải danh sách câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi kéo thả hoàn tất
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      return;
    }
    
    console.log('Bắt đầu kéo thả:', {
      activeId: active.id,
      overId: over.id,
      currentQuestions: questions
    });
    
    setQuestions((items) => {
      const oldIndex = items.findIndex(item => item.uniqueId === active.id);
      const newIndex = items.findIndex(item => item.uniqueId === over.id);
      
      if (oldIndex === -1 || newIndex === -1) {
        console.error('Không tìm thấy item để di chuyển');
        return items;
      }
      
      const newItems = arrayMove(items, oldIndex, newIndex);
      
      // Cập nhật thứ tự mới và ID
      const updatedItems = newItems.map((item, index) => ({
        ...item,
        questionOrder: index + 1,
        uniqueId: `item-${index}`
      }));

      console.log('Danh sách sau khi kéo thả:', updatedItems);
      setTempQuestions(updatedItems); // Lưu trữ tạm thời mảng mới
      
      return updatedItems;
    });
  };

  // Lưu thứ tự mới
  const handleSave = async () => {
    setSaving(true);
    try {
      console.log('Danh sách trước khi gửi API:', tempQuestions);
      
      const reorders = tempQuestions.map(q => ({
        questionId: q.questionId,
        newOrder: q.questionOrder
      }));
      
      console.log('Dữ liệu gửi lên API:', {
        questionPackageId: packageId,
        reorders
      });
      
      await questionDetailService.reorderQuestionDetails({
        questionPackageId: packageId,
        reorders
      });
      
      showSuccessNotification('Đã cập nhật thứ tự câu hỏi');
      await refreshQuestions();
      onClose();
    } catch (error) {
      console.error('Lỗi khi cập nhật thứ tự câu hỏi:', error);
      showErrorNotification('Không thể cập nhật thứ tự câu hỏi');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Sắp xếp thứ tự câu hỏi</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : questions.length === 0 ? (
          <Typography sx={{ p: 2 }}>Không có câu hỏi để sắp xếp</Typography>
        ) : (
          <Paper variant="outlined" sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ p: 2, bgcolor: 'background.default' }}>
              Kéo và thả để sắp xếp thứ tự câu hỏi
            </Typography>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={questions.map(q => q.uniqueId || '')}
                strategy={verticalListSortingStrategy}
              >
                <List sx={{ width: '100%', maxHeight: '400px', overflow: 'auto', p: 2 }}>
                  {questions.map((question) => (
                    <SortableItem 
                      key={question.uniqueId}
                      id={question.uniqueId || ''}
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
        <Button onClick={onClose}>Hủy</Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={loading || saving || questions.length === 0}
        >
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 