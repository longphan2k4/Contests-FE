// components/AppFormDialog.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Button,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { ReactNode } from "react";

interface ConfirmProps {
  open: boolean;
  title: string;
  description?: string; // thêm mô tả nếu cần
  loading?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  onClose: () => void;
  onConfirm: () => void;
}

const Confirm = ({
  open,
  title,
  description,
  loading = false,
  onConfirm,
  onClose,
  maxWidth = "xs",
}: ConfirmProps) => (
  <Dialog
    open={open}
    onClose={loading ? undefined : onClose}
    fullWidth
    maxWidth={maxWidth}
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

    <DialogContent dividers>
      <Typography variant="body1">
        {description || "Bạn có chắc chắn muốn xóa không?"}
      </Typography>
    </DialogContent>

    <DialogActions>
      <Button onClick={onClose} disabled={loading}>
        Hủy
      </Button>
      <Button
        onClick={() => {
          onConfirm(), onClose();
        }}
        variant="contained"
        color="error"
        disabled={loading}
      >
        {loading ? "Đang xóa..." : "Xác nhận"}
      </Button>
    </DialogActions>
  </Dialog>
);

export default Confirm;
