import { useMutation, useQuery } from "@tanstack/react-query";
import {
  type CreateMatchInput,
  type UpdateMatchInput,
  type DeleteMatchInput,
  type MatchQueryInput,
} from "../types/match.shame";

import {
  getAll,
  getById,
  Create,
  Update,
  Delete,
  Deletes,
  getListRound,
  getStatus,
  getListQuestionPackage,
  ToggleActive,
} from "../service/api";

export const useGetAll = (filter: MatchQueryInput, slug: string | null) => {
  return useQuery({
    queryKey: ["matches", filter],
    queryFn: () => getAll(filter, slug),
    placeholderData: prevData => prevData,
  });
};

export const useGetById = (id: number | null) => {
  return useQuery({
    queryKey: ["match", id],
    queryFn: () => getById(id),
    enabled: !!id,
  });
};

export const useCreate = () => {
  return useMutation({
    mutationFn: ({
      payload,
      slug,
    }: {
      payload: CreateMatchInput;
      slug: string | null;
    }) => Create(payload, slug),
  });
};

export const useDelete = () => {
  return useMutation({
    mutationFn: (id: number) => Delete(id),
  });
};

export const useDeletes = () => {
  return useMutation({
    mutationFn: (ids: DeleteMatchInput) => Deletes(ids),
  });
};

export const useUpdate = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateMatchInput }) =>
      Update(id, payload),
  });
};

export const useStatus = () => {
  return useQuery({
    queryKey: ["userStatus"],
    queryFn: () => getStatus(),
  });
};

export const useListRound = (slug: string | null) => {
  return useQuery({
    queryKey: ["useListRound", slug],
    queryFn: () => getListRound(slug),
  });
};

export const useListQuestionPackage = () => {
  return useQuery({
    queryKey: ["useListQuestionPackage"],
    queryFn: () => getListQuestionPackage(),
  });
};

export const useToggleIsActive = () => {
  return useMutation({
    mutationFn: (id: number) => ToggleActive(id),
  });
};
