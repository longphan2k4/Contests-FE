import React, { useState } from "react";
import { Box, Button, Typography, IconButton, Alert } from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { getMediaUrl } from "../../../config/env";

interface FileUploadProps {
  currentFile?: string | null;
  onFileSelected: (file: File | null) => void;
  acceptTypes?: string;
  maxSize?: number; // in MB
  label?: string;
  previewWidth?: number | string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  currentFile,
  onFileSelected,
  acceptTypes = "image/*",
  maxSize = 5, // 5MB mặc định
  label = "Tải lên tệp",
  previewWidth = 300,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Khởi tạo preview từ currentFile
  React.useEffect(() => {
    if (currentFile) {
      setPreview(getMediaUrl(currentFile));
    } else {
      setPreview(null);
    }
  }, [currentFile]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra kích thước
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File quá lớn. Kích thước tối đa là ${maxSize}MB`);
      return;
    }

    // Tạo URL xem trước
    setPreview(URL.createObjectURL(file));
    setError(null);

    // Gửi file về component cha
    onFileSelected(file);
  };

  const handleClear = () => {
    setPreview(null);
    onFileSelected(null);
  };

  return (
    <Box>
      <Box
        sx={{
          border: "1px dashed #ccc",
          borderRadius: 1,
          p: 2,
          mb: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 100,
          bgcolor: "background.paper",
        }}
      >
        {!preview && (
          <>
            <input
              accept={acceptTypes}
              style={{ display: "none" }}
              id={`upload-file-${label}`}
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor={`upload-file-${label}`}>
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                sx={{ mb: 1 }}
              >
                {label}
              </Button>
            </label>
            <Typography variant="caption" color="text.secondary">
              Chấp nhận {acceptTypes.replace("*", "tất cả")}, tối đa {maxSize}MB
            </Typography>
          </>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 1, width: "100%" }}>
            {error}
          </Alert>
        )}

        {preview && (
          <Box sx={{ position: "relative", maxWidth: previewWidth }}>
            <img
              src={preview}
              alt="Preview"
              style={{
                maxWidth: "100%",
                borderRadius: 4,
              }}
            />
            <IconButton
              size="small"
              onClick={handleClear}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "background.paper",
                "&:hover": {
                  bgcolor: "error.light",
                  color: "white",
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FileUpload;
