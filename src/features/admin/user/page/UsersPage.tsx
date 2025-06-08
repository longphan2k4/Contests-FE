import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import CreateUser from "../components/CreateUser";
import ViewUser from "../components/ViewUser";
import EditUser from "../components/EditeUser";
import UserList from "../components/UserList";
import { useUsers } from "../hook/useUsers";
import {
  type User,
  type CreateUserInput,
  type UpdateUserInput,
} from "../types/user.shame";
import AddIcon from "@mui/icons-material/Add";

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User>({
    id: 1,
    username: "haha",
    email: "hhaa",
    role: "Judge",
    isActive: false,
  });

  const { data, isLoading, isError } = useUsers();
  useEffect(() => {
    if (data) {
      setUsers(data.data.user);
      console.log(data);
    }
  }, []);
  if (isLoading) {
    return <div>Loading</div>;
  }
  if (isError) {
    return <div>Err</div>;
  }
  const openCreate = () => setIsCreate(true);
  const closeCreate = () => setIsCreate(false);
  const toggleActive = (id: number) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === id ? { ...user, isActive: !user.isActive } : user
      )
    );
  };

  const handleDelete = (id: number) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const handleCreate = (data: CreateUserInput) => {
    const newUser: User = {
      ...data,
      id: Date.now(), // chỉ demo
      isActive: true,
    };
    setUsers(prev => [...prev, newUser]);
    closeCreate();
  };
  const handleUpdate = (data: UpdateUserInput) => {};

  const handleAction = (type: "view" | "edit" | "delete", id: number) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    setSelectedUser(user);
    if (type === "view") setIsView(true);
    if (type === "edit") setIsEdit(true);
    if (type === "delete") handleDelete(id);
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h5">Quản lý người dùng</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreate}
          >
            Thêm người dùng mới
          </Button>
        </Box>

        <Box
          sx={{
            background: "#FFFFFF",
            p: "24px",
            boxShadow:
              "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
            border: "1px solid #ccc",
            borderRadius: "16px",
          }}
        >
          <UserList
            uses={users}
            onView={id => handleAction("view", id)}
            onEdit={id => handleAction("edit", id)}
            onDelete={id => handleAction("delete", id)}
            onToggle={toggleActive}
          />
        </Box>

        {/* Popups */}
        <CreateUser
          isOpen={isCreate}
          onClose={closeCreate}
          onSubmit={handleCreate}
        />

        <EditUser
          user={selectedUser}
          isOpen={isEdit}
          onClose={() => setIsEdit(false)}
          onSubmit={handleUpdate}
        />

        <ViewUser
          isOpen={isView}
          onClose={() => setIsView(false)}
          user={selectedUser}
        />
      </Box>
    </>
  );
};

export default UsersPage;
