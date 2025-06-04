import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Stack,
  Alert,
  AlertTitle,
  Typography,
  Divider,
  Snackbar
} from '@mui/material';
import type { About, AboutData } from '../types/about';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';
import { aboutSchema } from '../validations/aboutValidation';
import type { ZodIssue } from 'zod';

interface AboutFormProps {
  initialData: About;
  onSubmit: (data: Partial<AboutData>) => Promise<void>;
  isSubmitting: boolean;
}

type FormErrors = Partial<Record<keyof AboutData, string>>;

/**
 * Component form chỉnh sửa thông tin giới thiệu
 */
const AboutForm: React.FC<AboutFormProps> = ({ initialData, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<Partial<AboutData>>(initialData.data);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);
  
  useEffect(() => {
    setFormData(initialData.data);
  }, [initialData]);
  
  const validate = (): boolean => {
    const result = aboutSchema.safeParse(formData);
    
    if (!result.success) {
      const formattedErrors: FormErrors = {};
      result.error.errors.forEach((error: ZodIssue) => {
        const path = error.path[0];
        formattedErrors[path as keyof AboutData] = error.message;
      });
      setErrors(formattedErrors);
      return false;
    }
    
    setErrors({});
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when field is edited
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      await onSubmit(formData);
      setShowSuccess(true);
    } catch (error) {
      console.error('Failed to submit form:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={3}>
        <Typography variant="h6">Thông tin cơ bản</Typography>
        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth
            label="Tên đơn vị"
            name="schoolName"
            value={formData.schoolName || ''}
            onChange={handleChange}
            error={!!errors.schoolName}
            helperText={errors.schoolName}
            required
          />
          <TextField
            fullWidth
            label="Tên phòng ban"
            name="departmentName"
            value={formData.departmentName || ''}
            onChange={handleChange}
            error={!!errors.departmentName}
            helperText={errors.departmentName}
            required
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            fullWidth
            label="Website"
            name="website"
            value={formData.website || ''}
            onChange={handleChange}
            error={!!errors.website}
            helperText={errors.website}
          />
        </Stack>

        <TextField
          fullWidth
          label="Fanpage"
          name="fanpage"
          value={formData.fanpage || ''}
          onChange={handleChange}
          error={!!errors.fanpage}
          helperText={errors.fanpage}
        />

        <Divider />

        <Typography variant="h6">Bản đồ</Typography>
        <TextField
          fullWidth
          label="Mã nhúng Google Maps"
          name="mapEmbedCode"
          value={formData.mapEmbedCode || ''}
          onChange={handleChange}
          multiline
          rows={4}
          placeholder="<iframe src='https://www.google.com/maps/embed?...'></iframe>"
        />

        {formData.mapEmbedCode && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>Xem trước:</Typography>
            <Box sx={{ border: '1px solid #ddd', p: 1, borderRadius: 1, minHeight: 300 }}>
              <div dangerouslySetInnerHTML={{ __html: formData.mapEmbedCode || '' }} />
            </Box>
          </Box>
        )}

        <Divider />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive || false}
                onChange={handleChange}
                name="isActive"
                color="primary"
              />
            }
            label="Hiển thị trên trang web"
          />
          
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            loadingPosition="start"
            startIcon={<SaveIcon />}
          >
            Lưu thay đổi
          </LoadingButton>
        </Stack>
      </Stack>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success">
          <AlertTitle>Thành công</AlertTitle>
          Cập nhật thông tin thành công!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AboutForm;