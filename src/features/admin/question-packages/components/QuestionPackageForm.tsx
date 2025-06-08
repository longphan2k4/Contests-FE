import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  FormControlLabel,
  Switch,
  DialogActions,
  DialogContent
} from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { QuestionPackageFormData } from '../types/questionPackage';

const questionPackageSchema = z.object({
  name: z.string().min(3, 'Tên gói câu hỏi phải có ít nhất 3 ký tự'),
  isActive: z.boolean().optional()
});

type QuestionPackageFormProps = {
  initialData?: {
    name: string;
    isActive: boolean;
  };
  onSubmit: (data: QuestionPackageFormData) => void;
  onCancel: () => void;
};

export const QuestionPackageForm = ({
  initialData,
  onSubmit,
  onCancel
}: QuestionPackageFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<QuestionPackageFormData>({
    resolver: zodResolver(questionPackageSchema),
    defaultValues: {
      name: '',
      isActive: true
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        isActive: initialData.isActive
      });
    }
  }, [initialData, reset]);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          {initialData ? 'Chỉnh sửa gói câu hỏi' : 'Thêm gói câu hỏi mới'}
        </Typography>

        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Tên gói câu hỏi"
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register('name')}
          />

          <FormControlLabel
            control={
              <Switch
                defaultChecked
                {...register('isActive')}
              />
            }
            label="Đang hoạt động"
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel}>Hủy</Button>
        <Button type="submit" variant="contained">
          {initialData ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default QuestionPackageForm; 