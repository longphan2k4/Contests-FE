import { useState, useEffect } from "react";
import type { Question } from "../types";
import type { QuestionTopic } from "../components/QuestionDialog";
import { useToast } from "../../../../contexts/toastContext";
import {
  questionFormSchema,
  validateMediaFiles,
  type QuestionFormData,
} from "../schemas/questionSchema";
import { z } from "zod";

// Định nghĩa các loại file được phép
export const ALLOWED_TYPES = {
  image: {
    extensions: /jpeg|jpg|png|gif|webp|svg/,
    mimeTypes: /^image\/(jpeg|jpg|png|gif|webp|svg\+xml)$/,
    maxSize: 30 * 1024 * 1024, // 30MB
  },
  video: {
    extensions: /mp4|avi|mov|wmv|flv|webm|mkv/,
    mimeTypes: /^video\/(mp4|avi|quicktime|x-ms-wmv|x-flv|webm|x-matroska)$/,
    maxSize: 100 * 1024 * 1024, // 100MB
  },
  audio: {
    extensions: /mp3|wav|ogg|aac|flac|m4a/,
    mimeTypes: /^audio\/(mpeg|wav|ogg|aac|flac|mp4)$/,
    maxSize: 50 * 1024 * 1024, // 50MB
  },
};

interface QuestionFormValues {
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

interface QuestionFormErrors {
  [key: string]: string;
}

interface MediaFilePreview {
  id: string;
  url: string;
  name: string;
  type: string;
  size: number;
}

interface UseQuestionFormProps {
  question: Question | null;
  mode: "view" | "edit" | "create";
  topics: QuestionTopic[];
}

export const useQuestionForm = ({ question, mode }: UseQuestionFormProps) => {
  const [formData, setFormData] = useState<QuestionFormValues>({
    intro: "",
    defaultTime: 30,
    questionType: "multiple_choice",
    content: "",
    options: ["", ""],
    correctAnswer: "",
    score: 1,
    difficulty: "Alpha",
    explanation: "",
    questionTopicId: 0,
    isActive: true,
    deleteQuestionMedia: [],
    deleteMediaAnswer: [],
  });

  const [errors, setErrors] = useState<QuestionFormErrors>({});
  const [questionMediaFiles, setQuestionMediaFiles] = useState<File[]>([]);
  const [mediaAnswerFiles, setMediaAnswerFiles] = useState<File[]>([]);
  const [questionMediaPreviews, setQuestionMediaPreviews] = useState<
    MediaFilePreview[]
  >([]);
  const [mediaAnswerPreviews, setMediaAnswerPreviews] = useState<
    MediaFilePreview[]
  >([]);
  const { showToast } = useToast();

  // Kiểm tra xem các file có cùng loại không
  const areFilesOfSameType = (files: File[]): boolean => {
    if (files.length <= 1) return true;

    const firstFileType = files[0].type.split("/")[0]; // 'image', 'video', 'audio'
    return files.every(file => file.type.split("/")[0] === firstFileType);
  };

  // Kiểm tra xem file mới có cùng loại với file đã tồn tại không
  const isCompatibleWithExistingFiles = (
    file: File,
    existingPreviews: MediaFilePreview[],
    newFiles: File[]
  ): boolean => {
    // Kiểm tra với existing files
    if (existingPreviews.length > 0) {
      const fileType = file.type.split("/")[0]; // 'image', 'video', 'audio'
      const existingType = existingPreviews[0].type.split("/")[0];
      return fileType === existingType;
    }

    // Kiểm tra với new files đã có
    if (newFiles.length > 0) {
      const fileType = file.type.split("/")[0];
      const newFileType = newFiles[0].type.split("/")[0];
      return fileType === newFileType;
    }

    return true; // Nếu chưa có file nào thì cho phép
  };

  useEffect(() => {
    if (question && (mode === "view" || mode === "edit")) {
      const initialFormData: QuestionFormValues = {
        intro: question.intro || "",
        defaultTime: question.defaultTime || 30,
        questionType: question.questionType as "multiple_choice" | "essay",
        content: question.content || "",
        options:
          question.questionType === "essay"
            ? null
            : question.options || ["", ""],
        correctAnswer: question.correctAnswer || "",
        score: question.score || 1,
        difficulty: question.difficulty as "Alpha" | "Beta" | "Rc" | "Gold",
        explanation: question.explanation || "",
        questionTopicId: question.questionTopicId || 0,
        isActive: question.isActive || false,
        deleteQuestionMedia: [],
        deleteMediaAnswer: [],
      };

      setFormData(initialFormData);

      // Reset media files khi chuyển sang mode khác hoặc khi question thay đổi
      setQuestionMediaFiles([]);
      setMediaAnswerFiles([]);

      // Clear errors khi có data mới
      setErrors({});

      // Set media previews if available
      if (question.questionMedia && question.questionMedia.length > 0) {
        const previews = question.questionMedia.map((media, index) => ({
          id: `existing-question-media-${media.filename}-${index}`, // Sử dụng filename và index để tạo unique id
          url: media.url || "",
          name: media.filename || `file-${index}`,
          type: media.mimeType || "application/octet-stream",
          size: media.size || 0,
        }));
        setQuestionMediaPreviews(previews);
      } else {
        setQuestionMediaPreviews([]);
      }

      if (question.mediaAnswer && question.mediaAnswer.length > 0) {
        const previews = question.mediaAnswer.map((media, index) => ({
          id: `existing-media-answer-${media.filename}-${index}`, // Sử dụng filename và index để tạo unique id
          url: media.url || "",
          name: media.filename || `file-${index}`,
          type: media.mimeType || "application/octet-stream",
          size: media.size || 0,
        }));
        setMediaAnswerPreviews(previews);
      } else {
        setMediaAnswerPreviews([]);
      }
    } else if (mode === "create") {
      // Reset toàn bộ khi tạo mới
      resetForm();
    } else {
      showToast("Có lỗi xảy ra khi tải dữ liệu câu hỏi", "error");
    }
  }, [question, mode]); // Dependency chính xác để trigger khi question hoặc mode thay đổi

  // Hàm reset form
  const resetForm = () => {
    setFormData({
      intro: "",
      defaultTime: 30,
      questionType: "multiple_choice",
      content: "",
      options: ["", ""],
      correctAnswer: "",
      score: 1,
      difficulty: "Alpha",
      explanation: "",
      questionTopicId: 0,
      isActive: true,
      deleteQuestionMedia: [],
      deleteMediaAnswer: [],
    });
    setErrors({});
    setQuestionMediaFiles([]);
    setMediaAnswerFiles([]);
    setQuestionMediaPreviews([]);
    setMediaAnswerPreviews([]);
  };

  const handleFormChange = (name: string, value: string | number | boolean) => {
    setFormData(prev => {
      const newData = { ...prev, [name]: value };

      // Logic đặc biệt cho questionType - xử lý options
      if (name === "questionType") {
        if (value === "essay") {
          newData.options = null;
          newData.correctAnswer = ""; // Clear correctAnswer khi chuyển sang essay
        } else if (value === "multiple_choice") {
          newData.options =
            prev.options && prev.options.length > 0 ? prev.options : ["", ""];
          newData.correctAnswer = ""; // Clear correctAnswer khi chuyển sang multiple_choice
        }
      }

      return newData;
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
    if (errors.content) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.content;
        return newErrors;
      });
    }
  };

