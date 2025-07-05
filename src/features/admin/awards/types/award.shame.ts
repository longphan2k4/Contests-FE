import { z } from "zod";

export const CreateAwardSchema = z.object({
  name: z.string().min(1, "Tên giải thưởng không được để trống"),
  type: z.enum(
    [
      "firstPrize",
      "secondPrize",
      "thirdPrize",
      "fourthPrize",
      "impressiveVideo",
      "excellentVideo",
    ],
    {
      errorMap: () => ({ message: "Vui lòng chọn loại giải" }),
    }
  ),
});

export const AwardIdShema = z.object({
  id: z.number().nullable(),
});

export const AwardShema = z.object({
  id: z.number(),
  name: z.string(),
  contestId: z.number(),
  contestantId: z.number(),
  type: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const UpdateAwardSchema = z.object({
  name: z.string().min(1, "Tên giải thưởng không được để trống").optional(),
  contestantId: z
    .union([
      z.number().positive("ID thí sinh phải lớn hơn 0"),
      z.nan().transform(() => null),
      z.null(),
    ])
    .nullable(),
  type: z
    .enum(
      [
        "firstPrize",
        "secondPrize",
        "thirdPrize",
        "fourthPrize",
        "impressiveVideo",
        "excellentVideo",
      ],
      {
        errorMap: () => ({ message: "Vui lòng chọn loại giải" }),
      }
    )
    .optional(),
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

export const AwardTypeList = {
  firstPrize: "firstPrize",
  secondPrize: "secondPrize",
  thirdPrize: "thirdPrize",
  fourthPrize: "fourthPrize",
  impressiveVideo: "impressiveVideo",
  excellentVideo: "excellentVideo",
} as const;

export type AwardType = keyof typeof AwardTypeList;

export const awardTypeOptions = [
  { value: "firstPrize", label: "Giải Nhất" },
  { value: "secondPrize", label: "Giải Nhì" },
  { value: "thirdPrize", label: "Giải Ba" },
  { value: "fourthPrize", label: "Giải Tư" },
  { value: "impressiveVideo", label: "Video ấn tượng" },
  { value: "excellentVideo", label: "Video xuất sắc" },
];

export type Award = z.infer<typeof AwardShema>;
export type CreateAwardInput = z.infer<typeof CreateAwardSchema>;
export type UpdateAwardInput = z.infer<typeof UpdateAwardSchema>;
export type AwardIdParam = z.infer<typeof AwardIdShema>;
export type deleteAwardsType = z.infer<typeof deleteAwardsSchema>;
