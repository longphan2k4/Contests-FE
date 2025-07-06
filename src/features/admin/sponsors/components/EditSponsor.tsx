import React, { useEffect, useState } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import {
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CloseIcon from "@mui/icons-material/Close";
import { useSponsorById } from "../hook/useSponsorById";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  UpdateSponsorSchema,
  type UpdateSponsorInput,
} from "../types/sponsors.shame";

interface EditSponsorDialogProps {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateSponsorInput) => void;
  isLoading?: boolean;
}

function EditSponsorDialog({
  id,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: EditSponsorDialogProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<UpdateSponsorInput>({
    resolver: zodResolver(UpdateSponsorSchema),
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const {
    data: sponsorData,
    isLoading: isLoadingSponsor,
    isError: isErrorSponsor,
  } = useSponsorById(id);

  // Track file removal states
  const [removedFiles, setRemovedFiles] = useState<{
    logo: boolean;
    images: boolean;
    videos: boolean;
  }>({
    logo: false,
    images: false,
    videos: false,
  });

  const logoFile = watch("logo");
  const imagesFile = watch("images");
  const videosFile = watch("videos");
  useEffect(() => {
    if (isOpen) {
      reset({
        name: sponsorData.name,
        logo: sponsorData.logo,
        images: sponsorData.images,
        videos: sponsorData.videos,
      });

      // Reset removed files state
      setRemovedFiles({
        logo: false,
        images: false,
        videos: false,
      });
    }
  }, [isOpen, reset]);
  useEffect(() => {
    let url: string | undefined;
    if (logoFile instanceof File) {
      url = URL.createObjectURL(logoFile);
      setLogoPreview(url);
    } else if (typeof logoFile === "string" && !removedFiles.logo) {
      setLogoPreview(logoFile);
    } else {
      setLogoPreview(null);
    }

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [logoFile, removedFiles.logo]);
  useEffect(() => {
    let url: string | undefined;
    if (imagesFile instanceof File) {
      url = URL.createObjectURL(imagesFile);
      setImagePreview(url);
    } else if (typeof imagesFile === "string" && !removedFiles.images) {
      setImagePreview(imagesFile);
    } else {
      setImagePreview(null);
    }

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [imagesFile, removedFiles.images]);
  useEffect(() => {
    let url: string | undefined;
    if (videosFile instanceof File) {
      url = URL.createObjectURL(videosFile);
      setVideoPreview(url);
    } else if (typeof videosFile === "string" && !removedFiles.videos) {
      setVideoPreview(videosFile);
    } else {
      setVideoPreview(null);
    }

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [videosFile, removedFiles.videos]);
  const handleFormSubmit = (data: UpdateSponsorInput) => {
    // Add removal flags to the data
    const submitData = {
      ...data,
      removeLogo: removedFiles.logo,
      removeImages: removedFiles.images,
      removeVideos: removedFiles.videos,
    };

    onSubmit(submitData);
  };
  const handleRemoveFile = (field: "logo" | "images" | "videos") => {
    // Get current value before setting to undefined
    const currentValue = watch(field);

    // Mark file as removed if it was originally a string URL
    if (typeof currentValue === "string") {
      setRemovedFiles(prev => ({
        ...prev,
        [field]: true,
      }));
    }

    setValue(field, undefined, { shouldValidate: true });
  };
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "logo" | "images" | "videos"
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setValue(field, e.target.files[0], { shouldValidate: true });

      // Reset removed state when new file is selected
      setRemovedFiles(prev => ({
        ...prev,
        [field]: false,
      }));
    }
  };
  if (isLoadingSponsor) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (isErrorSponsor) {
    return <div>Không thể tải dữ liệu</div>;
  }

  return (
    <AppFormDialog
      open={isOpen}
      onClose={onClose}
      title="Chỉnh sửa nhà tài trợ"
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
              {logoFile && !removedFiles.logo ? (
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
                  Chọn hoặc kéo thả logo mới
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    JPG, PNG, GIF, WebP, SVG
                  </Typography>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={e => handleFileChange(e, "logo")}
                  />
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
              {imagesFile && !removedFiles.images ? (
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
                  Chọn hoặc kéo thả hình ảnh mới
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    JPG, PNG, GIF, WebP, SVG
                  </Typography>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={e => handleFileChange(e, "images")}
                  />
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
              {videosFile && !removedFiles.videos ? (
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
                  Chọn hoặc kéo thả video mới
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    MP4, AVI, MOV, WMV, WebM
                  </Typography>
                  <input
                    type="file"
                    accept="video/*"
                    hidden
                    onChange={e => handleFileChange(e, "videos")}
                  />
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
          </Box>{" "}
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              fullWidth
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? "Đang lưu..." : "Lưu"}
            </Button>
          </Box>
        </Box>
      </form>
    </AppFormDialog>
  );
}

export default EditSponsorDialog;
