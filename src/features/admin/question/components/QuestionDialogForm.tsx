import React from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
  Box,
  IconButton,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  Autocomplete,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Editor } from '@tinymce/tinymce-react';
import MediaPreview from './MediaPreview';
import ExistingMediaPreview from './ExistingMediaPreview';

interface QuestionTopic {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

interface MediaFilePreview {
  id: string;
  url: string;
  name: string;
  type: string;
  size: number;
}

export interface QuestionFormValues {
  intro: string;
  defaultTime: number;
  questionType: 'multiple_choice' | 'essay';
  content: string;
  options: string[] | null;
  correctAnswer: string;
  score: number;
  difficulty: 'Alpha' | 'Beta' | 'Rc' | 'Gold';
  explanation: string;
  questionTopicId: number;
  isActive: boolean;
  deleteQuestionMedia?: string[];
  deleteMediaAnswer?: string[];
}

export interface QuestionFormErrors {
  [key: string]: string;
}

interface QuestionDialogFormProps {
  formData: QuestionFormValues;
  errors: QuestionFormErrors;
  topics: QuestionTopic[];
  questionMediaFiles: File[];
  mediaAnswerFiles: File[];
  questionMediaPreviews: MediaFilePreview[];
  mediaAnswerPreviews: MediaFilePreview[];
  isReadOnly: boolean;
  onFormChange: (name: string, value: string | number | boolean) => void;
  onContentChange: (content: string) => void;
  onExplanationChange: (explanation: string) => void;
  onOptionChange: (index: number, value: string) => void;
  addOption: () => void;
  removeOption: (index: number) => void;
  onQuestionMediaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMediaAnswerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeQuestionMedia: (index: number) => void;
  removeMediaAnswer: (index: number) => void;
  removeQuestionMediaPreview: (index: number) => void;
  removeMediaAnswerPreview: (index: number) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const QuestionDialogForm: React.FC<QuestionDialogFormProps> = ({
  formData,
  errors,
  topics,
  questionMediaFiles,
  mediaAnswerFiles,
  questionMediaPreviews,
  mediaAnswerPreviews,
  isReadOnly,
  onFormChange,
  onContentChange,
  onExplanationChange,
  onOptionChange,
  addOption,
  removeOption,
  onQuestionMediaChange,
  onMediaAnswerChange,
  removeQuestionMedia,
  removeMediaAnswer,
  removeQuestionMediaPreview,
  removeMediaAnswerPreview,
  handleSubmit,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onFormChange(name, value);
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    onFormChange(name, value);
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    onFormChange(name, checked);
  };

  const renderMediaSection = (
    title: string,
    files: File[],
    existingFiles: MediaFilePreview[],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onRemove: (index: number) => void,
    onRemoveExisting: (index: number) => void
  ) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ mb: 2 }}>
        <input
          type="file"
          multiple
          onChange={onChange}
          style={{ display: 'none' }}
          id={`${title.toLowerCase().replace(/\s+/g, '-')}-input`}
          accept="image/*,video/*,audio/*"
        />
        <label htmlFor={`${title.toLowerCase().replace(/\s+/g, '-')}-input`}>
          <Button
            variant="outlined"
            component="span"
            startIcon={<CloudUploadIcon />}
            disabled={isReadOnly || files.length + existingFiles.length >= 5}
          >
            Tải lên {title.toLowerCase()}
          </Button>
        </label>
        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
          Giới hạn: Ảnh (5MB), Video (100MB), Audio (20MB). Tối đa 5 file.
        </Typography>
      </Box>
      
