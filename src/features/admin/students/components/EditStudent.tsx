import React, { useEffect } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import { Box, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateStudentSchema,
  type UpdateStudentInput,
  type Student,
} from "../types/student.shame";
import FormSwitch from "../../../../components/FormSwitch";
import FormSelect from "../../../../components/FormSelect";

interface EditStudentProp {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateStudentInput) => void;
}

// options classId kiểu string để khớp với FormSelect
const classOptions = [
  { label: "10A1", value: "1" },
  { label: "10A2", value: "2" },
  { label: "12A1", value: "3" },
  { label: "11A2", value: "4" },
  { label: "11A1", value: "5" },
  { label: "12A2", value: "6" },
  { label: "10A2", value: "7" },
  { label: "11A2", value: "8" },
  { label: "10A1", value: "9" },
  { label: "10A2", value: "10" },
  { label: "11A2", value: "11" },
  { label: "12A2", value: "12" },
  { label: "12A1", value: "13" },
  { label: "11A1", value: "14" },
  { label: "11A1", value: "15" },
  { label: "10A2", value: "16" },
  { label: "11A1", value: "17" },
  { label: "12A2", value: "18" },
  { label: "10A1", value: "19" },
  { label: "12A2", value: "20" },
  { label: "12A1", value: "21" },
  { label: "10A1", value: "22" },
  { label: "12A1", value: "23" },
  { label: "11A2", value: "24" },
  { label: "11A1", value: "25" },

];

export default function EditStudent({
  student,
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
    defaultValues: {
      fullName: student?.fullName ?? "",
      studentCode: student?.studentCode ?? "",
      classId: student?.classId, // số hoặc undefined
      isActive: student?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (student) {
      reset({
        fullName: student.fullName,
        studentCode: student.studentCode,
        classId: student?.classId, // số hoặc undefined
        isActive: student.isActive,
      });
    }
  }, [student, reset]);

  const handleFormSubmit = (data: UpdateStudentInput) => {
    // Chuyển classId từ string sang number (nếu có)
    const payload: UpdateStudentInput = {
      ...data,
      classId: data.classId !== undefined ? Number(data.classId) : undefined,
    };
    onSubmit(payload);
    onClose();
  };

  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title={`Cập nhật ${student?.fullName}`}
        maxWidth="sm"
      >
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <FormInput
            label="Họ và tên"
            id="fullName"
            placeholder="Nhập họ tên"
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
         <FormSelect
            id="classId"
            label="Lớp"
            options={classOptions}
            {...register("classId", {
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
            error={errors.classId}
          />
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <FormSwitch
                label="Đang hoạt động"
                value={field.value ?? false}
                onChange={field.onChange}
              />
            )}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2, display: "block" }}
          >
            Cập nhật
          </Button>
        </form>
      </AppFormDialog>
    </Box>
  );
}