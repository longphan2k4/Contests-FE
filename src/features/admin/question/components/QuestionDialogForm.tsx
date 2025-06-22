import React, { useState, forwardRef } from "react";
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
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  Radio,
  RadioGroup,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import VideocamIcon from "@mui/icons-material/Videocam";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import { Editor } from "@tinymce/tinymce-react";
import MediaPreview from "./MediaPreview";
import ExistingMediaPreview from "./ExistingMediaPreview";

// Định nghĩa các loại file được phép
const ALLOWED_TYPES = {
  image: {
    extensions: /jpeg|jpg|png|gif|webp|svg/,
    mimeTypes: /^image\/(jpeg|jpg|png|gif|webp|svg\+xml)$/,
    accept: "image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml",
    maxSize: 30 * 1024 * 1024, // 30MB
  },
  video: {
    extensions: /mp4|avi|mov|wmv|flv|webm|mkv/,
    mimeTypes: /^video\/(mp4|avi|quicktime|x-ms-wmv|x-flv|webm|x-matroska)$/,
    accept:
      "video/mp4,video/avi,video/quicktime,video/x-ms-wmv,video/x-flv,video/webm,video/x-matroska",
    maxSize: 100 * 1024 * 1024, // 100MB
  },
  audio: {
    extensions: /mp3|wav|ogg|aac|flac|m4a/,
    mimeTypes: /^audio\/(mpeg|wav|ogg|aac|flac|mp4)$/,
    accept: "audio/mp3,audio/wav,audio/ogg,audio/aac,audio/flac,audio/mp4",
    maxSize: 50 * 1024 * 1024, // 50MB
  },
};

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
  questionType: "multiple_choice" | "essay";
  content: string;
  options: string[] | null;
  correctAnswer: string;
  score: number;
  difficulty: "Alpha" | "Beta" | "Rc" | "Gold";
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

type MediaType = "image" | "video" | "audio";

