import { z } from 'zod';

// Create Question Topic Schema
export const CreateQuestionTopicSchema = z.object({
  name: z
    .string()
    .min(1, "Tên chủ đề là bắt buộc")
    .min(3, "Tên chủ đề phải có ít nhất 3 ký tự")
    .max(255, "Tên chủ đề không được vượt quá 255 ký tự")
    .trim(),
  isActive: z.boolean().optional().default(true),
});

// Update Question Topic Schema
export const UpdateQuestionTopicSchema = z.object({
  name: z
    .string()
    .min(3, "Tên chủ đề phải có ít nhất 3 ký tự")
    .max(255, "Tên chủ đề không được vượt quá 255 ký tự")
    .trim()
    .optional(),
  isActive: z.boolean().optional(),
});

// Question Topic ID Schema
export const QuestionTopicIdSchema = z.object({
  id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "ID phải là số nguyên dương",
    }),
});

// Query Schema for filtering and pagination
export const QuestionTopicQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Trang phải là số nguyên dương",
    }),
  limit: z
    .string()
    .optional()
    .default("10")
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0 && val <= 100, {
      message: "Giới hạn phải là số nguyên dương và không quá 100",
    }),
  search: z.string().optional(),
  isActive: z
    .string()
    .optional()
    .transform((val) => {
      if (val === undefined) return undefined;
      return val === "true";
    }),
  sortBy: z.enum(["name", "createdAt", "updatedAt"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

// TypeScript types
export type CreateQuestionTopicInput = z.infer<typeof CreateQuestionTopicSchema>;
export type UpdateQuestionTopicInput = z.infer<typeof UpdateQuestionTopicSchema>;
export type QuestionTopicQueryInput = z.infer<typeof QuestionTopicQuerySchema>;
export type QuestionTopicIdInput = z.infer<typeof QuestionTopicIdSchema>; 