import { z } from "zod";

export const LoginSchema = z.object({
  identifier: z
    .string({
      required_error: "Vui lòng nhập tên đăng nhập hoặc email",
      invalid_type_error: "Vui lòng nhập kí tự chuỗi",
    })
    .min(1, "Vui lòng nhập tên đăng nhập hoặc email")
    .trim(),
  password: z
    .string({
      required_error: "Vui lòng nhập mật khẩu",
      invalid_type_error: "Vui lòng nhập kí tự chuỗi",
    })
    .min(1, "Vui lòng nhập mật khẩu"),
});

export const RegisterSchema = z
  .object({
    username: z
      .string({
        required_error: "Vui lòng nhập tên đăng nhập",
        invalid_type_error: "Vui lòng nhập kí tự chuỗi",
      })
      .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
      .max(20, "Tên đăng nhập không được quá 20 ký tự")
      .trim(),
    fullName: z
      .string({
        required_error: "Vui lòng nhập họ và tên",
        invalid_type_error: "Vui lòng nhập kí tự chuỗi",
      })
      .min(2, "Họ và tên phải có ít nhất 2 ký tự")
      .max(100, "Họ và tên không được quá 100 ký tự")
      .trim(),
    email: z
      .string({
        required_error: "Vui lòng nhập email",
        invalid_type_error: "Vui lòng nhập kí tự chuỗi",
      })
      .email("Email không hợp lệ")
      .trim(),
    password: z
      .string({
        required_error: "Vui lòng nhập mật khẩu",
        invalid_type_error: "Vui lòng nhập kí tự chuỗi",
      })
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt"
      ),
    confirmPassword: z
      .string({
        required_error: "Vui lòng xác nhận mật khẩu",
        invalid_type_error: "Vui lòng nhập kí tự chuỗi",
      })
      .min(1, "Vui lòng xác nhận mật khẩu"),
    school: z.string().min(1, "Vui lòng chọn trường"),
    classId: z
      .number({
        required_error: "Vui lòng chọn lớp",
        invalid_type_error: "Vui lòng chọn lớp",
      })
      .min(0, "Vui lòng chọn lớp"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  })
  .refine((data) => data.classId > 0, {
    message: "Vui lòng chọn lớp",
    path: ["classId"],
  });

export const SubmitAnswerSchema = z
  .object({
    matchId: z.number().positive("Match ID phải là số dương"),
    questionOrder: z.number().positive("Question order phải là số dương"),
    answer: z.string().min(1, "Vui lòng chọn câu trả lời"),
    submittedAt: z.string().optional(),
  })
  .refine(
    (data) => {
      // 🔥 NEW: Validation bổ sung cho đáp án
      const answer = data.answer.trim();

      // Kiểm tra format option cho câu hỏi tự luận
      const optionPatterns = [/^option\s*[a-d]$/i, /^[a-d]$/i, /^[a-d]\./i];

      const isOptionFormat = optionPatterns.some((pattern) =>
        pattern.test(answer)
      );

      // 🔥 NEW: Cảnh báo nếu gửi format option (có thể do lỗi UI)
      if (isOptionFormat) {
        console.warn(
          `⚠️ [VALIDATION] Phát hiện format option "${answer}" - có thể do lỗi UI`
        );
      }

      return true; // Vẫn cho phép submit để backend xử lý
    },
    {
      message: "Đáp án không hợp lệ",
      path: ["answer"],
    }
  );

export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
export type SubmitAnswerSchemaType = z.infer<typeof SubmitAnswerSchema>;
