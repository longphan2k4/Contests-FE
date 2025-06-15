import axios from "axios";
import axiosInstance from "../../../../config/axiosInstance";
import {
  type RescueIdParam,
  type CreateRescueInput,
  type UpdateRescueInput,
  type RescueQuery,
  type deleteRescueType,
} from "../types/rescues.shame";

export const getAllRescues = async (params: RescueQuery = {}) => {
  const res = await axiosInstance.get("/rescue", { params });
  return res.data;
};
export const getRescueById = async (id: number | null) => {
  const res = await axiosInstance.get(`/rescue/${id}`);
  return res.data.data;
};

export const CreateRescue = async (payload: CreateRescueInput) => {
  const res = await axiosInstance.post("/rescue", payload);
  return res.data;
};

export const UpdateRescue = async (id: number, payload: UpdateRescueInput) => {
  const res = await axiosInstance.patch(`/rescue/${id}`, payload);
  return res.data;
};

export const ToggleActive = async (id: number) => {
  const res = await axiosInstance.patch(`/rescue/${id}/toggle-active`);
  return res.data;
};

export const DeleteRescues = async (ids: deleteRescueType) => {
  const res = await axiosInstance.post("/rescue/delete-many", ids);
  return res.data;
};

export const DeleteRescue = async (id: number) => {
  const res = await axiosInstance.delete(`/rescue/${id}`);
  return res.data;
};
