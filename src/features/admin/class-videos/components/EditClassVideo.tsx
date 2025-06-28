import React, { useEffect } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateClassVideoSchema,
  type UpdateClassVideoInput,
} from "../types/class-video.shame";

import { useClassVideoById } from "../hook/useClassVideoById";

interface EditClassVideoProps {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateClassVideoInput) => void;
}

export default function EditClassVideo({
  id,
  isOpen,
  onClose,
  onSubmit,
}: EditClassVideoProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<UpdateClassVideoInput>({
    resolver: zodResolver(UpdateClassVideoSchema),
  });

  const { data: video, isLoading, isError } = useClassVideoById(id);

  const watchedVideoFile = watch("videos")?.[0];

  useEffect(() => {
    if (video) {
      reset({
        name: video.name,
        slogan: video.slogan,
        videos: undefined, // reset không set lại video mới
      });
    }
  }, [video, reset, isOpen]);

  const handleFormSubmit = (data: UpdateClassVideoInput) => {
    onSubmit({
      ...data,
      videos: data.videos?.[0], // lấy file nếu có chọn
    });
    onClose();
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !video) return <div></div>;

  return (
    <AppFormDialog
      open={isOpen}
      onClose={onClose}
      title={`Cập nhật video lớp: ${video.name}`}
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
        {/* Video cũ */}
        {video.videos && (
          <Box mt={2}>
            <Typography variant="subtitle2">Video hiện tại:</Typography>
            <video
              width="100%"
              height="240"
              controls
              style={{ marginTop: "8px", borderRadius: "8px" }}
            >
              <source src={video.videos} type="video/mp4" />
              Trình duyệt không hỗ trợ video.
            </video>
          </Box>
        )}

        {/* Chọn video mới */}
        <Typography variant="subtitle2" sx={{ mt: 3 }}>
          Chọn video mới (nếu muốn thay)
        </Typography>
        <label htmlFor="video-upload-edit">
          <Box
            sx={{
              mt: 1,
              border: "2px dashed #ccc",
              borderRadius: 2,
              p: 2,
              textAlign: "center",
              cursor: "pointer",
              height: 100,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#fafafa",
            }}
          >
            {watchedVideoFile ? (
              <Typography variant="body2" color="primary">
                {watchedVideoFile.name}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Nhấn để chọn video mới
              </Typography>
            )}
          </Box>
        </label>
        <input
          id="video-upload-edit"
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
          sx={{ mt: 2, float: "right" }}
        >
          Cập nhật
        </Button>
      </form>
    </AppFormDialog>
  );
}
