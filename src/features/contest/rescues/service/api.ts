import axiosInstance from "../../../../config/axiosInstance";
import {
  type CreateRescueInput,
  type UpdateRescueInput,
  type DeleteRescuesInput,
  type RescuesQueryInput,
} from "../types/rescue.shame";

export const getAll = async (
  params: RescuesQueryInput,
  slug: string | null
) => {
  const res = await axiosInstance.get(`/rescue/contest/${slug}`, { params });
  return res.data;
};
export const getById = async (id: number | null) => {
  const res = await axiosInstance.get(`/rescue/${id}`);
  return res.data.data;
};

export const Create = async (payload: CreateRescueInput) => {
  const res = await axiosInstance.post(`/rescue`, payload);
  return res.data;
};

export const Update = async (id: number, payload: UpdateRescueInput) => {
  const res = await axiosInstance.patch(`/rescue/${id}`, payload);
  return res.data;
};

export const Deletes = async (ids: DeleteRescuesInput) => {
  const res = await axiosInstance.post("/rescue/delete-many", ids);
  return res.data;
};

export const Delete = async (id: number) => {
  const res = await axiosInstance.delete(`/rescue/${id}`);
  return res.data;
};

export const ListType = async () => {
  const res = await axiosInstance.get(`/enums/RescueType`);
  return res.data;
};

export const ListStatus = async () => {
  const res = await axiosInstance.get(`/enums/RescueStatus`);
  return res.data;
};

export const getListMath = async (slug: string | null) => {
  if (!slug === null) return;
  const res = await axiosInstance.get(`/match/contest/${slug}`);
  return res.data;
};
