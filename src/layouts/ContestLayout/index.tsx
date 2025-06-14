import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Outlet } from "react-router-dom";
import ContestHeader from "./ContestHeader";
import ContestSidebar from "./ContestSidebar";
import Notification from "../../components/Notification";
import { NotificationProvider } from "../../contexts/NotificationContext";

const ContestLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Drawer width matches ContestSidebar logic: 64px when collapsed, 240px when expanded
  const drawerWidth = isMobile ? 0 : isCollapsed ? 64 : 240;

  return (
    <NotificationProvider>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <CssBaseline />
        <ContestHeader onToggle={handleToggle} />
        <ContestSidebar collapsed={isCollapsed} onToggle={handleToggle} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 }, // Smaller padding on mobile
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            transition: theme.transitions.create(["margin", "width"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          <Toolbar /> {/* Spacer for fixed AppBar */}
          <Box
            sx={{
              flex: 1,
              backgroundColor: "white",
              borderRadius: 1,
              boxShadow: 1,
              p: { xs: 2, sm: 3 }, // Responsive padding
              minHeight: "calc(100vh - 112px)", // Adjust for header and padding
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

export default ContestLayout;
