import React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import DialogActions from '@mui/material/DialogActions';
import {
  TextField,
  FormControlLabel,
  Switch,
  Button
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateQuestionTopicSchema, UpdateQuestionTopicSchema } from '../schemas/questionTopic.schema';
import type { QuestionTopic } from '../types/questionTopic';
import { z } from 'zod';

type CreateQuestionTopicFormData = z.infer<typeof CreateQuestionTopicSchema>;
type UpdateQuestionTopicFormData = z.infer<typeof UpdateQuestionTopicSchema>;

interface BaseQuestionTopicFormProps {
  questionTopic?: QuestionTopic;
  onCancel: () => void;
  isSubmitting?: boolean;
}

interface CreateQuestionTopicFormProps extends BaseQuestionTopicFormProps {
  mode: 'create';
  onSubmit: (data: CreateQuestionTopicFormData) => Promise<void>;
}

interface UpdateQuestionTopicFormProps extends BaseQuestionTopicFormProps {
  mode: 'edit';
  questionTopic: QuestionTopic;
  onSubmit: (data: UpdateQuestionTopicFormData) => Promise<void>;
}

type QuestionTopicFormProps = CreateQuestionTopicFormProps | UpdateQuestionTopicFormProps;

const QuestionTopicForm: React.FC<QuestionTopicFormProps> = (props) => {
  const {
    questionTopic,
    onSubmit,
    onCancel,
    isSubmitting = false,
    mode
  } = props;

  const form = useForm({
    resolver: zodResolver(mode === 'edit' ? UpdateQuestionTopicSchema : CreateQuestionTopicSchema),
    defaultValues: {
      name: questionTopic?.name || '',
      isActive: questionTopic?.isActive ?? true
    }
  });

  const handleSubmit = async (data: CreateQuestionTopicFormData | UpdateQuestionTopicFormData) => {
    if (mode === 'create') {
      await (onSubmit as (data: CreateQuestionTopicFormData) => Promise<void>)(data as CreateQuestionTopicFormData);
    } else {
      await (onSubmit as (data: UpdateQuestionTopicFormData) => Promise<void>)(data as UpdateQuestionTopicFormData);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <DialogTitle sx={{ m: 0, p: 2, bgcolor: 'secondary.main', color: 'white' }}>
        <Typography component="span" variant="h6">
          {mode === 'edit' ? 'Chỉnh sửa chủ đề' : 'Thêm chủ đề mới'}
        </Typography>
        {!isSubmitting && (
          <IconButton
            aria-label="close"
            onClick={onCancel}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white'
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Controller
            name="name"
            control={form.control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Tên chủ đề"
                fullWidth
                error={!!form.formState.errors.name}
                helperText={form.formState.errors.name?.message as string}
                sx={{ mb: 2 }}
              />
            )}
          />
          <Controller
            name="isActive"
            control={form.control}
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
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          {mode === 'edit' ? 'Cập nhật' : 'Thêm'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default QuestionTopicForm; 