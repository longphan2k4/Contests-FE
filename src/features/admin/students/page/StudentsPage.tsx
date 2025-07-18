import React, { useState, useEffect, useCallback, memo } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  InputAdornment,
} from "@mui/material";
import { Button } from "@mui/material";
import { Pagination } from "@mui/material";

import CreateStudentDialog from "../components/CreateStudent";
import ViewStudent from "../components/ViewStudent";
import EditStudent from "../components/EditStudent";
import StudentList from "../components/StudentList";
import { useToast } from "../../../../contexts/toastContext";
import ConfirmDeleteMany from "../../../../components/Confirm";
import ConfirmDelete from "../../../../components/Confirm";
import FormAutocompleteFilter from "../../../../components/FormAutocompleteFilter";
import ImportExcelDialog from "../components/ImportExcel";
import { useClasses } from "../hook/useGetClass";
import { useStudents } from "../hook/useStudents";
import { useCreateStudent } from "../hook/useCreate";
import { useUpdate } from "../hook/useUpdate";
import { useActive } from "../hook/useActive";
import { useDeleteMany } from "../hook/useDeleteMany";
import { useDelete } from "../hook/useDelete";
import { useExportExcel } from "@/hooks/useExportExcel";
import AddIcon from "@mui/icons-material/Add";
import {
  type Student,
  type StudentQuery,
  type pagination,
  type deleteStudentsType,
} from "../types/student.shame";
import SearchIcon from "@mui/icons-material/Search";

