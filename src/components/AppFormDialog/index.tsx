// components/AppFormDialog.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { ReactNode } from "react";

interface AppFormDialogProps {
  open: boolean;
  title: string;
  loading?: boolean;
  children: ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  onClose: () => void;
}

const AppFormDialog = ({
  open,
  title,
  loading = false,
  children,
  onClose,
  maxWidth = "sm",
}: AppFormDialogProps) => {
  // Xử lý đóng dialog với focus management
  const handleClose = () => {
    if (loading) return; // Không cho phép đóng khi đang loading

    // Blur tất cả focusable elements trước khi đóng
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), video, audio'
    );
    focusableElements.forEach((element) => {
      (element as HTMLElement).blur();
    });

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth={maxWidth}
      scroll="paper"
    >
      <DialogTitle>
        {title}
        {!loading && (
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
        {loading && (
          <CircularProgress
            size={24}
            sx={{ position: "absolute", right: 48, top: 16 }}
          />
        )}
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
};

export default AppFormDialog;
