import React, { useEffect, useState } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import { Box, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateClassSchema, type UpdateClassInput } from "../types/class.shame";

import FormSelect from "../../../../components/FormSelect";
import FormSwitch from "../../../../components/FormSwitch";

import { useClassById } from "../hook/useClassById";
import { useListSChool } from "../hook/useListSchool";

interface EditeClassProp {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateClassInput) => void;
}

type options = {
  label: string;
  value: string | number;
};

export default function EditeClass({
  id,
  isOpen,
  onClose,
  onSubmit,
}: EditeClassProp): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    reset,
  } = useForm<UpdateClassInput>({
    resolver: zodResolver(UpdateClassSchema),
  });

  const { data: Class } = useClassById(id);

  useEffect(() => {
    if (Class) {
      reset({
        name: Class.name,
        schoolId: Class.schoolId,
        isActive: Class.isActive,
      });
    }
  }, [Class, reset, isOpen]);
  const handleFormSubmit = (data: UpdateClassInput) => {
    onSubmit(data);
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
        title={`Cập nhật ${Class?.name}`}
        maxWidth="sm"
      >
        <form id="create-school-form" onSubmit={handleSubmit(handleFormSubmit)}>
          <FormInput
            label="Tên tài khoản"
            id="name"
            placeholder="Nhập tên tài khoản"
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
              <FormSwitch
                value={field.value ?? false}
                onChange={field.onChange}
              />
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
