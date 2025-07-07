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

import CreateUser from "../components/CreateUser";
import ViewUser from "../components/ViewUser";
import EditUser from "../components/EditeUser";
import UserList from "../components/UserList";
import { useToast } from "../../../../contexts/toastContext";
import ConfirmDeleteMany from "../../../../components/Confirm";
import ConfirmDelete from "../../../../components/Confirm";
import FormAutocompleteFilter from "../../../../components/FormAutocompleteFilter";

import { useUsers } from "../hook/useUsers";
import { useCreateUser } from "../hook/useCreate";
import { useUpdate } from "../hook/useUpdate";
import { useActive } from "../hook/useActive";
import { useDeleteMany } from "../hook/useDeleteMany";
import { useDelete } from "../hook/useDelete";
import AddIcon from "@mui/icons-material/Add";
import { useExportExcel } from "@/hooks/useExportExcel";

import {
  type User,
  type CreateUserInput,
  type UpdateUserInput,
  type UserQuery,
  type pagination,
  type deleteUsersType,
  Role,
} from "../types/user.shame";
import SearchIcon from "@mui/icons-material/Search";

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [pagination, setPagination] = useState<pagination>({});

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmDeleteMany, setIsConfirmDeleteMany] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);

  const [filter, setFilter] = useState<UserQuery>({});
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  const { showToast } = useToast();

  const {
    data: usersQuery,
    isLoading: isUsersLoading,
    isError: isUsersError,
    refetch: refetchUsers,
  } = useUsers(filter);

  const { mutate: mutateCreate } = useCreateUser();

  const { mutate: mutateUpdate } = useUpdate();

  const { mutate: mutateActive } = useActive();

  const { mutate: mutateDeleteMany } = useDeleteMany();

  const { mutate: mutateDelete } = useDelete();

  const { mutate: exportExcel } = useExportExcel();

  useEffect(() => {
    refetchUsers();
    document.title = "Quản lý người dùng";
  }, []);

  useEffect(() => {
    if (usersQuery) {
      setUsers(usersQuery.data.user);
      setPagination(usersQuery.data.pagination);
    }
  }, [usersQuery]);

  const openCreate = () => setIsCreateOpen(true);
  const closeCreate = () => setIsCreateOpen(false);

  const toggleActive = useCallback((id: number) => {
    mutateActive(
      { id: id },
      {
        onSuccess: () => {
          showToast(`Cập nhật trạng thái thành công`, "success");

          refetchUsers();
          setSelectedUserId(null);
        },
        onError: (err: any) => {
          showToast(err.response?.data?.message, "error");
        },
      }
    );
  }, []);

  const handeDeletes = (ids: deleteUsersType) => {
    mutateDeleteMany(ids, {
      onSuccess: data => {
        data.messages.forEach((item: any) => {
          if (item.status === "error") {
            showToast(item.msg, "error");
          } else {
            showToast(item.msg, "success");
          }
        });
        refetchUsers();
      },
      onError: err => {
        console.log(err);
      },
    });
  };

  const handleCreate = (payload: CreateUserInput) => {
    mutateCreate(payload, {
      onSuccess: data => {
        if (data) showToast(`Tạo tài khoản thành công`, "success");
        refetchUsers();
      },
      onError: (err: any) => {
        if (err.response?.data?.message) {
          showToast(err.response?.data?.message, "error");
        }
      },
    });
  };

  const handleUpdate = (payload: UpdateUserInput) => {
    if (selectedUserId) {
      mutateUpdate(
        { id: selectedUserId, payload },
        {
          onSuccess: () => {
            showToast(`Cập nhật tài khoản thành công`, "success");
            refetchUsers();
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
        showToast(`Xóa người dùng thành công`, "success");
        refetchUsers();
      },
      onError: (error: any) => {
        showToast(error.response?.data?.message, "error");
      },
    });
  }, []);

  const handleAction = useCallback(
    (type: "view" | "edit" | "delete", id: number) => {
      setSelectedUserId(id);

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
    const data = users.map(user => ({
      id: user.id,
      "Tên tài khoản": user.username,
      "Địa chỉ email": user.email,
      "Vai trò":
        user.role === "Admin"
          ? "Admin"
          : user.role === "Judge"
          ? "Trọng tài"
          : "Sinh viên",
    }));

    exportExcel(
      {
        data: data,
        fileName: "users.xlsx",
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

  if (isUsersLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (isUsersError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          action={<Button onClick={() => refetchUsers()}>Thử lại</Button>}
        >
          Không thể tải danh sách người dùng.
        </Alert>
      </Box>
    );
  }
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">Quản lý người dùng</Typography>

        {/* Buttons */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreate}
          >
            Thêm người dùng
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={handleExportExcel}
          >
            Xuất Excel
          </Button>
        </Box>
      </Box>

      {/* User list card */}
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

            {/* Vai trò */}
            <FormAutocompleteFilter
              label="Vai trò"
              options={[
                { label: "Tất cả", value: "all" },
                { label: "Admin", value: "Admin" },
                { label: "Trọng tài", value: "Judge" },
                { label: "Sinh viên", value: "Student" },
              ]}
              value={filter.role ?? "all"}
              onChange={(val: string | number | undefined) =>
                setFilter(prev => ({
                  ...prev,
                  role: val === "all" ? undefined : (val as Role),
                }))
              }
              sx={{ flex: { sm: 1 }, minWidth: { xs: "100%", sm: 200 } }}
            />

            {/* Nút xoá người */}
            {selectedUserIds.length > 0 && (
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
                Xoá người ({selectedUserIds.length})
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
              Tổng số: {pagination.total} người dùng
            </Typography>
          </Box>

          <UserList
            users={users}
            selectedUserIds={selectedUserIds}
            setSelectedUserIds={setSelectedUserIds}
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
                    page: 1,
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
        <CreateUser
          isOpen={isCreateOpen}
          onClose={closeCreate}
          onSubmit={handleCreate}
        />

        <ViewUser
          isOpen={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          id={selectedUserId}
        />

        <EditUser
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          id={selectedUserId}
          onSubmit={handleUpdate}
        />
      </Box>
      <ConfirmDeleteMany
        open={isConfirmDeleteMany}
        onClose={() => setIsConfirmDeleteMany(false)}
        title="Xác nhận xóa người dùng "
        description={`Bạn có chắc xóa ${selectedUserIds.length} tài khoản này không`}
        onConfirm={() => handeDeletes({ ids: selectedUserIds })}
      />

      <ConfirmDelete
        open={isConfirmDelete}
        onClose={() => setIsConfirmDelete(false)}
        title="Xác nhận xóa người dùng "
        description={`Bạn có chắc chắn xóa tài khoản này không`}
        onConfirm={() => handleDelete(selectedUserId)}
      />
    </Box>
  );
};

export default memo(UsersPage);
