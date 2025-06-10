import { z } from "zod";

// Tạo học sinh
export const CreateStudentSchema = z.object({
  fullName: z
    .string()
    .min(1, "Vui lòng nhập họ và tên"),
  studentCode: z
    .string()
    .min(1, "Vui lòng nhập mã học sinh"),
  classId: z
    .string({ invalid_type_error: "Vui lòng chọn lớp" }), // ✅ Thêm dòng này
  isActive: z.boolean(),
});



// ID học sinh (dùng để lấy, cập nhật, xóa)
export const StudentIdSchema = z.object({
  id: z.number().nullable(),
});

// Thông tin học sinh đầy đủ
export const StudentItemSchema = z.object({
  id: z.number(),
  fullName: z.string(),
  studentCode: z.string().optional(),
  isActive: z.boolean(),
  classId: z.number(),
  className: z.string(),
});

// Schema cho phân trang
export const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
});

// Schema cho phần data
export const StudentsDataSchema = z.object({
  students: z.array(StudentItemSchema),
  pagination: PaginationSchema,
});

// Schema root cho response
export const StudentsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: StudentsDataSchema,
  timestamp: z.string(),
});
// Cập nhật học sinh
export const UpdateStudentSchema = z.object({
  fullName: z
    .string()
    .min(3, "Họ tên phải có ít nhất 3 ký tự")
    .max(100, "Họ tên tối đa 100 ký tự")
    .optional(),
  studentCode: z
    .string()
    .min(3, "Mã học sinh phải có ít nhất 3 ký tự")
    .max(20, "Mã học sinh tối đa 20 ký tự")
    .optional(),
    isActive: z.boolean().optional(),
  classId: z.number({ invalid_type_error: "Vui lòng chọn lớp" }).optional(),
  
});


export type Student = z.infer<typeof StudentItemSchema>;
export type CreateStudentInput = z.infer<typeof CreateStudentSchema>;
export type UpdateStudentInput = z.infer<typeof UpdateStudentSchema>;
export type StudentIdParam = z.infer<typeof StudentIdSchema>;

