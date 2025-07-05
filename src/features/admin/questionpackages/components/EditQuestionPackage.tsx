import React, { useEffect } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import { Box, Button, CircularProgress } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateQuestionPackageSchema,
  type UpdateQuestionPackageInput,
} from "../types/questionpackages.shame";

import FormSwitch from "../../../../components/FormSwitch";

import { useQuestionPackageById } from "../hook/useQuestionPackageById";
interface EditQuestionPackageProp {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateQuestionPackageInput) => void;
}

export default function EditQuestionPackage({
  id,
  isOpen,
  onClose,
  onSubmit,
}: EditQuestionPackageProp): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },

    control,
    reset,
  } = useForm<UpdateQuestionPackageInput>({
    resolver: zodResolver(UpdateQuestionPackageSchema),
  });

  const {
    data: questionPackage,
    isError,
    isLoading,
    refetch,
  } = useQuestionPackageById(id);

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  useEffect(() => {
    if (questionPackage && isOpen) {
      reset({
        id: questionPackage.id,
        name: questionPackage.name,
        questionDetailsCount: questionPackage.questionDetailsCount,
        matchesCount: questionPackage.matchesCount,
        isActive: questionPackage.isActive,
      });
    }
  }, [questionPackage, reset, isOpen]);
  const handleFormSubmit = (data: UpdateQuestionPackageInput) => {
    onSubmit(data);
    onClose();
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (isError) return <div>Không thể load dữ liệu</div>;
  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title={`Cập nhật ${questionPackage?.name}`}
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

          <FormInput
            label="Số lượng câu hỏi"
            id="questionDetailsCount"
            type="number"
            error={errors.questionDetailsCount}
            register={register("questionDetailsCount", { valueAsNumber: true })}
          />

          <FormInput
            label="Số trận sử dụng"
            id="matchesCount"
            type="number"
            error={errors.matchesCount}
            register={register("matchesCount", { valueAsNumber: true })}
          />

          <Controller
            name="isActive"
            control={control}
            defaultValue={true}
            render={({ field }) => (
              <FormSwitch
                label="Trạng thái hoạt động"
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
    </Box>
  );
}
