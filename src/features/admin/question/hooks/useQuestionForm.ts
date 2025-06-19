import { useState, useEffect } from 'react';
import type { Question } from '../types';
import type { QuestionTopic } from '../components/QuestionDialog';

// Định nghĩa các loại file được phép
export const ALLOWED_TYPES = {
  image: {
    extensions: /jpeg|jpg|png|gif|webp|svg/,
    mimeTypes: /^image\/(jpeg|jpg|png|gif|webp|svg\+xml)$/,
    maxSize: 5 * 1024 * 1024, // 5MB
  },
  video: {
    extensions: /mp4|avi|mov|wmv|flv|webm|mkv/,
    mimeTypes: /^video\/(mp4|avi|quicktime|x-ms-wmv|x-flv|webm|x-matroska)$/,
    maxSize: 100 * 1024 * 1024, // 100MB
  },
  audio: {
    extensions: /mp3|wav|ogg|aac|flac|m4a/,
    mimeTypes: /^audio\/(mp3|wav|ogg|aac|flac|mp4|x-m4a)$/,
    maxSize: 20 * 1024 * 1024, // 20MB
  }
};

interface QuestionFormValues {
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
  mode: 'view' | 'edit' | 'create';
  topics: QuestionTopic[];
}

export const useQuestionForm = ({ question, mode }: UseQuestionFormProps) => {
  const [formData, setFormData] = useState<QuestionFormValues>({
    intro: '',
    defaultTime: 30,
    questionType: 'multiple_choice',
    content: '',
    options: ['', ''],
    correctAnswer: '',
    score: 1,
    difficulty: 'Alpha',
    explanation: '',
    questionTopicId: 0,
    isActive: true,
    deleteQuestionMedia: [],
    deleteMediaAnswer: [],
  });

  const [errors, setErrors] = useState<QuestionFormErrors>({});
  const [questionMediaFiles, setQuestionMediaFiles] = useState<File[]>([]);
  const [mediaAnswerFiles, setMediaAnswerFiles] = useState<File[]>([]);
  const [questionMediaPreviews, setQuestionMediaPreviews] = useState<MediaFilePreview[]>([]);
  const [mediaAnswerPreviews, setMediaAnswerPreviews] = useState<MediaFilePreview[]>([]);

  // Kiểm tra loại file có hợp lệ không
  const isValidFileType = (file: File): { valid: boolean; type: 'image' | 'video' | 'audio' | null; message?: string } => {
    // Kiểm tra file là image
    if (ALLOWED_TYPES.image.mimeTypes.test(file.type)) {
      if (file.size > ALLOWED_TYPES.image.maxSize) {
        return { valid: false, type: 'image', message: `Kích thước ảnh không được vượt quá 5MB` };
      }
      return { valid: true, type: 'image' };
    }
    
    // Kiểm tra file là video
    if (ALLOWED_TYPES.video.mimeTypes.test(file.type)) {
      if (file.size > ALLOWED_TYPES.video.maxSize) {
        return { valid: false, type: 'video', message: `Kích thước video không được vượt quá 100MB` };
      }
      return { valid: true, type: 'video' };
    }
    
    // Kiểm tra file là audio
    if (ALLOWED_TYPES.audio.mimeTypes.test(file.type)) {
      if (file.size > ALLOWED_TYPES.audio.maxSize) {
        return { valid: false, type: 'audio', message: `Kích thước âm thanh không được vượt quá 20MB` };
      }
      return { valid: true, type: 'audio' };
    }
    
    return { valid: false, type: null, message: 'Định dạng file không được hỗ trợ' };
  };

  // Kiểm tra xem các file có cùng loại không
  const areFilesOfSameType = (files: File[]): boolean => {
    if (files.length <= 1) return true;
    
    const firstFileType = files[0].type.split('/')[0]; // 'image', 'video', 'audio'
    return files.every(file => file.type.split('/')[0] === firstFileType);
  };

  // Kiểm tra xem file mới có cùng loại với file đã tồn tại không
  const isCompatibleWithExistingFiles = (
    file: File, 
    existingPreviews: MediaFilePreview[],
    newFiles: File[]
  ): boolean => {
    // Kiểm tra với existing files
    if (existingPreviews.length > 0) {
      const fileType = file.type.split('/')[0]; // 'image', 'video', 'audio'
      const existingType = existingPreviews[0].type.split('/')[0];
      return fileType === existingType;
    }
    
    // Kiểm tra với new files đã có
    if (newFiles.length > 0) {
      const fileType = file.type.split('/')[0];
      const newFileType = newFiles[0].type.split('/')[0];
      return fileType === newFileType;
    }
    
    return true; // Nếu chưa có file nào thì cho phép
  };

  useEffect(() => {
    console.log('🔄 useQuestionForm useEffect triggered:', { question, mode });
    
    if (question && (mode === 'view' || mode === 'edit')) {
      console.log('📋 Setting form data for question:', question);
      console.log('🎬 Question media:', question.questionMedia);
      console.log('🎵 Media answer:', question.mediaAnswer);
      
      const initialFormData: QuestionFormValues = {
        intro: question.intro || '',
        defaultTime: question.defaultTime || 30,
        questionType: question.questionType as 'multiple_choice' | 'essay',
        content: question.content || '',
        options: question.options || ['', ''],
        correctAnswer: question.correctAnswer || '',
        score: question.score || 1,
        difficulty: question.difficulty as 'Alpha' | 'Beta' | 'Rc' | 'Gold',
        explanation: question.explanation || '',
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
        console.log('🖼️ Processing question media:', question.questionMedia);
        const previews = question.questionMedia.map((media, index) => ({
          id: `existing-question-media-${media.filename}-${index}`, // Sử dụng filename và index để tạo unique id
          url: media.url || '',
          name: media.filename || `file-${index}`,
          type: media.mimeType || 'application/octet-stream',
          size: media.size || 0
        }));
        console.log('📸 Question media previews created:', previews);
        setQuestionMediaPreviews(previews);
      } else {
        console.log('❌ No question media found');
        setQuestionMediaPreviews([]);
      }

      if (question.mediaAnswer && question.mediaAnswer.length > 0) {
        console.log('🎯 Processing media answer:', question.mediaAnswer);
        const previews = question.mediaAnswer.map((media, index) => ({
          id: `existing-media-answer-${media.filename}-${index}`, // Sử dụng filename và index để tạo unique id
          url: media.url || '',
          name: media.filename || `file-${index}`,
          type: media.mimeType || 'application/octet-stream',
          size: media.size || 0
        }));
        console.log('🎬 Media answer previews created:', previews);
        setMediaAnswerPreviews(previews);
      } else {
        console.log('❌ No media answer found');
        setMediaAnswerPreviews([]);
      }
    } else if (mode === 'create') {
      console.log('🆕 Create mode - resetting form');
      // Reset toàn bộ khi tạo mới
      resetForm();
    } else {
      console.log('⚠️ No action taken - question or mode invalid');
    }
  }, [question, mode]); // Dependency chính xác để trigger khi question hoặc mode thay đổi

  // Hàm reset form
  const resetForm = () => {
    setFormData({
      intro: '',
      defaultTime: 30,
      questionType: 'multiple_choice',
      content: '',
      options: ['', ''],
      correctAnswer: '',
      score: 1,
      difficulty: 'Alpha',
      explanation: '',
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
    setFormData(prev => ({ ...prev, [name]: value }));
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
    const newOptions = [...(formData.options || []), ''];
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const removeOption = (index: number) => {
    const newOptions = [...(formData.options || [])];
    newOptions.splice(index, 1);
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const handleQuestionMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    
    // Kiểm tra kích thước và loại file
    const invalidFiles = files.filter(file => !isValidFileType(file).valid);
    if (invalidFiles.length > 0) {
      const invalidFileNames = invalidFiles.map(f => f.name).join(', ');
      alert(`Một số file không hợp lệ: ${invalidFileNames}`);
      return;
    }
    
    // Kiểm tra xem các file có cùng loại không
    if (!areFilesOfSameType(files)) {
      alert('Tất cả các file phải cùng loại (ảnh, video hoặc âm thanh)');
      return;
    }
    
    // Kiểm tra xem file mới có tương thích với file đã tồn tại không
    const incompatibleFiles = files.filter(file => 
      !isCompatibleWithExistingFiles(file, questionMediaPreviews, questionMediaFiles)
    );
    if (incompatibleFiles.length > 0) {
      const currentType = questionMediaPreviews.length > 0 
        ? questionMediaPreviews[0].type.split('/')[0]
        : questionMediaFiles.length > 0 
        ? questionMediaFiles[0].type.split('/')[0]
        : null;
      
      const typeNames = {
        'image': 'ảnh',
        'video': 'video', 
        'audio': 'âm thanh'
      };
      
      alert(`Không thể thêm file khác loại. Chỉ có thể thêm ${typeNames[currentType as keyof typeof typeNames]} khi đã có file cùng loại.`);
      return;
    }
    
    // Kiểm tra số lượng file
    if (files.length + questionMediaFiles.length + questionMediaPreviews.length > 5) {
      alert('Không thể thêm quá 5 file media');
      return;
    }
    
    setQuestionMediaFiles(prev => [...prev, ...files]);
  };

  const handleMediaAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    
    // Kiểm tra kích thước và loại file
    const invalidFiles = files.filter(file => !isValidFileType(file).valid);
    if (invalidFiles.length > 0) {
      const invalidFileNames = invalidFiles.map(f => f.name).join(', ');
      alert(`Một số file không hợp lệ: ${invalidFileNames}`);
      return;
    }
    
    // Kiểm tra xem các file có cùng loại không
    if (!areFilesOfSameType(files)) {
      alert('Tất cả các file phải cùng loại (ảnh, video hoặc âm thanh)');
      return;
    }
    
    // Kiểm tra xem file mới có tương thích với file đã tồn tại không
    const incompatibleFiles = files.filter(file => 
      !isCompatibleWithExistingFiles(file, mediaAnswerPreviews, mediaAnswerFiles)
    );
    if (incompatibleFiles.length > 0) {
      const currentType = mediaAnswerPreviews.length > 0 
        ? mediaAnswerPreviews[0].type.split('/')[0]
        : mediaAnswerFiles.length > 0 
        ? mediaAnswerFiles[0].type.split('/')[0]
        : null;
      
      const typeNames = {
        'image': 'ảnh',
        'video': 'video', 
        'audio': 'âm thanh'
      };
      
      alert(`Không thể thêm file khác loại. Chỉ có thể thêm ${typeNames[currentType as keyof typeof typeNames]} khi đã có file cùng loại.`);
      return;
    }
    
    // Kiểm tra số lượng file
    if (files.length + mediaAnswerFiles.length + mediaAnswerPreviews.length > 5) {
      alert('Không thể thêm quá 5 file media');
      return;
    }
    
    setMediaAnswerFiles(prev => [...prev, ...files]);
  };

  const removeQuestionMedia = (index: number) => {
    const newFiles = [...questionMediaFiles];
    newFiles.splice(index, 1);
    setQuestionMediaFiles(newFiles);
  };

  const removeMediaAnswer = (index: number) => {
    const newFiles = [...mediaAnswerFiles];
    newFiles.splice(index, 1);
    setMediaAnswerFiles(newFiles);
  };

  const removeQuestionMediaPreview = (index: number) => {
    const mediaToDelete = questionMediaPreviews[index];
    setFormData(prev => ({
      ...prev,
      deleteQuestionMedia: [...(prev.deleteQuestionMedia || []), mediaToDelete.name]
    }));
    const newPreviews = [...questionMediaPreviews];
    newPreviews.splice(index, 1);
    setQuestionMediaPreviews(newPreviews);
  };

  const removeMediaAnswerPreview = (index: number) => {
    const mediaToDelete = mediaAnswerPreviews[index];
    setFormData(prev => ({
      ...prev,
      deleteMediaAnswer: [...(prev.deleteMediaAnswer || []), mediaToDelete.name]
    }));
    const newPreviews = [...mediaAnswerPreviews];
    newPreviews.splice(index, 1);
    setMediaAnswerPreviews(newPreviews);
  };

  const validateForm = () => {
    const newErrors: QuestionFormErrors = {};

    // Validate required fields
    if (!formData.content.trim()) {
      newErrors.content = 'Nội dung câu hỏi là bắt buộc';
    }

    if (!formData.correctAnswer.trim()) {
      newErrors.correctAnswer = 'Đáp án là bắt buộc';
    }

    if (!formData.questionTopicId) {
      newErrors.questionTopicId = 'Chủ đề là bắt buộc';
    }

    if (!formData.score || formData.score <= 0) {
      newErrors.score = 'Điểm số phải lớn hơn 0';
    }

    if (!formData.defaultTime || formData.defaultTime < 10) {
      newErrors.defaultTime = 'Thời gian làm bài phải ít nhất 10 giây';
    }

    // Validate options for multiple choice questions
    if (formData.questionType === 'multiple_choice') {
      if (!formData.options || formData.options.length < 2) {
        newErrors.options = 'Phải có ít nhất 2 lựa chọn';
      } else {
        const emptyOptions = formData.options.filter(opt => !opt.trim()).length;
        if (emptyOptions > 0) {
          newErrors.options = 'Các lựa chọn không được để trống';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const prepareFormData = (data: QuestionFormValues) => {
    const formDataToSubmit = new FormData();
    
    // Append basic fields
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'options' && key !== 'deleteQuestionMedia' && key !== 'deleteMediaAnswer') {
        formDataToSubmit.append(key, value.toString());
      }
    });
    
    // Append options as JSON string
    if (data.options) {
      formDataToSubmit.append('options', JSON.stringify(data.options));
    }
    
    // Append files to delete - chỉ gửi các mảng có giá trị hợp lệ
    if (data.deleteQuestionMedia && data.deleteQuestionMedia.length > 0) {
      const validEntries = data.deleteQuestionMedia.filter(item => item && item.trim() !== '');
      if (validEntries.length > 0) {
        formDataToSubmit.append('deleteQuestionMedia', JSON.stringify(validEntries));
      }
    }
    
    if (data.deleteMediaAnswer && data.deleteMediaAnswer.length > 0) {
      const validEntries = data.deleteMediaAnswer.filter(item => item && item.trim() !== '');
      if (validEntries.length > 0) {
        formDataToSubmit.append('deleteMediaAnswer', JSON.stringify(validEntries));
      }
    }
    
    // Append media files
    questionMediaFiles.forEach(file => {
      formDataToSubmit.append('questionMedia', file);
    });
    
    mediaAnswerFiles.forEach(file => {
      formDataToSubmit.append('mediaAnswer', file);
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