import React, { useEffect } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import { Box, Button, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateClassVideoSchema,
  type CreateClassVideoInput,
} from "../types/class-video.shame";

interface CreateClassVideoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    slogan?: string;
    classId: number;
    videos?: File;
  }) => void;
}

export default function CreateClassVideoDialog({
  isOpen,
  onClose,
  onSubmit,
}: CreateClassVideoDialogProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateClassVideoInput>({
    resolver: zodResolver(CreateClassVideoSchema),
  });

  const videoFile = watch("videos")?.[0];

  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);

  const handleFormSubmit = (data: CreateClassVideoInput) => {
    onSubmit({
      name: data.name,
      slogan: data.slogan,
      classId: data.classId,
      videos: data.videos?.[0], // Lấy file đầu tiên từ danh sách file
    });
    onClose();
  };

  return (
    <AppFormDialog
      open={isOpen}
      onClose={onClose}
      title="Thêm Video Lớp mới"
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <FormInput
          label="Tên Video"
          id="name"
          placeholder="Nhập tên video"
          error={errors.name}
          register={register("name")}
        />
        <FormInput
          label="Slogan"
          id="slogan"
          placeholder="Nhập slogan"
          error={errors.slogan}
          register={register("slogan")}
        />
        <FormInput
          label="ID Lớp"
          id="classId"
          placeholder="Nhập ID lớp"
          type="number"
          error={errors.classId}
          register={register("classId", { valueAsNumber: true })}
        />

        {/* Video Upload */}
        <Typography variant="subtitle2" sx={{ mt: 2 }}>
          Video lớp (tệp video)
        </Typography>
        <label htmlFor="video-upload">
          <Box
            sx={{
              mt: 1,
              border: "2px dashed #ccc",
              borderRadius: 2,
              p: 2,
              textAlign: "center",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 100,
              overflow: "hidden",
              backgroundColor: "#fafafa",
            }}
          >
            {videoFile ? (
              <Typography variant="body2" color="primary">
                {videoFile.name}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Nhấn để chọn video
              </Typography>
            )}
          </Box>
        </label>
        <input
          id="video-upload"
          type="file"
          accept="video/*"
          {...register("videos")}
          style={{ display: "none" }}
        />
        {errors.videos && (
          <Typography variant="caption" color="error">
            {errors.videos.message as string}
          </Typography>
        )}

        <Button type="submit" variant="contained" sx={{ mt: 2, float: "right" }}>
          Thêm
        </Button>
      </form>
    </AppFormDialog>
  );
}
