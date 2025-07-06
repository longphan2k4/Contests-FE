import axiosInstance from "@/config/axiosInstance";

export const getRescueQuestion = async (
  matchSlug: string | null,
  rescueId: number
) => {
  const response = await axiosInstance.get(
    `/rescue/match/${matchSlug}/${rescueId}`
  );
  return response.data;
};
export const submitSupportAnswer = async (
  rescueId: number,
  supportAnswers: string
) => {
  const response = await axiosInstance.post(
    `/rescue/supportAnswer/${rescueId}`,
    {
      supportAnswers,
    }
  );
  return response.data;
};
