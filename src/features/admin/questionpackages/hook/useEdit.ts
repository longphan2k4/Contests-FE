import { useMutation } from "@tanstack/react-query";
import { updateQuestionPackage } from "../service/api";
import { type QuestionPackage } from "../types/questionpackages.shame";

type EditQuestionPackagePayload = {
  id: number;
  data: Partial<QuestionPackage>;
};

export const useEditQuestionPackage = () => {
  const mutation = useMutation<
    any,
    unknown,
    EditQuestionPackagePayload 
  >({
    mutationFn: ({ id, data }) => updateQuestionPackage(id, data),
    onSuccess: (data) => {
      if (data.success) {
        alert(data.message);
      }
    },
    onError: (error) => {
      alert("Có lỗi xảy ra khi cập nhật: " + error);
    },
  });

  return mutation;
};