import React, { useState } from "react";
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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Home,
  Person,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useLogout } from "../../features/auth/hooks/useLogout";
import { useAuth } from "../../features/auth/hooks/authContext";
import { useToast } from "@contexts/toastContext";

interface AdminHeaderProps {
  onToggle: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [schoolInfo] = useState({
    schoolName: "Trường Cao Đẳng Kỹ Thuật Cao Thắng",
    departmentName: "Khoa Công nghệ thông tin",
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { setUser } = useAuth();
  const { showToast } = useToast();
  const { mutate } = useLogout();
  // const navigator = useNavigate();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    mutate(undefined, {
      onSuccess: () => {
        handleMenuClose();
        document.cookie =
          "feAccessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("feAccessToken");
        localStorage.removeItem("accessToken");
        showToast("Đăng xuất thành công", "success");
        setTimeout(() => setUser(null), 500);
      },
      onError: error => {
        console.error("Logout failed:", error);
        showToast("Đăng xuất thất bại", "error");
      },
    });
  };

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={1}
      sx={{ zIndex: theme.zIndex.drawer + 1, backgroundColor: "white" }}
    >
      <Toolbar sx={{ px: isMobile ? 1 : 2, minHeight: isMobile ? 56 : 64 }}>
        <IconButton
          color="inherit"
          aria-label="toggle drawer"
          edge="start"
          onClick={onToggle}
          sx={{ mr: isMobile ? 1 : 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
          <Typography
            variant={isMobile ? "subtitle2" : "subtitle1"}
            sx={{
              fontWeight: "bold",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: isMobile ? "40vw" : "none",
            }}
          >
            {schoolInfo.schoolName}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {schoolInfo.departmentName}
          </Typography>
        </Box>
        <Box>
          <IconButton
            aria-label="user menu"
            aria-controls="user-menu"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            sx={{
              p: isMobile ? 0.5 : 1,
              borderRadius: 1, // nhẹ nhàng thay vì 0 cứng nhắc
              bgcolor: "background.paper",
              boxShadow: 1,
              "&:hover": {
                bgcolor: "grey.100",
              },
            }}
          >
            <Avatar
              sx={{
                width: isMobile ? 32 : 36,
                height: isMobile ? 32 : 36,
                bgcolor: "primary.main",
                color: "white",
                fontSize: 20,
              }}
            >
              <AccountCircle fontSize="inherit" />
            </Avatar>

            {!isMobile && (
              <Typography
                variant="body2"
                sx={{
                  ml: 1,
                  fontWeight: 500,
                  color: "text.primary",
                  bgcolor: "grey.100",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "20px",
                }}
              >
                Admin
              </Typography>
            )}
          </IconButton>

          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: {
                minWidth: isMobile ? 140 : 180,
                borderRadius: 2,
                mt: 1,
                boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
                px: 1,
                py: 0.5,
              },
            }}
          >
            <MenuItem
              component={Link}
              to="/account/profile"
              onClick={handleMenuClose}
              sx={{
                borderRadius: 1,
                px: 2,
                py: 1,
                transition: "0.2s",
                "&:hover": {
                  bgcolor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <Person fontSize="small" sx={{ mr: 1 }} />
              Hồ sơ
            </MenuItem>

            <MenuItem
              component={Link}
              to="/"
              onClick={handleMenuClose}
              sx={{
                borderRadius: 1,
                px: 2,
                py: 1,
                transition: "0.2s",
                "&:hover": {
                  bgcolor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <Home fontSize="small" sx={{ mr: 1 }} />
              Trang chủ
            </MenuItem>

            <Divider sx={{ my: 0.5 }} />

            <MenuItem
              onClick={handleLogout}
              sx={{
                borderRadius: 1,
                px: 2,
                py: 1,
                color: "error.main",
                "&:hover": {
                  bgcolor: "rgba(255, 0, 0, 0.05)",
                },
              }}
            >
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
