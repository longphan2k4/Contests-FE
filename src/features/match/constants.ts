import type { Contestant } from "./types";
import type { contestant } from "@features/admin/controls/type/control.type";

export const TOTAL_ICONS = 60;
export const MOCK_CURRENT_QUESTION = 3;

export const mockContestants: Contestant[] = Array.from(
  { length: TOTAL_ICONS },
  (_, index) => {
    const statuses: contestant["status"][] = [
      "in_progress",
      "not_started",
      "confirmed1",
      "confirmed2",
      "rescued",
      "eliminated",
      "banned",
      "completed",
    ];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    return {
      registration_number: index + 1,
      fullname: `Contestant ${index + 1}`,
      status: status,
      eliminated_at_question_order:
        status === "eliminated" || status === "rescued"
          ? Math.floor(Math.random() * 5) + 1
          : null,
      rescued_at_question_order:
        status === "rescued" ? Math.floor(Math.random() * 5) + 1 : null,
    };
  }
);
