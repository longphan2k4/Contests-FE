import { z } from "zod";

export const CreateSchoolSchema = z.object({
  name: z
    .string({
      required_error: "Vui lòng nhập tên trường",
      invalid_type_error: "Vui lòng nhập kí tự chuỗi",
    })
    .min(5, "Tên trường ít nhất 5 kí tự")
    .max(255, "Tên trường tối đa 255 kí tự"),
  email: z
    .string({
      required_error: "Vui lòng nhập tên email",
      invalid_type_error: "Vui lòng nhập kí tự chuỗi",
    })
    .min(1, "Vui lòng nhập email")
    .max(255, "Tên email tối đa 255 kí tự")
    .email("Vui lòng nhập đúng định dạng email"),
  phone: z
    .string({
      required_error: "Vui lòng nhập số điện thoại",
      invalid_type_error: "Vui lòng nhập kí tự chuỗi",
    })
    .min(10, "Số điện thoại phải có 10 số")
    .max(10, "Số điện thoại phải có 10 số"),
  address: z
    .string({
      required_error: "Vui lòng nhập địa chỉ",
      invalid_type_error: "Vui lòng nhập kí tự chuỗi",
    })
    .min(1, "Vui lòng nhập địa chỉ")
    .max(255, "Địa chỉ tối đa 255 kí tự"),
  isActive: z.boolean().default(true),
});

export const SchoolIdSchema = z.object({
  id: z
    .string()
    .transform(val => parseInt(val))
    .refine(val => !isNaN(val) && val > 0, "Id là 1 số nguyên dương"),
});

export const UpdateSchoolSchema = z.object({
  name: z
    .string({
      required_error: "Vui lòng nhập tên trường",
      invalid_type_error: "Vui lòng nhập kí tự chuỗi",
    })
    .min(5, "Tên trường ít nhất 5 kí tự")
    .max(255, "Tên trường tối đa 255 kí tự")
    .optional(),
  email: z
    .string({
      required_error: "Vui lòng nhập tên email",
      invalid_type_error: "Vui lòng nhập kí tự chuỗi",
    })
    .min(1, "Vui lòng nhập email")
    .max(255, "Tên email tối đa 255 kí tự")
    .email("Vui lòng nhập đúng định dạng email")
    .optional(),
  phone: z
    .string({
      required_error: "Vui lòng nhập số điện thoại",
      invalid_type_error: "Vui lòng nhập kí tự chuỗi",
    })
    .min(10, "Số điện thoại phải có 10 số")
    .max(10, "Số điện thoại phải có 10 số")
    .optional(),
  address: z
    .string({
      required_error: "Vui lòng nhập địa chỉ",
      invalid_type_error: "Vui lòng nhập kí tự chuỗi",
    })
    .min(1, "Vui lòng nhập địa chỉ")
    .max(255, "Địa chỉ tối đa 255 kí tự")
    .optional(),
  isActive: z.boolean().optional(),
}); 