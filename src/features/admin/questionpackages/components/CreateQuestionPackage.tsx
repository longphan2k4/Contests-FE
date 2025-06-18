import React, { useEffect } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import { Box, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateQuestionPackageSchema, type CreateQuestionPackageInput } from "../types/questionpackages.shame";

import FormSwitch from "../../../../components/FormSwitch";
interface CreateQuestionPackageProp {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateQuestionPackageInput) => void;
}


export default function CreateQuestionPackage({
  isOpen,
  onClose,
  onSubmit,
}: CreateQuestionPackageProp): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },

    control,
    reset,
  } = useForm<CreateQuestionPackageInput>({
    resolver: zodResolver(CreateQuestionPackageSchema),
    defaultValues: {
      isActive: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);
  const handleFormSubmit = (data: CreateQuestionPackageInput) => {
    onSubmit(data);

    onClose();
  };
  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title="Thêm gói câu hỏi mới"
        maxWidth="sm"
      >
        <form id="create-school-form" onSubmit={handleSubmit(handleFormSubmit)}>
            <FormInput
              label="Tên gói câu hỏi"
              id="name"
              placeholder="Nhập tên gói câu hỏi"
              error={errors.name}
              register={register("name")}
            />

          <Controller
              name="isActive"
              control={control}
              defaultValue={true}
              render={({ field }) => (
                <FormSwitch
                  label="Trạng thái"
                  value={field.value}
                  onChange={field.onChange}
                />
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
    </Box>
  );
}
