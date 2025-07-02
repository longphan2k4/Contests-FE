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

import CreateClass from "../components/CreateClass";
import ViewClass from "../components/ViewClass";
import EditClass from "../components/EditeClass";
import ClassList from "../components/ClassesList";
import { useToast } from "../../../../contexts/toastContext";
import ConfirmDeleteMany from "../../../../components/Confirm";
import ConfirmDelete from "../../../../components/Confirm";
import FormAutocompleteFilter from "../../../../components/FormAutocompleteFilter";

import { useClasses } from "../hook/useClasses";
import { useCreate } from "../hook/useCreate";
import { useUpdate } from "../hook/useUpdate";
import { useActive } from "../hook/useActive";
import { useDeleteMany } from "../hook/useDeleteMany";
import { useDelete } from "../hook/useDelete";
import AddIcon from "@mui/icons-material/Add";

import {
  type Classes,
  type CreateClassInput,
  type UpdateClassInput,
  type ClassQuery,
  type pagination,
  type deleteClasssType,
} from "../types/class.shame";
import SearchIcon from "@mui/icons-material/Search";

import { type listSChool } from "../types/class.shame";
import { useListSChool } from "../hook/useListSchool";

const ClassesPage: React.FC = () => {
  const [Classes, setClasses] = useState<Classes[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [pagination, setPagination] = useState<pagination>({});

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isComfirmDelete, setIsComfirmDelete] = useState(false);
  const [isComfirmDeleteMany, setIsComfirmDeleteMany] = useState(false);

  const [filter, setFilter] = useState<ClassQuery>({});
  const [selectedClassIds, setSelectedClassIds] = useState<number[]>([]);
  const [school, setSchool] = useState<listSChool[]>([]);

  const { showToast } = useToast();

  const {
    data: ClasssQuery,
    isLoading: isClasssLoading,
    isError: isClasssError,
    refetch: refetchClasss,
  } = useClasses(filter);

  const {
    data: schoolData,
    isLoading: isLoadingSchool,
    isError: isErrorSchool,
    refetch: refetchSchools,
  } = useListSChool();

  const { mutate: mutateCreate } = useCreate();

  const { mutate: mutateUpdate } = useUpdate();

  const { mutate: mutateActive } = useActive();

  const { mutate: mutateDelete } = useDelete();
  const { mutate: mutateDeleteMany } = useDeleteMany();

  useEffect(() => {
    refetchClasss();
    refetchSchools();
  }, [refetchClasss, refetchSchools]);

  useEffect(() => {
    if (ClasssQuery) {
      setClasses(ClasssQuery.data.classes);
      setPagination(ClasssQuery.data.pagination);
    }
  }, [ClasssQuery]);

  useEffect(() => {
    if (schoolData) {
      setSchool(schoolData.data);
    }
  }, [schoolData]);

  const openCreate = () => setIsCreateOpen(true);
  const closeCreate = () => setIsCreateOpen(false);

  const toggleActive = useCallback((id: number) => {
    mutateActive(
      { id: id },
      {
        onSuccess: () => {
          showToast(`Cập nhật trạng thái thành công`, "success");
          refetchClasss();
          setSelectedClassId(null);
        },
        onError: (err: any) => {
          showToast(err.response?.data?.message, "error");
        },
      }
    );
  }, []);

  const handeDeletes = (ids: deleteClasssType) => {
    mutateDeleteMany(ids, {
      onSuccess: data => {
        data.messages.forEach((item: any) => {
          if (item.status === "error") {
            showToast(item.msg, "error");
          } else {
            showToast(item.msg, "success");
          }
        });
        refetchClasss();
      },
      onError: () => {
        showToast("Xóa lớp học thất bại");
      },
    });
  };

  const handleCreate = (payload: CreateClassInput) => {
    mutateCreate(payload, {
      onSuccess: data => {
        if (data) showToast(`Thêm lớp học thành công`, "success");
        refetchClasss();
      },
      onError: (err: any) => {
        if (err.response?.data?.message) {
          showToast(err.response?.data?.message, "success");
        }
      },
    });
  };

  const handleUpdate = (payload: UpdateClassInput) => {
    if (selectedClassId) {
      mutateUpdate(
        { id: selectedClassId, payload },
        {
          onSuccess: () => {
            showToast(`Cập nhật tài khoản thành công`, "success");
            refetchClasss();
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
        showToast(`Xóa lớp học thàn công`);
      },
      onError: (error: any) => {
        showToast(error.response?.data?.message, "error");
      },
    });
  }, []);

  const handleAction = useCallback(
    (type: "view" | "edit" | "delete", id: number) => {
      setSelectedClassId(id);

      if (type === "delete") {
        setIsComfirmDelete(true);
      }
      if (type === "view") setIsViewOpen(true);
      if (type === "edit") setIsEditOpen(true);
    },
    [handleDelete]
  );

  useEffect(() => {
    document.title = "Quản lý lớp học";
  }, []);

  if (isClasssLoading || isLoadingSchool) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (isClasssError || isErrorSchool) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          action={<Button onClick={() => refetchClasss}>Thử lại</Button>}
        >
          Không thể tải danh danh sách lớp
        </Alert>
      </Box>
    );
  }
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">Quản lý lớp học</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
        >
          Thêm lớp học
        </Button>
      </Box>

      {/* Class list card */}
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
              sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}
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
              sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}
            />

            <FormAutocompleteFilter
              label="Trường"
              options={[
                { label: "Tất cả", value: "all" },
                ...school.map(s => ({
                  label: s.name,
                  value: s.id,
                })),
              ]}
              value={filter.schoolId ?? "all"}
              onChange={(val: string | number | undefined) =>
                setFilter(prev => ({
                  ...prev,
                  schoolId: val === "all" ? undefined : Number(val),
                }))
              }
              sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}
            />

            {selectedClassIds.length > 0 && (
              <Button
                variant="contained"
                color="error"
                sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}
                onClick={() => setIsComfirmDeleteMany(true)}
              >
                Xoá ({selectedClassIds.length})
              </Button>
            )}
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
              Tổng số: {pagination.total} lớp học
            </Typography>
          </Box>

          <ClassList
            Classes={Classes}
            selectedClassIds={selectedClassIds}
            setSelectedClassIds={setSelectedClassIds}
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
        <CreateClass
          isOpen={isCreateOpen}
          onClose={closeCreate}
          onSubmit={handleCreate}
        />

        <ViewClass
          isOpen={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          id={selectedClassId}
        />

        <EditClass
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          id={selectedClassId}
          onSubmit={handleUpdate}
        />
        <ConfirmDelete
          open={isComfirmDelete}
          title="Xóa lớp học"
          onClose={() => setIsComfirmDelete(false)}
          description="Bạn có chắc chắn xóa lớp học này không"
          onConfirm={() => handleDelete(selectedClassId)}
        />

        <ConfirmDeleteMany
          open={isComfirmDeleteMany}
          title="Xóa lớp học"
          onClose={() => setIsComfirmDeleteMany(false)}
          onConfirm={() => handeDeletes({ ids: selectedClassIds })}
        />
      </Box>
    </Box>
  );
};

export default memo(ClassesPage);
