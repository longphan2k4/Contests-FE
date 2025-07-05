import React, { useEffect, useState } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateMediaSchema, type UpdateMediaInput } from "../types/media.shame";
import { useMediaById } from "../hook/useMediaById";

interface EditMediaProps {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateMediaInput & { newFile?: File }) => void;
}

export default function EditMedia({
  id,
  isOpen,
  onClose,
  onSubmit,
}: EditMediaProps): React.ReactElement {
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm<UpdateMediaInput>({
    resolver: zodResolver(UpdateMediaSchema),
  });

  const { data: media, isLoading, isError } = useMediaById(id);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Reset form khi mở dialog
  useEffect(() => {
    if (isOpen && media) {
      reset({
        url: media.url ?? "",
        type: media.type ?? "images",
      });
      setSelectedFile(null);
      setPreviewUrl(media.url ?? null);
    }
  }, [isOpen, media, reset]);

  // Cập nhật preview khi chọn ảnh mới
  useEffect(() => {
    let objectUrl: string | null = null;

    if (selectedFile) {
      objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    } else {
      setPreviewUrl(media?.url ?? null);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [selectedFile, media]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValue("url", file);
    }
  };

  const handleFormSubmit = (data: UpdateMediaInput) => {
    onSubmit({
      ...data,
      newFile: selectedFile ?? undefined,
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

  if (isError) return <div>Không thể tải dữ liệu</div>;

  return (
    <AppFormDialog
      open={isOpen}
      onClose={onClose}
      title={`Cập nhật media `}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {/* Loại media */}
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              select
              label="Loại media"
              {...field}
              error={!!errors.type}
              helperText={errors.type?.message}
              margin="normal"
            >
              <MenuItem value="images">Hình ảnh</MenuItem>
              <MenuItem value="logo">Logo</MenuItem>
              <MenuItem value="background">Ảnh nền</MenuItem>
            </TextField>
          )}
        />

        {/* Ảnh hiện tại hoặc mới */}
        <Typography variant="subtitle2" sx={{ mt: 2 }}>
          Ảnh hiện tại / ảnh mới
        </Typography>
        <label htmlFor="media-edit-upload">
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
              height: 150,
              backgroundColor: "#fafafa",
            }}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                Nhấn để chọn ảnh mới
              </Typography>
            )}
          </Box>
        </label>

        <input
          id="media-edit-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
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
  );
}
