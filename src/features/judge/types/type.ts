import { groupInfo } from "../services/selector/api";
export const contest_status = {
  upcoming: "upcoming",
  ongoing: "ongoing",
  finished: "finished",
} as const;

export type ContestStatus =
  (typeof contest_status)[keyof typeof contest_status];

export type MatchInfo = {
  id: number;
  slug: string;
  name: string;
  contestId: number;
  currentQuestion: number;
  remainingTime: number;
  status: ContestStatus;
  questionPackageId: number;
  roundName: string | null;
  studentId: number | null;
  studentName: string | null;
};
export interface Contestant {
  registrationNumber: string;
  status: "in_progress" | "confirmed1" | "confirmed2";
}

export type groupInfo = {
  id: number;
  name: "Nhóm A - Vòng loại - Trận 1";
  matchId: number;
  userId: number;
  confirmCurrentQuestion: number;
  user: {
    username: string;
  };
  match: {
    name: string;
  };
};

export type TabType = "Đang thi" | "Xác nhận 1" | "Xác nhận 2" | "Đăng xuất";
