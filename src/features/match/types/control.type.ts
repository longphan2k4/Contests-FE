export const contest_status = {
  upcoming: "upcoming",
  ongoing: "ongoing",
  finished: "finished",
} as const;

export type ContestStatus =
  (typeof contest_status)[keyof typeof contest_status];

export const QuestionType = {
  multiple_choice: "multiple_choice",
  essay: "essay",
} as const;

export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];

export const RescueStatus = {
  notUsed: "notUsed",
  used: "used",
  passed: "passed",
} as const;

export type RescueStatus = (typeof RescueStatus)[keyof typeof RescueStatus];

export const ContestantMatchStatus = {
  not_started: "not_started",
  in_progress: "in_progress",
  confirmed1: "confirmed1",
  confirmed2: "confirmed2",
  eliminated: "eliminated",
  rescued: "rescued",
  banned: "banned",
  completed: "completed",
} as const;

export type ContestantMatchStatus =
  (typeof ContestantMatchStatus)[keyof typeof ContestantMatchStatus];

export const controlKey = {
  background: "background",
  question: "question",
  questionInfo: "questionInfo",
  answer: "answer",
  matchDiagram: "matchDiagram",
  explanation: "explanation",
  firstprize: "firstprize",
  secondprize: "secondprize",
  thirdprize: "thirdprize",
  fourthprize: "fourthprize",
  impressivevideo: "impressivevideo",
  excellentvideo: "excellentvideo",
  allprize: "allprize",
  topwin: "topwin",
  listeliminated: "listeliminated",
  listrescued: "listrescued",
  video: "video",
  audio: "audio",
  image: "image",
  wingold: "wingold",
  qrcode: "qrcode",
} as const;

export type ControlKey = (typeof controlKey)[keyof typeof controlKey];

export const controlValue = {
  start: "start",
  pause: "pause",
  reset: "reset",
  zoomin: "zoomin",
  zoomout: "zoomout",
  Eliminate: "Eliminate",
  Rescued: "Rescued",
} as const;

export type ControlValue = (typeof controlValue)[keyof typeof controlValue];

export const difficultyType = {
  Alpha: "Alpha",
  Beta: "Beta",
  Rc: "Rc",
  Gold: "Gold",
} as const;

export type difficultyType =
  (typeof difficultyType)[keyof typeof difficultyType];

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

export type BgContest = {
  url: string | null;
};

export type MediaFile = {
  url: string;
  size: number;
  type: "video" | "audio" | "image";
  filename: string;
  mimeType: string;
};

export type CurrentQuestion = {
  id: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  options: string[];
  questionTopicId: number;
  questionType: QuestionType;
  difficulty: string;
  defaultTime: number;
  score: number;
  explanation: string | null;
  content: string;
  mediaAnswer: MediaFile[] | null;
  questionMedia: MediaFile[] | null;
  intro: string | null;
  correctAnswer: string;
  questionTopicName: string;
  questionOrder: number;
};

export type ListRescue = {
  id: number;
  status: RescueStatus;
};

export type contestant = {
  registrationNumber: number;
  eliminatedAtQuestionOrder: number | null;
  rescuedAtQuestionOrder: number | null;
  status: ContestantMatchStatus;
  contestant: {
    student: {
      id: number;
      fullName: string;
    };
  };
};

export type ListContestant = {
  id: number;
  name: string;
  confirmCurrentQuestion: number;
  user: {
    username: string;
  };
  contestantMatches: Contestant[];
};

export type countContestant = {
  countIn_progress: number;
  countEliminated: number;
  total: number;
};

export type SceenControl = {
  id: number;
  controlKey: ControlKey;
  controlValue: ControlValue | null;
  matchId: number;
  media: string | null;
};

export type Question = {
  questionOrder: number;
  id: number;
  content: string;
  difficulty: difficultyType;
  questionType: QuestionType;
};

export interface Contestant {
  registrationNumber: number;
  eliminatedAtQuestionOrder: number | null;
  rescuedAtQuestionOrder: number | null;
  status: ContestantMatchStatus;
  contestant: {
    student: {
      id: number;
      fullName: string;
    };
  };
}

export interface updateRescuedDataType {
  updatedRescues: any[];
  currentEligibleRescues: any[];
  totalUpdated: number;
  summary: {
    passed: number;
    notEligible: number;
    notUsed: number;
    unchanged: number;
  };
}

export interface updatedRescuesType {
  name: string;
  id: number;
  status: string;
  index: number;
  rescueType: string;
  questionFrom: number;
  questionTo: number;
}