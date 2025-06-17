import { z } from "zod";

const imageMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const CreateSponsorSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  logo: z
    .any()
    .refine((files) => files?.[0], { message: "Logo là bắt buộc" })
    .refine((files) => imageMimeTypes.includes(files?.[0]?.type), {
      message: "Logo phải là ảnh (jpg, png, webp, gif...)",
    }),
  images: z
    .any()
    .optional()
    .refine(
      (files) =>
        !files?.[0] || imageMimeTypes.includes(files?.[0]?.type),
      {
        message: "Ảnh phải đúng định dạng (jpg, png, webp, gif...)",
      }
    ),
  videos: z.any().optional(),
  contestId: z.any().nullable().optional(),
});
export const SponsorIdShema = z.object({
  id: z.number().nullable(),
});


// export type CreateSponsorInput = {
//   name: string;
//   videos?: string;
//   logo: File;
//   slug: string;
// };

export const SponsorShema = z.object({
  id: z.number(),
  name: z.string(),
  logo: z.any().nullable().optional(),
  images: z.any().nullable().optional(),
  videos: z.any().nullable().optional(),
  contestId: z.any().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  contest: z.any().nullable().optional(), // hoặc bạn có thể tạo `ContestSchema` riêng nếu cần
});

export type UploadSponsorMediaInput = {
  id: number; // sponsor ID
  logo?: File;
  videos?: File;
  images?: File;
};

export const UpdateSponsorSchema = z.object({
   name: z
    .string()
    .min(2, "Tên nhà tài trợ phải có ít nhất 2 ký tự")
    .max(100, "Tên nhà tài trợ không được vượt quá 100 ký tự"),
  logo: z.any().optional(), 
  images: z.any().optional(),  
  videos: z.any().optional(), 
  contestId: z.any().nullable().optional(),
});

export type SponsorQuery = {
  page?: number;
  limit?: number;
  search?: string;
};

export type pagination = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
};

export const deleteSponsorsSchema = z.object({
  ids: z
    .array(z.number().int().positive("ID phải là số nguyên dương"))
    .min(1, "Phải chọn ít nhất 1 ID để xoá"),
});

export type Sponsor = z.infer<typeof SponsorShema>;
export type CreateSponsorInput = z.infer<typeof CreateSponsorSchema>;
export type UpdateSponsorInput = z.infer<typeof UpdateSponsorSchema>;
export type SponsorIdParam = z.infer<typeof SponsorIdShema>;
export type deleteSponsorsType = z.infer<typeof deleteSponsorsSchema>;
