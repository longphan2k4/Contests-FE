import { boolean, number, z } from "zod";
export const CreateClassSchema = z.object({
  name: z
    .string({
      required_error: "Vui lòng nhập tên trường",
      invalid_type_error: "Vui lòng kí tự chuỗi",
    })
    .min(3, "Tên tài khoản ít nhất 3 kí tự")
    .max(255, "Tên tài tối đa 255 kí tự"),
  isActive: z.boolean(),
  schoolId: z.number(),
});

export const ClassIdShema = z.object({
  id: z.number().nullable(),
});

export const ClassShema = z.object({
  id: z.number(),
  name: z.string(),
  shoolName: z.string(),
  isActive: boolean(),
});

export const UpdateClassSchema = z.object({
  name: z
    .string({
      required_error: "Vui lòng nhập tên trường",
      invalid_type_error: "Vui lòng nhập kí tự chuỗi",
    })
    .min(3, "Tên tài khoản ít nhất 3 kí tự")
    .max(255, "Tên tài tối đa 255 kí tự")
    .optional(),
  isActive: z.boolean().optional(),
  schoolId: z.number().optional(),
});

export type ClassQuery = {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  schoolId?: number;
};

export type pagination = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
};

export const deletecClasseschema = z.object({
  ids: z
    .array(z.number().int().positive("ID phải là số nguyên dương"))
    .min(1, "Phải chọn ít nhất 1 ID để xoá"),
});

export type listSChool = {
  id: number;
  name: string;
};

export type Classes = z.infer<typeof ClassShema>;
export type CreateClassInput = z.infer<typeof CreateClassSchema>;
export type UpdateClassInput = z.infer<typeof UpdateClassSchema>;
export type ClassIdParam = z.infer<typeof ClassIdShema>;
export type deleteClasssType = z.infer<typeof deletecClasseschema>;
