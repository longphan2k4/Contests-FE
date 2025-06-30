import React, { useMemo, useEffect } from "react";
import { Button } from "@mui/material";
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
    },
  });

  const { slug } = useParams();

  const { data: listStatus } = useStatus();
  const { data: listRound } = useListRound(slug ?? null);
  const { data: listQuestionPackage } = useListQuestionPackage();

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
  }, [isOpen]);
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
          label="Xác nhận ở câu"
          placeholder="Nhập số câu hiện tại"
          error={errors.currentQuestion}
          register={register("currentQuestion")}
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