const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );
  const [pagination, setPagination] = useState<pagination>({});

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmDeleteMany, setIsConfirmDeleteMany] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [isImportExcelOpen, setIsImportExcelOpen] = useState(false);
  const [filter, setFilter] = useState<StudentQuery>({});
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [listClass, setListClass] = useState<{ id: number; name: string }[]>(
    []
  );

  const { showToast } = useToast();

  const {
    data: studentsQuery,
    isLoading: isStudentsLoading,
    isError: isStudentsError,
    refetch: refetchStudents,
  } = useStudents(filter);

  const { mutate: mutateCreate } = useCreateStudent();

  const { mutate: mutateUpdate } = useUpdate();

  const { mutate: mutateActive } = useActive();

  const { mutate: mutateDeleteMany } = useDeleteMany();

  const { mutate: mutateDelete } = useDelete();

  const { mutate: exportExcel } = useExportExcel();
  const {
    data: classData,
    isLoading: isClassLoading,
    isError: isClassError,
  } = useClasses();

  useEffect(() => {
    if (classData) {
      setListClass(classData.data);
    }
  }, [classData]);

  useEffect(() => {
    if (studentsQuery) {
      setStudents(studentsQuery.data.students);
      setPagination(studentsQuery.data.pagination);
    }
  }, [studentsQuery]);

  const openCreate = () => setIsCreateOpen(true);
  const closeCreate = () => setIsCreateOpen(false);
  useEffect(() => {
    document.title = "Quản lý Sinh viên";
    refetchStudents();
    refetchStudents();
  }, []);
  const toggleActive = useCallback((id: number) => {
    mutateActive(
      { id: id },
      {
        onSuccess: () => {
          showToast(`Cập nhật trạng thái thành công`, "success");

          refetchStudents();
          setSelectedStudentId(null);
        },
        onError: (err: any) => {
          showToast(err.response?.data?.message, "error");
        },
      }
    );
  }, []);

  const handeDeletes = (ids: deleteStudentsType) => {
    mutateDeleteMany(ids, {
      onSuccess: data => {
        data.messages.forEach((item: any) => {
          if (item.status === "error") {
            showToast(item.msg, "error");
          } else {
            showToast(item.msg, "success");
          }
        });
        refetchStudents();
      },
      onError: (err: any) => {
        if (err.response?.data?.message) {
          showToast(err.response?.data?.message, "error");
        }
      },
    });
  };

  const handleCreate = (payload: FormData) => {
    mutateCreate(payload, {
      onSuccess: data => {
        if (data) showToast(`Tạo sinh viên thành công`, "success");
        refetchStudents();
      },
      onError: (err: any) => {
        if (err.response?.data?.message) {
          showToast(err.response?.data?.message, "error");
        }
      },
    });
  };

  const handleUpdate = (payload: FormData) => {
    if (selectedStudentId) {
      mutateUpdate(
        { id: selectedStudentId, payload },
        {
          onSuccess: () => {
            showToast(`Cập nhật sinh viên thành công`, "success");
            setSelectedStudentId(null);
            refetchStudents();
          },
          onError: (err: any) => {
            if (err.response?.data?.message)
              showToast(err.response?.data?.message, "error");
          },
        }
      );
    }
  };

  const handleDelete = useCallback((id: number | null) => {
    if (!id) return;
    mutateDelete(id, {
      onSuccess: () => {
        showToast(`Xóa sinh viên thành công`, "success");
        refetchStudents();
        setSelectedStudentId(null);
      },
      onError: (error: any) => {
        showToast(error.response?.data?.message, "error");
      },
    });
  }, []);

  const handleAction = useCallback(
    (type: "view" | "edit" | "delete", id: number) => {
      setSelectedStudentId(id);

      if (type === "delete") {
        setIsConfirmDelete(true);
      }

      if (type === "view") setIsViewOpen(true);
      if (type === "edit") setIsEditOpen(true);
    },
    []
  );

  const hanldConfirmDeleteManyDeletes = () => {
    setIsConfirmDeleteMany(true);
  };

  const handleExportExcel = () => {
    const data: any = students.map(student => ({
      id: student.id,
      fullName: student.fullName,
      studentCode: student.studentCode,
      isActive: student.isActive,
      className: student.className,
    }));

    exportExcel(
      {
        data: data,
        fileName: "Student.xlsx",
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

  if (isStudentsLoading || isClassLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isStudentsError || isClassError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          action={<Button onClick={() => refetchStudents()}>Thử lại</Button>}
        >
          Không thể tải danh sách sinh viên.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">Quản lý sinh viên</Typography>

        {/* Buttons */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreate}
          >
            Thêm sinh viên
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={handleExportExcel}
          >
            Xuất Excel
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={() => setIsImportExcelOpen(true)}
          >
            Nhập từ Excel
          </Button>
        </Box>
      </Box>
      {/* Student list card */}
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
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            useFlexGap
            flexWrap="wrap"
            sx={{
              alignItems: "stretch",
              mb: 2,
              gap: 2,
            }}
          >
            {/* Ô tìm kiếm */}
            <TextField
              label="Tìm kiếm"
              variant="outlined"
              size="small"
              value={filter.search || ""}
              onChange={e =>
                setFilter(prev => ({
                  ...prev,
                  search: e.target.value,
                }))
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{
                flex: { sm: 1 },
                minWidth: { xs: "100%", sm: 200 },
              }}
            />

            <FormAutocompleteFilter
              label="Lớp học"
              options={[
                { label: "Tất cả", value: "all" },
                ...listClass.map((s: { id: number; name: string }) => ({
                  label: s.name,
                  value: s.id,
                })),
              ]}
              value={filter.classId ?? "all"}
              onChange={(val: string | number | undefined) =>
                setFilter(prev => ({
                  ...prev,
                  classId: val === "all" ? undefined : Number(val),
                }))
              }
              sx={{ flex: 1, minWidth: 200 }}
            />

            <FormAutocompleteFilter
              label="Trạng thái"
              options={[
                { label: "Tất cả", value: "all" },
                { label: "Hoạt động", value: "active" },
                { label: "Đã vô hiệu hóa", value: "inactive" },
              ]}
              value={
                filter.isActive === undefined
                  ? "all"
                  : filter.isActive
                  ? "active"
                  : "inactive"
              }
              onChange={val => {
                setFilter(prev => ({
                  ...prev,
                  isActive:
                    val === "all"
                      ? undefined
                      : val === "active"
                      ? true
                      : val === "inactive"
                      ? false
                      : undefined, // fallback nếu Autocomplete trả undefined
                }));
              }}
              sx={{ flex: { sm: 1 }, minWidth: { xs: "100%", sm: 200 } }}
            />

            {/* Nút xoá người */}
            {selectedStudentIds.length > 0 && (
              <Button
                variant="contained"
                color="error"
                onClick={hanldConfirmDeleteManyDeletes}
                sx={{
                  flex: { sm: 1 },
                  width: { xs: "100%", sm: "auto" },
                  whiteSpace: "nowrap",
                }}
              >
                Xoá ({selectedStudentIds.length})
              </Button>
            )}

            {/* Tổng số người dùng */}
          </Stack>
          <Box
            sx={{
              ml: { xs: 0, sm: "auto" },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              alignSelf={{ xs: "flex-start", sm: "center" }}
            >
              Tổng số: {pagination.total} sinh viên
            </Typography>
          </Box>

          <StudentList
            students={students}
            selectedStudentIds={selectedStudentIds}
            setSelectedStudentIds={setSelectedStudentIds}
            onView={id => handleAction("view", id)}
            onEdit={id => handleAction("edit", id)}
            onDelete={id => handleAction("delete", id)}
            onToggle={toggleActive}
          />
        </Box>

        <Box>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <FormControl variant="outlined" size="small" sx={{ minWidth: 100 }}>
              <InputLabel id="page-size-select-label">Hiển thị</InputLabel>
              <Select
                labelId="page-size-select-label"
                value={String(filter.limit || 10)}
                onChange={e => {
                  setFilter(prev => ({
                    ...prev,
                    limit: Number(e.target.value),
                    page: 1, // Reset to first page when changing limit
                  }));
                }}
                label="Hiển thị"
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
            <Typography>
              Trang {filter.page || 1} / {pagination.totalPages}
            </Typography>
          </Box>
        </Box>
        <Box
          style={{
            display:
              pagination.totalPages !== undefined && pagination.totalPages > 1
                ? "block"
                : "none",
          }}
        >
          <Box className="flex flex-col items-center">
            {" "}
            <Pagination
              count={pagination.totalPages}
              page={filter.page ?? 1}
              color="primary"
              onChange={(_event, value) =>
                setFilter(prev => ({
                  ...prev,
                  page: value,
                }))
              }
              showFirstButton
              showLastButton
            />
          </Box>
        </Box>
        <CreateStudentDialog
          isOpen={isCreateOpen}
          onClose={closeCreate}
          onSubmit={handleCreate}
        />

        <ViewStudent
          isOpen={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          id={selectedStudentId}
        />

        <EditStudent
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          id={selectedStudentId}
          onSubmit={handleUpdate}
        />
      </Box>
      <ConfirmDeleteMany
        open={isConfirmDeleteMany}
        onClose={() => setIsConfirmDeleteMany(false)}
        title="Xác nhận sinh viên dùng "
        description={`Bạn có chắc xóa ${selectedStudentIds.length} sinh viên này không`}
        onConfirm={() => handeDeletes({ ids: selectedStudentIds })}
      />

      <ConfirmDelete
        open={isConfirmDelete}
        onClose={() => setIsConfirmDelete(false)}
        title="Xác nhận sinh viên dùng "
        description={`Bạn có chắc chắn xóa sinh viên này không`}
        onConfirm={() => handleDelete(selectedStudentId)}
      />

      <ImportExcelDialog
        isOpen={isImportExcelOpen}
        onClose={() => {
          setIsImportExcelOpen(false);
          refetchStudents();
        }}
      />
    </Box>
  );
};

export default memo(StudentsPage);
