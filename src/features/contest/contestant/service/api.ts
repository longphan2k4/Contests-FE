import axiosInstance from "../../../../config/axiosInstance";

import {
  type CreateContestantInput,
  type UpdateContestantInput,
  type DeleteContestanteInput,
  type ContestantQueryInput,
  type CreatesContestInput,
} from "../types/contestant.shame";

export const GetAll = async (
  params: ContestantQueryInput,
  slug: string | null
) => {
  // Convert schoolIds and classIds to comma-separated strings if they exist
  const queryParams = {
    ...params,
    // truyền string vào để axios tự động chuyển đổi thành query string
    schoolIds: params.schoolIds ? params.schoolIds.join(",") : undefined,
    classIds: params.classIds ? params.classIds.join(",") : undefined,
  };
  const res = await axiosInstance.get(`/contestant/contest/${slug}`, {
    params: queryParams,
  });
  return res.data;
};

export const GetAllNotCotest = async (
  params: ContestantQueryInput,
  slug: string | null
) => {
  const res = await axiosInstance.get(`/contestant/not-contest/${slug}`, {
    params,
  });
  return res.data;
};

export const GetAllSutent = async (
  params: ContestantQueryInput,
  slug: string | null
) => {
  if (!slug) return;
  const res = await axiosInstance.get(
    `/student/not-contest/${slug}?isActive=true`,
    {
      params,
    }
  );
  return res.data;
};

export const GetById = async (id: number | null) => {
  const res = await axiosInstance.get(`/contestant/${id}`);
  return res.data.data;
};

export const Create = async (
  payload: CreateContestantInput,
  slug: string | null
) => {
  const res = await axiosInstance.post(`/contestant/contest/${slug}`, payload);
  return res.data;
};

export const Creates = async (
  payload: CreatesContestInput,
  slug: string | null
) => {
  const res = await axiosInstance.post(
    `/contestant/bulk/contest/${slug}`,
    payload
  );
  return res.data;
};

export const Update = async (id: number, payload: UpdateContestantInput) => {
  const res = await axiosInstance.patch(`/contestant/${id}`, payload);
  return res.data;
};

export const Deletes = async (ids: DeleteContestanteInput) => {
  const res = await axiosInstance.post("/contestant/delete-many", ids);
  return res.data;
};

export const Delete = async (id: number) => {
  const res = await axiosInstance.delete(`/contestant/${id}`);
  return res.data;
};

export const GetContestantStatus = async () => {
  const res = await axiosInstance.get(`/enums/ContestantStatus`);
  return res.data;
};

export const GetListSchool = async () => {
  const res = await axiosInstance.get(`/school/get-school`);
  return res.data;
};

export const GetListRound = async (slug: string | null) => {
  if (!slug) return;
  const res = await axiosInstance.get(`/round/contest/${slug}/get-round`);
  return res.data;
};

export const GetListClassBySchool = async (schoolId: number | null) => {
  const res = await axiosInstance.get(`/class/school/${schoolId}`);
  return res.data;
};

export const GetListContestNotSlug = async (slug: string | null) => {
  const res = await axiosInstance.get(`/contest/not-conest/${slug}`);
  return res.data;
};

export const GetListRoundByContestId = async (contestId: number | null) => {
  const res = await axiosInstance.get(`/round/list-round/${contestId}`);
  return res.data;
};