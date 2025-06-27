import React, { useEffect,useState } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import {
  Box,
  Button,
  Typography,
  MenuItem,
  TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateMediaSchema,
  type CreateMediaInput,
} from "../types/media.shame";

interface CreateMediaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { type: "images" | "logo" | "background"; url: File }) => void;
}

export default function CreateMediaDialog({
  isOpen,
  onClose,
  onSubmit,
}: CreateMediaDialogProps): React.ReactElement {
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm<CreateMediaInput>({
    resolver: zodResolver(CreateMediaSchema),
    defaultValues: {
      type: "images",
    },
  });

  const selectedFile = watch("url");

  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);

  const handleFormSubmit = (data: CreateMediaInput) => {
    onSubmit({
      type: data.type,
      url: data.url,
    });
    onClose();
  };
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
  if (selectedFile instanceof File) {
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  } else {
    setPreviewUrl(null);
    return undefined;
  }
}, [selectedFile]);


  return (
    <AppFormDialog
      open={isOpen}
      onClose={onClose}
      title="Thêm Media"
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
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
              <MenuItem value="background">Nền</MenuItem>
            </TextField>
          )}
        />

        <Typography variant="subtitle2" sx={{ mt: 2 }}>
          Chọn file media
        </Typography>
        <label htmlFor="media-upload">
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
                style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                Nhấn để chọn file
              </Typography>
            )}
          </Box>
        </label>

                <Controller
          name="url"
          control={control}
          render={({ field }) => (
            <input
              id="media-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                field.onChange(file);
              }}
            />
          )}
        />
        {errors.url && (
          <Typography variant="caption" color="error">
            
          </Typography>
        )}

        <Button type="submit" variant="contained" sx={{ mt: 2, float: "right" }}>
          Thêm
        </Button>
      </form>
    </AppFormDialog>
  );
}
