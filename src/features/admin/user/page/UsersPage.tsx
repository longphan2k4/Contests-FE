import React, { useState, useEffect, useCallback, memo } from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import CreateUser from "../components/CreateUser";
import ViewUser from "../components/ViewUser";
import EditUser from "../components/EditeUser";
import UserList from "../components/UserList";
import { useNotification } from "../../../../contexts/NotificationContext";

import { useUsers } from "../hook/useUsers";
import { useUserById } from "../hook/userUserById";
import { useCreateUser } from "../hook/useCreate";
import { data } from "react-router-dom";

import {
  type User,
  type CreateUserInput,
  type UpdateUserInput,
} from "../types/user.shame";

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [pendingAction, setPendingAction] = useState<"view" | "edit" | null>(
    null
  );
  const { showSuccessNotification, showErrorNotification } = useNotification();

  const {
    data: usersQuery,
    isLoading: isUsersLoading,
    isError: isUsersError,
    refetch: refetchUsers,
  } = useUsers();

  const { data: selectedUserData } = useUserById(selectedUserId);

  const { mutate: mutateCreate } = useCreateUser();

  useEffect(() => {
    if (usersQuery) {
      setUsers(usersQuery.data.user);
    }
  }, [usersQuery]);

  useEffect(() => {
    if (!selectedUserData || !pendingAction) return;

    setSelectedUser(selectedUserData);

    if (pendingAction === "view") setIsViewOpen(true);
    if (pendingAction === "edit") setIsEditOpen(true);

    setPendingAction(null);
  }, [selectedUserData, pendingAction]);

  const openCreate = () => setIsCreateOpen(true);
  const closeCreate = () => setIsCreateOpen(false);

  const toggleActive = useCallback((id: number) => {
    setUsers(prev =>
      prev.map(u => (u.id === id ? { ...u, isActive: !u.isActive } : u))
    );
  }, []);

  const handleDelete = useCallback((id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    // TODO: gọi API xoá user
  }, []);

  const handleCreate = (payload: CreateUserInput) => {
    mutateCreate(payload, {
      onSuccess: data => {
        if (data)
          showSuccessNotification(
            `Tạo tài khoản ${payload.username} thành công`
          );
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
    // TODO: gọi API cập nhật user
  };

  const handleAction = useCallback(
    (type: "view" | "edit" | "delete", id: number) => {
      if (type === "delete") {
        handleDelete(id);
        return;
      }
      setSelectedUserId(id);
      setPendingAction(type);
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
        <UserList
          users={users}
          onView={id => handleAction("view", id)}
          onEdit={id => handleAction("edit", id)}
          onDelete={id => handleAction("delete", id)}
          onToggle={toggleActive}
        />
      </Box>

      {/* Modals */}
      <CreateUser
        isOpen={isCreateOpen}
        onClose={closeCreate}
        onSubmit={handleCreate}
      />

      <ViewUser
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        user={selectedUser}
      />

      <EditUser
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        user={selectedUser}
        onSubmit={handleUpdate}
      />
    </Box>
  );
};

export default memo(UsersPage);
