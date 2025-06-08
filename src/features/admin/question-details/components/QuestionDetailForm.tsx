import React, { useEffect, useMemo } from 'react';
import { useForm, Controller, type SubmitHandler, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Alert,
  MenuItem
} from '@mui/material';
import type { QuestionDetail, QuestionDetailFormData, Question } from '../types/questionDetail';
import { questionDetailCreateSchema, questionDetailUpdateSchema } from '../schemas/questionDetail.schema';

interface ValidationError {
  field: string;
  message: string;
}

interface QuestionDetailFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: QuestionDetailFormData) => void;
  questionDetail?: QuestionDetail;
  packageId?: number;
  loading?: boolean;
  errors?: ValidationError[];
  questions?: Question[];
  mode: 'create' | 'edit';
}

const QuestionDetailForm: React.FC<QuestionDetailFormProps> = ({
  open,
  onClose,
  onSubmit,
  questionDetail,
  packageId,
  loading = false,
  errors = [],
  questions = [],
  mode = 'create'
}) => {
  const defaultValues = useMemo(() => ({
    questionId: questionDetail?.questionId || 0,
    questionPackageId: packageId || questionDetail?.questionPackageId || 0,
    questionOrder: questionDetail?.questionOrder || 0,
    isActive: questionDetail?.isActive ?? true
  }), [questionDetail, packageId]);

  const resolver: Resolver<QuestionDetailFormData> = zodResolver(
    mode === 'create' ? questionDetailCreateSchema : questionDetailUpdateSchema
  );

  const { control, handleSubmit, reset } = useForm<QuestionDetailFormData>({
    resolver,
    defaultValues
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, reset, defaultValues]);

  const onFormSubmit: SubmitHandler<QuestionDetailFormData> = (data) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'create' ? 'Thêm câu hỏi vào gói' : 'Chỉnh sửa câu hỏi trong gói'}
      </DialogTitle>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogContent>
          {errors.length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.map((error, index) => (
                <div key={index}>{error.message}</div>
              ))}
            </Alert>
          )}

          {mode === 'create' && (
            <Controller
              name="questionId"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  select
                  label="Chọn câu hỏi"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                >
                  {questions.map((question) => (
                    <MenuItem key={question.id} value={question.id}>
                      {question.title}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          )}

          <Controller
            name="questionOrder"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                type="number"
                label="Thứ tự câu hỏi"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
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
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Đang xử lý...' : mode === 'create' ? 'Thêm' : 'Cập nhật'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default QuestionDetailForm; 