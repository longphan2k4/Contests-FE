import React, { useEffect, useMemo } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useParams } from "react-router-dom";
import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import FormSelect from "../../../../components/FormSelect";

import {
  CreateRescuesShema,
  type CreateRescueInput,
} from "../types/rescue.shame";
import { useListMatch, useListType, useListStatus } from "../hook/useRescue";

interface CreateRescueProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRescueInput) => void;
}

export default function CreateRescue({
  isOpen,
  onClose,
  onSubmit,
}: CreateRescueProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<CreateRescueInput>({
    resolver: zodResolver(CreateRescuesShema),
  });

  const { slug } = useParams();

  const {
    data: ListType,
    refetch: refetchListType,
    isLoading: isListTypeLoading,
    isError: isListTypeError,
  } = useListType();

  const {
    data: ListStatus,
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
      refetchListType();
      refetchListStatus();
      refetchListMatches();
    }
  }, [isOpen, refetchListType, refetchListStatus, refetchListMatches]);

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
    if (ListType?.success && Array.isArray(ListType.data?.options)) {
      return ListType.data.options.map((item: any) => ({
        label: item.label,
        value: item.value,
      }));
    }
    return [];
  }, [ListType]);

  const status = useMemo(() => {
    if (ListStatus?.success && Array.isArray(ListStatus.data?.options)) {
      return ListStatus.data.options?.map((item: any) => ({
        label: item.label,
        value: item.value,
      }));
    }
    return [];
  }, [ListStatus]);

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const handleFormSubmit = (formData: CreateRescueInput) => {
    onSubmit(formData);
    onClose();
  };

  if (isListTypeLoading || isListStatusLoading || isListMatchesLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isListTypeError || isListStatusError || isListMatchesError) {
    return <div>Không thể tải dữ liệu</div>;
  }

  return (
    <AppFormDialog
      open={isOpen}
      onClose={onClose}
      title="Thêm cứu trợ mới"
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
          id="remainingContestants"
          label="Số thi sinh còn lại"
          placeholder="Nhập số thi sinh còn lại"
          error={errors.remainingContestants}
          register={register("remainingContestants", { valueAsNumber: true })}
          type="number"
        />

        {/* <FormInput
          id="index"
          label="Số thứ tự"
          placeholder="Nhập số thứ tự"
          error={errors.index}
          register={register("index", { valueAsNumber: true })}
          type="number"
        /> */}

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
