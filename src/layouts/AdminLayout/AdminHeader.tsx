import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Divider,
} from "@mui/material";
import { Menu as MenuIcon, AccountCircle, Logout } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useLogout } from "../../features/auth/hooks/useLogout";
import { useAuth } from "../../features/auth/hooks/authContext";
import { useNotification } from "../../contexts/NotificationContext";
interface AdminHeaderProps {
  toggle: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ toggle }) => {
  const [schoolInfo] = useState({
    schoolName: "Trường Cao Đẳng Kỹ Thuật Cao Thắng",
    departmentName: "Khoa Công nghệ thông tin",
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { setUser } = useAuth();
  const { showSuccessNotification, showErrorNotification } = useNotification();
  const { mutate } = useLogout();
  const handleLogout = () => {
    mutate(undefined, {
      onSuccess: () => {
        handleClose();
        document.cookie =
          "feAccessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        showSuccessNotification("Đăng xuất thành công", "Thông báo");
        setTimeout(() => {
          setUser(null); // Reset user context sau khi đã show notification
          // Nếu muốn chuyển route, chuyển ở đây
          // navigate("/auth/login");
        }, 500); // 500ms để Notification kịp hiển thị
      },
      onError: error => {
        console.error("Logout failed:", error);
        showErrorNotification("Đăng xuất thất bại", "Thông báo");
      },
    });
  };
  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={1}
      sx={{
        zIndex: theme => theme.zIndex.drawer + 1,
        backgroundColor: "white",
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggle}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ fontWeight: "bold" }}
          >
            {schoolInfo.schoolName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {schoolInfo.departmentName}
          </Typography>
        </Box>

        <Box>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              <AccountCircle />
            </Avatar>
            <Typography variant="body2" sx={{ ml: 1 }}>
              Admin
            </Typography>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              component={Link}
              to="/admin/profile"
              onClick={handleClose}
            >
              <AccountCircle fontSize="small" sx={{ mr: 1 }} />
              Hồ sơ
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <Logout fontSize="small" sx={{ mr: 1 }} />
              Đăng xuất
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;
