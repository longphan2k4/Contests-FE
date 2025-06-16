import { z } from "zod";

// Định nghĩa ContestStatus dưới dạng object thay vì enum
export const ContestStatus = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

// Tạo type từ object
export type ContestStatus = typeof ContestStatus[keyof typeof ContestStatus];

export const ContestIdSchema = z.object({
  id: z
    .string()
    .transform(val => parseInt(val))
    .refine(val => !isNaN(val) && val > 0, "Id là 1 số nguyên dương"),
});

export const CreateContestSchema = z.object({
  name: z.string().min(1, "Tên cuộc thi là bắt buộc"),
  rule: z.string().min(1, "Nội dung luật là bắt buộc"),
  location: z.string().min(1, "Địa điểm là bắt buộc"),
  startTime: z.string().refine(
    (val) => !isNaN(new Date(val).getTime()),
    "Ngày bắt đầu không hợp lệ"
  ),
  endTime: z.string().refine(
    (val) => !isNaN(new Date(val).getTime()),
    "Ngày kết thúc không hợp lệ"
  ),
  status: z.string().optional(),
  slogan: z.string().optional(),
  isActive: z.boolean().optional(),
}).refine(
  (data) => {
    const startDate = new Date(data.startTime);
    const endDate = new Date(data.endTime);
    return endDate > startDate;
  },
  {
    message: "Thời gian kết thúc phải sau thời gian bắt đầu",
    path: ["endTime"],
  }
);

export const UpdateContestSchema = z.object({
  name: z.string().min(1, "Tên cuộc thi là bắt buộc").optional(),
  rule: z.string().min(1, "Nội dung luật là bắt buộc").optional(),
  location: z.string().min(1, "Địa điểm là bắt buộc").optional(),
  startTime: z.string()
    .refine(
      (val) => !isNaN(new Date(val).getTime()),
      "Ngày bắt đầu không hợp lệ"
    )
    .optional(),
  endTime: z.string()
    .refine(
      (val) => !isNaN(new Date(val).getTime()),
      "Ngày kết thúc không hợp lệ"
    )
    .optional(),
  status: z.string().optional(),
  slogan: z.string().optional(),
  isActive: z.boolean().optional(),
}).refine(
  (data) => {
    if (data.startTime && data.endTime) {
      const startDate = new Date(data.startTime);
      const endDate = new Date(data.endTime);
      return endDate > startDate;
    }
    return true;
  },
  {
    message: "Thời gian kết thúc phải sau thời gian bắt đầu",
    path: ["endTime"],
  }
);

export const ContestQuerySchema = z.object({
  page: z
    .string()
    .transform(val => parseInt(val))
    .refine(val => !isNaN(val) && val > 0, "Page phải là số nguyên dương")
    .optional()
    .default("1"),
  limit: z
    .string()
    .transform(val => parseInt(val))
    .refine(val => !isNaN(val) && val > 0, "Limit phải là số nguyên dương")
    .optional()
    .default("10"),
  search: z.string().max(100, "Từ khóa tìm kiếm tối đa 100 ký tự").optional(),
  status: z.string().optional(),
});

export const DeleteContestsSchema = z.object({
  ids: z
    .array(z.number().int().positive("ID phải là số nguyên dương"))
    .min(1, "Phải chọn ít nhất 1 ID để xoá"),
});

export type ContestIdParams = z.infer<typeof ContestIdSchema>;
export type CreateContestInput = z.infer<typeof CreateContestSchema>;
export type UpdateContestInput = z.infer<typeof UpdateContestSchema>;
export type ContestQueryInput = z.infer<typeof ContestQuerySchema>;
export type DeleteContestsInput = z.infer<typeof DeleteContestsSchema>; 