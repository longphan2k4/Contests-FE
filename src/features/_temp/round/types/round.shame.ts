import z from "zod";
export const RoundShema = z.object({
  id: z.number(),
  name: z.string(),
  contestName: z.string(),
  isActive: z.boolean(),
  index: z.number(),
  endTime: z.date(),
  startTime: z.date(),
});

export const CreateRoundSchema = z.object({
  name: z.string().min(1).max(255),
  startTime: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Ngày bắt đầu không hợp lệ",
  }),

  endTime: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Ngày kết thúc không hợp lệ",
  }),

  index: z.coerce
    .number({
      required_error: "Vui lòng nhập thứ tự vòng đấu",
      invalid_type_error: "Thứ tự vòng đấu phải là số",
    })
    .min(1, "Thứ tự vòng đấu phải lớn hơn 0"),

  isActive: z.boolean(),
});

export const RoundIdShame = z.object({
  id: z
    .string()
    .transform(val => parseInt(val))
    .refine(val => !isNaN(val) && val > 0, "Id là 1 số nguyên dương "),
});

export const UpdateRoundSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  startTime: z
    .string()
    .refine(val => !isNaN(Date.parse(val)), {
      message: "Ngày bắt đầu không hợp lệ",
    })
    .optional(),

  endTime: z
    .string()
    .refine(val => !isNaN(Date.parse(val)), {
      message: "Ngày kết thúc không hợp lệ",
    })
    .optional(),

  index: z.coerce.number({
    required_error: "Vui lòng nhập thứ tự vòng đấu",
    invalid_type_error: "Thứ tự vòng đấu phải là số",
  }),

  isActive: z.boolean().optional(),
});

export const RoundQuerySchema = z.object({
  page: z
    .string()
    .transform(val => parseInt(val))
    .refine(val => !isNaN(val) && val > 0, "Page phải là số nguyên dương")
    .optional()
    .default("1")
    .optional(),
  limit: z
    .string()
    .transform(val => parseInt(val))
    .refine(val => !isNaN(val) && val > 0, "Limit phải là số nguyên dương")
    .optional()
    .default("10")
    .optional(),
  search: z.string().max(100, "Từ khóa tìm kiếm tối đa 100 ký tự").optional(),
  isActive: z
    .string()
    .transform(val => val === "true")
    .optional(),
});

export const deleteRoundsSchema = z.object({
  ids: z
    .array(z.number().int().positive("ID phải là số nguyên dương"))
    .min(1, "Phải chọn ít nhất 1 ID để xoá"),
});

export type RoundById = {
  id: number;
  name: string;
  contestId: number;
  contest: { name: string };
  index: number;
  isActive: boolean;
  startTime: Date;
  endTime: Date;
};

export type pagination = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
};

export type CreateRoundInput = z.infer<typeof CreateRoundSchema>;
export type RoundIdParams = z.infer<typeof RoundIdShame>;
export type UpdateRoundInput = z.infer<typeof UpdateRoundSchema>;
export type RoundQueryInput = z.infer<typeof RoundQuerySchema>;
export type Rounds = z.infer<typeof RoundShema>;
export type DeleteRoundsInput = z.infer<typeof deleteRoundsSchema>;
