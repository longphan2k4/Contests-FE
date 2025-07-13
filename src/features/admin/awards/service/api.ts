import axiosInstance from "../../../../config/axiosInstance";
import {
  //type AwardIdParam,
  type CreateAwardInput,
  type UpdateAwardInput,
  type AwardQuery,
  type deleteAwardsType,
} from "../types/award.shame";

export const getAllAwards = async (slug: string, filter: AwardQuery = {}) => {
  const params = new URLSearchParams();
  if (filter.search) params.append("search", filter.search);
  if (filter.page) params.append("page", String(filter.page));
  if (filter.limit) params.append("limit", String(filter.limit));
  if (filter.matchId) params.append("matchId", String(filter.matchId));

  const res = await axiosInstance.get(`/awards/contest/${slug}?${params}`);
  return res.data;
};

export const getAwardById = async (id: number | null) => {
  const res = await axiosInstance.get(`/awards/${id}`);
  return res.data.data;
};

export const CreateAward = async (slug: string, payload: CreateAwardInput) => {
  const res = await axiosInstance.post(`/awards/contest/${slug}`, payload);
  return res.data;
};

export const UpdateAward = async (id: number, payload: UpdateAwardInput) => {
  const res = await axiosInstance.patch(`/awards/${id}`, payload);
  return res.data;
};

export const ToggleActive = async (id: number) => {
  const res = await axiosInstance.patch(`/awards/${id}/toggle-active`);
  return res.data;
};

export const DeleteAwards = async (ids: deleteAwardsType) => {
  const res = await axiosInstance.delete("/awards/batch", {
    data: ids,
  });
  return res.data;
};

export const DeleteAward = async (id: number) => {
  const res = await axiosInstance.delete(`/awards/${id}`);
  return res.data;
};

export const ListContestant = async (slug: string | null) => {
  const res = await axiosInstance.get(
    `/contestant/list-contestant/${slug}/list`
  );
  return res.data;
};

export const ListMatch = async (slug: string | null) => {
  const res = await axiosInstance.get(`/match/contest/${slug}`);
  return res.data;
};
