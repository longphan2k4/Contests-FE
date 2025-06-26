import axiosInstance from '@/config/axiosInstance';

export interface JudgeInfo {
  id: number;
  username: string;
  email: string;
}

export interface ContestantInfo {
  id: number;
  student: {
    id: number;
    fullName: string;
    studentCode: string;
    class: {
      id: number;
      name: string;
      school: {
        id: number;
        name: string;
      };
    };
  };
  status: string;
  roundId: number;
}

export interface GroupInfo {
  id: number;
  name: string;
  userId: number;
  judge: {
    id: number;
    username: string;
    email: string;
  };
  contestantMatches: Array<{
    contestant: {
      id: number;
      student: {
        id: number;
        fullName: string;
        studentCode: string;
      };
      round: {
        id: number;
        name: string;
      };
    };
    registrationNumber: number;
  }>;
}

export interface SchoolInfo {
  id: number;
  name: string;
}

export interface ClassInfo {
  id: number;
  name: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ContestantFilters {
  roundId?: number;
  status?: string;
  schoolId?: number;
  classId?: number;
  search?: string;
  page: number;
  limit: number;
}

export interface JudgeFilters {
  search?: string;
  page: number;
  limit: number;
}

export interface DivideGroupsRequest {
  groups: Array<{
    judgeId: number;
    groupName?: string;
    contestantIds: number[];
  }>;
}

export interface DeleteGroupsResponse {
  success: boolean;
  messages: Array<{
    status: 'success' | 'error';
    msg: string;
  }>;
}

export class GroupDivisionService {
  private static baseUrl = '/group-division';

  /**
   * Lấy danh sách thí sinh có thể tham gia trận đấu
   */
  static async getAvailableContestants(
    matchId: number,
    filters: ContestantFilters
  ): Promise<{
    contestants: ContestantInfo[];
    pagination: PaginationInfo;
  }> {
    const params = new URLSearchParams();
    
    if (filters.roundId) params.append('roundId', filters.roundId.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.schoolId) params.append('schoolId', filters.schoolId.toString());
    if (filters.classId) params.append('classId', filters.classId.toString());
    if (filters.search) params.append('search', filters.search);
    params.append('page', filters.page.toString());
    params.append('limit', filters.limit.toString());

    const response = await axiosInstance.get(
      `${this.baseUrl}/matches/${matchId}/contestants?${params.toString()}`
    );
    return response.data.data;
  }

  /**
   * Lấy danh sách trọng tài có thể chấm thi
   */
  static async getAvailableJudges(
    filters: JudgeFilters
  ): Promise<{
    judges: JudgeInfo[];
    pagination: PaginationInfo;
  }> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    params.append('page', filters.page.toString());
    params.append('limit', filters.limit.toString());

    const response = await axiosInstance.get(
      `${this.baseUrl}/judges?${params.toString()}`
    );
    return response.data.data;
  }

  /**
   * Lấy danh sách nhóm hiện tại của trận đấu (không sắp xếp - để frontend tự quản lý thứ tự)
   */
  static async getCurrentGroups(matchId: number): Promise<GroupInfo[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/matches/${matchId}/groups/unsorted`);
    return response.data.data.groups;
  }

  /**
   * Tạo nhóm mới cho trận đấu
   */
  static async createGroup(
    matchId: number,
    groupName: string,
    judgeId: number
  ): Promise<GroupInfo> {
    const response = await axiosInstance.post(`${this.baseUrl}/matches/${matchId}/groups`, {
      groupName: groupName,
      judgeId: judgeId
    });
    return response.data.data;
  }

  /**
   * Xóa nhóm (bao gồm cả thí sinh trong nhóm)
   */
  static async deleteGroup(groupId: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/groups/${groupId}`);
  }

  /**
   * Xóa tất cả nhóm theo danh sách ID (hard reset)
   */
  static async deleteAllGroups(groupIds: number[]): Promise<{
    deletedGroupsCount: number;
    deletedContestantsCount: number;
  }> {
    const response = await axiosInstance.delete(`${this.baseUrl}/groups`, {
      data: { groupIds }
    });
    return response.data.data;
  }

  /**
   * Cập nhật tên nhóm
   */
  static async updateGroupName(groupId: number, newName: string): Promise<GroupInfo | null> {
    const response = await axiosInstance.put(`${this.baseUrl}/groups/${groupId}/name`, {
      name: newName
    });
    return response.data.data;
  }

  /**
   * Chia nhóm thí sinh cho trận đấu
   */
  static async divideGroups(
    matchId: number,
    data: DivideGroupsRequest
  ): Promise<GroupInfo[]> {
    const response = await axiosInstance.post(
      `${this.baseUrl}/matches/${matchId}/divide-groups`,
      data
    );
    return response.data.data.groups;
  }

  /**
   * Lấy danh sách trường học để lọc
   */
  static async getSchools(): Promise<SchoolInfo[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/schools`);
    return response.data.data.schools;
  }

  /**
   * Lấy danh sách lớp học theo trường
   */
  static async getClassesBySchool(schoolId: number): Promise<ClassInfo[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/schools/${schoolId}/classes`);
    return response.data.data.classes;
  }
}
