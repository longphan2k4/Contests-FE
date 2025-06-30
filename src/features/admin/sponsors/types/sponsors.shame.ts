import { z } from "zod";

const imageMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

const videoMimeTypes = [
  "video/mp4",
  "video/avi", 
  "video/mov",
  "video/wmv",
  "video/webm"
];

export const CreateSponsorSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  logo: z
    .any()
    .optional()
    .refine(
      (files) => !files?.[0] || imageMimeTypes.includes(files?.[0]?.type),
      {
        message: "Logo phải là ảnh (jpg, png, webp, gif...)",
      }
    ),
  images: z
    .any()
    .optional()
    .refine(
      (files) => !files?.[0] || imageMimeTypes.includes(files?.[0]?.type),
      {
        message: "Ảnh phải đúng định dạng (jpg, png, webp, gif...)",
      }
    ),
  videos: z
    .any()
    .optional()
    .refine(
      (files) => !files?.[0] || videoMimeTypes.includes(files?.[0]?.type),
      {
        message: "Video phải đúng định dạng (mp4, avi, mov, wmv, webm...)",
      }
    ),
});

export const SponsorIdShema = z.object({
  id: z.number().nullable(),
});

export const SponsorShema = z.object({
  id: z.number(),
  name: z.string(),
  logo: z.string().nullable(),
  images: z.string().nullable(),
  videos: z.string().nullable(),
  contestId: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  contest: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .optional(),
});

// Input types for API calls
export type CreateSponsorForContestInput = {
  name: string;
  logo?: File;
  images?: File; 
  videos?: File;
};

export type UpdateSponsorInput = z.infer<typeof UpdateSponsorSchema>;

export type UploadSponsorMediaInput = {
  id: number;
  logo?: File;
  images?: File;
  videos?: File;
};

export const UpdateSponsorSchema = z.object({
  name: z
    .string()
    .min(2, "Tên nhà tài trợ phải có ít nhất 2 ký tự")
    .max(100, "Tên nhà tài trợ không được vượt quá 100 ký tự")
    .optional(),
  logo: z.any().optional().nullable(), 
  images: z.any().optional().nullable(),  
  videos: z.any().optional().nullable(),
  // Flags to indicate file removal
  removeLogo: z.boolean().optional(),
  removeImages: z.boolean().optional(),
  removeVideos: z.boolean().optional(),
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
export type SponsorIdParam = z.infer<typeof SponsorIdShema>;
export type deleteSponsorsType = z.infer<typeof deleteSponsorsSchema>;
