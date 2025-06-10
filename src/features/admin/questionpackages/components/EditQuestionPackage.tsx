import React, { useEffect } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import { Box, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateUpdateQuestionPackageSchema,
  type CreateUpdateQuestionPackageInput,
  type QuestionPackage,
} from "../types/questionpackages.shame";

import FormSwitch from "../../../../components/FormSwitch";

interface EditQuestionPackageProps {
  questionPackage: QuestionPackage | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUpdateQuestionPackageInput) => void;
}

export default function EditQuestionPackage({
  questionPackage,
  isOpen,
  onClose,
  onSubmit,
}: EditQuestionPackageProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<CreateUpdateQuestionPackageInput>({
    resolver: zodResolver(CreateUpdateQuestionPackageSchema),
    defaultValues: {
      name: questionPackage?.name ?? "",
      isActive: questionPackage?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (questionPackage) {
      reset({
        name: questionPackage.name,
        isActive: questionPackage.isActive,
      });
    }
  }, [questionPackage, reset]);

  const handleFormSubmit = (data: CreateUpdateQuestionPackageInput) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title={`Cập nhật ${questionPackage?.name}`}
        maxWidth="sm"
      >
        <form id="edit-question-package-form" onSubmit={handleSubmit(handleFormSubmit)}>
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
                value={field.value ?? false}
                onChange={field.onChange}
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2, display: "block" }}
          >
            Cập nhật
          </Button>
        </form>
      </AppFormDialog>
    </Box>
  );
}
