import React, { useMemo, useEffect } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import FormSelect from "../../../../components/FormSelect";
import FormSwitch from "../../../../components/FormSwitch";

import { CreateMatchSchema, type CreateMatchInput } from "../types/match.shame";

import {
  useListQuestionPackage,
  useListRound,
  useStatus,
} from "../hook/useMatch";

interface CreateMatchProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMatchInput) => void;
}

export default function CreateMatch({
  isOpen,
  onClose,
  onSubmit,
}: CreateMatchProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<CreateMatchInput>({
    resolver: zodResolver(CreateMatchSchema),
    defaultValues: {
      isActive: true,
      currentQuestion: 1,
      maxContestantColumn: 10,
    },
  });

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

  const roundOptions = useMemo(() => {
    if (listRound?.success) {
      return listRound.data.map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
    }
    return [];
  }, [listRound]);

  const questionPackageOptions = useMemo(() => {
    if (listQuestionPackage?.success) {
      return listQuestionPackage.data.map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
    }
    return [];
  }, [listQuestionPackage]);

  useEffect(() => {
    if (isOpen) {
      refetchRound();
      refetchQuestionPackage();
      refetchStatus();
    }
  }, [isOpen]);

  const statusOptions = useMemo(() => {
    if (listStatus?.success && Array.isArray(listStatus.data.options)) {
      return listStatus.data.options.map((item: any) => ({
        label: item.label,
        value: item.value,
      }));
    }
    return [];
  }, [listStatus]);

  const handleFormSubmit = (formData: CreateMatchInput) => {
    onSubmit(formData);
    onClose();
    reset(); // Reset form sau khi submit
  };

  useEffect(() => {
    if (!isOpen) reset(); // Reset lại khi đóng form
  }, [isOpen, reset]);

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
      title="Thêm trận đấu"
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
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
          options={roundOptions}
          control={control}
          error={errors.roundId}
        />

        <FormInput
          id="currentQuestion"
          label="Câu hỏi hiện tại"
          placeholder="Nhập câu hỏi hiện tại"
          error={errors.currentQuestion}
          register={register("currentQuestion")}
          type="number"
        />

        <FormInput
          id="maxContestantColumn"
          label="Số cột hiển thị thí sinh tối đa"
          placeholder="Nhập số cột (mặc định: 10)"
          error={errors.maxContestantColumn}
          register={register("maxContestantColumn")}
          type="number"
        />

        <FormSelect
          id="questionPackageId"
          name="questionPackageId"
          label="Chọn gói câu hỏi"
          options={questionPackageOptions}
          control={control}
          error={errors.questionPackageId}
        />

        <FormInput
          id="startTime"
          label="Thời gian bắt đầu"
          placeholder="Chọn thời gian bắt đầu"
          error={errors.startTime}
          register={register("startTime")}
          type="datetime-local"
        />

        <FormInput
          id="endTime"
          label="Thời gian kết thúc"
          placeholder="Chọn thời gian kết thúc"
          error={errors.endTime}
          register={register("endTime")}
          type="datetime-local"
        />

        <FormSelect
          id="status"
          name="status"
          label="Trạng thái"
          options={statusOptions}
          control={control}
          error={errors.status}
        />

        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <FormSwitch
              label="Trạng thái hoạt động"
              value={field.value ?? true}
              onChange={field.onChange}
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 2, float: "right" }}
        >
          Thêm
        </Button>
      </form>
    </AppFormDialog>
  );
}
