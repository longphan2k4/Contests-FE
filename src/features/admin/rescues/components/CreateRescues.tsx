import React, { useEffect } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import { Box, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateRescueSchema,
  type CreateRescueInput,
  RescueSchema,
  Role,
} from "../types/rescues.shame";

import FormSelect from "../../../../components/FormSelect";
import FormSwitch from "../../../../components/FormSwitch";

// Các lựa chọn cho rescueType và status
const rescueTypeOptions = [
  { label: "Resurrected", value: "resurrected" },
  { label: "TypeA", value: "TypeA" },
  { label: "TypeB", value: "TypeB" },
  { label: "TypeC", value: "TypeC" },
];

const statusOptions = [
  { label: "Pending", value: "Pending" },
  { label: "InProgress", value: "InProgress" },
  { label: "Completed", value: "Completed" },
  { label: "Failed", value: "Failed" },
];

interface CreateRescuesDialogProp {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRescueInput) => void;
}

export default function CreateRescuesDialog({
  isOpen,
  onClose,
  onSubmit,
}: CreateRescuesDialogProp): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<CreateRescueInput>({
    resolver: zodResolver(CreateRescueSchema),
    defaultValues: {
      name: "",
      rescueType: "resurrected",
      questionFrom: 0,
      questionTo: 0,
      studentIds: [],
      supportAnswers: [],
      remainingContestants: 0,
      maxStudent: 1,
      index: 0,
      status: "used",
      matchId: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const handleFormSubmit = (data: CreateRescueInput) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title="Tạo cuộc giải cứu mới"
        maxWidth="md"
      >
        <form
          id="create-rescue-form"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          {/* Tên */}
          <FormInput
            label="Tên cuộc giải cứu"
            id="name"
            placeholder="Nhập tên cuộc giải cứu"
            error={errors.name}
            register={register("name")}
          />

          {/* Rescue Type */}
          <FormSelect
            id="rescueType"
            name="rescueType"
            label="Loại giải cứu"
            control={control}
            options={rescueTypeOptions}
            defaultValue="resurrected"
            error={errors.rescueType}
          />

          {/* Question From */}
          <FormInput
            label="Câu hỏi bắt đầu từ"
            id="questionFrom"
            placeholder="Nhập số câu hỏi bắt đầu"
            type="number"
            error={errors.questionFrom}
            register={register("questionFrom")}
          />

          {/* Question To */}
          <FormInput
            label="Câu hỏi đến"
            id="questionTo"
            placeholder="Nhập số câu hỏi đến"
            type="number"
            error={errors.questionTo}
            register={register("questionTo")}
          />

          {/* Student Ids (cần có UI phù hợp để nhập mảng, ví dụ text hoặc multiselect) */}
          <FormInput
            label="Student IDs (danh sách ID, cách nhau dấu phẩy)"
            id="studentIds"
            placeholder="Ví dụ: 22,23,24"
           
          />

          {/* Support Answers */}
          <FormInput
            label="Support Answers (danh sách câu trả lời, cách nhau dấu phẩy)"
            id="supportAnswers"
            placeholder='Ví dụ: "Câu trả lời 1","Câu trả lời 2"'
            
          />

          {/* Remaining Contestants */}
          <FormInput
            label="Số thí sinh còn lại"
            id="remainingContestants"
            placeholder="Nhập số còn lại"
            type="number"
            error={errors.remainingContestants}
            register={register("remainingContestants")}
          />

          {/* Max Student */}
          <FormInput
            label="Số lượng tối đa sinh viên"
            id="maxStudent"
            placeholder="Nhập số tối đa"
            type="number"
            error={errors.maxStudent}
            register={register("maxStudent")}
          />

          {/* Index */}
          <FormInput
            label="Chỉ số"
            id="index"
            placeholder="Nhập chỉ số"
            type="number"
            error={errors.index}
            register={register("index")}
          />

          {/* Status */}
          <FormSelect
            id="status"
            name="status"
            label="Trạng thái"
            control={control}
            options={statusOptions}
            defaultValue="Pending"
            error={errors.status}
          />

          {/* Match ID */}
          <FormInput
            label="Match ID"
            id="matchId"
            placeholder="Nhập ID trận đấu"
            type="number"
            error={errors.matchId}
            register={register("matchId")}
          />

          {/* Active Switch */}
          {/* <Controller
            name="isActive"
            control={control}
            defaultValue={true}
            render={({ field }) => (
             
            )}
          /> */}

          {/* Button submit */}
          <Button
            type="submit"
            variant="contained"
            sx={{
              mt: 2,
              display: "block",
              float: "right",
              marginTop: "24px",
            }}
          >
            Tạo cuộc giải cứu
          </Button>
        </form>
      </AppFormDialog>
    </Box>
  );
}