import React, { useEffect, useMemo } from "react";
import { Box, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import FormSelect from "../../../../components/FormSelect";
import FormSwitch from "../../../../components/FormSwitch";

import { UpdateClassSchema, type UpdateClassInput } from "../types/class.shame";
import { useClassById } from "../hook/useClassById";
import { useListSChool } from "../hook/useListSchool";

interface EditClassProps {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateClassInput) => void;
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
  } = useForm<UpdateClassInput>({
    resolver: zodResolver(UpdateClassSchema),
  });

  const { data: classData } = useClassById(id);
  const { data: schoolData } = useListSChool();

  const schoolOptions = useMemo(() => {
    if (schoolData?.success) {
      return schoolData.data.map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
    }
    return [];
  }, [schoolData]);

  useEffect(() => {
    if (isOpen && classData) {
      reset({
        name: classData.name,
        schoolId: classData.schoolId,
        isActive: classData.isActive,
      });
    }
  }, [isOpen, classData, reset]);

  const handleFormSubmit = (formData: UpdateClassInput) => {
    onSubmit(formData);
    onClose();
  };

  return (
    <AppFormDialog
      open={isOpen}
      onClose={onClose}
      title={`Cập nhật lớp: ${classData?.name || ""}`}
      maxWidth="sm"
    >
      <form id="edit-class-form" onSubmit={handleSubmit(handleFormSubmit)}>
        <FormInput
          id="name"
          label="Tên lớp"
          placeholder="Nhập tên lớp"
          register={register("name")}
          error={errors.name}
        />

        <FormSelect
          id="schoolId"
          name="schoolId"
          label="Trường"
          control={control}
          options={schoolOptions}
          error={errors.schoolId}
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
