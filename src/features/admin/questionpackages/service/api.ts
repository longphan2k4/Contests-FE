import axiosInstance from "../../../../config/axiosInstance";
import {
  type CreateQuestionPackageInput,
  type UpdateQuestionPackageInput,
  type QuestionPackageQuery,
  type deleteQuestionPackagesType,
} from "../types/questionpackages.shame";

export const getAllQuestionPackages = async (
  params: QuestionPackageQuery = {}
) => {
  const res = await axiosInstance.get("/question-packages", { params });
  return res.data;
};
export const getQuestionPackageById = async (id: number | null) => {
  const res = await axiosInstance.get(`/question-packages/${id}`);
  return res.data.data;
};

export const CreateQuestionPackage = async (
  payload: CreateQuestionPackageInput
) => {
  const res = await axiosInstance.post("/question-packages", payload);
  return res.data;
};

export const UpdateQuestionPackage = async (
  id: number,
  payload: UpdateQuestionPackageInput
) => {
  const res = await axiosInstance.put(`/question-packages/${id}`, payload);
  return res.data;
};

export const ToggleActive = async (id: number) => {
  const res = await axiosInstance.patch(
    `/question-packages/${id}/toggle-active`
  );
  return res.data;
};

export const DeleteQuestionPackages = async (
  ids: deleteQuestionPackagesType
) => {
  const res = await axiosInstance.post("/question-packages/delete-many", ids);
  return res.data;
};

export const DeleteQuestionPackage = async (id: number) => {
  const res = await axiosInstance.patch(`/question-packages/${id}`);
  return res.data;
};
