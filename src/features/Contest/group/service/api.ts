import axiosInstance from "../../../../config/axiosInstance";
import {
  type CreateGroupInput,
  type UpdateGroupInput,
  type DeleteGroupsInput,
  type GroupQueryInput,
} from "../types/group.shame";

export const getAll = async (params: GroupQueryInput, slug: string | null) => {
  const res = await axiosInstance.get(`/group/contest/${slug}`, { params });
  return res.data;
};
export const getById = async (id: number | null) => {
  const res = await axiosInstance.get(`/group/${id}`);
  return res.data.data;
};

export const Create = async (payload: CreateGroupInput) => {
  const res = await axiosInstance.post(`/group`, payload);
  return res.data;
};

export const Update = async (id: number, payload: UpdateGroupInput) => {
  const res = await axiosInstance.patch(`/group/${id}`, payload);
  return res.data;
};

export const Deletes = async (ids: DeleteGroupsInput) => {
  const res = await axiosInstance.post("/group/delete-many", ids);
  return res.data;
};

export const Delete = async (id: number) => {
  const res = await axiosInstance.delete(`/group/${id}`);
  return res.data;
};

export const getListUser = async () => {
  const res = await axiosInstance.get(`/user/get-user`);
  return res.data;
};

export const getListMath = async (slug: string | null) => {
  if (!slug === null) return;
  const res = await axiosInstance.get(`/match/contest/${slug}`);
  return res.data;
};
