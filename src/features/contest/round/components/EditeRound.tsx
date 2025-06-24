import React, { useEffect } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";

import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import FormSwitch from "../../../../components/FormSwitch";

import { UpdateRoundSchema, type UpdateRoundInput } from "../types/round.shame";
import { useGetById } from "../hook/useRound";

interface EditClassProps {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateRoundInput) => void;
}

export default function EditClass({
  id,
  isOpen,
  onClose,
  onSubmit,
}: EditClassProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<UpdateRoundInput>({
    resolver: zodResolver(UpdateRoundSchema),
  });

  const { data: round, isLoading, isError, refetch } = useGetById(id);

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  useEffect(() => {
    if (isOpen && round) {
      reset({
        name: round.name,
        index: round.index,
        isActive: round.isActive,
        startTime: dayjs(round.startTime).format("YYYY-MM-DDTHH:mm"),
        endTime: dayjs(round.endTime).format("YYYY-MM-DDTHH:mm"),
      });
    }
  }, [isOpen, round, reset]);

  const handleFormSubmit = (formData: UpdateRoundInput) => {
    onSubmit(formData);
    onClose();
  };

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );

  if (isError) return <div>Không thể tải dữ liệu</div>;

  return (
    <AppFormDialog
      open={isOpen}
      onClose={onClose}
      title={`Cập vòng đấu ${round?.name || ""}`}
      maxWidth="sm"
    >
      <form id="edit-class-form" onSubmit={handleSubmit(handleFormSubmit)}>
        <FormInput
          id="name"
          label="Tên vòng đấu"
          placeholder="Nhập tên vòng đấu"
          register={register("name")}
          error={errors.name}
        />

        <FormInput
          id="index"
          label="Thứ tự"
          placeholder="Nhập thứ tự"
          register={register("index")}
          error={errors.index}
          type="number"
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