      {/* Hiển thị media đã tồn tại */}
      {existingFiles.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
            Media hiện tại:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {existingFiles.map((file, index) => (
              <ExistingMediaPreview
                key={file.id}
                media={file}
                onRemove={() => onRemoveExisting(index)}
              />
            ))}
          </Box>
        </Box>
      )}
      
      {/* Hiển thị media mới thêm */}
      {files.length > 0 && (
        <Box>
          <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
            Media mới thêm:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {files.map((file, index) => (
              <MediaPreview
                key={`${file.name}-${index}`}
                file={file}
                onRemove={() => onRemove(index)}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Thông tin cơ bản */}
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Thông tin cơ bản
          </Typography>
        </Box>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          <FormControl fullWidth required error={!!errors.questionTopicId}>
            <Autocomplete
              value={topics.find(topic => topic.id === formData.questionTopicId) || null}
              onChange={(_, newValue) => {
                onFormChange('questionTopicId', newValue?.id || 0);
              }}
              options={topics}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chủ đề"
                  error={!!errors.questionTopicId}
                  helperText={errors.questionTopicId}
                />
              )}
              disabled={isReadOnly}
              size="small"
              ListboxProps={{
                style: {
                  maxHeight: '200px',
                  overflow: 'auto'
                }
              }}
              filterOptions={(options, { inputValue }) => {
                const searchTerm = inputValue.toLowerCase();
                return options.filter(option => 
                  option.name.toLowerCase().includes(searchTerm)
                );
              }}
              noOptionsText="Không tìm thấy chủ đề"
              loadingText="Đang tải..."
            />
          </FormControl>
          
          <FormControl fullWidth required>
            <InputLabel>Loại câu hỏi</InputLabel>
            <Select
              name="questionType"
              value={formData.questionType || 'multiple_choice'}
              onChange={handleSelectChange}
              label="Loại câu hỏi"
              disabled={isReadOnly}
            >
              <MenuItem value="multiple_choice">Trắc nghiệm</MenuItem>
              <MenuItem value="essay">Tự luận</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
          <FormControl fullWidth required error={!!errors.defaultTime}>
            <TextField
              name="defaultTime"
              label="Thời gian làm bài (giây)"
              type="number"
              InputProps={{ inputProps: { min: 10, max: 1800 } }}
              value={formData.defaultTime || ''}
              onChange={handleChange}
              error={!!errors.defaultTime}
              helperText={errors.defaultTime}
              disabled={isReadOnly}
            />
          </FormControl>
          
          <FormControl fullWidth required error={!!errors.score}>
            <TextField
              name="score"
              label="Điểm số"
              type="number"
              InputProps={{ inputProps: { min: 1, max: 100 } }}
              value={formData.score || ''}
              onChange={handleChange}
              error={!!errors.score}
              helperText={errors.score}
              disabled={isReadOnly}
            />
          </FormControl>
          
          <FormControl fullWidth required>
            <InputLabel>Độ khó</InputLabel>
            <Select
              name="difficulty"
              value={formData.difficulty || 'Alpha'}
              onChange={handleSelectChange}
              label="Độ khó"
              disabled={isReadOnly}
            >
              <MenuItem value="Alpha">Alpha</MenuItem>
              <MenuItem value="Beta">Beta</MenuItem>
              <MenuItem value="Rc">Rc</MenuItem>
              <MenuItem value="Gold">Gold</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Box>
          <TextField
            name="intro"
            label="Giới thiệu (tùy chọn)"
            fullWidth
            multiline
            rows={2}
            value={formData.intro || ''}
            onChange={handleChange}
            disabled={isReadOnly}
          />
        </Box>
        
        {/* Nội dung câu hỏi */}
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Nội dung câu hỏi
          </Typography>
        </Box>
        
        <Box>
          <FormControl fullWidth error={!!errors.content}>
            <Typography variant="body2" gutterBottom>
              Nội dung câu hỏi *
            </Typography>
            <Box sx={{ border: errors.content ? '1px solid red' : '1px solid #ccc', borderRadius: 1 }}>
              <Editor
                apiKey="27tx6fph0lki6eefz8gfsu5jz74x6clpth0dnq0k02a9wz4b"
                value={formData.content || ''}
                init={{
                  height: 300,
                  menubar: false,
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
                  ],
                  toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                  branding: false,
                  promotion: false,
                  statusbar: false,
                  resize: false,
                  language: 'vi',
                  language_url: '/tinymce/langs/vi.js'
                }}
                onEditorChange={onContentChange}
                disabled={isReadOnly}
              />
            </Box>
            {errors.content && (
              <FormHelperText error>{errors.content}</FormHelperText>
            )}
          </FormControl>
        </Box>
        
        {renderMediaSection(
          'Media câu hỏi',
          questionMediaFiles,
          questionMediaPreviews,
          onQuestionMediaChange,
          removeQuestionMedia,
          removeQuestionMediaPreview
        )}
        
        {/* Câu trả lời */}
        <Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Câu trả lời
          </Typography>
        </Box>
        
        {formData.questionType === 'multiple_choice' && (
          <Box>
            <FormControl fullWidth error={!!errors.options}>
              <Typography variant="body2" gutterBottom>
                Các lựa chọn *
              </Typography>
              
              {(formData.options || []).map((option, index) => (
                <Box key={index} display="flex" alignItems="center" mb={1}>
                  <TextField
                    fullWidth
                    value={option}
                    onChange={(e) => onOptionChange(index, e.target.value)}
                    placeholder={`Lựa chọn ${index + 1}`}
                    disabled={isReadOnly}
                  />
                  
                  {!isReadOnly && (formData.options || []).length > 2 && (
                    <IconButton 
                      color="error" 
                      onClick={() => removeOption(index)}
                      size="small"
                    >
                      <CloseIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
              
              {errors.options && (
                <FormHelperText error>{errors.options}</FormHelperText>
              )}
              
              {!isReadOnly && (
                <Button 
                  variant="outlined" 
                  onClick={addOption}
                  sx={{ mt: 1 }}
                  disabled={(formData.options || []).length >= 10}
                >
                  Thêm lựa chọn
                </Button>
              )}
            </FormControl>
          </Box>
        )}
        
        <Box>
          <FormControl fullWidth error={!!errors.correctAnswer}>
            <TextField
              name="correctAnswer"
              label={formData.questionType === 'multiple_choice' ? "Đáp án đúng *" : "Đáp án mẫu *"}
              multiline={formData.questionType === 'essay'}
              rows={formData.questionType === 'essay' ? 4 : 1}
              value={formData.correctAnswer || ''}
              onChange={handleChange}
              error={!!errors.correctAnswer}
              helperText={errors.correctAnswer}
              disabled={isReadOnly}
            />
          </FormControl>
        </Box>
        
        {renderMediaSection(
          'Media đáp án',
          mediaAnswerFiles,
          mediaAnswerPreviews,
          onMediaAnswerChange,
          removeMediaAnswer,
          removeMediaAnswerPreview
        )}
        
        <Box>
          <FormControl fullWidth>
            <Typography variant="body2" gutterBottom>
              Giải thích (tùy chọn)
            </Typography>
            <Box sx={{ border: '1px solid #ccc', borderRadius: 1 }}>
              <Editor
                apiKey="27tx6fph0lki6eefz8gfsu5jz74x6clpth0dnq0k02a9wz4b"
                value={formData.explanation || ''}
                init={{
                  height: 200,
                  menubar: false,
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
                  ],
                  toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                  branding: false,
                  promotion: false,
                  statusbar: false,
                  resize: false,
                  language: 'vi',
                  language_url: '/tinymce/langs/vi.js'
                }}
                onEditorChange={onExplanationChange}
                disabled={isReadOnly}
              />
            </Box>
          </FormControl>
        </Box>
        
        {/* Trạng thái */}
        <Box>
          <Divider sx={{ my: 2 }} />
          <FormControlLabel
            control={
              <Switch
                name="isActive"
                checked={formData.isActive || false}
                onChange={handleSwitchChange}
                disabled={isReadOnly}
              />
            }
            label="Câu hỏi đang hoạt động"
          />
        </Box>
      </Box>
    </form>
  );
};

export default QuestionDialogForm; 