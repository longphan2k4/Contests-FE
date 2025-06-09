import React, { useEffect } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import { Box, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateUserSchema,
  type UpdateUserInput,
  type User,
} from "../types/user.shame";

import FormSelect from "../../../../components/FormSelect";
import FormSwitch from "../../../../components/FormSwitch";
interface EditeUserProp {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateUserInput) => void;
}

const roleOptions = [
  { label: "Admin", value: "Admin" },
  { label: "Trọng tài", value: "Judge" },
];

export default function EditeUser({
  user,
  isOpen,
  onClose,
  onSubmit,
}: EditeUserProp): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    reset,
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      username: user?.username,
      email: user?.email,
      password: "",
      role: user?.role,
      isActive: user?.isActive,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        email: user.email,
        password: "", // không hiển thị password
        role: user.role,
        isActive: user.isActive,
      });
    }
  }, [user, reset]);
  const handleFormSubmit = (data: UpdateUserInput) => {
    onSubmit(data);
    onClose();
  };
  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title={`Cập nhật ${user?.username}`}
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
          />
          <FormSwitch
            name="isActive"
            control={control}
            label={watch("isActive") ? "Đang hoạt động" : "Đã vô hiệu hóa"}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2, display: "block  " }}
          >
            Cập nhật
          </Button>
        </form>
      </AppFormDialog>
    </Box>
  );
}
