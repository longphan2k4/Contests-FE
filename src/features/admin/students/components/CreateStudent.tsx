import React, { useEffect } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import { Box, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateStudentSchema,
  type CreateStudentInput,
} from "../types/student.shame";
import { useClasses } from "../hook/useGetClass";
import { type ClassItem } from "../types/student.shame";
import FormSwitch from "../../../../components/FormSwitch";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";

interface CreateStudentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStudentInput) => void;
}

export default function CreateStudentDialog({
  isOpen,
  onClose,
  onSubmit,
}: CreateStudentDialogProps): React.ReactElement {

const { data } = useClasses({});
const classOptions = (data?.data?.classes || []) as ClassItem[];

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<CreateStudentInput>({
    resolver: zodResolver(CreateStudentSchema),
    defaultValues: {
      isActive: true,
      classId: undefined,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const handleFormSubmit = (data: CreateStudentInput) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title="Thêm học sinh mới"
        maxWidth="sm"
      >
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <FormInput
            label="Họ và tên"
            id="fullName"
            placeholder="Nhập họ và tên"
            error={errors.fullName}
            register={register("fullName")}
          />
          <FormInput
            label="Mã học sinh"
            id="studentCode"
            placeholder="Nhập mã học sinh"
            error={errors.studentCode}
            register={register("studentCode")}
          />
        <Controller
          name="classId"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth margin="normal" error={!!errors.classId}>
              <InputLabel id="class-select-label">Lớp học</InputLabel>
              <Select
                {...field}
                labelId="class-select-label"
                id="classId"
                label="Lớp học"
                value={field.value ?? ""}
                onChange={field.onChange}
              >
                {classOptions.map((cls: ClassItem) => (
                  <MenuItem key={cls.id} value={cls.id}>
                    {`${cls.name} - ${cls.shoolName}`}
                  </MenuItem>
                ))}
              </Select>
              {errors.classId && (
                <FormHelperText>{errors.classId.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />
          <Controller
            name="isActive"
            control={control}
            defaultValue={true}
            render={({ field }) => (
              <FormSwitch
                label="Kích hoạt tài khoản"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2, float: "right" }}
          >
            Thêm
          </Button>
        </form>
      </AppFormDialog>
    </Box>
  );
}
