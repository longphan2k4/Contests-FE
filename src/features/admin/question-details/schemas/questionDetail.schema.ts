import { z } from 'zod';

/**
 * Schema cho validation đối tượng QuestionDetail khi tạo mới
 */
export const questionDetailCreateSchema = z.object({
  questionId: z.number().int().positive('ID câu hỏi phải là số nguyên dương'),
  questionPackageId: z.number().int().positive('ID gói câu hỏi phải là số nguyên dương'),
  questionOrder: z.number().int().nonnegative('Thứ tự câu hỏi phải là số nguyên không âm'),
  isActive: z.boolean()
}).strict();

/**
 * Schema cho validation đối tượng QuestionDetail khi cập nhật
 */
export const questionDetailUpdateSchema = z.object({
  questionId: z.number().int().positive('ID câu hỏi phải là số nguyên dương'),
  questionPackageId: z.number().int().positive('ID gói câu hỏi phải là số nguyên dương'),
  questionOrder: z.number().int().nonnegative('Thứ tự câu hỏi phải là số nguyên không âm'),
  isActive: z.boolean()
}).strict();

/**
 * Schema cho validation đối tượng khi reorder
 */
export const questionOrderUpdateSchema = z.object({
  questionId: z.number().int().positive('ID câu hỏi phải là số nguyên dương'),
  questionOrder: z.number().int().nonnegative('Thứ tự câu hỏi phải là số nguyên không âm')
});

export const reorderRequestSchema = z.object({
  questionPackageId: z.number().int().positive('ID gói câu hỏi phải là số nguyên dương'),
  questionOrders: z.array(questionOrderUpdateSchema).min(1, 'Cần ít nhất một câu hỏi để sắp xếp lại')
});

/**
 * Schema cho validation filter
 */
export const questionDetailFilterSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100, 'Giới hạn tối đa là 100 mục').optional(),
  questionId: z.number().int().positive().optional(),
  questionPackageId: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
  search: z.string().max(255).optional()
}); 