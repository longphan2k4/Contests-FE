import { useState, useEffect } from 'react';
import type { Question } from '../types';
import type { QuestionFormValues, QuestionFormErrors } from '../components/QuestionDialogForm';

interface QuestionTopic {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
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
  });

  const [errors, setErrors] = useState<QuestionFormErrors>({});
  const [questionMediaFiles, setQuestionMediaFiles] = useState<File[]>([]);
  const [mediaAnswerFiles, setMediaAnswerFiles] = useState<File[]>([]);

  useEffect(() => {
    if (question && (mode === 'edit' || mode === 'view')) {
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
      });
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
      });
    }
    
    // Reset files
    setQuestionMediaFiles([]);
    setMediaAnswerFiles([]);
    setErrors({});
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

  const prepareFormData = (): FormData => {
    const submitFormData = new FormData();
    
    // Add all form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'options' && Array.isArray(value)) {
          submitFormData.append('options', JSON.stringify(value));
        } else {
          submitFormData.append(key, value.toString());
        }
      }
    });
    
    // Add media files
    questionMediaFiles.forEach(file => {
      submitFormData.append('questionMedia', file);
    });
    
    mediaAnswerFiles.forEach(file => {
      submitFormData.append('mediaAnswer', file);
    });

    return submitFormData;
  };

  return {
    formData,
    errors,
    questionMediaFiles,
    mediaAnswerFiles,
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
  };
}; 