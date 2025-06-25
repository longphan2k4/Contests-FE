import z from "zod";

export const ContestantSchema = z.object({
  id: z.number().int(),
  roundName: z.string(),
  fullName: z.string(),
  status: z.enum([" compete", "eliminate", "advanced"]),
  studentCode: z.string().optional().nullable(),
  schoolName: z.string(),
  className: z.string(),
  groupName: z.string().optional(),
  schoolId: z.number(),
  classId: z.number(),
  groupId: z.number().optional(),
});

export const CreateContestantSchema = z.object({
  contestId: z.number({
    required_error: "Vui lòng id cuộc thi",
    invalid_type_error: "Vui lòng nhập kí tự số",
  }),
  studentId: z.number({
    required_error: "Vui lòng id cuộc thi",
    invalid_type_error: "Vui lòng nhập kí tự số",
  }),
  roundId: z
    .number({
      required_error: "Vui lòng id cuộc thi",
      invalid_type_error: "Vui lòng nhập kí tự số",
    })
    .int(),
  status: z.enum(["compete", "eliminate", "advanced"]).optional(),
});

export const UpdateContestantSchema = z.object({
  roundId: z
    .number({
      required_error: "Vui lòng id cuộc thi",
      invalid_type_error: "Vui lòng nhập kí tự số",
    })
    .optional(),
  status: z.enum(["compete", "eliminate", "advanced"]),
});

export const ContestantQuerySchema = z.object({
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
    .default("10")
    .optional(),
  search: z.string().max(100, "Từ khóa tìm kiếm tối đa 100 ký tự").optional(),
  contestId: z
    .string()
    .transform(val => parseInt(val))
    .refine(
      val => !isNaN(val) && val > 0,
      "Id cuộc thi phải là số nguyên dương"
    )
    .optional(),
  roundId: z
    .string()
    .transform(val => parseInt(val))
    .refine(
      val => !isNaN(val) && val > 0,
      "Id cuộc thi phải là số nguyên dương"
    )
    .optional(),
  status: z.enum(["compete", "eliminate", "advanced"]).optional(),
  schoolId: z.number().positive().optional(),
  classId: z.number().positive().optional(),
  groupId: z.number().optional(), // Có thể là -1 cho "unassigned"
  matchId: z.number().positive().optional(),
});

export const deleteContestantesSchema = z.object({
  ids: z
    .array(z.number().int().positive("ID phải là số nguyên dương"))
    .min(1, "Phải chọn ít nhất 1 ID để xoá"),
});

export const CreatesContestShema = z.object({
  ids: z
    .array(z.number().int().positive("ID phải là số nguyên dương"))
    .min(1, "Phải chọn ít nhất 1 ID để xoá"),
  roundId: z.number({
    invalid_type_error: "Id trận đấu là ký tự số",
    required_error: "Vui lòng nhập id trận đấu",
  }),
});

export type ContestantById = {
  id: number;
  roundId: number;
  studentId: number;
  round: { name: string };
  student: { fullName: string };
  status: "compete" | "eliminate" | "advanced";
};

export type pagination = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
};

export type listStatus = {
  label: string;
  value: string;
};

export type listRound = {
  id: number;
  name: string;
};

export interface StudentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  classId?: number;
}
export type CreateContestantInput = z.infer<typeof CreateContestantSchema>;
export type UpdateContestantInput = z.infer<typeof UpdateContestantSchema>;
export type ContestantQueryInput = z.infer<typeof ContestantQuerySchema>;
export type Contestant = z.infer<typeof ContestantSchema>;
export type CreatesContestInput = z.infer<typeof CreatesContestShema>;
export type DeleteContestanteInput = z.infer<typeof deleteContestantesSchema>;
