import React, { useEffect } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import { Box, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateAwardSchema, type CreateAwardInput } from "../types/award.shame";

import FormSelect from "@/components/FormSelect";

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
    control,
  } = useForm<CreateAwardInput>({
    resolver: zodResolver(CreateAwardSchema),
    defaultValues: {},
  });

  const options = [
    { value: "firstPrize", label: "Giải Nhất" },
    { value: "secondPrize", label: "Giải Nhì" },
    { value: "thirdPrize", label: "Giải Ba" },
    { value: "fourthPrize", label: "Giải Khuyến Khích" },
    { value: "impressiveVideo", label: "Video Ấn Tượng" },
    { value: "excellentVideo", label: "Video Xuất Sắc" },
  ];

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

          <FormSelect
            label="Loại giải"
            id="type"
            name="type"
            placeholder="Chọn loại giải"
            options={options}
            control={control}
            error={errors.type}
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
