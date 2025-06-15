import axios from "axios";
import axiosInstance from "../../../../config/axiosInstance";
import {
  type AwardIdParam,
  type CreateAwardInput,
  type UpdateAwardInput,
  type AwardQuery,
  type deleteAwardsType,
} from "../types/award.shame";

export const getAllAwards = async (params: AwardQuery = {}) => {
  const res = await axiosInstance.get("/awards", { params });
  return res.data;
};
export const getAwardById = async (id: number | null) => {
  const res = await axiosInstance.get(`/awards/${id}`);
  return res.data.data;
};

export const CreateAward = async (payload: CreateAwardInput) => {
  const res = await axiosInstance.post("/awards", payload);
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
  const res = await axiosInstance.post("/awards/delete-many", ids);
  return res.data;
};

export const DeleteAward = async (id: number) => {
  const res = await axiosInstance.delete(`/awards/${id}`);
  return res.data;
};
