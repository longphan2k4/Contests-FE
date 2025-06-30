import { z } from 'zod';

// Enum cho loại câu hỏi
export const QuestionTypeEnum = z.enum(['multiple_choice', 'essay']);

// Enum cho độ khó
export const DifficultyEnum = z.enum(['Alpha', 'Beta', 'Rc', 'Gold']);

// Enum cho loại media
export const MediaTypeEnum = z.enum(['image', 'video', 'audio']);

// Schema validation cho file media
export const mediaFileSchema = z.object({
  name: z.string(),
  size: z.number(),
  type: z.string()
}).refine((file) => {
  // Validate image files
  if (file.type.startsWith('image/')) {
    const allowedImageTypes = /^image\/(jpeg|jpg|png|gif|webp|svg\+xml)$/;
    const maxImageSize = 30 * 1024 * 1024; // 30MB
    
    if (!allowedImageTypes.test(file.type)) {
      return false;
    }
    if (file.size > maxImageSize) {
      return false;
    }
  }
  
  // Validate video files
  else if (file.type.startsWith('video/')) {
    const allowedVideoTypes = /^video\/(mp4|avi|quicktime|x-ms-wmv|x-flv|webm|x-matroska)$/;
    const maxVideoSize = 100 * 1024 * 1024; // 100MB
    
    if (!allowedVideoTypes.test(file.type)) {
      return false;
    }
    if (file.size > maxVideoSize) {
      return false;
    }
  }
  
  // Validate audio files
  else if (file.type.startsWith('audio/')) {
    const allowedAudioTypes = /^audio\/(mpeg|wav|ogg|aac|flac|mp4)$/;
    const maxAudioSize = 50 * 1024 * 1024; // 50MB
    
    if (!allowedAudioTypes.test(file.type)) {
      return false;
    }
    if (file.size > maxAudioSize) {
      return false;
    }
  }
  
  else {
    return false;
  }
  
  return true;
}, {
  message: "File không hợp lệ hoặc vượt quá kích thước cho phép"
});

// Schema validation cho array media files
export const mediaFilesArraySchema = z.array(mediaFileSchema)
  .max(5, "Không thể tải lên quá 5 file")
  .optional()
  .refine((files) => {
    if (!files || files.length === 0) return true;
    
    // Check if all files are of the same type
    const firstFileType = files[0].type.split('/')[0];
    return files.every(file => file.type.split('/')[0] === firstFileType);
  }, {
    message: "Tất cả file phải cùng loại (ảnh, video hoặc âm thanh)"
  });

// Schema cho media
export const questionMediaSchema = z.array(z.any()).optional();

// Schema cho một lựa chọn
export const stringOptionSchema = z.string().min(1, "Lựa chọn không được để trống");

// Schema cho mảng lựa chọn
export const optionsSchema = z.array(stringOptionSchema)
  .min(2, "Phải có ít nhất 2 lựa chọn")
  .max(10, "Không được quá 10 lựa chọn")
  .refine((options) => {
    const nonEmptyOptions = options.filter(opt => opt.trim() !== '');
    return nonEmptyOptions.length >= 2;
  }, {
    message: "Phải có ít nhất 2 lựa chọn không rỗng"
  });

// Schema validation form data với media files
export const questionFormSchema = z.object({
  intro: z.string().optional(),
  defaultTime: z.coerce.number({
    required_error: "Thời gian làm bài là bắt buộc",
    invalid_type_error: "Thời gian phải là số"
  })
    .int("Thời gian phải là số nguyên")
    .min(10, "Thời gian tối thiểu là 10 giây")
    .max(1800, "Thời gian tối đa là 30 phút"),
  questionType: QuestionTypeEnum,
  content: z.string()
    .min(1, "Nội dung câu hỏi không được để trống")
    .refine((content) => {
      // Remove HTML tags and check if there's actual content
      const textContent = content.replace(/<[^>]*>/g, '').trim();
      return textContent.length > 0;
    }, {
      message: "Nội dung câu hỏi phải có văn bản thực tế"
    }),
  questionMediaFiles: mediaFilesArraySchema,
  options: z.union([
    optionsSchema,
    z.null()
  ]).optional(),
  correctAnswer: z.string()
    .min(1, "Đáp án không được để trống"),
  mediaAnswerFiles: mediaFilesArraySchema,
  score: z.coerce.number({
    required_error: "Điểm số là bắt buộc",
    invalid_type_error: "Điểm số phải là số"
  })
    .int("Điểm số phải là số nguyên")
    .min(1, "Điểm số tối thiểu là 1")
    .max(100, "Điểm số tối đa là 100"),
  difficulty: DifficultyEnum,
  explanation: z.string().optional(),
  questionTopicId: z.coerce.number({
    required_error: "Chủ đề là bắt buộc",
    invalid_type_error: "Chủ đề phải được chọn"
  })
    .int("Question Topic ID phải là số nguyên")
    .positive("Vui lòng chọn chủ đề"),
  isActive: z.boolean().default(true)
}).refine((data) => {
  // Validate options based on question type
  if (data.questionType === 'multiple_choice') {
    if (!data.options || data.options.length < 2) {
      return false;
    }
    // Check if correctAnswer is one of the options
    if (!data.options.includes(data.correctAnswer)) {
      return false;
    }
  }
  return true;
}, {
  message: "Dữ liệu form không hợp lệ",
  path: ["options"]
});

