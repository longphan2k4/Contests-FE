import { useState, useEffect } from 'react';
import type { Question } from '../types';
import type { QuestionFormValues, QuestionFormErrors } from '../components/QuestionDialogForm';

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

interface UseQuestionFormProps {
  question?: Question | null;
  mode: 'create' | 'edit' | 'view';
  topics: QuestionTopic[];
}

export const useQuestionForm = ({ question, mode, topics }: UseQuestionFormProps) => {
  const [formData, setFormData] = useState<QuestionFormValues>({
    intro: '',
    defaultTime: 60,
    questionType: 'multiple_choice',
    content: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    score: 10,
    difficulty: 'Alpha',
    explanation: '',
    questionTopicId: topics && topics.length > 0 ? topics[0].id : 0,
    isActive: true,
    deleteQuestionMedia: [],
    deleteMediaAnswer: [],
  });

  const [errors, setErrors] = useState<QuestionFormErrors>({});
  const [questionMediaFiles, setQuestionMediaFiles] = useState<File[]>([]);
  const [mediaAnswerFiles, setMediaAnswerFiles] = useState<File[]>([]);
  const [questionMediaPreviews, setQuestionMediaPreviews] = useState<MediaFilePreview[]>([]);
  const [mediaAnswerPreviews, setMediaAnswerPreviews] = useState<MediaFilePreview[]>([]);

  // Helper function to guess media type from URL
  const getMediaTypeFromUrl = (url: string): string => {
    const extension = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return 'image/' + extension;
    } else if (['mp4', 'webm', 'ogg'].includes(extension || '')) {
      return 'video/' + extension;
    } else if (['mp3', 'wav'].includes(extension || '')) {
      return 'audio/' + extension;
    }
    return 'application/octet-stream';
  };

  // Helper function to format media URL
  const formatMediaUrl = (url: string): string => {
    if (!url) return '';
    // Nếu URL đã là đường dẫn đầy đủ (bắt đầu bằng http), trả về nguyên bản
    if (url.startsWith('http')) return url;
    // Sử dụng URL tương đối để tránh vấn đề CORS
    return url;
  };

  useEffect(() => {
    if (question && (mode === 'edit' || mode === 'view')) {
      console.log('Question data:', question);
      console.log('Question media:', question.questionMedia);
      console.log('Media answer:', question.mediaAnswer);

      // Reset các state media
      setQuestionMediaFiles([]);
      setMediaAnswerFiles([]);
      setQuestionMediaPreviews([]);
      setMediaAnswerPreviews([]);

      setFormData({
        intro: question.intro || '',
        defaultTime: question.defaultTime,
        questionType: question.questionType,
        content: question.content,
        options: question.options || ['', '', '', ''],
        correctAnswer: question.correctAnswer,
        score: question.score,
        difficulty: question.difficulty,
        explanation: question.explanation || '',
        questionTopicId: question.questionTopicId,
        isActive: question.isActive,
        deleteQuestionMedia: [],
        deleteMediaAnswer: [],
      });

      // Xử lý questionMedia từ câu hỏi đã có
      if (question.questionMedia && Array.isArray(question.questionMedia)) {
        console.log('Processing question media:', question.questionMedia);
        const previews = question.questionMedia
          .filter(media => media && media.url && media.filename) // Chỉ lấy media có URL và filename
          .map((media: { url: string; filename: string; mimeType?: string; size?: number }, index: number) => {
            console.log('Media item:', media);
            return {
              id: `existing-question-media-${index}`,
              url: formatMediaUrl(media.url),
              name: media.filename,
              type: media.mimeType || getMediaTypeFromUrl(media.url),
              size: media.size || 0
            };
          });
        console.log('Created question media previews:', previews);
        setQuestionMediaPreviews(previews);
      }

      // Xử lý mediaAnswer từ câu hỏi đã có
      if (question.mediaAnswer && Array.isArray(question.mediaAnswer)) {
        console.log('Processing media answer:', question.mediaAnswer);
        const previews = question.mediaAnswer
          .filter(media => media && media.url && media.filename) // Chỉ lấy media có URL và filename
          .map((media: { url: string; filename: string; mimeType?: string; size?: number }, index: number) => {
            console.log('Media answer item:', media);
            return {
              id: `existing-media-answer-${index}`,
              url: formatMediaUrl(media.url),
              name: media.filename,
              type: media.mimeType || getMediaTypeFromUrl(media.url),
              size: media.size || 0
            };
          });
        console.log('Created media answer previews:', previews);
        setMediaAnswerPreviews(previews);
      }
    } else {
      // Reset form for create mode
      setFormData({
        intro: '',
        defaultTime: 60,
        questionType: 'multiple_choice',
        content: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        score: 10,
        difficulty: 'Alpha',
        explanation: '',
        questionTopicId: topics && topics.length > 0 ? topics[0].id : 0,
        isActive: true,
        deleteQuestionMedia: [],
        deleteMediaAnswer: [],
      });
      
      // Reset files and previews
      setQuestionMediaFiles([]);
      setMediaAnswerFiles([]);
      setQuestionMediaPreviews([]);
      setMediaAnswerPreviews([]);
      setErrors({});
    }
  }, [question, mode, topics]);

  const handleFormChange = (name: string, value: unknown) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      
      // Special handling for questionType
      if (name === 'questionType' && value === 'essay') {
        // Reset options for essay questions
        newData.options = null;
      }
      
      return newData;
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
    
    // Clear error when content is edited
    if (errors.content) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.content;
        return newErrors;
      });
    }
  };

  const handleExplanationChange = (explanation: string) => {
    setFormData((prev) => ({ ...prev, explanation }));
  };

  const handleOptionChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newOptions = [...(prev.options || [])];
      newOptions[index] = value;
      return { ...prev, options: newOptions };
    });
  };

  const addOption = () => {
    setFormData((prev) => {
      const newOptions = [...(prev.options || []), ''];
      return { ...prev, options: newOptions };
    });
  };

  const removeOption = (index: number) => {
    setFormData((prev) => {
      const newOptions = [...(prev.options || [])];
      newOptions.splice(index, 1);
      return { ...prev, options: newOptions };
    });
  };

  const handleQuestionMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setQuestionMediaFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleMediaAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setMediaAnswerFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeQuestionMedia = (index: number) => {
    setQuestionMediaFiles((prev) => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const removeMediaAnswer = (index: number) => {
    setMediaAnswerFiles((prev) => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const removeQuestionMediaPreview = (index: number) => {
    setQuestionMediaPreviews(prev => {
      const newPreviews = [...prev];
      const removedPreview = newPreviews.splice(index, 1)[0];
      
      console.log('Removing question media preview:', removedPreview);
      
      // Thêm filename vào danh sách cần xóa và loại bỏ trùng lặp
      setFormData(prevData => {
        const currentDeleteList = prevData.deleteQuestionMedia || [];
        const newDeleteList = [...new Set([...currentDeleteList, removedPreview.name])];
        console.log('Updated deleteQuestionMedia list:', newDeleteList);
        
        return {
          ...prevData,
          deleteQuestionMedia: newDeleteList
        };
      });
      
      return newPreviews;
    });
  };

  const removeMediaAnswerPreview = (index: number) => {
    setMediaAnswerPreviews(prev => {
      const newPreviews = [...prev];
      const removedPreview = newPreviews.splice(index, 1)[0];
      
      console.log('Removing media answer preview:', removedPreview);
      
      // Thêm filename vào danh sách cần xóa và loại bỏ trùng lặp
      setFormData(prevData => {
        const currentDeleteList = prevData.deleteMediaAnswer || [];
        const newDeleteList = [...new Set([...currentDeleteList, removedPreview.name])];
        console.log('Updated deleteMediaAnswer list:', newDeleteList);
        
        return {
          ...prevData,
          deleteMediaAnswer: newDeleteList
        };
      });
      
      return newPreviews;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.content?.trim()) {
      newErrors.content = 'Nội dung câu hỏi là bắt buộc';
    }
    
    if (!formData.questionTopicId) {
      newErrors.questionTopicId = 'Chủ đề câu hỏi là bắt buộc';
    }
    
    if (formData.questionType === 'multiple_choice') {
      if (!formData.options || formData.options.length < 2) {
        newErrors.options = 'Cần ít nhất 2 lựa chọn';
      } else if (formData.options.some(opt => !opt.trim())) {
        newErrors.options = 'Các lựa chọn không được để trống';
      }
      
      if (!formData.correctAnswer) {
        newErrors.correctAnswer = 'Đáp án đúng là bắt buộc';
      } else if (formData.options && !formData.options.includes(formData.correctAnswer)) {
        newErrors.correctAnswer = 'Đáp án đúng phải là một trong các lựa chọn';
      }
    } else { // Essay
      if (!formData.correctAnswer?.trim()) {
        newErrors.correctAnswer = 'Đáp án mẫu là bắt buộc';
      }
    }
    
    if (!formData.defaultTime || formData.defaultTime < 10 || formData.defaultTime > 1800) {
      newErrors.defaultTime = 'Thời gian làm bài phải từ 10 đến 1800 giây';
    }
    
    if (!formData.score || formData.score < 1 || formData.score > 100) {
      newErrors.score = 'Điểm số phải từ 1 đến 100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const prepareFormData = (values: QuestionFormValues): FormData => {
    const formData = new FormData();

    console.log('=== DEBUG MEDIA HANDLING ===');
    console.log('Form values:', values);
    console.log('Question media files:', questionMediaFiles);
    console.log('Media answer files:', mediaAnswerFiles);
    console.log('Question media previews:', questionMediaPreviews);
    console.log('Media answer previews:', mediaAnswerPreviews);

    // Thêm các trường text
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'isActive') {
          formData.append(key, value ? '1' : '0');
        } else if (key === 'options') {
          formData.append(key, JSON.stringify(value));
        } else if (key === 'deleteQuestionMedia' || key === 'deleteMediaAnswer') {
          // Xử lý danh sách media cần xóa và loại bỏ trùng lặp
          if (Array.isArray(value) && value.length > 0) {
            const uniqueValues = [...new Set(value)];
            console.log(`Adding ${key} to delete (unique values):`, uniqueValues);
            formData.append(key, JSON.stringify(uniqueValues));
          }
        } else if (key !== 'questionMedia' && key !== 'mediaAnswer') {
          formData.append(key, value.toString());
        }
      }
    });

    // Xử lý files mới
    if (questionMediaFiles.length > 0) {
      console.log('Adding new question media files:', questionMediaFiles);
      questionMediaFiles.forEach((file) => {
        if (file instanceof File && file.size > 0) {
          formData.append('questionMedia', file);
        }
      });
    }

    if (mediaAnswerFiles.length > 0) {
      console.log('Adding new media answer files:', mediaAnswerFiles);
      mediaAnswerFiles.forEach((file) => {
        if (file instanceof File && file.size > 0) {
          formData.append('mediaAnswer', file);
        }
      });
    }

    // Nếu có media hiện tại nhưng không có preview nào (đã xóa hết), gửi mảng rỗng
    if (question?.questionMedia && Array.isArray(question.questionMedia) && 
        question.questionMedia.length > 0 && questionMediaPreviews.length === 0) {
      const filesToDelete = question.questionMedia.map(m => m.filename);
      console.log('Deleting all question media:', filesToDelete);
      formData.append('deleteQuestionMedia', JSON.stringify(filesToDelete));
    }

    if (question?.mediaAnswer && Array.isArray(question.mediaAnswer) && 
        question.mediaAnswer.length > 0 && mediaAnswerPreviews.length === 0) {
      const filesToDelete = question.mediaAnswer.map(m => m.filename);
      console.log('Deleting all media answer:', filesToDelete);
      formData.append('deleteMediaAnswer', JSON.stringify(filesToDelete));
    }

    // Log final FormData
    console.log('Final FormData entries:');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    console.log('=== END DEBUG ===');

    return formData;
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