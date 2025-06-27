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

export const SubmitAnswerSchema = z.object({
  matchId: z.number().positive("Match ID phải là số dương"),
  questionOrder: z.number().positive("Question order phải là số dương"),
  answer: z.string().min(1, "Vui lòng chọn câu trả lời"),
  submittedAt: z.string().optional(),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type SubmitAnswerSchemaType = z.infer<typeof SubmitAnswerSchema>; 