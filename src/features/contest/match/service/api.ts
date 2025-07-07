import axiosInstance from "../../../../config/axiosInstance";
import {
  type CreateMatchInput,
  type UpdateMatchInput,
  type DeleteMatchInput,
  type MatchQueryInput,
} from "../types/match.shame";

export const getAll = async (params: MatchQueryInput, slug: string | null) => {
  const res = await axiosInstance.get(`/match/contest/${slug}/all`, { params });
  return res.data;
};
export const getById = async (id: number | null) => {
  const res = await axiosInstance.get(`/match/${id}`);
  return res.data.data;
};

export const Create = async (
  payload: CreateMatchInput,
  slug: string | null
) => {
  const res = await axiosInstance.post(`/match/contest/${slug}`, payload);
  return res.data;
};

export const Update = async (id: number, payload: UpdateMatchInput) => {
  const res = await axiosInstance.patch(`/match/${id}`, payload);
  return res.data;
};

export const Deletes = async (ids: DeleteMatchInput) => {
  const res = await axiosInstance.post("/match/delete-many", ids);
  return res.data;
};

export const Delete = async (id: number) => {
  const res = await axiosInstance.delete(`/match/${id}`);
  return res.data;
};

export const getStatus = async () => {
  const res = await axiosInstance.get(`/enums/ContestStatus`);
  return res.data;
};

export const getListRound = async (slug: string | null) => {
  if (!slug === null) return;
  const res = await axiosInstance.get(`/round/contest/${slug}/get-round`);
  return res.data;
};

export const getListQuestionPackage = async () => {
  const res = await axiosInstance.get(
    `/question-packages/get-question-package`
  );
  return res.data;
};

export const ToggleActive = async (id: number) => {
  const res = await axiosInstance.patch(`/match/${id}/toggle-active`);
  return res.data;
};

export const ExportExcel = async (matchId: number | null) => {
  const response = await axiosInstance.post(
    `/group-division/export/excel`,
    { matchId, fileName: "danhsach" },
    {
      responseType: "blob",
    }
  );

  const blob = new Blob([response.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "danhsach.xlsx");
  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
};