// Schema tạo câu hỏi mới (cho API)
export const createQuestionSchema = z.object({
  intro: z.string().optional(),
  defaultTime: z.preprocess((val) => Number(val), z.number()
    .int("Thời gian phải là số nguyên")
    .min(10, "Thời gian tối thiểu là 10 giây")
    .max(1800, "Thời gian tối đa là 30 phút")),
  questionType: QuestionTypeEnum,
  content: z.string()
    .min(1, "Nội dung HTML không được để trống"),
  questionMedia: questionMediaSchema,
  options: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return undefined;
        }
      }
      return val;
    },
    z.union([
      optionsSchema,
      z.null()
    ])
  ).optional(),
  correctAnswer: z.string()
    .min(1, "Đáp án đúng không được để trống"),
  mediaAnswer: questionMediaSchema,
  score: z.preprocess((val) => Number(val), z.number()
    .int("Điểm phải là số nguyên")
    .min(1, "Điểm tối thiểu là 1")
    .max(100, "Điểm tối đa là 100")).default(1),
  difficulty: DifficultyEnum,
  explanation: z.string().optional().nullable(),
  questionTopicId: z.preprocess((val) => Number(val), z.number()
    .int("Question Topic ID phải là số nguyên")
    .positive("Question Topic ID phải là số dương"))
});

// Schema cập nhật câu hỏi
export const updateQuestionSchema = z.object({
  intro: z.string().optional().nullable(),
  defaultTime: z.preprocess((val) => val === undefined || val === null ? undefined : Number(val), z.number()
    .int("Thời gian phải là số nguyên")
    .min(10, "Thời gian tối thiểu là 10 giây")
    .max(1800, "Thời gian tối đa là 30 phút")).optional().nullable(),
  questionType: QuestionTypeEnum.optional(),
  content: z.string()
    .min(1, "Nội dung HTML không được để trống")
    .optional(),
  questionMedia: questionMediaSchema,
  options: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return undefined;
        }
      }
      return val;
    },
    z.union([
      optionsSchema,
      z.null()
    ])
  ).optional(),
  correctAnswer: z.string()
    .min(1, "Đáp án đúng không được để trống")
    .optional(),
  mediaAnswer: questionMediaSchema,
  score: z.preprocess((val) => val === undefined || val === null ? undefined : Number(val), z.number()
    .int("Điểm phải là số nguyên")
    .min(1, "Điểm tối thiểu là 1")
    .max(100, "Điểm tối đa là 100")).optional().nullable(),
  difficulty: DifficultyEnum.optional(),
  explanation: z.string().optional().nullable(),
  questionTopicId: z.preprocess((val) => val === undefined || val === null ? undefined : Number(val), z.number()
    .int("Question Topic ID phải là số nguyên")
    .positive("Question Topic ID phải là số dương")).optional().nullable(),
  isActive: z.preprocess(
    (val) => {
      if (val === undefined || val === null) return undefined;
      if (typeof val === 'string') {
        return val === 'true' || val === '1';
      }
      return Boolean(val);
    },
    z.boolean()
  ).optional(),
  // Trường hỗ trợ xóa media
  deleteQuestionMedia: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return [val];
        }
      }
      return val;
    },
    z.array(z.string())
  ).optional(),
  deleteMediaAnswer: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return [val];
        }
      }
      return val;
    },
    z.array(z.string())
  ).optional()
}).refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "Ít nhất một trường cần được cập nhật"
  }
);

// Schema lấy câu hỏi theo ID
export const getQuestionByIdSchema = z.object({
  id: z.string()
    .regex(/^\d+$/, "ID phải là số")
    .transform(Number)
});

// Schema xóa câu hỏi (soft delete)
export const deleteQuestionSchema = z.object({
  id: z.string()
    .regex(/^\d+$/, "ID phải là số")
    .transform(Number)
});

// Schema xóa vĩnh viễn câu hỏi
export const hardDeleteQuestionSchema = z.object({
  id: z.string()
    .regex(/^\d+$/, "ID phải là số")
    .transform(Number)
});

// Schema query lấy danh sách câu hỏi
export const getQuestionsQuerySchema = z.object({
  page: z.string()
    .regex(/^\d+$/, "Page phải là số")
    .transform(Number)
    .refine(val => val > 0, "Page phải lớn hơn 0")
    .default("1"),
  limit: z.string()
    .regex(/^\d+$/, "Limit phải là số")
    .transform(Number)
    .refine(val => val > 0 && val <= 100, "Limit phải từ 1-100")
    .default("10"),
  search: z.string().optional(),
  questionTopicId: z.string()
    .regex(/^\d+$/, "Question Topic ID phải là số")
    .transform(Number)
    .optional(),
  questionType: QuestionTypeEnum.optional(),
  difficulty: DifficultyEnum.optional(),
  hasMedia: z.string()
    .transform(val => val === "true")
    .optional(),
  isActive: z.string()
    .transform(val => val === "true")
    .optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "defaultTime", "score"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"])
    .default("desc")
});

// Schema xóa nhiều câu hỏi
export const batchDeleteQuestionsSchema = z.object({
  ids: z.array(z.number().int().positive())
    .min(1, "Danh sách ID không được để trống")
    .max(100, "Không thể xóa quá 100 câu hỏi cùng lúc"),
  hardDelete: z.boolean().default(false)
});

// Helper functions để validate media files
export const validateMediaFile = (file: File): { isValid: boolean; error?: string } => {
  try {
    mediaFileSchema.parse({
      name: file.name,
      size: file.size,
      type: file.type
    });
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0].message };
    }
    return { isValid: false, error: "File không hợp lệ" };
  }
};

export const validateMediaFiles = (files: File[]): { isValid: boolean; error?: string } => {
  try {
    mediaFilesArraySchema.parse(files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type
    })));
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0].message };
    }
    return { isValid: false, error: "Danh sách file không hợp lệ" };
  }
};

// Type exports
export type QuestionFormData = z.infer<typeof questionFormSchema>;
export type CreateQuestionData = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionData = z.infer<typeof updateQuestionSchema>; 