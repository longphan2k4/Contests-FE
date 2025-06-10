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
import { useNotification } from "../../../../contexts/NotificationContext";

import { useUsers } from "../hook/useUsers";
import { useCreateUser } from "../hook/useCreate";
import { useUpdate } from "../hook/useUpdate";
import { useActive } from "../hook/useActive";
import AddIcon from "@mui/icons-material/Add";

import {
  type User,
  type CreateUserInput,
  type UpdateUserInput,
  type UserQuery,
  Role,
  type pagination,
} from "../types/user.shame";
import SearchIcon from "@mui/icons-material/Search";

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pagination, setPagination] = useState<pagination>({});

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [filter, setFilter] = useState<UserQuery>({});
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  const { showSuccessNotification, showErrorNotification } = useNotification();

  const {
    data: usersQuery,
    isLoading: isUsersLoading,
    isError: isUsersError,
    refetch: refetchUsers,
  } = useUsers(filter);

  const { mutate: mutateCreate } = useCreateUser();

  const { mutate: mutateUpdate } = useUpdate();

  const { mutate: mutateActive } = useActive();

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
        onSuccess: data => {
          showSuccessNotification(
            `Cập nhật trạng thái ${selectedUser?.username} thành công`
          );
          refetchUsers();
          setSelectedUserId(null);
        },
        onError: (err: any) => {
          showErrorNotification(err.response?.data?.message);
        },
      }
    );
  }, []);

  const handleDelete = useCallback((id: number) => {}, []);

  const handleCreate = (payload: CreateUserInput) => {
    mutateCreate(payload, {
      onSuccess: data => {
        if (data) showSuccessNotification(`Tạo tài khoản thành công`);
        refetchUsers();
      },
      onError: (err: any) => {
        if (err.response?.data?.message) {
          showErrorNotification(err.response?.data?.message);
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
            showSuccessNotification(`Cập nhật tài khoản thành công`);
            refetchUsers();
          },
          onError: (err: any) => {
            if (err.response?.data?.message)
              showErrorNotification(err.response?.data?.message);
          },
        }
      );
    }
  };

  const handleAction = useCallback(
    (type: "view" | "edit" | "delete", id: number) => {
      if (type === "delete") {
        handleDelete(id);
        return;
      }
      setSelectedUserId(id);
      if (type === "view") setIsViewOpen(true);
      if (type === "edit") setIsEditOpen(true);
    },
    [handleDelete]
  );

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
          action={<Button onClick={() => refetchUsers}>Thử lại</Button>}
        >
          Không thể tải danh sách người dùng.
        </Alert>
      </Box>
    );
  }
  console.log(selectedUserIds);
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">Quản lý người dùng</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
        >
          Thêm người dùng
        </Button>
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
              <InputLabel>Vai trò</InputLabel>
              <Select
                value={filter.role ?? "all"}
                label="Vai trò"
                onChange={e =>
                  setFilter(prev => ({
                    ...prev,
                    role:
                      e.target.value === "all"
                        ? undefined
                        : (e.target.value as Role),
                  }))
                }
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Judge">Trọng tài</MenuItem>
              </Select>
            </FormControl>

            {selectedUserIds.length > 0 && (
              <Button
                variant="contained"
                color="error"
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                Xoá người ({selectedUserIds.length})
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
                Tổng số: {pagination.total} trường học
              </Typography>
            </Box>
          </Stack>

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
    </Box>
  );
};

export default memo(UsersPage);
