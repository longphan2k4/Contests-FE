import React, { useEffect, useState } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import { Box, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateClassSchema, type CreateClassInput } from "../types/class.shame";

import FormSelect from "../../../../components/FormSelect";
import FormSwitch from "../../../../components/FormSwitch";

import { useListSChool } from "../hook/useListSchool.ts";

interface CreateClassProp {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateClassInput) => void;
}

type options = {
  label: string;
  value: string | number;
};

export default function CreateClass({
  isOpen,
  onClose,
  onSubmit,
}: CreateClassProp): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    reset,
  } = useForm<CreateClassInput>({
    resolver: zodResolver(CreateClassSchema),
    defaultValues: {
      isActive: true,
    },
  });

  const handleFormSubmit = (data: CreateClassInput) => {
    onSubmit(data);
    reset();
    onClose();
  };

  const [School, setSchool] = useState<options[]>([]);
  const { data } = useListSChool();

  useEffect(() => {
    if (data && data.success) {
      const formattedSchools: options[] = data.data.map((item: any) => ({
        label: item.name,
        value: item.id,
      }));

      setSchool(formattedSchools);
    }
  }, [data]);

  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title="Thêm lớp học mới"
        maxWidth="sm"
      >
        <form id="create-school-form" onSubmit={handleSubmit(handleFormSubmit)}>
          <FormInput
            label="Tên lớp"
            id="name"
            placeholder="Nhập tên lớp"
            error={errors.name}
            register={register("name")}
          />
          <FormSelect
            id="schoolId"
            label="Trường"
            register={register("schoolId")}
            options={School}
            error={errors.schoolId}
          />
          <Controller
            name="isActive"
            control={control}
            defaultValue={true}
            render={({ field }) => (
              <FormSwitch value={field.value} onChange={field.onChange} />
            )}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2, display: "block  " }}
          >
            Thêm
          </Button>
        </form>
      </AppFormDialog>
    </Box>
  );
}
