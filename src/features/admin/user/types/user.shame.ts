import { boolean, number, z } from "zod";
export const CreateUserSchema = z.object({
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

export const UserIdShema = z.object({
  id: z.number().nullable(),
});

export const UserShema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  role: z.enum(["Admin", "Judge"]),
  isActive: boolean(),
});
export const UpdateUserSchema = z.object({
  username: z
    .string()
    .min(3, "Tên tài khoản ít nhất 3 kí tự")
    .max(20, "Tên tài tối đa 20 kí tự")
    .optional(),
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
    .optional(),
  role: z.enum(["Admin", "Judge"]).optional(),
  isActive: z.boolean().optional(),
});

export type User = z.infer<typeof UserShema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type UserIdParam = z.infer<typeof UserIdShema>;
