import z from "zod";

export const GroupShema = z.object({
  id: z.number(),
  name: z.string(),
  userName: z.string(),
  matchName: z.string(),
  confirmCurrentQuestion: z.number(),
});

export const CreateGroupsSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên nhóm"),
  userId: z.number({
    required_error: "Vui lòng nhập trong tài",
    invalid_type_error: "Thứ tự vòng đấu phải là số",
  }),
  matchId: z.number({
    required_error: "Vui lòng nhập trận đấu",
    invalid_type_error: "Thứ tự vòng đấu phải là số",
  }),
  confirmCurrentQuestion: z.coerce.number({
    required_error: "Vui lòng nhập thứ tự vòng đấu",
    invalid_type_error: "Thứ tự vòng đấu phải là số",
  }),
});

export const GroupsIdShema = z.object({
  id: z
    .string()
    .transform(val => parseInt(val))
    .refine(val => !isNaN(val) && val > 0, "Id là 1 số nguyên dương "),
});

export const UpdateGroupsSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên nhóm").optional(),
  userId: z.number().optional(),
  matchId: z.number().optional(),
  confirmCurrentQuestion: z.coerce.number({
    required_error: "Vui lòng nhập thứ tự vòng đấu",
    invalid_type_error: "Thứ tự vòng đấu phải là số",
  }),
});

export type listMatch = {
  id: number;
  name: string;
};

export type listUser = {
  id: number;
  username: string;
};

export const GroupsQuerySchema = z.object({
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
  matchId: z
    .string()
    .transform(val => parseInt(val))
    .refine(val => !isNaN(val) && val > 0, "Id lớp phải là số nguyên dương")
    .optional(),
  userId: z
    .string()
    .transform(val => parseInt(val))
    .refine(val => !isNaN(val) && val > 0, "Id lớp phải là số nguyên dương")
    .optional(),
});

export type GroupByIdType = {
  id: number;
  name: string;
  confirmCurrentQuestion: number;
  matchId: number;
  userId: number;
  user: { username: string };
  match: { name: string };
};

export const deleteGroupsesSchema = z.object({
  ids: z
    .array(z.number().int().positive("ID phải là số nguyên dương"))
    .min(1, "Phải chọn ít nhất 1 ID để xoá"),
});

export type pagination = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
};
export type GroupsIdParams = z.infer<typeof GroupsIdShema>;
export type UpdateGroupInput = z.infer<typeof UpdateGroupsSchema>;
export type GroupQueryInput = z.infer<typeof GroupsQuerySchema>;
export type CreateGroupInput = z.infer<typeof CreateGroupsSchema>;
export type Group = z.infer<typeof GroupShema>;
export type DeleteGroupsInput = z.infer<typeof deleteGroupsesSchema>;
