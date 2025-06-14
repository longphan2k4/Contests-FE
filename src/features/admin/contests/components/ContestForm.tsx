import React from 'react';
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  Paper,
  Alert,
  FormControlLabel,
  Switch
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { vi } from 'date-fns/locale';
import type { Contest } from '../types';
import { CreateContestSchema, UpdateContestSchema } from '../schemas/contestSchema';
import { ZodError } from 'zod';
import { Fullscreen, FullscreenExit } from '@mui/icons-material';

import { Editor } from '@tinymce/tinymce-react';
interface ValidationError {
  field: string;
  message: string;
}

interface ContestFormProps {
  initialData?: Partial<Contest>;
  onSubmit: (data: Partial<Contest>) => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  validationErrors?: ValidationError[];
}

const ContestForm: React.FC<ContestFormProps> = ({
  initialData = {},
  onSubmit,
  isSubmitting = false,
  submitButtonText = 'Lưu',
  validationErrors = []
}) => {
  const [formData, setFormData] = React.useState<Partial<Contest>>({
    name: '',
    description: '',
    rule: '',
    location: '',
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: false,
    slogan: '',
    ...initialData
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  React.useEffect(() => {
    // Xử lý validation errors từ API
    const errorMap: Record<string, string> = {};
    validationErrors.forEach(error => {
      errorMap[error.field] = error.message;
    });
    setErrors(errorMap);
  }, [validationErrors]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Xóa lỗi khi người dùng thay đổi giá trị
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleDateChange = (name: string, value: Date | null) => {
    if (value) {
      setFormData(prev => ({ ...prev, [name]: value.toISOString() }));
      // Xóa lỗi khi người dùng thay đổi giá trị
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Sử dụng schema phù hợp dựa trên việc có initialData hay không
      const schema = Object.keys(initialData).length > 0 ? UpdateContestSchema : CreateContestSchema;
      
      // Validate dữ liệu
      const validatedData = schema.parse(formData) as Partial<Contest>;
      
      // Nếu validate thành công, gọi onSubmit
      onSubmit(validatedData);
    } catch (error) {
      if (error instanceof ZodError) {
        // Chuyển đổi lỗi Zod thành định dạng lỗi cho form
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      {/* Hiển thị tổng quan lỗi validation nếu có */}
      {validationErrors.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Vui lòng kiểm tra lại thông tin đã nhập
        </Alert>
      )}

      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 3,
          maxWidth: isFullscreen ? '100vw' : '1000px',
          width: isFullscreen ? '100vw' : '100%',
          height: isFullscreen ? '100vh' : 'auto',
          position: isFullscreen ? 'fixed' : 'relative',
          top: isFullscreen ? 0 : 'auto',
          left: isFullscreen ? 0 : 'auto',
          zIndex: isFullscreen ? 1300 : 'auto',
          overflow: isFullscreen ? 'auto' : 'unset',
          margin: isFullscreen ? 0 : '0 auto',
          borderRadius: isFullscreen ? 0 : 2,
          background: 'white',
          transition: 'all 0.3s',
        }}
      >
        {/* Nút phóng to/thu nhỏ */}
        <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1400 }}>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => setIsFullscreen((prev) => !prev)}
            sx={{ minWidth: 36, minHeight: 36, borderRadius: '50%' }}
          >
            {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
          </Button>
        </Box>

        <Stack spacing={3}>
          {/* Thông tin cơ bản */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Thông tin cơ bản
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                required
                label="Tên cuộc thi"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                disabled={isSubmitting}
                margin="normal"
              />
              <TextField
                fullWidth
                required
                label="Luật thi"
                name="rule"
                value={formData.rule || ''}
                onChange={handleChange}
                error={!!errors.rule}
                helperText={errors.rule}
                disabled={isSubmitting}
                margin="normal"
                multiline
                rows={4}
              />
            <Box sx={{ mt: 2 }}>
                <Editor
                  apiKey="27tx6fph0lki6eefz8gfsu5jz74x6clpth0dnq0k02a9wz4b"
                  value={formData.rule || ''}
                  init={{
                    height: 400,
                    menubar: true,
                    plugins: [
                      'advlist autolink lists link image charmap preview anchor',
                      'searchreplace visualblocks code fullscreen',
                      'insertdatetime media table paste code help wordcount emoticons',
                    ],
                    toolbar: [
                      'undo redo | formatselect |',
                      'bold italic underline strikethrough | forecolor backcolor |',
                      'alignleft aligncenter alignright alignjustify |',
                      'bullist numlist |',
                      'outdent indent |',
                      'blockquote subscript superscript |',
                      'link image media table |',
                      'removeformat | emoticons |',
                      'code preview help'
                    ].join(' '),
                    auto_list: true,
                    advlist_bullet_styles: 'default',
                    advlist_number_styles: 'default',
                    content_style:
                      'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                  }}
                  disabled={isSubmitting}
                  onEditorChange={(content) => {
                    handleChange({ target: { name: 'rule', value: content } } as any);
                  }}
                />

              </Box>

              <TextField
                fullWidth
                required
                label="Địa điểm"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                error={!!errors.location}
                helperText={errors.location}
                disabled={isSubmitting}
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="Slogan"
                name="slogan"
                value={formData.slogan || ''}
                onChange={handleChange}
                error={!!errors.slogan}
                helperText={errors.slogan}
                disabled={isSubmitting}
                margin="normal"
              />
            </Box>
          </Box>

          {/* Thông tin thời gian */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Thông tin thời gian
            </Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <DateTimePicker
                label="Thời gian bắt đầu"
                value={formData.startTime ? new Date(formData.startTime) : null}
                onChange={(newValue) => handleDateChange('startTime', newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: 'normal',
                    error: !!errors.startTime,
                    helperText: errors.startTime
                  }
                }}
                disabled={isSubmitting}
              />
              
              <DateTimePicker
                label="Thời gian kết thúc"
                value={formData.endTime ? new Date(formData.endTime) : null}
                onChange={(newValue) => handleDateChange('endTime', newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: 'normal',
                    error: !!errors.endTime,
                    helperText: errors.endTime
                  }
                }}
                disabled={isSubmitting}
              />
            </Stack>
          </Box>

          {/* Trạng thái */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Trạng thái
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive || false}
                  onChange={handleSwitchChange}
                  name="isActive"
                  disabled={isSubmitting}
                />
              }
              label="Kích hoạt cuộc thi"
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              {submitButtonText}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </LocalizationProvider>
  );
};

export default ContestForm; 