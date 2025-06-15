import React, { useEffect } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import { Box, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateSponsorSchema, type UpdateSponsorInput } from "../types/sponsors.shame";

import FormSelect from "../../../../components/FormSelect";
import FormSwitch from "../../../../components/FormSwitch";

import { useSponsorById } from "../hook/useSponsorById";
interface EditeUserProp {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateSponsorInput) => void;
}

const roleOptions = [
  { label: "Admin", value: "Admin" },
  { label: "Trọng tài", value: "Judge" },
];

export default function EditeUser({
  id,
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
  } = useForm<UpdateSponsorInput>({
    resolver: zodResolver(UpdateSponsorSchema),
  });

  const { data: user } = useSponsorById(id);

  useEffect(() => {
    if (user) {
      reset({
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      });
    }
  }, [user, reset, isOpen]);
  const handleFormSubmit = (data: UpdateSponsorInput) => {
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
            control={control}
            options={roleOptions}
            name="role"
            error={errors.role}
            defaultValue={user?.role}
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
            sx={{ mt: 2, display: "block ", float: "right", marginTop: "24px" }}
          >
            Cập nhật
          </Button>
        </form>
      </AppFormDialog>
    </Box>
  );
}
