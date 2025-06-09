import React from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import { Box, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserSchema, type CreateUserInput } from "../types/user.shame";

import FormSelect from "../../../../components/FormSelect";

import FormSwitch from "../../../../components/FormSwitch";
interface CreateSchoolDialogProp {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserInput) => void;
}

const roleOptions = [
  { label: "Admin", value: "Admin" },
  { label: "Trọng tài", value: "Judge" },
];

export default function CreateSchoolDialog({
  isOpen,
  onClose,
  onSubmit,
}: CreateSchoolDialogProp): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    reset,
  } = useForm<CreateUserInput>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      isActive: true,
      role: "Judge",
    },
  });

  const handleFormSubmit = (data: CreateUserInput) => {
    onSubmit(data);
    reset();
    onClose();
  };
  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title="Thêm người dùng mới"
        maxWidth="sm"
      >
        <form id="create-school-form" onSubmit={handleSubmit(handleFormSubmit)}>
          <FormInput
            label="Tên tài khoản"
            id="username"
            placeholder="Nhập tên tài khoản"
            error={errors.username}
            register={register("username")}
          />
          <FormInput
            label="Email"
            id="email"
            placeholder="Nhập email"
            error={errors.email}
            register={register("email")}
          />
          <FormInput
            label="Mật khẩu"
            id="password"
            placeholder="Nhập mật khẩu"
            error={errors.password}
            type="password"
            register={register("password")}
          />
          <FormSelect
            id="role"
            label="Vai trò"
            register={register("role")}
            options={roleOptions}
            defaultValue="Judge"
            error={errors.role}
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
            Thêm người dùng mới
          </Button>
        </form>
      </AppFormDialog>
    </Box>
  );
}
