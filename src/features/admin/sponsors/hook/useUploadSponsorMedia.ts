// hooks/useCreateSponsor.ts
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import {  uploadSponsorMedia } from "../service/api";
// import { type CreateSponsorInput } from "../types/sponsors.shame";
// import { toast } from "react-toastify";

// export const useCreateSponsor = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (data: CreateSponsorInput) => {
//       // Gửi thông tin cơ bản (dạng JSON)
//       const { data: createdSponsor } = await CreateSponsor(data);

//       // Upload media nếu có
//       if (data.logo || data.images || data.videos) {
//         await uploadSponsorMedia({
//           id: createdSponsor.id,
//           logo: data.logo as File,
//           images: data.images as File,
//           videos: data.videos as File,
//         });
//       }

//       return createdSponsor;
//     },
//     onSuccess: () => {
//       toast.success("Thêm nhà tài trợ thành công");
//       queryClient.invalidateQueries({ queryKey: ["sponsors"] });
//     },
//     onError: err => {
//       toast.error("Lỗi khi thêm nhà tài trợ");
//       console.error("Create sponsor error:", err);
//     },
//   });
// };
