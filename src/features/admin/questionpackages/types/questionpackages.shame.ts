import { boolean, z } from "zod";

export const CreateQuestionPackageSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên gói câu hỏi"),
  isActive: z.boolean(),
});

export const QuestionPackageIdShema = z.object({
  id: z.number().nullable(),
});

export const QuestionPackageShema = z.object({
  id: z.number(),
  name: z.string(),
  questionDetailsCount: z.number(),
  matchesCount: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  isActive: boolean(),
});

export const UpdateQuestionPackageSchema = z.object({
  id: z.number(),
  name: z.string(),
  questionDetailsCount: z.number(),
  matchesCount: z.number(),
  isActive: z.boolean().optional(),
});

export type QuestionPackageQuery = {
  page?: number; // trang hiện tại, mặc định 1
  limit?: number; // số item trên 1 trang, mặc định 10
  search?: string; // chuỗi tìm kiếm, có thể không truyền
  isActive?: boolean; // trạng thái active, true hoặc false hoặc undefined
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

export const deleteQuestionPackagesSchema = z.object({
  ids: z
    .array(z.number().int().positive("ID phải là số nguyên dương"))
    .min(1, "Phải chọn ít nhất 1 ID để xoá"),
});

export type QuestionPackage = z.infer<typeof QuestionPackageShema>;
export type CreateQuestionPackageInput = z.infer<typeof CreateQuestionPackageSchema>;
export type UpdateQuestionPackageInput = z.infer<typeof UpdateQuestionPackageSchema>;
export type QuestionPackageIdParam = z.infer<typeof QuestionPackageIdShema>;
export type deleteQuestionPackagesType = z.infer<typeof deleteQuestionPackagesSchema>;
