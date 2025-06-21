import React, { useEffect } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import { Box, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateAwardSchema, type CreateAwardInput ,awardTypeOptions } from "../types/award.shame";

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
            {...(errors.name && { error: errors.name })}
            register={register("name")}
          />          
          <FormInput
            label="ID Thí sinh (tùy chọn)"
            id="contestantId"
            placeholder="Nhập ID thí sinh (để trống nếu chưa có)"
            {...(errors.contestantId && { error: errors.contestantId })}
            register={register("contestantId", { 
              valueAsNumber: true
            })}
            type="number"
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
            Thêm
          </Button>
        </form>
      </AppFormDialog>
    </Box>
  );
}
