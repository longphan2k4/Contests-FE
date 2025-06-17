import { z } from 'zod';

// Enum cho loại câu hỏi
export const QuestionTypeEnum = z.enum(['multiple_choice', 'essay']);

// Enum cho độ khó
export const DifficultyEnum = z.enum(['Alpha', 'Beta', 'Rc', 'Gold']);

// Schema cho media
export const questionMediaSchema = z.array(z.any()).optional();

// Schema cho một lựa chọn
export const stringOptionSchema = z.string().min(1, "Option không được để trống");

// Schema cho mảng lựa chọn
export const optionsSchema = z.array(stringOptionSchema)
  .min(2, "Phải có ít nhất 2 lựa chọn")
  .max(6, "Không được quá 6 lựa chọn");

// Schema tạo câu hỏi mới
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