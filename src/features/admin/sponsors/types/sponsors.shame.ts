import { boolean, number, z } from "zod";
export const CreateSponsorSchema = z.object({
  username: z
    .string()
    .min(3, "Tên tài khoản ít nhất 3 kí tự")
    .max(20, "Tên tài tối đa 20 kí tự"),
  email: z
    .string()
    .min(1, "Vui lòng nhập email")
    .email("Vui lòng nhập đúng định dạng email"),
  password: z
    .string()
    .min(8, "Mật khẩu mới là bắt buộc và phải có ít nhất 8 ký tự")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
      "Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa và chữ thường"
    ),
  role: z.enum(["Admin", "Judge"]),
  isActive: z.boolean(),
});

export const SponsorIdShema = z.object({
  id: z.number().nullable(),
});

export const SponsorShema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  role: z.enum(["Admin", "Judge"]),
  isActive: boolean(),
});

export const UpdateSponsorSchema = z.object({
  email: z
    .string()
    .min(1, "Vui lòng nhập email")
    .email("Vui lòng nhập đúng định dạng email")
    .optional(),
  password: z
    .string()
    .min(8, "Mật khẩu mới là bắt buộc và phải có ít nhất 8 ký tự")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
      "Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa và chữ thường"
    )
    .optional()
    .or(z.literal("")),
  role: z.enum(["Admin", "Judge"]).optional(),
  isActive: z.boolean().optional(),
});
export const Role = {
  Admin: "Admin",
  Judge: "Judge",
} as const;

export type Role = (typeof Role)[keyof typeof Role];
export type SponsorQuery = {
  page?: number; // trang hiện tại, mặc định 1
  limit?: number; // số item trên 1 trang, mặc định 10
  search?: string; // chuỗi tìm kiếm, có thể không truyền
  isActive?: boolean; // trạng thái active, true hoặc false hoặc undefined
  role?: Role;
};

type ActiveOption = {
  label: string;
  value: boolean | ""; // có thể là true, false hoặc ""
};

export const ActiveOptions: ActiveOption[] = [
  { label: "Đang hoạt động", value: true },
  { label: "Tất cả", value: "" },
  { label: "Không hoạt động", value: false },
];

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
