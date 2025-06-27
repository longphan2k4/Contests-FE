import { z } from "zod";

export const MediaItemSchema = z.object({
  id: z.number(),
  url: z.string().url(),
  type: z.enum(["images", "logo", "background"], {
    errorMap: () => ({ message: "Loại media không hợp lệ" })
  }),
  contestId: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const MediaResponseSchema = z.object({
  images: z.array(MediaItemSchema),
  logo: MediaItemSchema.nullable(),       // Có thể null
  background: MediaItemSchema.nullable(), // Có thể null
});

export type MediaQuery = {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  contest_id?: number;
  contestant_id?: number;
};

export const CreateMediaSchema = z.object({
  url: z.any({ message: "URL không hợp lệ" }).optional(),
  type: z.enum(["images", "logo", "background"]),
});


export const UpdateMediaSchema = z.object({
  url: z.any({ message: "URL không hợp lệ" }).optional(),
  type: z.enum(["images", "logo", "background"]).optional(),
});

export const MediaIdSchema = z.object({
  id: z.number().nullable(),
});

export type pagination = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
};

export const DeleteMediasSchema = z.object({
  ids: z
    .array(z.number().int().positive("ID phải là số nguyên dương"))
    .min(1, "Phải chọn ít nhất 1 ID để xoá"),
});


export type MediaItem = z.infer<typeof MediaItemSchema>;
export type MediaResponse = z.infer<typeof MediaResponseSchema>;
export type CreateMediaInput = z.infer<typeof CreateMediaSchema>;
export type UpdateMediaInput = z.infer<typeof UpdateMediaSchema>;
export type MediaIdParam = z.infer<typeof MediaIdSchema>;
export type DeleteMediasType = z.infer<typeof DeleteMediasSchema>;