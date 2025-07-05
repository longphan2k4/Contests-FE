import { z } from "zod";
export const CreateClassVideoSchema = z.object({
  name: z.string().min(1, "Tên video không được bỏ trống"),
  slogan: z.string().optional(),
  classId: z.number().int().positive("ID lớp phải là số nguyên dương"),
  videos: z
    .any()
    .refine(val => val instanceof FileList && val.length > 0, {
      message: "Bạn phải chọn một video",
    })
    .transform(val => val[0]), // 👉 Lấy ra file đầu tiên
});

export const ClassVideoIdShema = z.object({
  id: z.number().nullable(),
});

export const ClassVideoShema = z.object({
  id: z.number(),
  name: z.string(),
  slogan: z.string().nullable().optional(),
  classId: z.number(),
  contestId: z.number(),
  videos: z.any(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const UpdateClassVideoSchema = z.object({
  name: z.string().optional(),
  slogan: z.string().optional(),
  videos: z.any(),
  classId: z
    .number()
    .int()
    .positive("ID lớp phải là số nguyên dương")
    .optional(),
});

export type ClassVideoQuery = {
  page?: number;
  limit?: number;
  search?: string;
  classId?: number;
  contestId?: number;
};

export type pagination = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
};

export const deleteClassVideosSchema = z.object({
  ids: z
    .array(z.number().int().positive("ID phải là số nguyên dương"))
    .min(1, "Phải chọn ít nhất 1 ID để xoá"),
});

export type ClassVideo = z.infer<typeof ClassVideoShema>;
export type CreateClassVideoInput = z.infer<typeof CreateClassVideoSchema>;
export type UpdateClassVideoInput = z.infer<typeof UpdateClassVideoSchema>;
export type ClassVideoIdParam = z.infer<typeof ClassVideoIdShema>;
export type deleteClassVideosType = z.infer<typeof deleteClassVideosSchema>;
