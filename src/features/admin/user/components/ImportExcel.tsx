import React, { useEffect } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import { Box, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImportExcelSchema, type ImportExcelInput } from "../types/user.shame";
import { useImportExcel } from "../hook/useImportExcel";
import { useToast } from "../../../../contexts/toastContext";
import { useExportExcel } from "@/hooks/useExportExcel";

interface ImportExcelDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportExcelDialog({
  isOpen,
  onClose,
}: ImportExcelDialogProps): React.ReactElement {
  const { mutate: importExcel, isPending } = useImportExcel();
  const { mutate: exportExcel } = useExportExcel();
  const [error, setError] = React.useState<string[] | []>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ImportExcelInput>({
    resolver: zodResolver(ImportExcelSchema),
  });

  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);
  const handleFormSubmit = (data: ImportExcelInput) => {
    setError([]);
    importExcel(data.file[0], {
      onSuccess: (response: any) => {
        showToast(`Thêm thành công ${response.data}`, "success");
        onClose();
      },
      onError: (error: any) => {
        setError(error.response.data.errors);
      },
    });
  };

  const handleExportExcel = () => {
    const data: any = [
      {
        STT: 1,
        "Tên tài khoản": "admin",
        "Mật khẩu": "password1",
        "Địa chỉ Email": "user1@example.com",
        "Vai trò": "Admin",
      },
      {
        STT: 2,
        "Tên tài khoản": "judge",
        "Mật khẩu": "password1",
        "Địa chỉ Email": "judge@example.com",
        "Vai trò": "Judge",
      },
      {
        STT: 3,
        "Tên tài khoản": "student",
        "Mật khẩu": "password1",
        "Địa chỉ Email": "judge@example.com",
        "Vai trò": "Student",
      },
    ];

    exportExcel(
      {
        data: data,
        fileName: "ExcelUserExample.xlsx",
      },
      {
        onSuccess: () => {
          showToast(`Xuất Excel thành công`, "success");
        },
        onError: (err: any) => {
          showToast(err.response?.data?.message, "error");
        },
      }
    );
  };

  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title="Thêm người dùng bằng Excel"
        maxWidth="sm"
      >
        <Button
          variant="outlined"
          onClick={handleExportExcel}
          sx={{ mb: 2, float: "right" }}
        >
          Xuất Excel mẫu
        </Button>
        <form id="create-school-form" onSubmit={handleSubmit(handleFormSubmit)}>
          <FormInput
            label="Chọn file excel"
            id="file"
            placeholder="Nhập tên tài khoản"
            error={errors.file}
            type="file"
            register={register("file")}
          />
          {error?.length > 0 && (
            <Box sx={{ mt: 2, color: "red" }}>
              {error.map((err, index) => (
                <div key={index}>{err}</div>
              ))}
            </Box>
          )}
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2, display: "block ", float: "right", marginTop: "24px" }}
          >
            {isPending ? "Đang tải..." : "Tải lên"}
          </Button>
        </form>
      </AppFormDialog>
    </Box>
  );
}
