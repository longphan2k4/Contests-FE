import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";

import FormSwitch from "../../../../components/FormSwitch";

import { CreateRoundSchema, type CreateRoundInput } from "../types/round.shame";

interface CreateRoundProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRoundInput) => void;
}

export default function CreateRound({
  isOpen,
  onClose,
  onSubmit,
}: CreateRoundProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<CreateRoundInput>({
    resolver: zodResolver(CreateRoundSchema),
    defaultValues: {
      isActive: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const handleFormSubmit = (formData: CreateRoundInput) => {
    onSubmit(formData);
    onClose();
  };

  return (
    <AppFormDialog
      open={isOpen}
      onClose={onClose}
      title="Thêm vòng đấu mới"
      maxWidth="sm"
    >
      <form id="create-Round-form" onSubmit={handleSubmit(handleFormSubmit)}>
        <FormInput
          id="name"
          label="Tên vòng đấu"
          placeholder="Nhập tên vòng đấu"
          error={errors.name}
          register={register("name")}
        />

        <FormInput
          id="index"
          label="Thứ tự "
          placeholder="Nhập thứ tự vòng đấu"
          error={errors.index}
          register={register("index")}
          type={`number`}
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

        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <FormSwitch value={field.value} onChange={field.onChange} />
          )}
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
