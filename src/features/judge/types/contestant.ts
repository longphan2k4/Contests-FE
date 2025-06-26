export interface Contestant {
  registrationNumber: string;
  status: "in_progress" | "confirmed1" | "confirmed2";
}
export type MatchInfo = {
  mockQuestionOrder: number;
  mockMatchName: string;
};

export type RawMatchData = {
  id: number;
  name: string;
  currentQuestion: number;
};

export type TabType = "Đang thi" | "Xác nhận 1" | "Xác nhận 2" | "Đăng xuất";
