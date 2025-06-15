import React, { useEffect, useMemo } from "react";
import { Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import FormSelect from "../../../../components/FormSelect";
import FormSwitch from "../../../../components/FormSwitch";

import { CreateClassSchema, type CreateClassInput } from "../types/class.shame";
import { useListSChool } from "../hook/useListSchool";

interface CreateClassProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateClassInput) => void;
}

export default function CreateClass({
  isOpen,
  onClose,
  onSubmit,
}: CreateClassProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<CreateClassInput>({
    resolver: zodResolver(CreateClassSchema),
    defaultValues: {
      isActive: true,
    },
  });

  const { data } = useListSChool();

  // Memo hóa danh sách trường học để tránh re-render thừa
  const schoolOptions = useMemo(() => {
    if (data?.success) {
      return data.data.map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
    }
    return [];
  }, [data]);

  // Reset khi mở lại form
  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const handleFormSubmit = (formData: CreateClassInput) => {
    onSubmit(formData);
    onClose();
  };

  return (
    <AppFormDialog
      open={isOpen}
      onClose={onClose}
      title="Thêm lớp học mới"
      maxWidth="sm"
    >
      <form id="create-class-form" onSubmit={handleSubmit(handleFormSubmit)}>
        <FormInput
          id="name"
          label="Tên lớp"
          placeholder="Nhập tên lớp"
          error={errors.name}
          register={register("name")}
        />

        <FormSelect
          id="schoolId"
          name="schoolId"
          label="Chọn trường học"
          options={schoolOptions}
          control={control}
          error={errors.schoolId}
        />

        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <FormSwitch value={field.value} onChange={field.onChange} />
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
  );
}
