import React, { useEffect } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import { Box, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateAwardSchema, type UpdateAwardInput,awardTypeOptions } from "../types/award.shame";
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
        contestantId: award.contestantId,
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
            label="ID Thí sinh (tùy chọn)"
            id="contestant_id"
            placeholder="Nhập ID thí sinh (để trống nếu chưa có)"
            type="number"
            error={errors.contestantId}
            register={register("contestantId", { valueAsNumber: true })}
          />
          <Box sx={{ mt: 2 }}>
          <label htmlFor="type">Loại giải</label>
          <select
            id="type"
            {...register("type")}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          >
            <option value="">Chọn loại giải</option>
            {awardTypeOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          {errors.type && (
            <p style={{ color: "red", marginTop: "4px" }}>{errors.type.message}</p>
          )}
        </Box>

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
