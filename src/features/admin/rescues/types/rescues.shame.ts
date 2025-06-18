import { z } from "zod";

export const CreateRescueSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên cuộc giải cứu"),
  rescueType: z.enum(["resurrected", "TypeB", "TypeC"]), // Thay đổi theo các rescueType thực tế
  questionFrom: z.number().int().nonnegative(),
  questionTo: z.number().int().nonnegative(),
  studentIds: z.array(z.number().int().positive()), // Mảng số nguyên dương
  supportAnswers: z.array(z.string()), // Mảng chuỗi
  remainingContestants: z.number().int().nonnegative(),
  maxStudent: z.number().int().positive(),
  index: z.number().int().nonnegative(),
  status: z.enum(["used", "", "", ""]), // Thay đổi theo trạng thái thực tế
  matchId: z.number().int().positive(),
   isActive: z.boolean().optional(),
});

export const RescueIdSchema = z.object({
  id: z.number().int().positive().nullable(),
});

export const RescueSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  rescueType: z.enum(["TypeA", "TypeB", "TypeC"]),
  questionFrom: z.number().int().nonnegative(),
  questionTo: z.number().int().nonnegative(),
  studentIds: z.array(z.number().int().positive()),
  supportAnswers: z.array(z.string()),
  remainingContestants: z.number().int().nonnegative(),
  maxStudent: z.number().int().positive(),
  index: z.number().int().nonnegative(),
  status: z.enum(["Pending", "InProgress", "Completed", "Failed"]),
  matchId: z.number().int().positive(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
   isActive: z.boolean().optional(),
});

export const UpdateRescueSchema = z.object({
  name: z.string().min(1).optional(),
  rescueType: z.enum(["TypeA", "TypeB", "TypeC"]).optional(),
  questionFrom: z.number().int().nonnegative().optional(),
  questionTo: z.number().int().nonnegative().optional(),
  studentIds: z.array(z.number().int().positive()).optional(),
  supportAnswers: z.array(z.string()).optional(),
  remainingContestants: z.number().int().nonnegative().optional(),
  maxStudent: z.number().int().positive().optional(),
  index: z.number().int().nonnegative().optional(),
  status: z.enum(["Pending", "InProgress", "Completed", "Failed"]).optional(),
  matchId: z.number().int().positive().optional(),
  // Không cập nhật createdAt và updatedAt qua API này
   isActive: z.boolean().optional(),
});

export const Role = {
  Admin: "Admin",
  Judge: "Judge",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export type RescueQuery = {
  page?: number; // trang hiện tại, mặc định 1
  limit?: number; // số item trên 1 trang, mặc định 10
  search?: string; // chuỗi tìm kiếm, có thể không truyền
  isActive?: boolean; // trạng thái active, true hoặc false hoặc undefined
  role?: Role;
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

export const deleteRescueSchema = z.object({
  ids: z
    .array(z.number().int().positive("ID phải là số nguyên dương"))
    .min(1, "Phải chọn ít nhất 1 ID để xoá"),
});

export type Rescue = z.infer<typeof RescueSchema>;
export type CreateRescueInput = z.infer<typeof CreateRescueSchema>;
export type UpdateRescueInput = z.infer<typeof UpdateRescueSchema>;
export type RescueIdParam = z.infer<typeof RescueIdSchema>;
export type deleteRescueType = z.infer<typeof deleteRescueSchema>;