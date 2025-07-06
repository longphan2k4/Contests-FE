import React, { useEffect } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import { Box, CircularProgress } from "@mui/material";
import { useStudentById } from "../hook/useStudentById";

interface ViewStudentProps {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewStudent({
  id,
  isOpen,
  onClose,
}: ViewStudentProps): React.ReactElement {
  const {
    data: student,
    isLoading: isLoadingStudent,
    refetch,
    isError,
  } = useStudentById(id);

  useEffect(() => {
    if (isOpen && id) {
      refetch();
    }
  }, [isOpen, id, refetch]);

  const fields = [
    { label: "ID", value: student?.id },
    { label: "Họ và tên", value: student?.fullName },
    { label: "Mã học sinh", value: student?.studentCode || "Chưa có" },
    {
      label: "Lớp",
      value: student?.class?.name || "Chưa có",
    },
    {
      label: "Tên đăng nhập",
      value: student?.user?.username || "Chưa có",
    },
    {
      label: "Ảnh đại diện",
      value: student?.avatar ? (
        <img
          src={
            student.avatar ? student.avatar : "https://via.placeholder.com/150"
          }
          alt="Avatar"
          style={{
            maxWidth: "100%",
            maxHeight: 150,
            borderRadius: 8,
            objectFit: "cover",
          }}
        />
      ) : (
        "Chưa có"
      ),
    },
    {
      label: "Link video giới thiệu",
      value: student?.bio ? (
        <a
          href={student.bio}
          className="text-blue-500"
          target="_blank"
          rel="noopener noreferrer"
        >
          {student.bio}
        </a>
      ) : (
        "Chưa có"
      ),
    },

    {
      label: "Trạng thái",
      value: student?.isActive ? "Đang hoạt động" : "Đã vô hiệu hóa",
    },
  ];

  if (isLoadingStudent) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) return <div>Không thể tải dữ liệu</div>;

  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title={`Xem sinh viên: ${student?.fullName || "Học sinh"}`}
        maxWidth="sm"
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {fields.map(({ label, value }) => (
              <tr key={label} style={{ borderBottom: "1px solid #ddd" }}>
                <td
                  style={{
                    fontWeight: "bold",
                    padding: "8px",
                    width: "35%",
                    verticalAlign: "top",
                  }}
                >
                  {label}
                </td>
                <td style={{ padding: "8px", verticalAlign: "top" }}>
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AppFormDialog>
    </Box>
  );
}
