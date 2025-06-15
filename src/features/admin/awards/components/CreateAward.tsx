import React, { useEffect } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import { Box, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateAwardSchema, type CreateAwardInput } from "../types/award.shame";

interface CreateAwardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAwardInput) => void;
}

export default function CreateAwardDialog({
  isOpen,
  onClose,
  onSubmit,
}: CreateAwardDialogProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateAwardInput>({
    resolver: zodResolver(CreateAwardSchema),
    defaultValues: {
      name: "",
      contest_id: undefined,
      contestant_id: undefined,
      type: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const handleFormSubmit = (data: CreateAwardInput) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title="Thêm giải thưởng"
        maxWidth="sm"
      >
        <form id="create-award-form" onSubmit={handleSubmit(handleFormSubmit)}>
          <FormInput
            label="Tên giải thưởng"
            id="name"
            placeholder="Nhập tên giải thưởng"
            error={errors.name}
            register={register("name")}
          />
          <FormInput
            label="ID Cuộc thi"
            id="contest_id"
            placeholder="Nhập contest_id"
            error={errors.contest_id}
            register={register("contest_id", { valueAsNumber: true })}
            type="number"
          />
          <FormInput
            label="ID Thí sinh"
            id="contestant_id"
            placeholder="Nhập contestant_id"
            error={errors.contestant_id}
            register={register("contestant_id", { valueAsNumber: true })}
            type="number"
          />
          <FormInput
            label="Loại giải"
            id="type"
            placeholder="Nhập loại giải (ví dụ: Gold, Silver...)"
            error={errors.type}
            register={register("type")}
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
    </Box>
  );
}
