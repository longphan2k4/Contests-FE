import z from "zod";

export const MatchSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Tên trận không được để trống"),
  startTime: z.coerce.date(), // Chuyển từ string nếu cần
  endTime: z.coerce.date(),
  slug: z.string().optional(), // Có thể auto-gen từ name
  remainingTime: z.number().int().optional(),
  status: z.enum(["upcoming", "ongoing", "finished"]),
  currentQuestion: z.number().int(),
  questionPackageId: z.number().int(),
  contestId: z.number().int(),
  roundName: z.string(),
  isActive: z.boolean().optional(), // Prisma đã có default
  maxContestantColumn: z.number().int().optional(),
  studentId: z.number().int().optional(),
  studentFullName: z.string(),
  contestName: z.string(),
});

export const CreateMatchSchema = z.object({
  name: z.string().min(1, "Tên trận đấu không được để trống"),
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
  slug: z.string().optional(),

  remainingTime: z.coerce
    .number({
      invalid_type_error: "Thời gian còn lại phải là số",
      required_error: "Vui lòng nhập thời gian còn lại",
    })
    .int("Thời gian còn lại phải là số nguyên")
    .nonnegative("Thời gian còn lại không hợp lệ")
    .optional(),

  currentQuestion: z.coerce
    .number({
      invalid_type_error: "Câu hỏi hiện tại phải là số",
      required_error: "Vui lòng nhập số thứ tự câu hỏi",
    })
    .int("Câu hỏi hiện tại phải là số nguyên")
    .nonnegative("Câu hỏi hiện tại không được âm"),

  questionPackageId: z.coerce
    .number({
      invalid_type_error: "Vui lòng chọn gói câu hỏi",
      required_error: "Vui lòng chọn gói câu hỏi",
    })
    .int("ID gói câu hỏi phải là số nguyên"),
  roundId: z.coerce
    .number({
      invalid_type_error: "Vui lòng chọn vòng đấu",
      required_error: "Vui lòng chọn vòng đấu",
    })
    .int("ID vòng đấu phải là số nguyên"),

  studentId: z.coerce
    .number({
      invalid_type_error: "ID sinh viên phải là số",
    })
    .int("ID sinh viên phải là số nguyên")
    .optional(),
  status: z.enum(["upcoming", "ongoing", "finished"], {
    errorMap: () => ({ message: "Vui lòng chọn trạng thái" }),
  }),

  maxContestantColumn: z.coerce
    .number({
      invalid_type_error: "Số cột hiển thị phải là số",
    })
    .int("Số cột hiển thị phải là số nguyên")
    .min(1, "Số cột hiển thị phải ít nhất là 1")
    .max(20, "Số cột hiển thị tối đa là 20")
    .optional(),

  isActive: z.boolean().optional(),
});

export const UpdateMatchSchema = z.object({
  name: z.string().min(1, "Tên trận đấu không được để trống").optional(),
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
  slug: z.string().optional(),

  remainingTime: z.coerce
    .number({
      invalid_type_error: "Thời gian còn lại phải là số",
      required_error: "Vui lòng nhập thời gian còn lại",
    })
    .int("Thời gian còn lại phải là số nguyên")
    .nonnegative("Thời gian còn lại không hợp lệ")
    .optional(),

  currentQuestion: z.coerce
    .number({
      invalid_type_error: "Câu hỏi hiện tại phải là số",
      required_error: "Vui lòng nhập số thứ tự câu hỏi",
    })
    .int("Câu hỏi hiện tại phải là số nguyên")
    .nonnegative("Câu hỏi hiện tại không được âm")
    .optional(),

  questionPackageId: z.coerce
    .number({
      required_error: "Vui lòng chọn gói câu hỏi",
    })
    .int("ID gói câu hỏi phải là số nguyên")
    .optional(),

  roundId: z.coerce
    .number({
      invalid_type_error: "ID vòng thi phải là số",
      required_error: "Vui lòng chọn vòng thi",
    })
    .int("ID vòng thi phải là số nguyên")
    .optional(),

  studentId: z.coerce
    .number({
      invalid_type_error: "ID sinh viên phải là số",
    })
    .int("ID sinh viên phải là số nguyên")
    .optional(),

  status: z.enum(["upcoming", "ongoing", "finished"]),

  maxContestantColumn: z.coerce
    .number({
      invalid_type_error: "Số cột hiển thị phải là số",
    })
    .int("Số cột hiển thị phải là số nguyên")
    .min(1, "Số cột hiển thị phải ít nhất là 1")
    .max(20, "Số cột hiển thị tối đa là 20")
    .optional(),

  isActive: z.boolean().optional(),
});

export const MatchIdShame = z.object({
  id: z
    .string()
    .transform(val => parseInt(val))
    .refine(val => !isNaN(val) && val > 0, "Id là 1 số nguyên dương "),
});

export const MatchQuerySchema = z.object({
  page: z
    .string()
    .transform(val => parseInt(val))
    .refine(val => !isNaN(val) && val > 0, "Page phải là số nguyên dương")
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
  roundId: z
    .string()
    .transform(val => parseInt(val))
    .refine(
      val => !isNaN(val) && val > 0,
      "Id cuộc thi phải là số nguyên dương"
    )
    .optional(),
  status: z.enum(["upcoming", "ongoing", "finished"]).optional(),
});

export const deleteMatchesSchema = z.object({
  ids: z
    .array(z.number().int().positive("ID phải là số nguyên dương"))
    .min(1, "Phải chọn ít nhất 1 ID để xoá"),
});

export type listRound = {
  id: number;
  name: string;
};

export type listQuestionPackage = {
  id: number;
  name: string;
};

export type listStatus = {
  label: string;
  value: string;
};

export type pagination = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
};

export type CreateMatchInput = z.infer<typeof CreateMatchSchema>;
export type MatchIdParams = z.infer<typeof MatchIdShame>;
export type UpdateMatchInput = z.infer<typeof UpdateMatchSchema>;
export type MatchQueryInput = z.infer<typeof MatchQuerySchema>;
export type Match = z.infer<typeof MatchSchema>;
export type DeleteMatchInput = z.infer<typeof deleteMatchesSchema>;
