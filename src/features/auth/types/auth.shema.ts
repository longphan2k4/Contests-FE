import z, { number } from "zod";
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

export const ForgotPasswordSchema = z.object({
  email: z
    .string({
      required_error: "Email không được để trống",
      invalid_type_error: "Email phải là chuỗi",
    })
    .email("Email không hợp lệ"),
});

export const VerifyOtpSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  otp: z.string().min(6, "Mã OTP phải có 6 kí tự"),
});
export const ResetPasswordSchema = VerifyOtpSchema.extend({
  newPassword: z
    .string()
    .min(8, "Mật khẩu mới là bắt buộc và phải có ít nhất 8 ký tự")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
      "Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa và chữ thường"
    ),
  confirmNewPassword: z
    .string()
    .min(8, "Xác nhận mật khẩu mới là bắt buộc và phải có ít nhất 8 ký tự")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
      "Xác nhận mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa và chữ thường"
    ),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "Mật khẩu mới và xác nhận mật khẩu không khớp",
  path: ["confirmNewPassword"],
});
export const UserType = z.object({
  id: number().int(),
  username: z.string(),
  email: z.string(),
  role: z.enum(["Admin", "Judge", "Student"]),
  isActive: z.boolean(),
});

// Define AuthContextType as a TypeScript type, not a Zod schema
export type AuthContextType = {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  loading: boolean;
};

export const OtpSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  otp: z.string().length(6, "Mã OTP phải có 6 kí tự"),
});
export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type UserType = z.infer<typeof UserType>;
export type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>;
export type VerifyOtpSchemaType = z.infer<typeof VerifyOtpSchema>;
export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;
