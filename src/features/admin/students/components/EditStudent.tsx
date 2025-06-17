import React, { useEffect } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import { Box, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useClasses } from "../hook/useGetClass";
import {
  UpdateStudentSchema,
  type UpdateStudentInput,
  type ClassItem,
} from "../types/student.shame";
import FormSwitch from "../../../../components/FormSwitch";
import { useStudentById } from "../hook/useStudentById";

interface EditStudentProp {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateStudentInput) => void;
}

export default function EditStudent({
  id,
  isOpen,
  onClose,
  onSubmit,
}: EditStudentProp): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<UpdateStudentInput>({
    resolver: zodResolver(UpdateStudentSchema),
  });

  const { data: student } = useStudentById(id);
  const { data: classData } = useClasses({});
  const classOptions = (classData?.data?.classes || []) as ClassItem[];

  useEffect(() => {
    if (student) {
      reset({
        fullName: student.fullName,
        studentCode: student.studentCode,
        classId: student.classId,
        isActive: student.isActive,
      });
    }
  }, [student, reset, isOpen]);

  const handleFormSubmit = (data: UpdateStudentInput) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title={`Cập nhật ${student?.fullName || "học sinh"}`}
        maxWidth="sm"
      >
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <FormInput
            label="Họ và tên"
            id="fullName"
            placeholder="Nhập họ tên học sinh"
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
                <InputLabel id="classId-label">Lớp học</InputLabel>
                <Select
                  {...field}
                  labelId="classId-label"
                  id="classId"
                  label="Lớp học"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                >
                  {classOptions.map((cls) => (
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
                value={field.value ?? false}
                onChange={field.onChange}
              />
            )}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2, float: "right" }}
          >
            Cập nhật
          </Button>
        </form>
      </AppFormDialog>
    </Box>
  );
}
