import axios from "axios";
import axiosInstance from "../../../../config/axiosInstance";
import {
  type SponsorIdParam,
  type CreateSponsorInput,
  type UpdateSponsorInput,
  type SponsorQuery,
  type deleteSponsorsType,
} from "../types/sponsors.shame";

export const getAllSponsors = async (params: SponsorQuery = {}) => {
  const res = await axiosInstance.get("/sponsors", { params });
  return res.data;
};
export const getSponsorById = async (id: number | null) => {
  const res = await axiosInstance.get(`/sponsors/${id}`);
  return res.data.data;
};

export const CreateSponsor = async (payload: CreateSponsorInput) => {
  const res = await axiosInstance.post("/sponsors", payload);
  return res.data;
};

export const UpdateSponsor = async (id: number, payload: UpdateSponsorInput) => {
  const res = await axiosInstance.patch(`/sponsors/${id}`, payload);
  return res.data;
};

export const ToggleActive = async (id: number) => {
  const res = await axiosInstance.patch(`/sponsors/${id}/toggle-active`);
  return res.data;
};

export const DeleteSponsors = async (ids: deleteSponsorsType) => {
  const res = await axiosInstance.post("/sponsors/delete-many", ids);
  return res.data;
};

export const DeleteSponsor = async (id: number) => {
  const res = await axiosInstance.delete(`/sponsors/${id}`);
  return res.data;
};
