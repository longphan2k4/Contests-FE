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
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
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
