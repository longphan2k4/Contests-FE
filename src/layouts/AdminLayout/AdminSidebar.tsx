import React, { useState } from "react";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Group as GroupIcon,
  QuestionMark as QuestionIcon,
  EmojiEvents as TrophyIcon,
  AccountBalance as BankIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle?: () => void; // Optional callback for external toggle control
}

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  path?: string;
  children?: MenuItem[];
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detect mobile screens
  const [mobileOpen, setMobileOpen] = useState(false); // State for mobile drawer

  const handleClick = (key: string) => {
    setOpenSubMenu(openSubMenu === key ? null : key);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
    if (onToggle) {
      onToggle();
    }
  };

  const menuItems: MenuItem[] = [
    {
      key: "dashboard",
      icon: <DashboardIcon />,
      label: "Bảng điều khiển",
      path: "/admin/dashboard",
    },
    {
      key: "schools",
      icon: <BankIcon />,
      label: "Trường học",
      path: "/admin/schools",
    },
    {
      key: "classes",
      icon: <SchoolIcon />,
      label: "Lớp học",
      path: "/admin/classes",
    },
    {
      key: "users",
      icon: <GroupIcon />,
      label: "Quản lý người dùng",
      path: "/admin/users",
    },
    {
      key: "topics",
      icon: <QuestionIcon fontSize="small" />,
      label: "Chủ đề câu hỏi",
      path: "/admin/question-topics",
    },
    {
      key: "questions",
      icon: <QuestionIcon fontSize="small" />,
      label: "Câu hỏi",
      path: "/admin/questions",
    },
    {
      key: "packages",
      icon: <QuestionIcon fontSize="small" />,
      label: "Gói câu hỏi",
      path: "/admin/question-packages",
    },
    {
      key: "contests",
      icon: <TrophyIcon />,
      label: "Cuộc thi",
      path: "/admin/contests",
    },
    {
      key: "students",
      icon: <GroupIcon />,
      label: "Quản lý sinh viên",
      path: "/admin/students",
    },
    // {
    //   key: "about",
    //   icon: <FileIcon />,
    //   label: "Thông tin website",
    //   path: "/admin/about",
    // },
  ];

  const renderMenuItems = (items: MenuItem[]) => {
    return items.map(item => {
      const isSelected = location.pathname === item.path;
      const isSubMenuOpen = openSubMenu === item.key;

      if (item.children) {
        return (
          <React.Fragment key={item.key}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleClick(item.key)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
                {isSubMenuOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={isSubMenuOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.children.map(child => (
                  <ListItem key={child.key} disablePadding>
                    <ListItemButton
                      component={Link}
                      to={child.path || ""}
                      sx={{ pl: 4 }}
                      selected={location.pathname === child.path}
                      onClick={() => isMobile && setMobileOpen(false)}
                    >
                      <ListItemIcon>{child.icon}</ListItemIcon>
                      <ListItemText primary={child.label} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        );
      }

      return (
        <ListItem key={item.key} disablePadding>
          <ListItemButton
            component={Link}
            to={item.path || ""}
            selected={isSelected}
            onClick={() => isMobile && setMobileOpen(false)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      );
    });
  };

  // Set drawerWidth to 240px by default on large screens, collapse to 64px when toggled
  const drawerWidth = isMobile ? (mobileOpen ? 240 : 0) : collapsed ? 64 : 240;

  return (
    <>
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: theme.zIndex.drawer + 1,
          }}
        ></IconButton>
      )}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            whiteSpace: collapsed && !isMobile ? "nowrap" : "normal",
            overflowX: "hidden",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        <Box
          sx={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
        >
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontWeight: "bold",
              display: collapsed && !isMobile ? "none" : "block",
            }}
          >
            Quản lý cuộc thi
          </Typography>
          {collapsed && !isMobile && (
            <Typography variant="h6" fontWeight="bold">
              QCT
            </Typography>
          )}
        </Box>
        <Divider />
        <List>{renderMenuItems(menuItems)}</List>
      </Drawer>
    </>
  );
};

export default AdminSidebar;
