import React, { useEffect, useMemo } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import FormSelect from "../../../../components/FormSelect";

import { UpdateMatchSchema, type UpdateMatchInput } from "../types/match.shame";

import {
  useStatus,
  useListQuestionPackage,
  useListRound,
  useGetById,
} from "../hook/useMatch";
import FormSwitch from "../../../../components/FormSwitch";
import dayjs from "dayjs";

interface EditeMatchProps {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateMatchInput) => void;
}

export default function EditeMatch({
  id,
  isOpen,
  onClose,
  onSubmit,
}: EditeMatchProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<UpdateMatchInput>({
    resolver: zodResolver(UpdateMatchSchema),
  });

  const { data: matchData } = useGetById(id);

  const { slug } = useParams();

  const {
    data: listStatus,
    refetch: refetchStatus,
    isError: isStatusError,
    isLoading: isStatusLoading,
  } = useStatus();

  const {
    data: listRound,
    refetch: refetchRound,
    isError: isRoundError,
    isLoading: isRoundLoading,
  } = useListRound(slug ?? null);

  const {
    data: listQuestionPackage,
    refetch: refetchQuestionPackage,
    isError: isQuestionPackageError,
    isLoading: isQuestionPackageLoading,
  } = useListQuestionPackage();

  useEffect(() => {
    refetchRound();
    refetchStatus();
    refetchQuestionPackage();
  }, [refetchRound, refetchStatus, refetchQuestionPackage, isOpen]);

  // Memo hóa danh sách trường học để tránh re-render thừa
  const round = useMemo(() => {
    if (listRound?.success) {
      return listRound.data.map((item: { id: number; name: string }) => ({
        label: item.name,
        value: item.id,
      }));
    }
    return [];
  }, [listRound]);

  // Memo hóa danh sách trường học để tránh re-render thừa
  const questionPackage = useMemo(() => {
    if (listQuestionPackage?.success) {
      return listQuestionPackage.data.map((item: { id: number; name: string }) => ({
        label: item.name,
        value: item.id,
      }));
    }
    return [];
  }, [listQuestionPackage]);

  const status = useMemo(() => {
    if (listStatus?.success && Array.isArray(listStatus.data.options)) {
      return listStatus.data.options.map((item: { label: string; value: string }) => ({
        label: item.label,
        value: item.value,
      }));
    }
    return [];
  }, [listStatus]);

  useEffect(() => {
    if (isOpen && matchData) {
      reset({
        name: matchData.name,
        roundId: matchData.roundId,
        status: matchData.status,
currentQuestion: matchData.currentQuestion,
        questionPackageId: matchData.questionPackageId,
        isActive: matchData.isActive,
        startTime: dayjs(matchData.startTime).format("YYYY-MM-DDTHH:mm"),
        endTime: dayjs(matchData.endTime).format("YYYY-MM-DDTHH:mm"),
        remainingTime: matchData.remainingTime,
      });
    }
  }, [isOpen, matchData, reset]);

  const handleFormSubmit = (formData: UpdateMatchInput) => {
    onSubmit(formData);
    onClose();
  };

  if (isStatusLoading || isRoundLoading || isQuestionPackageLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isStatusError || isRoundError || isQuestionPackageError) {
    return <div>Không thể tải dữ liệu</div>;
  }

  return (
    <AppFormDialog
      open={isOpen}
      onClose={onClose}
      title={`Cập nhật trận đấu: ${matchData?.name || ""}`}
      maxWidth="sm"
    >
      <form id="create-class-form" onSubmit={handleSubmit(handleFormSubmit)}>
        <FormInput
          id="name"
          label="Tên trận đấu"
          placeholder="Nhập tên trận đấu"
          error={errors.name}
          register={register("name")}
        />
        <FormSelect
          id="roundId"
          name="roundId"
          label="Tên vòng đấu"
          options={round}
          control={control}
          error={errors.roundId}
        />
        <FormInput
          id="remainingTime"
          label="Thời gian câu hỏi còn lại"
          placeholder="Nhập số câu hiện tại"
          error={errors.remainingTime}
          register={register("remainingTime")}
          type="number"
        />
        <FormInput
          id="currentQuestion"
          label="Xác nhận ở câu"
          placeholder="Nhập xác nhận ở câu"
          error={errors.currentQuestion}
          register={register("currentQuestion")}
          type="number"
        />

        <FormSelect
          id="questionPackageId"
          name="questionPackageId"
          label="Chọn gói câu hỏi "
          options={questionPackage}
          control={control}
          error={errors.questionPackageId}
        />

        <FormInput
          id="startTime"
          label="Thời gian bắt đầu"
          placeholder="Nhập thời gian bắt đầu"
          error={errors.startTime}
          register={register("startTime")}
          type="datetime-local"
        />

        <FormInput
          id="endTime"
          label="Thứ tự vòng đấu"
          placeholder="Nhập thứ tự"
          error={errors.endTime}
          register={register("endTime")}
          type="datetime-local"
        />

        <FormSelect
          id="status"
          name="status"
          label="Trạng thái"
          options={status}
          control={control}
          error={errors.status}
        />
        <Controller
name="isActive"
          control={control}
          render={({ field }) => (
            <FormSwitch
              value={field.value ?? false}
              onChange={field.onChange}
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 2, display: "block ", float: "right", marginTop: "24px" }}
        >
          Cập nhật
        </Button>
      </form>
    </AppFormDialog>
  );
}