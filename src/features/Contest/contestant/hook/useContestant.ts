import { useMutation, useQuery } from "@tanstack/react-query";

import {
  type CreateContestantInput,
  type UpdateContestantInput,
  type DeleteContestanteInput,
  type ContestantQueryInput,
  type CreatesContestInput,
  type StudentQueryParams,
} from "../types/contestant.shame";

import {
  GetAll,
  GetById,
  GetAllNotCotest,
  GetListClassBySchool,
  GetListSchool,
  GetListRound,
  Create,
  Creates,
  Update,
  Delete,
  Deletes,
  GetContestantStatus,
  GetAllSutent,
} from "../service/api";

export const useGetAll = (
  filter: ContestantQueryInput,
  slug: string | null
) => {
  return useQuery({
    queryKey: ["contestant-contest", filter],
    queryFn: () => GetAll(filter, slug),
    placeholderData: prevData => prevData,
  });
};

export const useGetAllNotContest = (
  filter: ContestantQueryInput,
  slug: string | null
) => {
  return useQuery({
    queryKey: ["contestant-not-contest", filter],
    queryFn: () => GetAllNotCotest(filter, slug),
    placeholderData: prevData => prevData,
  });
};

export const useGetStudent = (
  filter: StudentQueryParams,
  slug: string | null
) => {
  return useQuery({
    queryKey: ["contestant-not-contest", filter, slug],
    queryFn: () => GetAllSutent(filter, slug),
    placeholderData: prevData => prevData,
  });
};

export const useGetById = (id: number | null) => {
  return useQuery({
    queryKey: ["contestants", id],
    queryFn: () => GetById(id),
    enabled: !!id,
  });
};

export const useCreate = () => {
  return useMutation({
    mutationFn: ({
      payload,
      slug,
    }: {
      payload: CreateContestantInput;
      slug: string | null;
    }) => Create(payload, slug),
  });
};

export const useCreates = () => {
  return useMutation({
    mutationFn: ({
      payload,
      slug,
    }: {
      payload: CreatesContestInput;
      slug: string | null;
    }) => Creates(payload, slug),
  });
};

export const useDelete = () => {
  return useMutation({
    mutationFn: (id: number) => Delete(id),
  });
};

export const useDeletes = () => {
  return useMutation({
    mutationFn: (ids: DeleteContestanteInput) => Deletes(ids),
  });
};

export const useUpdate = () => {
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateContestantInput;
    }) => Update(id, payload),
  });
};

export const useContestStatus = () => {
  return useQuery({
    queryKey: ["useContetnetStatus"],
    queryFn: () => GetContestantStatus(),
  });
};

export const useListRound = (slug: string | null) => {
  return useQuery({
    queryKey: ["useListRoundContestTant", slug],
    queryFn: () => GetListRound(slug),
  });
};

export const useGetListSchool = () => {
  return useQuery({
    queryKey: ["useGetListSchool"],
    queryFn: () => GetListSchool(),
  });
};

export const useClassSchoolId = (schooId: number | null) => {
  return useQuery({
    queryKey: ["useClassSchoolId", schooId],
    queryFn: () => GetListClassBySchool(schooId),
  });
};
