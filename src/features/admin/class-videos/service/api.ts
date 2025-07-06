import axiosInstance from "../../../../config/axiosInstance";
import {
  type CreateClassVideoInput,
  type UpdateClassVideoInput,
  type ClassVideoQuery,
  type deleteClassVideosType,
} from "../types/class-video.shame";

export const getAllClassVideos = async (
  slug: string,
  filter: ClassVideoQuery = {}
) => {
  const params = new URLSearchParams();
  if (filter.search) params.append("search", filter.search);
  if (filter.page) params.append("page", String(filter.page));
  if (filter.limit) params.append("limit", String(filter.limit));

  const res = await axiosInstance.get(`/class-video/contest/${slug}`, {
    params,
  });
  return res.data;
};

export const getClassVideoById = async (id: number | null) => {
  const res = await axiosInstance.get(`/class-video/${id}`);
  return res.data.data;
};

export const CreateClassVideo = async (
  slug: string,
  payload: CreateClassVideoInput
) => {
  const formData = new FormData();

  formData.append("name", payload.name);
  if (payload.slogan) {
    formData.append("slogan", payload.slogan);
  }
  formData.append("classId", String(payload.classId));
  formData.append("videos", payload.videos);

  const res = await axiosInstance.post(
    `/class-video/contest/${slug}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

export const UpdateClassVideo = async (
  id: number,
  payload: UpdateClassVideoInput
) => {
  const formData = new FormData();
  payload.name && formData.append("name", payload.name);
  payload.slogan && formData.append("slogan", payload.slogan);
  payload.videos && formData.append("videos", payload.videos);

  const res = await axiosInstance.patch(`/class-video/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const DeleteClassVideos = async (ids: deleteClassVideosType) => {
  const res = await axiosInstance.post("/class-video/delete-many", ids);
  return res.data;
};

export const DeleteClassVideo = async (id: number) => {
  const res = await axiosInstance.delete(`/class-video/${id}`);
  return res.data;
};

export const listClass = async () => {
  const res = await axiosInstance.get(`/class/list-class`);
  return res.data;
};
