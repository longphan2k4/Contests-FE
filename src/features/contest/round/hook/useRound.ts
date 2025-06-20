import { useMutation, useQuery } from "@tanstack/react-query";
import {
  type RoundQueryInput,
  type CreateRoundInput,
  type UpdateRoundInput,
  type DeleteRoundsInput,
} from "../types/round.shame";
import {
  getAll,
  getById,
  Create,
  Update,
  ToggleActive,
  Delete,
  Deletes,
} from "../service/api";

export const useGetAll = (filter: RoundQueryInput, slug: string | null) => {
  return useQuery({
    queryKey: ["rounds", filter],
    queryFn: () => getAll(filter, slug),
    placeholderData: prevData => prevData,
  });
};

export const useGetById = (id: number | null) => {
  return useQuery({
    queryKey: ["round", id],
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
      payload: CreateRoundInput;
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
    mutationFn: (ids: DeleteRoundsInput) => Deletes(ids),
  });
};

export const useUpdate = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateRoundInput }) =>
      Update(id, payload),
  });
};

export const useToggleIsActive = () => {
  return useMutation({
    mutationFn: (id: number) => ToggleActive(id),
  });
};