  const handleExplanationChange = (explanation: string) => {
    setFormData(prev => ({ ...prev, explanation }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(formData.options || [])];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));

    if (errors.options) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.options;
        return newErrors;
      });
    }
  };

  const addOption = () => {
    const newOptions = [...(formData.options || []), ""];
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const removeOption = (index: number) => {
    const newOptions = [...(formData.options || [])];
    newOptions.splice(index, 1);
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const handleQuestionMediaChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);

    // Validate files using Zod
    const validation = validateMediaFiles([...questionMediaFiles, ...files]);
    if (!validation.isValid) {
      showToast(validation.error || "File không hợp lệ", "error");
      return;
    }

    // Kiểm tra xem các file có cùng loại không
    if (!areFilesOfSameType(files)) {
      showToast(
        "Tất cả các file phải cùng loại (ảnh, video hoặc âm thanh)",
        "error"
      );
      return;
    }

    // Kiểm tra xem file mới có tương thích với file đã tồn tại không
    const incompatibleFiles = files.filter(
      file =>
        !isCompatibleWithExistingFiles(
          file,
          questionMediaPreviews,
          questionMediaFiles
        )
    );
    if (incompatibleFiles.length > 0) {
      const currentType =
        questionMediaPreviews.length > 0
          ? questionMediaPreviews[0].type.split("/")[0]
          : questionMediaFiles.length > 0
          ? questionMediaFiles[0].type.split("/")[0]
          : null;

      const typeNames = {
        image: "ảnh",
        video: "video",
        audio: "âm thanh",
      };

      showToast(
        `Không thể thêm file khác loại. Chỉ có thể thêm ${
          typeNames[currentType as keyof typeof typeNames]
        } khi đã có file cùng loại.`,
        "warning"
      );
      return;
    }

    // Kiểm tra số lượng file
    if (
      files.length + questionMediaFiles.length + questionMediaPreviews.length >
      5
    ) {
      showToast("Không thể thêm quá 5 file media", "warning");
      return;
    }

    setQuestionMediaFiles(prev => [...prev, ...files]);
    showToast(`Đã thêm ${files.length} file thành công`, "success");
  };

  const handleMediaAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);

    // Validate files using Zod
    const validation = validateMediaFiles([...mediaAnswerFiles, ...files]);
    if (!validation.isValid) {
      showToast(validation.error || "File không hợp lệ", "error");
      return;
    }

    // Kiểm tra xem các file có cùng loại không
    if (!areFilesOfSameType(files)) {
      showToast(
        "Tất cả các file phải cùng loại (ảnh, video hoặc âm thanh)",
        "error"
      );
      return;
    }

    // Kiểm tra xem file mới có tương thích với file đã tồn tại không
    const incompatibleFiles = files.filter(
      file =>
        !isCompatibleWithExistingFiles(
          file,
          mediaAnswerPreviews,
          mediaAnswerFiles
        )
    );
    if (incompatibleFiles.length > 0) {
      const currentType =
        mediaAnswerPreviews.length > 0
          ? mediaAnswerPreviews[0].type.split("/")[0]
          : mediaAnswerFiles.length > 0
          ? mediaAnswerFiles[0].type.split("/")[0]
          : null;

      const typeNames = {
        image: "ảnh",
        video: "video",
        audio: "âm thanh",
      };

      showToast(
        `Không thể thêm file khác loại. Chỉ có thể thêm ${
          typeNames[currentType as keyof typeof typeNames]
        } khi đã có file cùng loại.`,
        "warning"
      );
      return;
    }

    // Kiểm tra số lượng file
    if (
      files.length + mediaAnswerFiles.length + mediaAnswerPreviews.length >
      5
    ) {
      showToast("Không thể thêm quá 5 file media", "warning");
      return;
    }

    setMediaAnswerFiles(prev => [...prev, ...files]);
    showToast(`Đã thêm ${files.length} file thành công`, "success");
  };

  const removeQuestionMedia = (index: number) => {
    const newFiles = [...questionMediaFiles];
    newFiles.splice(index, 1);
    setQuestionMediaFiles(newFiles);
    showToast("Đã xóa file", "info");
  };

  const removeMediaAnswer = (index: number) => {
    const newFiles = [...mediaAnswerFiles];
    newFiles.splice(index, 1);
    setMediaAnswerFiles(newFiles);
    showToast("Đã xóa file", "info");
  };

  const removeQuestionMediaPreview = (index: number) => {
    const mediaToDelete = questionMediaPreviews[index];
    setFormData(prev => ({
      ...prev,
      deleteQuestionMedia: [
        ...(prev.deleteQuestionMedia || []),
        mediaToDelete.name,
      ],
    }));
    const newPreviews = [...questionMediaPreviews];
    newPreviews.splice(index, 1);
    setQuestionMediaPreviews(newPreviews);
    showToast("Đã đánh dấu xóa file", "info");
  };

  const removeMediaAnswerPreview = (index: number) => {
    const mediaToDelete = mediaAnswerPreviews[index];
    setFormData(prev => ({
      ...prev,
      deleteMediaAnswer: [
        ...(prev.deleteMediaAnswer || []),
        mediaToDelete.name,
      ],
    }));
    const newPreviews = [...mediaAnswerPreviews];
    newPreviews.splice(index, 1);
    setMediaAnswerPreviews(newPreviews);
    showToast("Đã đánh dấu xóa file", "info");
  };

  const validateForm = (): boolean => {
    try {
      // Prepare data for validation
      const dataToValidate: QuestionFormData = {
        intro: formData.intro,
        defaultTime: formData.defaultTime,
        questionType: formData.questionType,
        content: formData.content,
        questionMediaFiles: questionMediaFiles.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type,
        })),
        options: formData.options,
        correctAnswer: formData.correctAnswer,
        mediaAnswerFiles: mediaAnswerFiles.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type,
        })),
        score: formData.score,
        difficulty: formData.difficulty,
        explanation: formData.explanation,
        questionTopicId: formData.questionTopicId,
        isActive: formData.isActive,
      };

      // Validate using Zod schema
      questionFormSchema.parse(dataToValidate);

      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: QuestionFormErrors = {};

        error.errors.forEach(err => {
          const path = err.path.join(".");
          newErrors[path] = err.message;
        });

        setErrors(newErrors);

        // Show toast for first error
        const firstError = error.errors[0];
        showToast(firstError.message, "error");

        return false;
      }

      showToast("Có lỗi xảy ra khi kiểm tra dữ liệu", "error");
      return false;
    }
  };

  const prepareFormData = (data: QuestionFormValues) => {
    const formDataToSubmit = new FormData();

    // Append basic fields
    Object.entries(data).forEach(([key, value]) => {
      if (
        key !== "options" &&
        key !== "deleteQuestionMedia" &&
        key !== "deleteMediaAnswer"
      ) {
        formDataToSubmit.append(key, value.toString());
      }
    });

    // Append options as JSON string - luôn gửi options (null cho essay, array cho multiple_choice)
    formDataToSubmit.append("options", JSON.stringify(data.options));

    // Append files to delete - chỉ gửi các mảng có giá trị hợp lệ
    if (data.deleteQuestionMedia && data.deleteQuestionMedia.length > 0) {
      const validEntries = data.deleteQuestionMedia.filter(
        item => item && item.trim() !== ""
      );
      if (validEntries.length > 0) {
        formDataToSubmit.append(
          "deleteQuestionMedia",
          JSON.stringify(validEntries)
        );
      }
    }

    if (data.deleteMediaAnswer && data.deleteMediaAnswer.length > 0) {
      const validEntries = data.deleteMediaAnswer.filter(
        item => item && item.trim() !== ""
      );
      if (validEntries.length > 0) {
        formDataToSubmit.append(
          "deleteMediaAnswer",
          JSON.stringify(validEntries)
        );
      }
    }

    // Append media files
    questionMediaFiles.forEach(file => {
      formDataToSubmit.append("questionMedia", file);
    });

    mediaAnswerFiles.forEach(file => {
      formDataToSubmit.append("mediaAnswer", file);
    });

    return formDataToSubmit;
  };

  return {
    formData,
    errors,
    questionMediaFiles,
    mediaAnswerFiles,
    questionMediaPreviews,
    mediaAnswerPreviews,
    validateForm,
    prepareFormData,
    resetForm,
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
  };
};

export default useQuestionForm;