const QuestionDialogForm = forwardRef<HTMLFormElement, QuestionDialogFormProps>(
  (
    {
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
    },
    ref
  ) => {
    // State để lưu loại media đang được chọn
    const [questionMediaType, setQuestionMediaType] =
      useState<MediaType>("image");
    const [answerMediaType, setAnswerMediaType] = useState<MediaType>("image");

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
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

    // Xác định loại media hiện tại nếu đã có file
    const getCurrentMediaType = (
      previews: MediaFilePreview[],
      files: File[]
    ): MediaType | null => {
      // Kiểm tra existing files trước
      if (previews.length > 0) {
        const firstType = previews[0].type;
        if (firstType.startsWith("image/")) return "image";
        if (firstType.startsWith("video/")) return "video";
        if (firstType.startsWith("audio/")) return "audio";
      }

      // Nếu không có existing files, kiểm tra new files
      if (files.length > 0) {
        const firstType = files[0].type;
        if (firstType.startsWith("image/")) return "image";
        if (firstType.startsWith("video/")) return "video";
        if (firstType.startsWith("audio/")) return "audio";
      }

      return null;
    };

    // Kiểm tra xem có thể thay đổi loại media không
    const canChangeMediaType = (
      previews: MediaFilePreview[],
      files: File[]
    ): boolean => {
      return previews.length === 0 && files.length === 0;
    };

    const renderMediaSection = (
      title: string,
      files: File[],
      existingFiles: MediaFilePreview[],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
      onRemove: (index: number) => void,
      onRemoveExisting: (index: number) => void,
      mediaType: MediaType,
      setMediaType: (type: MediaType) => void
    ) => {
      // Xác định loại media hiện tại từ file đã tồn tại hoặc file mới
      const currentMediaType = getCurrentMediaType(existingFiles, files);
      const canChange = canChangeMediaType(existingFiles, files);

      // Nếu đã có file và loại media khác với loại hiện tại, cập nhật state
      if (currentMediaType && mediaType !== currentMediaType) {
        setMediaType(currentMediaType);
      }

      // Lấy accept attribute dựa trên loại media
      const acceptAttribute = ALLOWED_TYPES[mediaType].accept;

      // Hiển thị thông báo giới hạn kích thước
      const sizeLimit = {
        image: "30MB",
        video: "100MB",
        audio: "50MB",
      }[mediaType];

      return (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            {title}
          </Typography>

          {/* Lựa chọn loại media */}
          <Box sx={{ mb: 2 }}>
            <ToggleButtonGroup
              value={mediaType}
              exclusive
              onChange={(_, newValue) => {
                if (newValue && canChange) {
                  setMediaType(newValue as MediaType);
                }
              }}
              aria-label="media type"
              size="small"
              disabled={isReadOnly}
            >
              <ToggleButton
                value="image"
                aria-label="image"
                disabled={!canChange && currentMediaType !== "image"}
              >
                <Tooltip title="Hình ảnh (JPEG, PNG, GIF...)">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ImageIcon sx={{ mr: 0.5 }} />
                    <Typography variant="body2">Ảnh</Typography>
                  </Box>
                </Tooltip>
              </ToggleButton>
              <ToggleButton
                value="video"
                aria-label="video"
                disabled={!canChange && currentMediaType !== "video"}
              >
                <Tooltip title="Video (MP4, WebM...)">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <VideocamIcon sx={{ mr: 0.5 }} />
                    <Typography variant="body2">Video</Typography>
                  </Box>
                </Tooltip>
              </ToggleButton>
              <ToggleButton
                value="audio"
                aria-label="audio"
                disabled={!canChange && currentMediaType !== "audio"}
              >
                <Tooltip title="Âm thanh (MP3, WAV...)">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <AudiotrackIcon sx={{ mr: 0.5 }} />
                    <Typography variant="body2">Âm thanh</Typography>
                  </Box>
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>

            {!canChange && currentMediaType && (
              <Typography
                variant="caption"
                color="warning.main"
                sx={{ display: "block", mt: 1 }}
              >
                ⚠️ Đã có{" "}
                {currentMediaType === "image"
                  ? "ảnh"
                  : currentMediaType === "video"
                  ? "video"
                  : "âm thanh"}
                . Chỉ có thể thêm cùng loại media hoặc xóa tất cả để chọn loại
                khác.
              </Typography>
            )}
          </Box>

          <Box sx={{ mb: 2 }}>
            <input
              type="file"
              multiple
              onChange={onChange}
              style={{ display: "none" }}
              id={`${title.toLowerCase().replace(/\s+/g, "-")}-input`}
              accept={acceptAttribute}
              disabled={isReadOnly}
            />
            <label
              htmlFor={`${title.toLowerCase().replace(/\s+/g, "-")}-input`}
            >
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                disabled={
                  isReadOnly || files.length + existingFiles.length >= 5
                }
              >
                Tải lên{" "}
                {mediaType === "image"
                  ? "ảnh"
                  : mediaType === "video"
                  ? "video"
                  : "âm thanh"}
              </Button>
            </label>
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ display: "block", mt: 1 }}
            >
              Giới hạn:{" "}
              {mediaType === "image"
                ? "Ảnh"
                : mediaType === "video"
                ? "Video"
                : "Âm thanh"}{" "}
              ({sizeLimit}). Tối đa 5 file cùng loại.
            </Typography>
          </Box>

          {/* Hiển thị media đã tồn tại */}
          {existingFiles.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                color="primary"
                sx={{ display: "block", mb: 1, fontWeight: "bold" }}
              >
                Media đã lưu:
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  p: 1,
                  bgcolor: "background.default",
                  borderRadius: 1,
                }}
              >
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
              <Typography
                variant="subtitle2"
                color="secondary"
                sx={{ display: "block", mb: 1, fontWeight: "bold" }}
              >
                Media mới thêm:
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  p: 1,
                  bgcolor: "background.default",
                  borderRadius: 1,
                }}
              >
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
    };

    return (
      <form onSubmit={handleSubmit} ref={ref}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Thông tin cơ bản */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Thông tin cơ bản
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <FormControl fullWidth required error={!!errors.questionTopicId}>
              <Autocomplete
                value={
                  topics.find(
                    (topic) => topic.id === formData.questionTopicId
                  ) || null
                }
                onChange={(_, newValue) => {
                  onFormChange("questionTopicId", newValue?.id || 0);
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
                    maxHeight: "200px",
                    overflow: "auto",
                  },
                }}
                filterOptions={(options, { inputValue }) => {
                  const searchTerm = inputValue.toLowerCase();
                  return options.filter((option) =>
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
                value={formData.questionType || "multiple_choice"}
                onChange={handleSelectChange}
                label="Loại câu hỏi"
                disabled={isReadOnly}
              >
                <MenuItem value="multiple_choice">Trắc nghiệm</MenuItem>
                <MenuItem value="essay">Tự luận</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
              gap: 2,
            }}
          >
            <FormControl fullWidth required error={!!errors.defaultTime}>
              <TextField
                name="defaultTime"
                label="Thời gian làm bài (giây)"
                type="number"
                InputProps={{ inputProps: { min: 10, max: 1800 } }}
                value={formData.defaultTime || ""}
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
                value={formData.score || ""}
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
                value={formData.difficulty || "Alpha"}
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
              value={formData.intro || ""}
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
              <Box
                sx={{
                  border: errors.content ? "1px solid red" : "1px solid #ccc",
                  borderRadius: 1,
                }}
              >
                <Editor
                  apiKey="27tx6fph0lki6eefz8gfsu5jz74x6clpth0dnq0k02a9wz4b"
                  value={formData.content || ""}
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "preview",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | blocks | " +
                      "bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    branding: false,
                    promotion: false,
                    statusbar: false,
                    resize: false,
                    language: "vi",
                    language_url: "/tinymce/langs/vi.js",
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
            "Media câu hỏi",
            questionMediaFiles,
            questionMediaPreviews,
            onQuestionMediaChange,
            removeQuestionMedia,
            removeQuestionMediaPreview,
            questionMediaType,
            setQuestionMediaType
          )}

          {/* Câu trả lời */}
          <Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Câu trả lời
            </Typography>
          </Box>

          {formData.questionType === "multiple_choice" && (
            <Box>
              <FormControl fullWidth error={!!errors.options}>
                <Typography variant="body2" gutterBottom>
                  Các lựa chọn *
                </Typography>

                <RadioGroup
                  value={formData.correctAnswer || ""}
                  onChange={(e) =>
                    onFormChange("correctAnswer", e.target.value)
                  }
                >
                  {(formData.options || []).map((option, index) => (
                    <Box
                      key={index}
                      display="flex"
                      alignItems="center"
                      mb={1}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        border: "2px solid",
                        borderColor:
                          formData.correctAnswer === option
                            ? "success.main"
                            : "grey.300",
                        backgroundColor:
                          formData.correctAnswer === option
                            ? "success.50"
                            : "background.paper",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          borderColor:
                            formData.correctAnswer === option
                              ? "success.dark"
                              : "primary.main",
                          backgroundColor:
                            formData.correctAnswer === option
                              ? "success.100"
                              : "action.hover",
                          transform: "translateY(-1px)",
                          boxShadow: 2,
                        },
                      }}
                    >
                      <Radio
                        value={option}
                        disabled={isReadOnly || !option.trim()}
                        sx={{
                          mr: 1,
                          color:
                            formData.correctAnswer === option
                              ? "success.main"
                              : "default",
                          "&.Mui-checked": {
                            color: "success.main",
                          },
                        }}
                      />
                      <TextField
                        fullWidth
                        value={option}
                        onChange={(e) => {
                          onOptionChange(index, e.target.value);
                          // Nếu option này đang được chọn làm đáp án đúng và người dùng thay đổi nội dung
                          // thì cập nhật luôn correctAnswer
                          if (formData.correctAnswer === option) {
                            onFormChange("correctAnswer", e.target.value);
                          }
                        }}
                        placeholder={`Lựa chọn ${index + 1}`}
                        disabled={isReadOnly}
                        variant="outlined"
                        size="small"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "transparent",
                            "& fieldset": {
                              borderColor: "transparent",
                            },
                            "&:hover fieldset": {
                              borderColor: "transparent",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "primary.main",
                              borderWidth: 1,
                            },
                          },
                        }}
                      />

                      {!isReadOnly && (formData.options || []).length > 2 && (
                        <IconButton
                          color="error"
                          onClick={() => {
                            // Nếu đang xóa option được chọn làm đáp án đúng, clear correctAnswer
                            if (formData.correctAnswer === option) {
                              onFormChange("correctAnswer", "");
                            }
                            removeOption(index);
                          }}
                          size="small"
                          sx={{
                            ml: 1,
                            "&:hover": {
                              backgroundColor: "error.100",
                              transform: "scale(1.1)",
                            },
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                </RadioGroup>

                {errors.options && (
                  <FormHelperText error>{errors.options}</FormHelperText>
                )}

                {errors.correctAnswer && (
                  <FormHelperText error>{errors.correctAnswer}</FormHelperText>
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

          {formData.questionType === "essay" && (
            <Box>
              <FormControl fullWidth error={!!errors.correctAnswer}>
                <TextField
                  name="correctAnswer"
                  label="Đáp án mẫu *"
                  multiline
                  rows={4}
                  value={formData.correctAnswer || ""}
                  onChange={handleChange}
                  error={!!errors.correctAnswer}
                  helperText={errors.correctAnswer}
                  disabled={isReadOnly}
                />
              </FormControl>
            </Box>
          )}

          {renderMediaSection(
            "Media đáp án",
            mediaAnswerFiles,
            mediaAnswerPreviews,
            onMediaAnswerChange,
            removeMediaAnswer,
            removeMediaAnswerPreview,
            answerMediaType,
            setAnswerMediaType
          )}

          <Box>
            <FormControl fullWidth>
              <Typography variant="body2" gutterBottom>
                Giải thích (tùy chọn)
              </Typography>
              <Box sx={{ border: "1px solid #ccc", borderRadius: 1 }}>
                <Editor
                  apiKey="27tx6fph0lki6eefz8gfsu5jz74x6clpth0dnq0k02a9wz4b"
                  value={formData.explanation || ""}
                  init={{
                    height: 200,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "preview",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | blocks | " +
                      "bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    branding: false,
                    promotion: false,
                    statusbar: false,
                    resize: false,
                    language: "vi",
                    language_url: "/tinymce/langs/vi.js",
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
  }
);

QuestionDialogForm.displayName = "QuestionDialogForm";

export default QuestionDialogForm;
