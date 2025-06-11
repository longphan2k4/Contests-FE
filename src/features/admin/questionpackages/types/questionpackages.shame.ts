import { z } from "zod";

export const CreateUpdateQuestionPackageSchema = z.object({
  name: z.string().min(1, "Tên gói câu hỏi không được để trống"),
  isActive: z.boolean(),  // Bắt buộc luôn
});

export type CreateUpdateQuestionPackageInput = z.infer<typeof CreateUpdateQuestionPackageSchema>;

// Các schema cũ vẫn giữ nguyên
export const QuestionPackageSchema = z.object({
  id: z.number(),
  name: z.string(),
  isActive: z.boolean(),
  questionDetailsCount: z.number(),
  matchesCount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const QuestionPackageListSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(QuestionPackageSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
  timestamp: z.string(),
});

export type QuestionPackage = z.infer<typeof QuestionPackageSchema>;
export type QuestionPackageList = z.infer<typeof QuestionPackageListSchema>;
