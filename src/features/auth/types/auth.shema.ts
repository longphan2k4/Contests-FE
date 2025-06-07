import z from "zod";
export const LoginSchema = z.object({
  identifier: z
    .string({
      required_error: "Tên đăng nhập không được để trống",
      invalid_type_error: "Tên đăng nhập phải là chuỗi",
    })
    .min(1, "Vui lòng nhập tên đăng nhập")
    .max(20, "Tên đăng nhập không được quá 20 kí tự"),
  password: z
    .string({
      required_error: "Mật khẩu không được để trống",
      invalid_type_error: "Mật khẩu phải kí tự chuỗi",
    })
    .min(1, "Vui lòng nhập mật khẩu"),
});
export const UserType = z.object({
  username: z.string(),
  email: z.string(),
  role: z.enum(["Admin", "Judge"]),
  isActive: z.boolean(),
});

// Define AuthContextType as a TypeScript type, not a Zod schema
export type AuthContextType = {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  loading: boolean;
};

export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type UserType = z.infer<typeof UserType>;
