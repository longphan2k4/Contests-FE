export interface Contest {
  id: number;
  name: string;
  description: string;
  rule: string;
  plainText?: string;
  isActive: boolean;
  status: string;
  location: string;
  startTime: string;
  endTime: string;
  slogan?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface ContestResponse {
  success: boolean;
  data: {
    Contest: Contest[];
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
  message?: string;
}

export interface ContestListResponse {
  success: boolean;
  data: {
    Contest: Contest[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
  message?: string;
}

export interface ContestMessageResponse {
  success: boolean;
  message: string;
}

// Định nghĩa interface cho vòng đấu
export interface Round {
  id: number;
  contestId: number;
  name: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  order: number; // Thứ tự của vòng đấu
  isElimination: boolean; // Có phải vòng loại hay không
  createdAt: string;
  updatedAt: string;
}

// Định nghĩa interface cho thí sinh
export interface Contestant {
  id: number;
  contestId: number;
  userId?: number; // ID người dùng nếu có tài khoản
  fullName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  organization?: string; // Tổ chức/trường học
  registrationTime: string;
  status: 'pending' | 'approved' | 'rejected';
  groupId?: number; // ID nhóm nếu đã được phân nhóm
  createdAt: string;
  updatedAt: string;
}

// Định nghĩa interface cho nhóm
export interface Group {
  id: number;
  contestId: number;
  name: string;
  description?: string;
  maxContestants?: number; // Số lượng thí sinh tối đa
  roundId?: number; // Vòng đấu mà nhóm này thuộc về (nếu có)
  createdAt: string;
  updatedAt: string;
  contestants?: Contestant[]; // Danh sách thí sinh trong nhóm
}

// Định nghĩa interface cho kết quả
export interface Result {
  id: number;
  contestId: number;
  roundId: number;
  contestantId: number;
  score: number;
  rank?: number;
  feedback?: string;
  submittedAt: string;
  judgeName?: string;
  createdAt: string;
  updatedAt: string;
}

// Response cho vòng đấu
export interface RoundResponse {
  success: boolean;
  data: {
    Round: Round[];
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
  message?: string;
}

// Response cho thí sinh
export interface ContestantResponse {
  success: boolean;
  data: {
    Contestant: Contestant[];
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
  message?: string;
}

// Response cho nhóm
export interface GroupResponse {
  success: boolean;
  data: {
    Group: Group[];
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
  message?: string;
}

// Response cho kết quả
export interface ResultResponse {
  success: boolean;
  data: {
    Result: Result[];
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
  message?: string;
}