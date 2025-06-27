import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Videocam as VideocamIcon,
  AudioFile as AudioFileIcon,
  InsertDriveFile as FileIcon,
} from "@mui/icons-material";
import { LIMITS } from "../types";
import type { SelectChangeEvent } from "@mui/material";

interface MediaUploaderProps {
  questionId: number;
  onUpload: (
    questionId: number,
    mediaType: "questionMedia" | "mediaAnswer",
    files: File[]
  ) => Promise<unknown>;
  isLoading?: boolean;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  questionId,
  onUpload,
  isLoading = false,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [mediaType, setMediaType] = useState<"questionMedia" | "mediaAnswer">(
    "questionMedia"
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Kiểm tra giới hạn số lượng file theo loại media
  const getMaxFilesByMediaType = (fileType: string): number => {
    return fileType === "audio" ? 1 : 4;
  };

  // Kiểm tra xem các file có cùng loại không
  const areFilesOfSameType = (files: File[]): boolean => {
    if (files.length <= 1) return true;
    const firstFileType = files[0].type.split("/")[0];
    return files.every(file => file.type.split("/")[0] === firstFileType);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const files = Array.from(event.target.files);

    // Kiểm tra xem các file có cùng loại không
    if (!areFilesOfSameType(files)) {
      setError("Tất cả các file phải cùng loại (ảnh, video hoặc âm thanh)");
      return;
    }

    // Xác định loại media
    const fileType = files[0].type.split("/")[0];
    const maxFiles = getMaxFilesByMediaType(fileType);

    // Kiểm tra số lượng file theo loại
    if (files.length > maxFiles) {
      const typeNames = {
        image: "ảnh",
        video: "video",
        audio: "âm thanh",
      };
      setError(`Chỉ được phép tải lên tối đa ${maxFiles} file ${typeNames[fileType as keyof typeof typeNames]}`);
      return;
    }

    // Kiểm tra kích thước và định dạng file
    const invalidFiles = files.filter(file => {
      const fileType = file.type.split("/")[0];

      if (fileType === "image" && file.size > LIMITS.image) {
        return true;
      }

      if (fileType === "video" && file.size > LIMITS.video) {
        return true;
      }

      if (fileType === "audio" && file.size > LIMITS.audio) {
        return true;
      }

      return false;
    });

    if (invalidFiles.length > 0) {
      setError("Một số file không hợp lệ về kích thước hoặc định dạng");
      return;
    }

    setSelectedFiles(files);
    setError(null);
  };

  const handleMediaTypeChange = (
    event: SelectChangeEvent<"questionMedia" | "mediaAnswer">
  ) => {
    setMediaType(event.target.value as "questionMedia" | "mediaAnswer");
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("Vui lòng chọn ít nhất một file");
      return;
    }

    try {
      setError(null);
      const result = await onUpload(questionId, mediaType, selectedFiles);
      setSuccess("Tải lên media thành công");
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return result;
    } catch (error) {
      console.error("Lỗi khi tải lên media:", error);
      setError("Có lỗi xảy ra khi tải lên media");
    }
    return;
  };

  const getFileIcon = (file: File) => {
    const fileType = file.type.split("/")[0];

    switch (fileType) {
      case "image":
        return <ImageIcon />;
      case "video":
        return <VideocamIcon />;
      case "audio":
        return <AudioFileIcon />;
      default:
        return <FileIcon />;
    }
  };

  const getFileSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Tải lên media cho câu hỏi
      </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Loại media</InputLabel>
        <Select
          value={mediaType}
          onChange={handleMediaTypeChange}
          label="Loại media"
        >
          <MenuItem value="questionMedia">Media câu hỏi</MenuItem>
          <MenuItem value="mediaAnswer">Media đáp án</MenuItem>
        </Select>
        <FormHelperText>Chọn loại media bạn muốn tải lên</FormHelperText>
      </FormControl>

      <Box sx={{ mt: 2, mb: 3 }}>
        <input
          ref={fileInputRef}
          accept="image/*,video/*,audio/*"
          style={{ display: "none" }}
          id="media-file-input"
          type="file"
          multiple
          onChange={handleFileChange}
        />
        <label htmlFor="media-file-input">
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUploadIcon />}
            fullWidth
            disabled={isLoading}
          >
            Chọn file
          </Button>
        </label>
        <Typography
          variant="caption"
          color="textSecondary"
          display="block"
          sx={{ mt: 1 }}
        >
          Giới hạn: Ảnh (30MB), Video (100MB), Audio (50MB). Tối đa 4 file ảnh/video hoặc 1 file âm thanh.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {selectedFiles.length > 0 && (
        <Paper variant="outlined" sx={{ mb: 3 }}>
          <List dense>
            {selectedFiles.map((file, index) => (
              <ListItem key={index}>
                <Box sx={{ mr: 1 }}>{getFileIcon(file)}</Box>
                <ListItemText
                  primary={file.name}
                  secondary={`${file.type} - ${getFileSize(file.size)}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={selectedFiles.length === 0 || isLoading}
        fullWidth
        startIcon={isLoading ? <CircularProgress size={24} /> : null}
      >
        {isLoading ? "Đang tải lên..." : "Tải lên"}
      </Button>
    </Box>
  );
};

export default MediaUploader;
