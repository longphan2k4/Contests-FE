import React, { useEffect } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import { Box, Button, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateSponsorSchema,
  type CreateSponsorInput,
} from "../types/sponsors.shame";

interface CreateSponsorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    logo?: File;
    images?: File;
    videos?: string;
  }) => void;
}

export default function CreateSponsorDialog({
  isOpen,
  onClose,
  onSubmit,
}: CreateSponsorDialogProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateSponsorInput>({
    resolver: zodResolver(CreateSponsorSchema),
    defaultValues: {
      name: "",
      videos: "",
    },
  });

  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);

  const logoFile = watch("logo")?.[0];
  const imagesFile = watch("images")?.[0];
  const videoUrl = watch("videos");

  const handleFormSubmit = (data: CreateSponsorInput) => {
    onSubmit({
      name: data.name,
      logo: data.logo?.[0],
      images: data.images?.[0],
      videos: data.videos,
    });
    onClose();
  };

  return (
    <AppFormDialog
      open={isOpen}
      onClose={onClose}
      title="Thêm nhà tài trợ"
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {/* Tên nhà tài trợ */}
        <FormInput
          label="Tên nhà tài trợ"
          id="name"
          placeholder="Nhập tên"
          error={errors.name}
          register={register("name")}
        />

        {/* Logo (file) */}
        <Typography variant="subtitle2" sx={{ mt: 2 }}>
          Logo (ảnh)
        </Typography>
        <label htmlFor="logo-upload">
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
              position: "relative",
              backgroundColor: "#fafafa",
            }}
          >
            {logoFile ? (
              <img
                src={URL.createObjectURL(logoFile)}
                alt="logo-preview"
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                Nhấn để chọn logo
              </Typography>
            )}
          </Box>
        </label>
        <input
          id="logo-upload"
          type="file"
          accept="image/*"
          {...register("logo")}
          style={{ display: "none" }}
        />
        {errors.logo && (
          <Typography variant="caption" color="error">
            {errors.logo.message as string}
          </Typography>
        )}

        {/* Images (file) */}
        <Typography variant="subtitle2" sx={{ mt: 2 }}>
          Hình ảnh giới thiệu (nếu có)
        </Typography>
        <label htmlFor="images-upload">
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
              position: "relative",
              backgroundColor: "#fafafa",
            }}
          >
            {imagesFile ? (
              <img
                src={URL.createObjectURL(imagesFile)}
                alt="image-preview"
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                Nhấn để chọn ảnh
              </Typography>
            )}
          </Box>
        </label>
        <input
          id="images-upload"
          type="file"
          accept="image/*"
          {...register("images")}
          style={{ display: "none" }}
        />
        {errors.images && (
          <Typography variant="caption" color="error">
            {errors.images.message as string}
          </Typography>
        )}

        {/* Videos (URL) */}
        <FormInput
          label="Video giới thiệu (URL)"
          id="videos"
          placeholder="https://youtube.com/..."
          register={register("videos")}
        />
        {videoUrl && (
          <Box mt={2}>
            <Typography variant="subtitle2">Xem trước video:</Typography>
            <Box mt={1}>
              <iframe
                width="100%"
                height="250"
                src={convertYoutubeUrlToEmbed(videoUrl)}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="video preview"
              ></iframe>
            </Box>
          </Box>
        )}

        {/* Nút Submit */}
        <Button type="submit" variant="contained" sx={{ mt: 2, float: "right" }}>
          Thêm
        </Button>
      </form>
    </AppFormDialog>
  );
}

// Hàm chuyển URL YouTube sang dạng nhúng iframe
function convertYoutubeUrlToEmbed(url?: string): string {
  if (!url) return "";
  const regExp =
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/;
  const match = url.match(regExp);
  return match ? `https://www.youtube.com/embed/${match[1]}` : "";
}
