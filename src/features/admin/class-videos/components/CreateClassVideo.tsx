import React, { useEffect, useMemo } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useListClass } from "../hook/useListClass";
import {
  CreateClassVideoSchema,
  type CreateClassVideoInput,
} from "../types/class-video.shame";
import FormSelect from "@components/FormSelect";

interface CreateClassVideoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    slogan?: string;
    classId: number;
    videos?: File;
    image?: File;
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
    control,
    watch,
  } = useForm<CreateClassVideoInput>({
    resolver: zodResolver(CreateClassVideoSchema),
  });

  const {
    data: classList,
    isLoading: isClassLoading,
    isError: isClassError,
    refetch: refetchClassList,
  } = useListClass();

  useEffect(() => {
    refetchClassList();
  }, [refetchClassList, isOpen]);

  const classes = useMemo(() => {
    if (classList?.success) {
      return classList.data.map((item: { id: number; name: string }) => ({
        label: item.name,
        value: item.id,
      }));
    }
    return [];
  }, [classList]);

  const videoFile = watch("videos")?.[0];

  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);

  const handleFormSubmit = (data: CreateClassVideoInput) => {
    onSubmit({
      name: data.name,
      slogan: data.slogan,
      classId: data.classId,
      videos: videoFile,
    });

    onClose();
  };

  if (isClassLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isClassError) {
    return <div>Không thể tải dữ liệu</div>;
  }

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
        <FormSelect
          id="classId"
          name="classId"
          label="Chọn lớp"
          options={classes}
          control={control}
          error={errors.classId}
        />

        {/* Upload Video */}
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

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 3, float: "right" }}
        >
          Thêm
        </Button>
      </form>
    </AppFormDialog>
  );
}
