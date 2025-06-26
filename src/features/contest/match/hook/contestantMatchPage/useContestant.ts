import { useMutation, useQuery } from "@tanstack/react-query";

import {
    type CreateContestantInput,
    type UpdateContestantInput,
    type DeleteContestanteInput,
    type ContestantQueryInput,
    type CreatesContestInput,
    type StudentQueryParams,
} from "../../../contestant/types/contestant.shame";

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
} from "../../../contestant/service/api";

import { contestantMatchApi } from "../../service/contestant-match.api";
import type { ContestantMatchQueryInput } from "../../types/contestant-match.types";

export const useGetAll = (
    filter: ContestantQueryInput,
    slug: string | null,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: ["contestant-contest", filter],
        queryFn: () => GetAll(filter, slug),
        placeholderData: prevData => prevData,
        enabled: options?.enabled !== false,
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

export const useGetByIdAndContestSlug = (id: number, matchId: number) => {
    return useQuery({
        queryKey: ["contestants", id, matchId],
        queryFn: () => contestantMatchApi.getContestantInMatch(id, matchId),
        enabled: !!id && !!matchId,
        retry: false, // Không retry khi thí sinh không có trong match
        throwOnError: false, // Không throw error, return undefined thay vì
    });
};

// Lấy thông tin thí sinh với nhóm trong trận đấu hiện tại
export const useGetContestantWithGroups = ( 
   contestantId: number,
    contestSlug: string,
    matchId: number
) => {
    return useQuery({
        queryKey: ["contestant-with-groups", contestantId, contestSlug, matchId],
        queryFn: () => contestantMatchApi.getContestantWithGroups(contestantId, contestSlug, matchId),
        enabled: !!contestantId && !!matchId && !!contestSlug,
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

// lấy danh sách các trận trong cuộc thi theo slug cuộc thi: /contest/:slug/matches 
export const useGetMatchesByContestSlug = (contestSlug: string) => {
    return useQuery({
        queryKey: ["matches-by-contest-slug", contestSlug],
        queryFn: () => contestantMatchApi.getMatchesByContestSlug(contestSlug),
        enabled: !!contestSlug,
    });
};

// lấy danh sách thí sinh trong trận đấu theo slug cuộc thi và id trận đấu
export const useGetContestantsInMatch = (
    contestSlug: string,
    matchId: number,
    params: ContestantMatchQueryInput = {},
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: ["contestants-in-match", contestSlug, matchId, params],
        queryFn: () => contestantMatchApi.getContestantsInMatch(contestSlug, matchId, params),
        enabled: options?.enabled !== false && !!contestSlug && !!matchId,
        placeholderData: prevData => prevData,
    });
};

// Định nghĩa kiểu dữ liệu cho trọng tài
export interface JudgeInfo {
    id: number;
    username: string;
    email: string;
}

// Định nghĩa kiểu dữ liệu cho trận đấu
export interface MatchInfo {
    id: number;
    name: string;
    slug: string | null;
}
