import { z } from "zod";
export const CreateStudentSchema = z.object({
  fullName: z
    .string()
    .min(3, "Họ và tên ít nhất 3 kí tự")
    .max(50, "Họ và tên tối đa 50 kí tự"),
  studentCode: z
    .string()
    .transform(val => (val.trim() === "" ? undefined : val))
    .optional(),
  classId: z.number({
    required_error: "Vui lòng chọn lớp học",
    invalid_type_error: "Lớp học không hợp lệ",
  }),
  isActive: z.boolean(),
  userId: z.number({
    required_error: "Vui lòng chọn tài khoản học sinh",
    invalid_type_error: "Vui lòng chọn tài khoản học sinh",
  }),
  avatar: z.string().optional().nullable(),
  bio: z
    .string()
    .optional()
    .nullable()
    .refine(
      val => !val || val === "" || z.string().url().safeParse(val).success,
      {
        message: "Vui lòng nhập link video giới thiệu hợp lệ",
      }
    ),
});

export type ClassItem = {
  id: number;
  name: string;
  isActive: boolean;
  shoolName: string;
};

export const StudentIdShema = z.object({
  id: z.number().nullable(),
});

export const StudentShema = z.object({
  id: z.number(),
  fullName: z.string(),
  studentCode: z.string(),
  isActive: z.boolean(),
  className: z.string(),
});

export const UpdateStudentSchema = z.object({
  fullName: z.string().min(3).max(50).optional(),
  studentCode: z
    .string()
    .transform(val => (val.trim() === "" ? undefined : val))
    .optional(),

  classId: z.number({ required_error: "Vui lòng chọn lớp học" }),
  isActive: z.boolean().optional(),
  bio: z
    .string()
    .optional()
    .nullable()
    .refine(
      val => !val || val === "" || z.string().url().safeParse(val).success,
      {
        message: "Vui lòng nhập link video giới thiệu hợp lệ",
      }
    ),

  avatar: z.string().optional().nullable(),
  userId: z
    .number({
      required_error: "Vui lòng chọn tài khoản học sinh",
      invalid_type_error: "Vui lòng chọn tài khoản học sinh",
    })
    .optional(),
});

export const ImportExcelSchema = z.object({
  file: z.instanceof(FileList).refine(files => files.length > 0, {
    message: "Vui lòng chọn một file Excel",
  }),
});

export type StudentQuery = {
  page?: number; // trang hiện tại, mặc định 1
  limit?: number; // số item trên 1 trang, mặc định 10
  search?: string; // chuỗi tìm kiếm, có thể không truyền
  isActive?: boolean; // trạng thái active, true hoặc false hoặc undefined
  classId?: number;
};

type ActiveOption = {
  label: string;
  value: boolean | ""; // có thể là true, false hoặc ""
};

export const ActiveOptions: ActiveOption[] = [
  { label: "Đang hoạt động", value: true },
  { label: "Tất cả", value: "" },
  { label: "Không hoạt động", value: false },
];

export type pagination = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
};

export const deleteStudentsSchema = z.object({
  ids: z
    .array(z.number().int().positive("ID phải là số nguyên dương"))
    .min(1, "Phải chọn ít nhất 1 ID để xoá"),
});

export type Student = z.infer<typeof StudentShema>;
export type CreateStudentInput = z.infer<typeof CreateStudentSchema>;
export type UpdateStudentInput = z.infer<typeof UpdateStudentSchema>;
export type StudentIdParam = z.infer<typeof StudentIdShema>;
export type deleteStudentsType = z.infer<typeof deleteStudentsSchema>;
export type ImportExcelInput = z.infer<typeof ImportExcelSchema>;
