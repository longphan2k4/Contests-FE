import { z } from 'zod';

/**
 * Schema cho thống kê tổng quan
 */
export const overviewStatsSchema = z.object({
  totalQuestionDetails: z.number().int().nonnegative(),
  activeQuestionDetails: z.number().int().nonnegative(),
  inactiveQuestionDetails: z.number().int().nonnegative(),
  totalQuestions: z.number().int().nonnegative(),
  totalPackages: z.number().int().nonnegative()
});

/**
 * Schema cho thống kê theo gói
 */
export const packageStatsSchema = z.object({
  questionPackageId: z.number().int().positive(),
  packageName: z.string(),
  totalQuestions: z.number().int().nonnegative(),
  activeQuestions: z.number().int().nonnegative(),
  inactiveQuestions: z.number().int().nonnegative()
});

/**
 * Schema cho thống kê theo câu hỏi
 */
export const questionStatsSchema = z.object({
  questionId: z.number().int().positive(),
  questionTitle: z.string(),
  totalPackages: z.number().int().nonnegative(),
  activeInPackages: z.number().int().nonnegative(),
  inactiveInPackages: z.number().int().nonnegative()
});

/**
 * Schema cho toàn bộ thống kê
 */
export const questionDetailStatsSchema = z.object({
  overview: overviewStatsSchema,
  packageStats: z.array(packageStatsSchema),
  questionStats: z.array(questionStatsSchema)
});

/**
 * Schema cho tham số filter thống kê
 */
export const statsFilterSchema = z.object({
  questionPackageId: z.number().int().positive().optional(),
  timeRange: z.enum(['day', 'week', 'month', 'year']).optional()
}); 