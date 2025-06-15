import React from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import { Box, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateStudentSchema,
  type CreateStudentInput,
} from "../types/student.shame";
import FormSelect from "../../../../components/FormSelect";
import FormSwitch from "../../../../components/FormSwitch";

// Danh sách lớp mẫu (bạn có thể thay bằng dữ liệu API)
const classOptions = [
  { label: "10A1", value: "1" },
  { label: "10A2", value: "2" },
  { label: "11A1", value: "3" },
  { label: "12A1", value: "4" },
  { label: "12A2", value: "5" },
];

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
      fullName: "",
      studentCode: "",
    },
  });

  const handleFormSubmit = (data: CreateStudentInput) => {
    onSubmit(data);
    reset();
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
        <form
          id="create-student-form"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
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
          <FormSelect
            id="classId"
            name="classId"
            label="Lớp"
            control={control}
            options={classOptions}
            error={errors.classId}
            defaultValue="" // hoặc giá trị mặc định tương ứng
          />

          <Controller
            name="isActive"
            control={control}
            defaultValue={true}
            render={({ field }) => (
              <FormSwitch
                label="Đang hoạt động"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2, display: "block" }}
          >
            Thêm học sinh
          </Button>
        </form>
      </AppFormDialog>
    </Box>
  );
}
