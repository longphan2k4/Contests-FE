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
import { Menu as MenuIcon, AccountCircle, Logout } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useLogout } from "../../features/auth/hooks/useLogout";
import { useAuth } from "../../features/auth/hooks/authContext";
import { useNotification } from "../../contexts/NotificationContext";

interface ContestHeaderProps {
  onToggle: () => void;
}

const ContestHeader: React.FC<ContestHeaderProps> = ({ onToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [schoolInfo] = useState({
    schoolName: "Trường Cao Đẳng Kỹ Thuật Cao Thắng",
    departmentName: "Khoa Công nghệ thông tin",
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { setUser } = useAuth();
  const { showSuccessNotification, showErrorNotification } = useNotification();
  const { mutate } = useLogout();

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
        showSuccessNotification("Đăng xuất thành công", "Thông báo");
        setTimeout(() => setUser(null), 500);
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
            sx={{ p: isMobile ? 0.5 : 1 }}
          >
            <Avatar
              sx={{ width: isMobile ? 28 : 32, height: isMobile ? 28 : 32 }}
            >
              <AccountCircle />
            </Avatar>
            {!isMobile && (
              <Typography variant="body2" sx={{ ml: 1 }}>
                Contest
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
            PaperProps={{ sx: { minWidth: isMobile ? 120 : 160 } }}
          >
            <MenuItem
              component={Link}
              to="/Contest/profile"
              onClick={handleMenuClose}
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

export default ContestHeader;
