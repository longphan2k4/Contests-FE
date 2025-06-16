import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Outlet } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import Notification from "../../components/Notification";
import { NotificationProvider } from "../../contexts/NotificationContext";

const AdminLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Start expanded on large screens
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  // Sync drawerWidth with mobileOpen and isCollapsed, default to 240px on large screens
  const drawerWidth = isMobile
    ? mobileOpen
      ? 240
      : 0
    : isCollapsed
    ? 64
    : 240;

  return (
    <NotificationProvider>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <CssBaseline />
        <AdminHeader onToggle={handleToggle} />
        <AdminSidebar collapsed={isCollapsed} onToggle={handleToggle} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            width: { sm: `calc(100% - ${drawerWidth}px)` },

            transition: theme.transitions.create(["margin", "width"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          <Toolbar />
          <Box
            sx={{
              flex: 1,
              backgroundColor: "white",
              borderRadius: 1,
              boxShadow: 1,
              p: { xs: 2, sm: 3 },
              minHeight: "calc(100vh - 112px)",
            }}
          >
            <Outlet />
          </Box>
        </Box>
        <Notification />
      </Box>
    </NotificationProvider>
  );
};

export default AdminLayout;
