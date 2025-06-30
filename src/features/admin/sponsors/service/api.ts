import axiosInstance from "../../../../config/axiosInstance";
import {
  type CreateSponsorForContestInput,
  type UpdateSponsorInput,
  type SponsorQuery,
  type deleteSponsorsType,
  type UploadSponsorMediaInput
} from "../types/sponsors.shame";

// Get sponsors by contest slug
export const getAllSponsors = async (slug: string, filter: SponsorQuery) => {
  const params = new URLSearchParams();
  if (filter.search) params.append("search", filter.search);
  if (filter.page) params.append("page", String(filter.page));
  if (filter.limit) params.append("limit", String(filter.limit));

  const res = await axiosInstance.get(`/sponsors/contest/${slug}?${params}`);
  return res.data.data;
};

// Get sponsor by ID
export const getSponsorById = async (id: number | null) => {
  const res = await axiosInstance.get(`/sponsors/${id}`);
  return res.data.data;
};

// Get sponsors statistics
export const getStatistics = async () => {
  const res = await axiosInstance.get(`/sponsors/statistics`);
  return res.data;
};

// Create sponsor for specific contest
export const createSponsorForContest = async (
  slug: string,
  data: CreateSponsorForContestInput
) => {
  const formData = new FormData();
  formData.append("name", data.name);
  
  if (data.logo) formData.append("logo", data.logo);
  if (data.images) formData.append("images", data.images);
  if (data.videos) formData.append("videos", data.videos);

  const res = await axiosInstance.post(`/sponsors/contest/${slug}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// Update sponsor
export const UpdateSponsor = async (
  id: number,
  data: UpdateSponsorInput
) => {
  const formData = new FormData();

  if (data.name) formData.append("name", data.name);
  if (data.logo) formData.append("logo", data.logo);
  if (data.images) formData.append("images", data.images);
  if (data.videos) formData.append("videos", data.videos);
  
  // Add removal flags - explicitly check for true
  if (data.removeLogo === true) formData.append("removeLogo", "true");
  if (data.removeImages === true) formData.append("removeImages", "true");
  if (data.removeVideos === true) formData.append("removeVideos", "true");

  const res = await axiosInstance.patch(`/sponsors/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// Delete sponsor
export const DeleteSponsor = async (id: number) => {
  const res = await axiosInstance.delete(`/sponsors/${id}`);
  return res.data;
};

// Batch delete sponsors  
export const DeleteSponsors = async (ids: deleteSponsorsType) => {
  const res = await axiosInstance.delete("/sponsors/batch", {
    data: ids,
  });
  return res.data;
};

// Upload sponsor media
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