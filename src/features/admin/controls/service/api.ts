import axiosInstance from "../../../../config/axiosInstance";

export const GetMatchInfo = async (match: string | null) => {
  const res = await axiosInstance.get(`/match/${match}/matchInfo`);
  return res.data;
};

export const GetBgContest = async (match: string | null) => {
  const res = await axiosInstance.get(`/match/${match}/bgContest`);
  return res.data;
};

export const GetCurrentQuestion = async (match: string | null) => {
  const res = await axiosInstance.get(`/match/${match}/CurrentQuestion`);
  return res.data;
};

export const GetListRescues = async (match: string | null) => {
  const res = await axiosInstance.get(`/match/${match}/ListRescues`);
  return res.data;
};

export const GetcountContestant = async (match: string | null) => {
  const res = await axiosInstance.get(`/match/${match}/countContestant`);
  return res.data;
};

export const GetListQuestion = async (match: string | null) => {
  const res = await axiosInstance.get(`/match/${match}/ListQuestion`);
  return res.data;
};

export const GetScreenControl = async (match: string | null) => {
  const res = await axiosInstance.get(`/match/${match}/ScreenControl`);
  return res.data;
};

export const GetListContestant = async (match: string | null) => {
  const res = await axiosInstance.get(`/match/${match}/ListContestant`);
  return res.data;
};

export const updateRescueQuestionOrder = async (
  rescueId: number,
  questionOrder: number
) => {
  const res = await axiosInstance.patch(`/rescue/${rescueId}`, {
    questionOrder: questionOrder,
  });
  return res.data;
};

// Cập nhật status của rescue thành "used"
export const updateRescueStatus = async (
  rescueId: number,
  status: string = "used"
) => {
  const res = await axiosInstance.patch(`/rescue/${rescueId}`, {
    status: status,
  });
  return res.data;
};
export const GetListSponsorMedia = async (slug: string | null) => {
  const res = await axiosInstance.get(`/sponsors/contest/list-video/${slug}`);
  return res.data;
};

export const GetListClassVideo = async (slug: string | null) => {
  const res = await axiosInstance.get(
    `/class-video/contest/list-video/${slug}`
  );
  return res.data;
};

/**==================================CỨU TRỢ======================================== */
// Lấy danh sách thí sinh bị loại có phân trang, lọc, tìm kiếm
export const getEliminatedContestants = async (
  matchId: number | string,
  params: { page?: number; limit?: number; search?: string; schoolId?: number; classId?: number; status?: string; registrationNumber?: string } = {}
) => {
  // Convert registrationNumber to number if provided and valid
  const processedParams = { ...params };
  if (params.registrationNumber && params.registrationNumber.trim() !== '') {
    const regNum = Number(params.registrationNumber);
    if (!isNaN(regNum) && Number.isInteger(regNum)) {
      processedParams.registrationNumber = regNum.toString();
    } else {
      // If invalid number, remove the parameter to avoid server error
      delete processedParams.registrationNumber;
    }
  }
  
  const res = await axiosInstance.get(`/contestant/eliminated/${matchId}/list`, { params: processedParams });
  return res.data;
};

// Lấy danh sách thí sinh bị loại theo tiêu chí cứu trợ (có thể truyền rescueId và limit)
export const getRescueCandidates = async (matchId: number | string, rescueId?: number | null, limit?: number) => {
  const url = `/contestant/rescue-candidates/${matchId}`;
  const params: Record<string, unknown> = {};
  if (rescueId) params.rescueId = rescueId;
  if (limit !== undefined && limit > 0) params.limit = limit;
  const res = await axiosInstance.get(url, { params });
  return res.data;
};

// Lấy danh sách thí sinh đã được cứu trợ theo rescueId
export const getRescuedContestantsByRescueId = async (rescueId: number | string) => {
  const res = await axiosInstance.get(`/contestant/rescued/${rescueId}`);
  return res.data;
};

// Cứu trợ hàng loạt thí sinh
export const rescueManyContestants = async (
  matchId: number | string,
  data: { contestantIds: number[]; currentQuestionOrder: number; rescueId?: number }
) => {
  const res = await axiosInstance.post(`/contestant/rescue-candidates/${matchId}/rescue-many`, data);
  return res.data;
};

// Thêm hàng loạt studentIds vào rescue (push, không trùng lặp)
export const addStudentsToRescue = async (
  rescueId: number,
  studentIds: number[]
) => {
  const res = await axiosInstance.post('/contestant/rescue/add-students', {
    rescueId,
    studentIds
  });
  return res.data;
};

// Xóa 1 studentId khỏi rescue
export const removeStudentFromRescue = async (
  rescueId: number,
  studentId: number
) => {
  const res = await axiosInstance.delete('/contestant/rescue/remove-student', {
    data: {
      rescueId,
      studentId
    }
  });
  return res.data;
};

// API: Lấy danh sách rescue theo matchId và rescueType (mặc định 'resurrected')
export const getRescuesByMatchIdAndType = async (
  matchId: number, 
  rescueType: string = 'resurrected'
): Promise<{
  message: string;
  data: Array<{
    id: number;
    name: string;
    rescueType: string;
    status: string;
    questionOrder: number | null;
    index: number | null;
    studentIds: number[];
    questionFrom: number;
    questionTo: number;
  }>;
}> => {
  const response = await axiosInstance.get(`/rescue/match/${matchId}?rescueType=${rescueType}`);
  return response.data;
};

/** Cập nhật trạng thái rescue theo câu hỏi hiện tại */
export const updateRescueStatusByCurrentQuestion = async (
  matchId: number,
  currentQuestionOrder: number
) => {
  const res = await axiosInstance.post('/rescues/update-status-by-question',
    {
      matchId,
      currentQuestionOrder,
    }
  );
  return res.data;
};

