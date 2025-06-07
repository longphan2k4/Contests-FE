import React from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Box
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateQuestionTopicSchema, UpdateQuestionTopicSchema } from '../schemas/questionTopic.schema';
import type { QuestionTopic } from '../types/questionTopic';

interface QuestionTopicFormProps {
  questionTopic?: QuestionTopic;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const QuestionTopicForm: React.FC<QuestionTopicFormProps> = ({
  questionTopic,
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(questionTopic ? UpdateQuestionTopicSchema : CreateQuestionTopicSchema),
    defaultValues: {
      name: questionTopic?.name || '',
      isActive: questionTopic?.isActive ?? true
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogTitle>
        {questionTopic ? 'Chỉnh sửa chủ đề' : 'Thêm chủ đề mới'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Tên chủ đề"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message as string}
                sx={{ mb: 2 }}
              />
            )}
          />
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                label="Đang hoạt động"
              />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Hủy</Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Đang xử lý...' : questionTopic ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default QuestionTopicForm; 