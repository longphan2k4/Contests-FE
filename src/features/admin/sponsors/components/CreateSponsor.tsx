import React, { useEffect, useState } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import { Box, Button, Typography, TextField, IconButton } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  CreateSponsorSchema,
  type CreateSponsorInput,
  type CreateSponsorForContestInput,
} from "../types/sponsors.shame";

interface CreateSponsorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSponsorForContestInput) => void;
  isLoading?: boolean;
}

function CreateSponsorDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: CreateSponsorDialogProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CreateSponsorInput>({
    resolver: zodResolver(CreateSponsorSchema),
    defaultValues: {
      name: "",
    },
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      reset();
      setLogoPreview(null);
      setImagePreview(null);
      setVideoPreview(null);
    }
  }, [isOpen, reset]);
  const logoFile = watch("logo")?.[0];
  const imagesFile = watch("images")?.[0];
  const videosFile = watch("videos")?.[0];

  useEffect(() => {
    let objectUrl: string | undefined;
    if (logoFile) {
      objectUrl = URL.createObjectURL(logoFile);
      setLogoPreview(objectUrl);
    } else {
      setLogoPreview(null);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [logoFile]);

  useEffect(() => {
    let objectUrl: string | undefined;
    if (imagesFile) {
      objectUrl = URL.createObjectURL(imagesFile);
      setImagePreview(objectUrl);
    } else {
      setImagePreview(null);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [imagesFile]);

  useEffect(() => {
    let objectUrl: string | undefined;
    if (videosFile) {
      objectUrl = URL.createObjectURL(videosFile);
      setVideoPreview(objectUrl);
    } else {
      setVideoPreview(null);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [videosFile]);

  const handleFormSubmit = (data: CreateSponsorInput) => {
    onSubmit({
      name: data.name,
      logo: data.logo?.[0],
      images: data.images?.[0],
      videos: data.videos?.[0],
    });
  };

  const handleRemoveFile = (field: "logo" | "images" | "videos") => {
    setValue(field, undefined);
  };

  return (
    <AppFormDialog
      open={isOpen}
      onClose={onClose}
      title="Tạo nhà tài trợ"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            label="Tên nhà tài trợ"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            required
            fullWidth
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Logo
              </Typography>
              {logoFile ? (
                <Box
                  sx={{
                    position: "relative",
                    p: 1,
                    border: "1px solid #ccc",
                    borderRadius: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  {logoPreview && (
                    <img
                      src={logoPreview}
                      alt="logo-preview"
                      style={{
                        width: "100%",
                        maxHeight: 150,
                        objectFit: "contain",
                        borderRadius: "4px",
                      }}
                    />
                  )}
                  <Box
                    sx={{
                      overflow: "hidden",
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {(logoFile.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => handleRemoveFile("logo")}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                      },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ) : (
                <Button
                  component="label"
                  variant="outlined"
                  fullWidth
                  sx={{
                    p: 2,
                    borderStyle: "dashed",
                    height: "100%",
                    flexDirection: "column",
                  }}
                >
                  <CloudUploadIcon sx={{ mb: 1 }} />
                  Chọn hoặc kéo thả logo
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    JPG, PNG, GIF, WebP, SVG
                  </Typography>
                  <input type="file" accept="image/*" {...register("logo")} hidden />
                </Button>
              )}
              {errors.logo && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 0.5, display: "block" }}
                >
                  {errors.logo.message as string}
                </Typography>
              )}
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Hình ảnh giới thiệu
              </Typography>
              {imagesFile ? (
                <Box
                  sx={{
                    position: "relative",
                    p: 1,
                    border: "1px solid #ccc",
                    borderRadius: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="image-preview"
                      style={{
                        width: "100%",
                        maxHeight: 150,
                        objectFit: "contain",
                        borderRadius: "4px",
                      }}
                    />
                  )}
                  <Box
                    sx={{
                      overflow: "hidden",
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {(imagesFile.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => handleRemoveFile("images")}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                      },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ) : (
                <Button
                  component="label"
                  variant="outlined"
                  fullWidth
                  sx={{
                    p: 2,
                    borderStyle: "dashed",
                    height: "100%",
                    flexDirection: "column",
                  }}
                >
                  <CloudUploadIcon sx={{ mb: 1 }} />
                  Chọn hoặc kéo thả hình ảnh
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    JPG, PNG, GIF, WebP, SVG
                  </Typography>
                  <input type="file" accept="image/*" {...register("images")} hidden />
                </Button>
              )}
              {errors.images && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 0.5, display: "block" }}
                >
                  {errors.images.message as string}
                </Typography>
              )}
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Video giới thiệu
              </Typography>
              {videosFile ? (
                <Box
                  sx={{
                    position: "relative",
                    p: 1,
                    border: "1px solid #ccc",
                    borderRadius: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  {videoPreview && (
                    <video
                      src={videoPreview}
                      style={{
                        width: "100%",
                        maxHeight: 150,
                        borderRadius: "4px",
                      }}
                      controls
                    />
                  )}
                  <Box
                    sx={{
                      overflow: "hidden",
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {(videosFile.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => handleRemoveFile("videos")}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                      },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ) : (
                <Button
                  component="label"
                  variant="outlined"
                  fullWidth
                  sx={{
                    p: 2,
                    borderStyle: "dashed",
                    height: "100%",
                    flexDirection: "column",
                  }}
                >
                  <CloudUploadIcon sx={{ mb: 1 }} />
                  Chọn hoặc kéo thả video
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    MP4, AVI, MOV, WMV, WebM
                  </Typography>
                  <input type="file" accept="video/*" {...register("videos")} hidden />
                </Button>
              )}
              {errors.videos && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 0.5, display: "block" }}
                >
                  {errors.videos.message as string}
                </Typography>
              )}
            </Box>
          </Box>          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button variant="outlined" onClick={onClose} fullWidth disabled={isLoading}>
              Hủy
            </Button>
            <Button type="submit" variant="contained" fullWidth disabled={isLoading}>
              {isLoading ? "Đang tạo..." : "Tạo"}
            </Button>
          </Box>
        </Box>
      </form>
    </AppFormDialog>
  );
}

export default CreateSponsorDialog;
