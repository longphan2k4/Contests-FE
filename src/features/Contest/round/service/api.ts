import axiosInstance from "../../../../config/axiosInstance";
import {
  type RoundQueryInput,
  type CreateRoundInput,
  type UpdateRoundInput,
  type DeleteRoundsInput,
} from "../types/round.shame";

export const getAll = async (params: RoundQueryInput, slug: string | null) => {
  const res = await axiosInstance.get(`/round/contest/${slug}`, { params });
  return res.data;
};
export const getById = async (id: number | null) => {
  const res = await axiosInstance.get(`/round/${id}`);
  return res.data.data;
};

export const Create = async (
  payload: CreateRoundInput,
  slug: string | null
) => {
  const res = await axiosInstance.post(`/round/contest/${slug}`, payload);
  return res.data;
};

export const Update = async (id: number, payload: UpdateRoundInput) => {
  const res = await axiosInstance.patch(`/group/${id}`, payload);
  return res.data;
};

export const ToggleActive = async (id: number) => {
  const res = await axiosInstance.patch(`/round/${id}/toggle-active`);
  return res.data;
};

export const Deletes = async (ids: DeleteRoundsInput) => {
  const res = await axiosInstance.post("/round/delete-many", ids);
  return res.data;
};

export const Delete = async (id: number) => {
  const res = await axiosInstance.delete(`/round/${id}`);
  return res.data;
};
