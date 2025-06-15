export interface Contest {
  id: number;
  name: string;
  slug: string;
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
export interface ContestUpdate {
  id: number;
  name: string;
  slug: string;
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
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface ContestResponse {
  success: boolean;
  data: {
    Contest: Contest[];
    pagination?: {
      currentPage: number;
      totalPages: number;
      total: number;
      itemsPerPage: number;
    };
  };
  message?: string;
}
export interface ContestUpdateResponse {
  success: boolean;
  message?: string;
  data: {
    id: number;
    name: string;
    slug: string;
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
  };
}
export interface SingleContestResponse {
  success: boolean;
  data: Contest;
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

export interface DeleteManyResponse {
  success: boolean;
  messages: Array<{
    id: number;
    status: "success" | "error";
    msg: string;
  }>;
}

export interface CreateContestData {
  name: string;
  description: string;
  rule: string;
  location: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}
