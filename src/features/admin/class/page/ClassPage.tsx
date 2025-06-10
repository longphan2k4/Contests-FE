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

import { useClasses } from "../hook/useClasses";
import { useCreate } from "../hook/useCreate";
import { useUpdate } from "../hook/useUpdate";
import { useActive } from "../hook/useActive";
import { useDeletes } from "../hook/useDeletes";
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

  const { data: schoolData } = useListSChool();

  const { mutate: mutateCreate } = useCreate();

  const { mutate: mutateUpdate } = useUpdate();

  const { mutate: mutateActive } = useActive();

  const { mutate: mutateDeletes } = useDeletes();

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
    mutateDeletes(ids, {
      onSuccess: data => {
        data.messages.forEach((item: any, index: number) => {
          if (item.status === "error") {
            showToast(item.msg, "error");
          } else {
            showToast(item.msg, "success");
          }
        });
        refetchClasss();
      },
      onError: err => {
        showToast("Xóa lớp học thất bại");
      },
    });
  };

  const handleCreate = (payload: CreateClassInput) => {
    mutateCreate(payload, {
      onSuccess: data => {
        if (data) showToast(`Tạo tài khoản thành công`, "success");
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

  const handleDelete = useCallback(() => {}, []);

  const handleAction = useCallback(
    (type: "view" | "edit" | "delete", id: number) => {
      if (type === "delete") {
        return;
      }
      setSelectedClassId(id);
      if (type === "view") setIsViewOpen(true);
      if (type === "edit") setIsEditOpen(true);
    },
    [handleDelete]
  );

  if (isClasssLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (isClasssError) {
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
            sx={{
              flexWrap: "wrap",
              alignItems: { sm: "center" },
              mb: 2,
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
              sx={{ minWidth: { xs: "100%", sm: 200 } }}
            />

            <FormControl
              size="small"
              sx={{ minWidth: { xs: "100%", sm: 200 } }}
            >
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={
                  filter.isActive === undefined
                    ? "all"
                    : filter.isActive
                    ? "active"
                    : "inactive"
                }
                label="Trạng thái"
                onChange={e =>
                  setFilter(prev => ({
                    ...prev,
                    isActive:
                      e.target.value === "all"
                        ? undefined
                        : e.target.value === "active"
                        ? true
                        : false,
                  }))
                }
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="active">Đang hoạt động</MenuItem>
                <MenuItem value="inactive">Đã ẩn</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              size="small"
              sx={{ minWidth: { xs: "100%", sm: 200 } }}
            >
              <InputLabel>Trường</InputLabel>
              <Select
                value={filter.schoolId ?? "all"}
                label="Trường"
                onChange={e =>
                  setFilter(prev => ({
                    ...prev,
                    schoolId:
                      e.target.value === "all" ? undefined : e.target.value,
                  }))
                }
              >
                <MenuItem value="all">Tất cả</MenuItem>
                {school.map(s => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedClassIds.length > 0 && (
              <Button
                variant="contained"
                color="error"
                sx={{ width: { xs: "100%", sm: "auto" } }}
                onClick={() => handeDeletes({ ids: selectedClassIds })}
              >
                Xoá người ({selectedClassIds.length})
              </Button>
            )}

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
          </Stack>

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
                  }));
                  filter.page = 1;
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
        <Box className="flex flex-col items-center">
          {" "}
          <Pagination
            count={pagination.totalPages}
            page={filter.page ?? 1}
            color="primary"
            onChange={(event, value) =>
              setFilter(prev => ({
                ...prev,
                page: value,
              }))
            }
            showFirstButton
            showLastButton
          />
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
      </Box>
    </Box>
  );
};

export default memo(ClassesPage);
