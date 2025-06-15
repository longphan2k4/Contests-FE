import { boolean, number, z } from "zod";

export const CreateAwardSchema = z.object({
  name: z.string().min(1, "Tên giải thưởng không được để trống"),
  contest_id: z.number().nullable(),
  contestant_id: z.number().nullable(),
  type: z.string().min(1, "Loại giải thưởng không được để trống"),
});


export const AwardIdShema = z.object({
  id: z.number().nullable(),
});

export const AwardShema = z.object({
  id: z.number(),
  name: z.string(),
  contest_id: z.number(),
  contestant_id: z.number(),
  type: z.string(),
  createdAt: z.string(), // hoặc: z.coerce.date() nếu bạn xử lý ngày dạng Date
  updatedAt: z.string(),
});

export const UpdateAwardSchema = z.object({
  name: z.string().min(1, "Tên giải thưởng không được để trống").optional(),
  contest_id: z.number().nullable(),
  contestant_id: z.number().nullable(),
  type: z.string().min(1, "Loại giải thưởng không được để trống").optional(),
});

export type AwardQuery = {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  contest_id?: number;
  contestant_id?: number;
};

export type pagination = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
};

export const deleteAwardsSchema = z.object({
  ids: z
    .array(z.number().int().positive("ID phải là số nguyên dương"))
    .min(1, "Phải chọn ít nhất 1 ID để xoá"),
});

export type Award = z.infer<typeof AwardShema>;
export type CreateAwardInput = z.infer<typeof CreateAwardSchema>;
export type UpdateAwardInput = z.infer<typeof UpdateAwardSchema>;
export type AwardIdParam = z.infer<typeof AwardIdShema>;
export type deleteAwardsType = z.infer<typeof deleteAwardsSchema>;
