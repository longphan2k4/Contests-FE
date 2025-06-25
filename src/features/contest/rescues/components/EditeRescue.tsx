import React, { useEffect, useMemo } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import FormSelect from "../../../../components/FormSelect";

import {
  UpdateRescuesShema,
  type UpdateRescueInput,
} from "../types/rescue.shame";
import {
  useGetById,
  useListMatch,
  useListStatus,
  useListType,
} from "../hook/useRescue";

interface EditRescueProps {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateRescueInput) => void;
}

export default function EditRescue({
  id,
  isOpen,
  onClose,
  onSubmit,
}: EditRescueProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<UpdateRescueInput>({
    resolver: zodResolver(UpdateRescuesShema),
  });

  const { data: rescueData } = useGetById(id);
  const { slug } = useParams();

  const {
    data: listTypes,
    refetch: refetchListTypes,
    isLoading: isListTypesLoading,
    isError: isListTypesError,
  } = useListType();

  const {
    data: listStatus,
    refetch: refetchListStatus,
    isLoading: isListStatusLoading,
    isError: isListStatusError,
  } = useListStatus();

  const {
    data: listMatches,
    refetch: refetchListMatches,
    isLoading: isListMatchesLoading,
    isError: isListMatchesError,
  } = useListMatch(slug ?? null);

  useEffect(() => {
    if (isOpen) {
      refetchListTypes();
      refetchListStatus();
      refetchListMatches();
    }
  }, [isOpen, refetchListTypes, refetchListStatus, refetchListMatches]);

  // Memo hóa danh sách trường học để tránh re-render thừa
  const matches = useMemo(() => {
    if (listMatches?.success) {
      return listMatches.data.map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
    }
    return [];
  }, [listMatches]);

  const types = useMemo(() => {
    if (listTypes?.success && Array.isArray(listTypes.data?.options)) {
      return listTypes.data.options.map((item: any) => ({
        label: item.label,
        value: item.value,
      }));
    }
    return [];
  }, [listTypes]);

  const status = useMemo(() => {
    if (listStatus?.success && Array.isArray(listStatus.data?.options)) {
      return listStatus.data.options.map((item: any) => ({
        label: item.label,
        value: item.value,
      }));
    }
    return [];
  }, [listStatus]);

  useEffect(() => {
    if (isOpen && rescueData) {
      reset({
        name: rescueData.name,
        rescueType: rescueData.rescueType,
        questionFrom: rescueData.questionFrom,
        questionTo: rescueData.questionTo,
        status: rescueData.status,
        index: rescueData.index,
        remainingContestants: rescueData.remainingContestants,
        matchId: rescueData.matchId,
      });
    }
  }, [isOpen, rescueData, reset]);

  const handleFormSubmit = (formData: UpdateRescueInput) => {
    onSubmit(formData);
    onClose();
  };

  if (isListTypesLoading || isListStatusLoading || isListMatchesLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    ); // Hiển thị loading khi đang tải dữ liệu
  }

  if (isListTypesError || isListStatusError || isListMatchesError) {
    return <div>Không thể tải dữ liệu</div>;
  }

  return (
    <AppFormDialog
      open={isOpen}
      onClose={onClose}
      title={`Cập nhật lớp: ${rescueData?.name || ""}`}
      maxWidth="sm"
    >
      <form id="create-rescue-form" onSubmit={handleSubmit(handleFormSubmit)}>
        <FormInput
          id="name"
          label="Tên cưu trợ"
          placeholder="Nhập tên cưu trợ"
          error={errors.name}
          register={register("name")}
        />

        <FormSelect
          id="rescueType"
          name="rescueType"
          label="Chọn loại cứu trợ"
          options={types}
          control={control}
          error={errors.rescueType}
        />

        <FormInput
          id="questionFrom"
          label="Câu bắt đầu "
          placeholder="Nhập câu bắt đầu"
          error={errors.questionFrom}
          register={register("questionFrom", { valueAsNumber: true })}
          type="number"
        />

        <FormInput
          id="questionTo"
          label="Câu kết thúc"
          placeholder="Nhập câu kết thúc"
          error={errors.questionTo}
          register={register("questionTo", { valueAsNumber: true })}
          type="number"
        />

        <FormInput
          id="questionTo"
          label="Câu kết thúc"
          placeholder="Nhập câu kết thúc"
          error={errors.questionTo}
          register={register("questionTo", { valueAsNumber: true })}
          type="number"
        />

        <FormInput
          id="remainingContestants"
          label="Số thi sinh còn lại"
          placeholder="Nhập số thi sinh còn lại"
          error={errors.remainingContestants}
          register={register("remainingContestants", { valueAsNumber: true })}
          type="number"
        />

        <FormInput
          id="index"
          label="Số thứ tự"
          placeholder="Nhập số thứ tự"
          error={errors.index}
          register={register("index", { valueAsNumber: true })}
          type="number"
        />

        <FormSelect
          id="matchId"
          name="matchId"
          label="Chọn trận đấu"
          options={matches}
          control={control}
          error={errors.matchId}
        />

        <FormSelect
          id="status"
          name="status"
          label="Chọn trạng thái"
          options={status}
          control={control}
          error={errors.status}
        />

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 2, display: "block ", float: "right", marginTop: "24px" }}
        >
          Thêm
        </Button>
      </form>
    </AppFormDialog>
  );
}
