import { z } from 'zod';

/**
 * Schema validation cho AboutData
 */
export const aboutDataSchema = z.object({
  schoolName: z.string({
    required_error: 'Vui lòng nhập tên đơn vị',
    invalid_type_error: 'Tên đơn vị phải là chuỗi'
  }).min(1, 'Vui lòng nhập tên đơn vị'),

  departmentName: z.string({
    required_error: 'Vui lòng nhập tên phòng ban',
    invalid_type_error: 'Tên phòng ban phải là chuỗi'
  }).min(1, 'Vui lòng nhập tên phòng ban'),

  email: z.string({
    required_error: 'Vui lòng nhập email',
    invalid_type_error: 'Email không hợp lệ'
  }).email('Email không hợp lệ').optional().or(z.literal('')),


  website: z.string().url('Website không hợp lệ').optional().or(z.literal('')),


  fanpage: z.string().url('Đường dẫn Fanpage không hợp lệ').optional().or(z.literal('')),


  mapEmbedCode: z.string().optional(),

  logo: z.string().optional().or(z.literal('')),

  banner: z.string().optional().or(z.literal('')),

  isActive: z.boolean().default(true)
});

/**
 * Schema validation cho About
 */
export const aboutSchema = z.object({
  id: z.number(),
  schoolName: z
    .string()
    .min(1, 'Tên đơn vị không được để trống')
    .max(100, 'Tên đơn vị không được quá 100 ký tự'),
  departmentName: z
    .string()
    .min(1, 'Tên phòng ban không được để trống')
    .max(100, 'Tên phòng ban không được quá 100 ký tự'),
  email: z
    .string()
    .email('Email không hợp lệ')
    .optional()
    .nullable()
    .or(z.literal('')),
  website: z
    .string()
    .url('Website không hợp lệ')
    .optional()
    .nullable()
    .or(z.literal('')),
  fanpage: z
    .string()
    .url('Fanpage không hợp lệ')
    .optional()
    .nullable()
    .or(z.literal('')),
  mapEmbedCode: z.string().optional().nullable().or(z.literal('')),
  logo: z.string().optional().nullable().or(z.literal('')),
  banner: z.string().optional().nullable().or(z.literal('')),
  isActive: z.boolean().optional().default(true),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export type AboutValidationSchema = z.infer<typeof aboutSchema>;
