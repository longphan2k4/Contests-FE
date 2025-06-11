import React from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import { Box, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type CreateUpdateQuestionPackageInput, CreateUpdateQuestionPackageSchema } from "../types/questionpackages.shame";

interface CreateQuestionPackageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUpdateQuestionPackageInput) => void;
}

export default function CreateQuestionPackageDialog({
  isOpen,
  onClose,
  onSubmit,
}: CreateQuestionPackageDialogProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUpdateQuestionPackageInput>({
    resolver: zodResolver(CreateUpdateQuestionPackageSchema),
    defaultValues: {
      isActive: true,
      name: "",
    },
  });

  const handleFormSubmit = (data: CreateUpdateQuestionPackageInput) => {
    onSubmit(data);
    reset();
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
        <form id="create-question-package-form" onSubmit={handleSubmit(handleFormSubmit)}>
          <FormInput
            label="Tên gói câu hỏi"
            id="name"
            placeholder="Nhập tên gói câu hỏi"
            error={errors.name}
            register={register("name")}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2, display: "block" }}
          >
            Thêm gói câu hỏi mới
          </Button>
        </form>
      </AppFormDialog>
    </Box>
  );
}
