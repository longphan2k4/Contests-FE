import React, { useEffect } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import { Box, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateRescueSchema } from "../types/rescues.shame"; // import schema
import type { UpdateRescueInput } from "../types/rescues.shame"; // import type

import FormSelect from "../../../../components/FormSelect";
import FormSwitch from "../../../../components/FormSwitch";

import { useRescueById } from "../hook/useRescueById";

interface EditRescueProp {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateRescueInput) => void;
}

// const roleOptions = [
//   { label: "Admin", value: "Admin" },
//   { label: "Trọng tài", value: "Judge" },
// ];

export default function EditRescue({
  id,
  isOpen,
  onClose,
  onSubmit,
}: EditRescueProp): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<UpdateRescueInput>({
    resolver: zodResolver(UpdateRescueSchema),
    defaultValues: {
      name: "",
      rescueType: "TypeA",
      questionFrom: 0,
      questionTo: 0,
      studentIds: [],
      supportAnswers: [],
      remainingContestants: 0,
      maxStudent: 1,
      index: 0,
      status: "Pending",
      matchId: 0,
    },
  });

  const { data: user } = useRescueById(id);

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        rescueType: user.rescueType,
        questionFrom: user.questionFrom,
        questionTo: user.questionTo,
        studentIds: user.studentIds,
        supportAnswers: user.supportAnswers,
        remainingContestants: user.remainingContestants,
        maxStudent: user.maxStudent,
        index: user.index,
        status: user.status,
        matchId: user.matchId,
      });
    }
  }, [user, reset, isOpen]);

  const handleFormSubmit = (data: UpdateRescueInput) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title={`Cập nhật ${user?.name}`}
        maxWidth="sm"
      >
        <form
          id="edit-rescue-form"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          {/* Example input fields, adjust as needed */}
          <FormInput
            label="Tên cuộc giải cứu"
            id="name"
            placeholder="Nhập tên"
            error={errors.name}
            register={register("name")}
          />
          <FormSelect
            id="rescueType"
            label="Loại hình"
            control={control}
            options={[
              { label: "TypeA", value: "TypeA" },
              { label: "TypeB", value: "TypeB" },
              { label: "TypeC", value: "TypeC" },
            ]}
            name="rescueType"
            error={errors.rescueType}
            defaultValue={user?.rescueType}
          />
          {/* Các trường khác tương tự */}
         <Controller
            name="isActive"
            control={control}
            defaultValue={true}
            render={({ field }) => (
              <FormSwitch
                value={Boolean(field.value)} // ép kiểu thành boolean
                onChange={field.onChange}
              />
            )}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2, float: "right", marginTop: "24px" }}
          >
            Cập nhật
          </Button>
        </form>
      </AppFormDialog>
    </Box>
  );
}