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

// Cập nhật questionOrder cho rescue khi hiển thị QR
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