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
  topics: any[];
}
// interface Topic{
//   id: number;
//   name: string;
// }
export default function ImportExcelDialog({
  isOpen,
  onClose,
  topics,
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
      console.log(topics);
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
    const topic_arr = topics.map((t, i) => {
      return {
        STT: i + 2,
        "Giới thiệu": "",
        "Thời gian mặc định (>10s) ": "",
        "Loại câu hỏi": "",
        "Nội dung câu hỏi": "",
        "Lựa chọn": "",
        "Đáp án đúng": "",
        "Điểm": "",
        "Độ khó(Alpha|Beta|Rc|Gold)": "",
        "Giải thích": "",
        "Chủ đề": "",
        "Trạng thái": "",
        "question_type": "",//loai cau tu generate
        "topic_id": "",//chu de tu generate
        "question topic id": t.id,
        "Tên chủ Đề": t.name,
        "question type": i == 0 ? "multiple_choice"
          : i === 1
            ? "essay"
            : "",
        "loại câu hỏi": i == 0 ? "Trắc nghiệm"
          : i === 1
            ? "Tự luận"
            : "",
      }
    })
    const data: any = [
      {
        STT: 1,
        "Giới thiệu": "Câu hỏi Toán học nâng cao",
        "Thời gian mặc định (>10s) ": 10,
        "Loại câu hỏi": `Trắc nghiệm`,
        "Nội dung câu hỏi": "Đạo hàm của hàm số y = x² là?",
        "Lựa chọn": "x|2x|x²|2x²",
        "Đáp án đúng": "2x",
        "Điểm": "20",
        "Độ khó(Alpha|Beta|Rc|Gold)": "Alpha",
        "Giải thích": "Đạo hàm của x² là 2x",
        "Chủ đề": "Khoa học xã hội",
        "Trạng thái": "Hoạt động",
        "question_type": `=XLOOKUP(D2,$R$3:$R$4,$Q$3:$Q$4,"")`,
        "topic_id": `=XLOOKUP(K2,$P$3:$P$4,$O$3:$O$4,"")`,
        "question topic id": "",
        "Tên chủ Đề": "",
        "question type": "",
        "loại câu hỏi": "",
      },
      ...topic_arr
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
