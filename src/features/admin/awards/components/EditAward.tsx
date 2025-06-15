import React, { useEffect } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import { Box, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateAwardSchema, type UpdateAwardInput } from "../types/award.shame";

import { useAwardById } from "../hook/useAwardById";

interface EditAwardProps {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateAwardInput) => void;
}

export default function EditeAward({
  id,
  isOpen,
  onClose,
  onSubmit,
}: EditAwardProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateAwardInput>({
    resolver: zodResolver(UpdateAwardSchema),
  });

  const { data: award } = useAwardById(id);

  useEffect(() => {
    if (award) {
      reset({
        name: award.name,
        contest_id: award.contest_id,
        contestant_id: award.contestant_id,
        type: award.type,
      });
    }
  }, [award, reset, isOpen]);

  const handleFormSubmit = (data: UpdateAwardInput) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title={`Cập nhật giải thưởng "${award?.name}"`}
        maxWidth="sm"
      >
        <form onSubmit={handleSubmit(handleFormSubmit)}>
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
            type="number"
            error={errors.contest_id}
            register={register("contest_id", { valueAsNumber: true })}
          />
          <FormInput
            label="ID Thí sinh"
            id="contestant_id"
            placeholder="Nhập contestant_id"
            type="number"
            error={errors.contestant_id}
            register={register("contestant_id", { valueAsNumber: true })}
          />
          <FormInput
            label="Loại giải"
            id="type"
            placeholder="Nhập loại giải (VD: Gold, Silver, Bronze)"
            error={errors.type}
            register={register("type")}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2, float: "right" }}
          >
            Cập nhật
          </Button>
        </form>
      </AppFormDialog>
    </Box>
  );
}
