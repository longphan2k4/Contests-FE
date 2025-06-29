import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  IconButton,
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import QuestionDialogForm from "./QuestionDialogForm";
import { useQuestionForm } from "../hooks/useQuestionForm";
import type { Question } from "../types";
import { useToast } from "../../../../contexts/toastContext";

export interface QuestionTopic {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

interface QuestionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  question: Question | null;
  isLoading: boolean;
  mode: "view" | "edit" | "create";
  topics: QuestionTopic[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`question-tabpanel-${index}`}
      aria-labelledby={`question-tab-${index}`}
      style={{ width: "100%" }}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `question-tab-${index}`,
    "aria-controls": `question-tabpanel-${index}`,
  };
}

const QuestionDialog: React.FC<QuestionDialogProps> = ({
  open,
  onClose,
  onSubmit,
  question,
  isLoading,
  mode,
  topics,
}) => {
  const isReadOnly = mode === "view";
  const [tabValue, setTabValue] = React.useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const { showToast } = useToast();
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const {
    formData,
    errors,
    questionMediaFiles,
    mediaAnswerFiles,
    questionMediaPreviews,
    mediaAnswerPreviews,
    validateForm,
    prepareFormData,
    resetForm,
    resetMediaFiles,
    handleFormChange,
    handleContentChange,
    handleExplanationChange,
    handleOptionChange,
    addOption,
    removeOption,
    handleQuestionMediaChange,
    handleMediaAnswerChange,
    removeQuestionMedia,
    removeMediaAnswer,
    removeQuestionMediaPreview,
    removeMediaAnswerPreview,
  } = useQuestionForm({ question, mode, topics });

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("=== DEBUG QuestionDialog handleSubmit ===");
    console.log("Mode:", mode, "isReadOnly:", isReadOnly);

    e.preventDefault();
    if (isReadOnly) {
      onClose();
      return;
    }

    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Preparing form data for submission...");
      const formDataToSubmit = prepareFormData(formData);
      console.log("Calling onSubmit with form data...");
      console.log("=== DEBUG: Calling onSubmit ===");
      await onSubmit(formDataToSubmit);
      console.log("=== DEBUG: onSubmit completed successfully ===");

      // Reset media files sau khi submit thành công để tránh duplicate
      console.log(
        "=== DEBUG: Calling resetMediaFiles after successful submission ==="
      );
      resetMediaFiles();

      // Đóng dialog sẽ được xử lý trong onClose callback hoặc bởi parent component
    } catch (error) {
      console.error("Submit error:", error);
      showToast(
        error instanceof Error ? error.message : "Lỗi khi gửi dữ liệu câu hỏi"
      );
    } finally {
      // Reset submitting state trong finally để đảm bảo luôn được reset
      setIsSubmitting(false);
      console.log("=== END QuestionDialog handleSubmit ===");
    }
  };

  // Reset tab when dialog opens
  React.useEffect(() => {
    if (open) {
      setTabValue(0);
    }
  }, [open]);

  // Reset isSubmitting state khi dialog đóng
  React.useEffect(() => {
    if (!open) {
      setIsSubmitting(false);
    }
  }, [open]);

  const renderQuestionDetails = () => {
    if (!question) return null;

    const topic = topics.find((t) => t.id === formData.questionTopicId);

    return (
      <Box sx={{ p: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Thông tin cơ bản
          </Typography>
          <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default" }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Chủ đề
              </Typography>
              <Typography variant="body1">
                {topic?.name || "Không có"}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                gap: 2,
                mb: 2,
              }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Loại câu hỏi
                </Typography>
                <Typography variant="body1">
                  {formData.questionType === "multiple_choice"
                    ? "Trắc nghiệm"
                    : "Tự luận"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Điểm số
                </Typography>
                <Typography variant="body1">{formData.score} điểm</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Độ khó
                </Typography>
                <Chip
                  label={formData.difficulty}
                  color="primary"
                  size="small"
                />
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Thời gian làm bài
              </Typography>
              <Typography variant="body1">
                {formData.defaultTime} giây
              </Typography>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Trạng thái
              </Typography>
              <Chip
                label={formData.isActive ? "Đang hoạt động" : "Vô hiệu hóa"}
                color="primary"
                size="small"
              />
            </Box>
          </Paper>
        </Box>

        {formData.intro && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Giới thiệu
            </Typography>
            <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default" }}>
              <Typography variant="body1">{formData.intro}</Typography>
            </Paper>
          </Box>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Nội dung câu hỏi
          </Typography>
          <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default" }}>
            <Box
              dangerouslySetInnerHTML={{ __html: formData.content }}
              sx={{
                "& img": { maxWidth: "100%", height: "auto" },
                "& p": { margin: "0.5em 0" },
                "& ul, & ol": { paddingLeft: "1.5em" },
              }}
            />
          </Paper>
        </Box>

        {questionMediaPreviews.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Media câu hỏi
            </Typography>
            <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default" }}>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {questionMediaPreviews.map((media) => (
                  <Box
                    key={media.id}
                    sx={{
                      width: { xs: "100%", sm: "auto" },
                      maxWidth: "100%",
                      mb: 2,
                    }}
                  >
                    {media.type.startsWith("image/") ? (
                      <Box
                        component="img"
                        src={media.url}
                        alt={media.name}
                        sx={{
                          maxWidth: "100%",
                          maxHeight: 300,
                          objectFit: "contain",
                          borderRadius: 1,
                        }}
                      />
                    ) : media.type.startsWith("video/") ? (
                      <Box
                        component="video"
                        src={media.url}
                        controls
                        sx={{
                          maxWidth: "100%",
                          maxHeight: 300,
                        }}
                      />
                    ) : media.type.startsWith("audio/") ? (
                      <Box
                        component="audio"
                        src={media.url}
                        controls
                        sx={{
                          width: "100%",
                        }}
                      />
                    ) : (
                      <Typography>{media.name}</Typography>
                    )}
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ mt: 0.5 }}
                    >
                      {media.name}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Đáp án
          </Typography>
          <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default" }}>
            {formData.questionType === "multiple_choice" ? (
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Các lựa chọn
                </Typography>
                {(formData.options || []).map((option, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 1.5,
                      mb: 1,
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor:
                        option === formData.correctAnswer
                          ? "primary.main"
                          : "divider",
                      bgcolor:
                        option === formData.correctAnswer
                          ? "primary.light"
                          : "transparent",
                      color:
                        option === formData.correctAnswer
                          ? "primary.contrastText"
                          : "text.primary",
                    }}
                  >
                    <Typography variant="body1">
                      {option === formData.correctAnswer && "✓ "}
                      {option}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Đáp án mẫu
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                  {formData.correctAnswer}
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>

        {mediaAnswerPreviews.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Media đáp án
            </Typography>
            <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default" }}>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {mediaAnswerPreviews.map((media) => (
                  <Box
                    key={media.id}
                    sx={{
                      width: { xs: "100%", sm: "auto" },
                      maxWidth: "100%",
                      mb: 2,
                    }}
                  >
                    {media.type.startsWith("image/") ? (
                      <Box
                        component="img"
                        src={media.url}
                        alt={media.name}
                        sx={{
                          maxWidth: "100%",
                          maxHeight: 300,
                          objectFit: "contain",
                          borderRadius: 1,
                        }}
                      />
                    ) : media.type.startsWith("video/") ? (
                      <Box
                        component="video"
                        src={media.url}
                        controls
                        sx={{
                          maxWidth: "100%",
                          maxHeight: 300,
                        }}
                      />
                    ) : media.type.startsWith("audio/") ? (
                      <Box
                        component="audio"
                        src={media.url}
                        controls
                        sx={{
                          width: "100%",
                        }}
                      />
                    ) : (
                      <Typography>{media.name}</Typography>
                    )}
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ mt: 0.5 }}
                    >
                      {media.name}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        )}

        {formData.explanation && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Giải thích
            </Typography>
            <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default" }}>
              <Box
                dangerouslySetInnerHTML={{ __html: formData.explanation }}
                sx={{
                  "& img": { maxWidth: "100%", height: "auto" },
                  "& p": { margin: "0.5em 0" },
                  "& ul, & ol": { paddingLeft: "1.5em" },
                }}
              />
            </Paper>
          </Box>
        )}
      </Box>
    );
  };

  // Xử lý đóng dialog
  const handleClose = () => {
    // Blur tất cả focusable elements trước khi đóng
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), video, audio'
    );
    focusableElements.forEach((element) => {
      (element as HTMLElement).blur();
    });

    // Đóng dialog trước
    if (onClose) {
      onClose();
    }

    // Delay nhẹ để animation đóng dialog hoàn tất trước khi reset state
    setTimeout(() => {
      // Reset form nếu đang ở mode create
      if (mode === "create") {
        resetForm();
      }
      // Reset state cần thiết
      setIsSubmitting(false);
      setFormKey((prev) => prev + 1); // Thay đổi key để re-render form khi cần
    }, 200); // Tăng thời gian delay lên 200ms để đảm bảo focus đã được xử lý
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pr: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        {mode === "create"
          ? "Tạo câu hỏi"
          : mode === "edit"
          ? "Chỉnh sửa câu hỏi"
          : "Chi tiết câu hỏi"}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
            "&:hover": {
              color: (theme) => theme.palette.grey[700],
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {isReadOnly ? (
        <>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="question tabs"
              variant={isMobile ? "fullWidth" : "standard"}
            >
              <Tab label="Xem chi tiết" {...a11yProps(0)} />
              <Tab label="Xem biểu mẫu" {...a11yProps(1)} />
            </Tabs>
          </Box>

          <DialogContent
            dividers
            sx={{
              p: 0,
              display: "flex",
              flexDirection: "column",
              flex: 1,
              overflow: "auto",
            }}
          >
            <TabPanel value={tabValue} index={0}>
              {renderQuestionDetails()}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <QuestionDialogForm
                key={formKey}
                formData={formData}
                errors={errors}
                topics={topics}
                questionMediaFiles={questionMediaFiles}
                mediaAnswerFiles={mediaAnswerFiles}
                questionMediaPreviews={questionMediaPreviews}
                mediaAnswerPreviews={mediaAnswerPreviews}
                isReadOnly={isReadOnly}
                onFormChange={handleFormChange}
                onContentChange={handleContentChange}
                onExplanationChange={handleExplanationChange}
                onOptionChange={handleOptionChange}
                addOption={addOption}
                removeOption={removeOption}
                onQuestionMediaChange={handleQuestionMediaChange}
                onMediaAnswerChange={handleMediaAnswerChange}
                removeQuestionMedia={removeQuestionMedia}
                removeMediaAnswer={removeMediaAnswer}
                removeQuestionMediaPreview={removeQuestionMediaPreview}
                removeMediaAnswerPreview={removeMediaAnswerPreview}
                handleSubmit={handleSubmit}
              />
            </TabPanel>
          </DialogContent>
        </>
      ) : (
        <DialogContent dividers>
          <QuestionDialogForm
            key={formKey}
            ref={formRef}
            formData={formData}
            errors={errors}
            topics={topics}
            questionMediaFiles={questionMediaFiles}
            mediaAnswerFiles={mediaAnswerFiles}
            questionMediaPreviews={questionMediaPreviews}
            mediaAnswerPreviews={mediaAnswerPreviews}
            isReadOnly={isReadOnly}
            onFormChange={handleFormChange}
            onContentChange={handleContentChange}
            onExplanationChange={handleExplanationChange}
            onOptionChange={handleOptionChange}
            addOption={addOption}
            removeOption={removeOption}
            onQuestionMediaChange={handleQuestionMediaChange}
            onMediaAnswerChange={handleMediaAnswerChange}
            removeQuestionMedia={removeQuestionMedia}
            removeMediaAnswer={removeMediaAnswer}
            removeQuestionMediaPreview={removeQuestionMediaPreview}
            removeMediaAnswerPreview={removeMediaAnswerPreview}
            handleSubmit={handleSubmit}
          />
        </DialogContent>
      )}

      <DialogActions
        sx={{ borderTop: "1px solid", borderColor: "divider", p: 2 }}
      >
        <Button onClick={handleClose} color="inherit">
          {isReadOnly ? "Đóng" : "Hủy"}
        </Button>
        {!isReadOnly && (
          <Button
            onClick={(e) => handleSubmit(e as React.FormEvent)}
            color="primary"
            variant="contained"
            disabled={isLoading || isSubmitting}
          >
            {isLoading || isSubmitting ? <CircularProgress size={24} /> : "Lưu"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default QuestionDialog;
