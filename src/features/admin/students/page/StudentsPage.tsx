import React, { useState, useEffect, useCallback, memo } from "react";
import { Box, Typography, CircularProgress, Alert, Button,TextField,InputAdornment } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CreateStudent from "../components/CreateStudent";
import ViewStudent from "../components/ViewStudent";
import EditStudent from "../components/EditStudent";
import StudentList from "../components/StudentList";
import PaginationControl from "../components/PaginationControl";
import { useNotification } from "../../../../contexts/NotificationContext";
import { useStudents } from "../hook/useStudents";
import { useStudentById } from "../hook/useStudentById";
import { useCreateStudent } from "../hook/useCreate";
import {type Filter } from "../components/StudentList";
import { useDeleteStudent } from "../hook/useDelete";
import { useToggleStudentActive } from "../hook/useToggleStudentActive";
import { useUpdateStudent } from "../hook/useEdit";
import {
  type Student,
  type CreateStudentInput,
  type UpdateStudentInput,
} from "../types/student.shame";

const StudentsPage: React.FC = () => {
  const [, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<"view" | "edit" | null>(null);
  const { mutate: deleteStudent } = useDeleteStudent();
  const { showSuccessNotification, showErrorNotification } = useNotification();
  const { mutate: toggleActive } = useToggleStudentActive();
  const { mutate: updateStudentMutate } = useUpdateStudent();
const [filter, setFilter] = useState<Filter>({
  page: 1,
  limit: 10,
  keyword: "",
  searchText: "",
});

  const {
    data: studentsQuery,
    isLoading: isStudentsLoading,
    isError: isStudentsError,
    refetch: refetchStudents,
  } = useStudents(filter);

  const { data: selectedStudentData } = useStudentById(selectedStudentId);
  const { mutate: mutateCreate } = useCreateStudent();

  useEffect(() => {
  if (studentsQuery?.data.students) {
    setStudents(studentsQuery?.data.students);
  }
  console.log(studentsQuery?.data?.pagination.total)
}, [studentsQuery]);



  useEffect(() => {
    if (!selectedStudentData || !pendingAction) return;

    setSelectedStudent(selectedStudentData);

    if (pendingAction === "view") setIsViewOpen(true);
    if (pendingAction === "edit") setIsEditOpen(true);

    setPendingAction(null);
  }, [selectedStudentData, pendingAction]);

  const openCreate = () => setIsCreateOpen(true);
  const closeCreate = () => setIsCreateOpen(false);


const handleToggle = useCallback((id: number) => {
  toggleActive(id);
}, [toggleActive]);

  const handleDelete = useCallback((id: number) => {
    if (window.confirm("Bạn có chắc muốn xoá học sinh này không?")) {
    deleteStudent(id, {
      onSuccess: () => {
        // Nếu bạn đang dùng local state students, thì cần cập nhật:
        setStudents(prev => prev.filter(s => s.id !== id));
      },
      onError: () => {
        alert("Xoá học sinh thất bại");
      }
      
    });
  }
}, [deleteStudent]);

  const handleCreate = (payload: CreateStudentInput) => {
    mutateCreate(payload, {
      onSuccess: data => {
        if (data)
          showSuccessNotification(
            `Tạo học sinh ${payload.fullName} thành công`
          );
        refetchStudents();
      },
      onError: (err: any) => {
        if (err.response?.data?.message) {
          showErrorNotification(err.response?.data?.message);
        }
      },
    });
  };
 const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const filteredStudents = studentsQuery?.data.students || [];
  
  const total = studentsQuery?.data?.pagination?.total || 0;


  const handleUpdate = async (payload: UpdateStudentInput) => {
  if (selectedStudent?.id) {
    try {
      await new Promise((resolve, reject) => {
        updateStudentMutate(
          {
            id: selectedStudent.id,
            data: payload,
          },
          {
            onSuccess: () => resolve(undefined),
            onError: (err) => reject(err),
          }
        );
      });
      showSuccessNotification(`Cập nhật học sinh ${selectedStudent.fullName} thành công`);
      refetchStudents();
      setIsEditOpen(false);
    } catch (err) {
      showErrorNotification("Cập nhật học sinh thất bại");
    }
  }
};
  const handleAction = useCallback(
    (type: "view" | "edit" | "delete", id: number) => {
      if (type === "delete") {
        handleDelete(id);
        return;
      }
      setSelectedStudentId(id);
      setPendingAction(type);
    },
    [handleDelete]
  );

  if (isStudentsLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isStudentsError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          action={<Button onClick={() => refetchStudents()}>Thử lại</Button>}
        >
          Không thể tải danh sách học sinh.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">Quản lý học sinh</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
        >
          Thêm học sinh
        </Button>
      </Box>

      {/* Student list */}
      <Box
        sx={{
          background: "#FFFFFF",
          p: 3,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          boxShadow:
            "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
        }}
      >

        <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
                flexWrap="wrap"
                gap={2}
              >
                <TextField
                  size="small"
                  placeholder="Tìm kiếm gói câu hỏi"
                  value={searchValue}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    minWidth: { xs: "100%", sm: 300 },
                    maxWidth: { xs: "100%", sm: 300 },
                  }}
                />
        
                <Typography
                  variant="body2"
                  color="text.secondary"
                  flexShrink={0}
                  textAlign={{ xs: "right", sm: "right" }}
                  sx={{ minWidth: 120 }}
                >
                  Tổng số: {total} gói câu hỏi
                </Typography>
              </Box>

        <StudentList
          students={filteredStudents}
          onView={id => handleAction("view", id)}
          onEdit={id => handleAction("edit", id)}
          onDelete={handleDelete}
          onToggle={handleToggle}
        />
         <PaginationControl
                  totalPages={Math.ceil(total / filter.limit)}
                  currentPage={filter.page}
                  pageSize={filter.limit}
                  onPageChange={(page) =>
                    setFilter((prev) => ({ ...prev, page }))
                  }
                  onPageSizeChange={(newSize) =>
                    setFilter((prev) => ({ ...prev, limit: newSize, page: 1 }))
                  }
                />
      </Box>

      {/* Dialogs */}
      <CreateStudent
        isOpen={isCreateOpen}
        onClose={closeCreate}
        onSubmit={handleCreate}
      />

      <ViewStudent
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        student={selectedStudent}
      />

      <EditStudent
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        student={selectedStudent}
        onSubmit={handleUpdate}
      />
    </Box>
  );
};

export default memo(StudentsPage);
