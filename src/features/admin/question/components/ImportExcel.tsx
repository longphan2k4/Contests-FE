import React, { useEffect } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import FormInput from "../../../../components/FormInput";
import { Box, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ImportExcelSchema,
  type ImportExcelInput,
} from "../schemas/questionSchema";
import { useImportExcel } from "../hooks/useImportExcel";
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

  const handleExportExcel = () => {//sua
    const data: any = [
       {
        STT: 1,
        "Giới thiệu": "Câu hỏi Toán học nâng cao",
        "Thời gian mặc định (s) ": 1,
        "Loại câu hỏi(tam thoi ko sua)": "multiple_choice",
        "Nội dung câu hỏi": "Đạo hàm của hàm số y = x² là?",
        "Lựa chọn":"x | 2x | x² | 2x²",
        "Đáp án đúng":"2x",
        "Điểm":"20",
        "Độ khó(Alpha|Beta|Rc|Gold)":"Alpha",
        "Giải thích":"Đạo hàm của x² là 2x",
        "Chủ đề(id chu de)":"3",
        "Trạng thái":"Hoạt động",
      },
          {
        STT: 2,
        "Giới thiệu": "Câu hỏi Toán học nâng cao",
        "Thời gian mặc định (s) ": 1,
        "Loại câu hỏi(tam thoi ko sua)": "multiple_choice",
        "Nội dung câu hỏi": "Đạo hàm của hàm số y = x² là?",
        "Lựa chọn":"x | 2x | x² | 2x²",
        "Đáp án đúng":"2x",
        "Điểm":"20",
        "Độ khó(Alpha|Beta|Rc|Gold)":"Beta",
        "Giải thích":"Đạo hàm của x² là 2x",
        "Chủ đề(id chu de)":"3",
        "Trạng thái":"Hoạt động",
      },
          {
        STT: 3,
        "Giới thiệu": "Câu hỏi Toán học nâng cao",
        "Thời gian mặc định (s) ": 1,
        "Loại câu hỏi(tam thoi ko sua)": "multiple_choice",
        "Nội dung câu hỏi": "Đạo hàm của hàm số y = x² là?",
        "Lựa chọn":"x | 2x | x² | 2x²",
        "Đáp án đúng":"2x",
        "Điểm":"20",
        "Độ khó(Alpha|Beta|Rc|Gold)":"Alpha",
        "Giải thích":"Đạo hàm của x² là 2x",
        "Chủ đề(id chu de)":"3",
        "Trạng thái":"Hoạt động",
      },
    ];

    exportExcel(//sua
      {
        data: data,
        fileName: "ExcelQuestionExample.xlsx",
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
        title="Thêm sinh viên bằng Excel"
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
