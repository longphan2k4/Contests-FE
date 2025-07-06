import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import {
  getRescueQuestion,
  submitSupportAnswer,
} from "../services/rescueService";

export const useRescueQuestion = (
  matchSlug: string | null,
  rescueId: number
) => {
  return useQuery({
    queryKey: ["RescueQuestion", matchSlug, rescueId],
    queryFn: () => getRescueQuestion(matchSlug, rescueId),
    enabled: !!matchSlug && !!rescueId,
  });
};

export const useSubmitSupportAnswer = () => {
  return useMutation({
    mutationFn: (data: { rescueId: number; supportAnswers: string }) =>
      submitSupportAnswer(data.rescueId, data.supportAnswers),
  });
};
