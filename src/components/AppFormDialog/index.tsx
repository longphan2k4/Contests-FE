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
}: AppFormDialogProps) => (
  <Dialog
    open={open}
    onClose={loading ? undefined : onClose}
    fullWidth
    maxWidth={maxWidth}
    scroll="paper"
  >
    <DialogTitle>
      {title}
      {!loading && (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500],
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

export default AppFormDialog;
