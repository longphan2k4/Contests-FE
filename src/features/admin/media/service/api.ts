import axiosInstance from "../../../../config/axiosInstance";
import {
  //type AwardIdParam,
  type CreateMediaInput,
  type UpdateMediaInput,
  type MediaQuery,
  type DeleteMediasType,
} from "../types/media.shame";

export const getAllMedias = async (slug: string,filter: MediaQuery = {}) => {
  const params = new URLSearchParams();
  if (filter.search) params.append("search", filter.search);
  if (filter.page) params.append("page", String(filter.page));
  if (filter.limit) params.append("limit", String(filter.limit));

  const res = await axiosInstance.get(`/media/contest/${slug}?${params}`);
  return res.data;
};

export const getMediaById = async (id: number | null) => {
  const res = await axiosInstance.get(`/media/${id}`);
  return res.data.data;
};

// export const CreateMedia = async (slug: string,payload: CreateMediaInput) => {
//   const res = await axiosInstance.post(`/media/contest/${slug}`, payload);
//   return res.data;
// };

export const CreateMedia = async (slug: string, payload: CreateMediaInput) => {
  const formData = new FormData();

  formData.append("media", payload.url);
  formData.append("type", payload.type);

  const res = await axiosInstance.post(`/media/contest/${slug}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};


// export const UpdateMedia = async (id: number, payload: UpdateMediaInput) => {
//   const res = await axiosInstance.patch(`/media/${id}`, payload);
//   return res.data;
// };


export const UpdateMedia = async (id: number, payload: UpdateMediaInput) => {
  const formData = new FormData();
  console.log(payload.url)
  payload.url && formData.append("media", payload.url);
  payload.type && formData.append("type", payload.type);

  const res = await axiosInstance.patch(`/media/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};


export const ToggleActive = async (id: number) => {
  const res = await axiosInstance.patch(`/media/${id}/toggle-active`);
  return res.data;
};

export const DeleteMedias = async (ids: DeleteMediasType) => {
  const res = await axiosInstance.post("/media/delete-many", ids);
  return res.data;
};



export const DeleteMedia = async (id: number) => {
  const res = await axiosInstance.delete(`/media/${id}`);
  return res.data;
};
