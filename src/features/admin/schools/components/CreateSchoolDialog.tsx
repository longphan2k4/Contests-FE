import { useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SchoolForm from "./SchoolForm";
import { useCreateSchool } from "../hooks";
import type { School } from "../types/school";

import { useToast } from "@/contexts/toastContext";

interface CreateSchoolDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const CreateSchoolDialog = ({
  open,
  onClose,
  onCreated,
}: CreateSchoolDialogProps) => {
  const { create, loading, error, validationErrors } = useCreateSchool();
  const { showToast } = useToast();

  // Hiển thị lỗi chung nếu có và không phải lỗi validation
  useEffect(() => {
    if (error && (!validationErrors || validationErrors.length === 0)) {
      showToast(error, "error");
    }
  }, [error, validationErrors, showToast]);

  const handleSubmit = async (data: Partial<School>) => {
    try {
      const result = await create(data);
      if (result) {
        showToast("Tạo mới trường học thành công", "success");
        if (onCreated) {
          onCreated();
        }
        // Đóng dialog sau một khoảng thời gian để người dùng đọc thông báo thành công
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch {
      // Lỗi đã được xử lý bởi hook useCreateSchool và useEffect
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={loading ? undefined : onClose}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle
          sx={{ m: 0, p: 2, bgcolor: "secondary.main", color: "white" }}
        >
          Thêm trường học mới
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
        </DialogTitle>
        <DialogContent dividers>
          <SchoolForm
            onSubmit={handleSubmit}
            isSubmitting={loading}
            submitButtonText="Tạo mới"
            validationErrors={validationErrors}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateSchoolDialog;
