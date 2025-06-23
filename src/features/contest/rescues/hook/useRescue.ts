import { useMutation, useQuery } from "@tanstack/react-query";
import {
  type CreateRescueInput,
  type UpdateRescueInput,
  type DeleteRescuesInput,
  type RescuesQueryInput,
} from "../types/rescue.shame";
import {
  getAll,
  getById,
  Create,
  Update,
  Delete,
  Deletes,
  ListType,
  ListStatus,
  getListMath,
} from "../service/api";

export const useGetAll = (filter: RescuesQueryInput, slug: string | null) => {
  return useQuery({
    queryKey: ["rescues", filter],
    queryFn: () => getAll(filter, slug),
    placeholderData: prevData => prevData,
  });
};

export const useGetById = (id: number | null) => {
  return useQuery({
    queryKey: ["rescue", id],
    queryFn: () => getById(id),
    enabled: !!id,
  });
};

export const useCreate = () => {
  return useMutation({
    mutationFn: ({
      payload,
    }: {
      payload: CreateRescueInput;
      slug: string | null;
    }) => Create(payload),
  });
};

export const useDelete = () => {
  return useMutation({
    mutationFn: (id: number) => Delete(id),
  });
};

export const useDeletes = () => {
  return useMutation({
    mutationFn: (ids: DeleteRescuesInput) => Deletes(ids),
  });
};

export const useUpdate = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateRescueInput }) =>
      Update(id, payload),
  });
};

export const useListType = () => {
  return useQuery({
    queryKey: ["getlisttype"],
    queryFn: () => ListType(),
  });
};

export const useListStatus = () => {
  return useQuery({
    queryKey: ["getliststatus"],
    queryFn: () => ListStatus(),
  });
};

export const useListMatch = (slug: string | null) => {
  return useQuery({
    queryKey: ["getlistmatch", slug],
    queryFn: () => getListMath(slug),
  });
};
