import axiosInstance from "../../../../config/axiosInstance";
import {
  type SponsorIdParam,
  type CreateSponsorInput,
  type UpdateSponsorInput,
  type SponsorQuery,
  type deleteSponsorsType,
  type UploadSponsorMediaInput
} from "../types/sponsors.shame";

export const getAllSponsors = async (slug: string, filter: SponsorQuery) => {
  const params = new URLSearchParams();
  if (filter.search) params.append("search", filter.search);
  if (filter.page) params.append("page", String(filter.page));
  if (filter.limit) params.append("limit", String(filter.limit));

  const res = await axiosInstance.get(`/sponsors/contest/${slug}?${params}`);
  return res.data.data; // chỉ return mảng data
};

export const getSponsorById = async (id: number | null) => {
  const res = await axiosInstance.get(`/sponsors/${id}`);
  return res.data.data;
};

export const getStatistics = async () => {
  const res = await axiosInstance.get(`/sponsors/statistics`);
  return res.data; // chỉ return mảng data
};

export const CreateSponsor = async (payload: CreateSponsorInput) => {
  const res = await axiosInstance.post("/sponsors", payload);
  return res.data;
};

export const UpdateSponsor = async (
  id: number,
  data: {
    name?: string;
    logo?: File;
    images?: File;
    videos?: string;
  }
) => {
  const formData = new FormData();

  // Chỉ append nếu có giá trị
  if (data.name) formData.append("name", data.name);
  if (data.logo) formData.append("logo", data.logo);
  if (data.images) formData.append("images", data.images);
  if (data.videos) formData.append("videos", data.videos);

  const res = await axiosInstance.patch(`/sponsors/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const ToggleActive = async (id: number) => {
  const res = await axiosInstance.patch(`/sponsors/${id}/toggle-active`);
  return res.data;
};

export const DeleteSponsors = async (ids: deleteSponsorsType) => {
  const res = await axiosInstance.delete("/sponsors/batch", {
    data: ids,
  });
  return res.data;
};

export const DeleteSponsor = async (id: number) => {
  const res = await axiosInstance.delete(`/sponsors/${id}`);
  return res.data;
};


export const uploadSponsorMedia = async (payload: UploadSponsorMediaInput) => {
  const { id, logo, videos, images } = payload;
  const formData = new FormData();

  if (logo) formData.append("logo", logo);
  if (videos) formData.append("videos", videos);
  if (images) formData.append("images", images);

  const res = await axiosInstance.post(`/sponsors/${id}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};


export const createSponsorForContest = async (
  slug: string,
  data: {
    name: string;
    logo?: File;
    images?: File;
    videos?: string;
  }
) => {
  const formData = new FormData();
  formData.append("name", data.name);
  if (data.logo) formData.append("logo", data.logo);
  if (data.images) formData.append("images", data.images);
  if (data.videos) formData.append("videos", data.videos); // string dạng URL

  const res = await axiosInstance.post(`/sponsors/contest/${slug}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};