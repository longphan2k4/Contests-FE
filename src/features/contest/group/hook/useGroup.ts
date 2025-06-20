import { useMutation, useQuery } from "@tanstack/react-query";
import {
  type CreateGroupInput,
  type UpdateGroupInput,
  type DeleteGroupsInput,
  type GroupQueryInput,
} from "../types/group.shame";
import {
  getAll,
  getById,
  Create,
  Update,
  Delete,
  Deletes,
  getListUser,
  getListMath,
} from "../service/api";

export const useGetAll = (filter: GroupQueryInput, slug: string | null) => {
  return useQuery({
    queryKey: ["groups", filter],
    queryFn: () => getAll(filter, slug),
    placeholderData: prevData => prevData,
  });
};

export const useGetById = (id: number | null) => {
  return useQuery({
    queryKey: ["group", id],
    queryFn: () => getById(id),
    enabled: !!id,
  });
};

export const useCreate = () => {
  return useMutation({
    mutationFn: ({
      payload,
    }: {
      payload: CreateGroupInput;
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
    mutationFn: (ids: DeleteGroupsInput) => Deletes(ids),
  });
};

export const useUpdate = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateGroupInput }) =>
      Update(id, payload),
  });
};

export const useListUser = () => {
  return useQuery({
    queryKey: ["getlistuser"],
    queryFn: () => getListUser(),
  });
};

export const useListMatch = (slug: string | null) => {
  return useQuery({
    queryKey: ["getlistmatch", slug],
    queryFn: () => getListMath(slug),
  });
};
