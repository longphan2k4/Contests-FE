import React, { useState } from "react";
import { useParams } from "react-router-dom";
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
  Description as FileIcon,
  AccountBalance as BankIcon,
  ExpandLess,
  ExpandMore,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

interface ContestSidebarProps {
  collapsed: boolean;
  onToggle?: () => void; // Optional callback for external toggle control
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  path?: string;
  children?: MenuItem[];
}

const ContestSidebar: React.FC<ContestSidebarProps> = ({
  collapsed,
  onToggle,
  mobileOpen = false,
  setMobileOpen,
}) => {
  const location = useLocation();
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detect mobile screens

  const handleClick = (key: string) => {
    setOpenSubMenu(openSubMenu === key ? null : key);
  };

  const { slug, match } = useParams();
  const handleDrawerToggle = () => {
    if (setMobileOpen) {
      setMobileOpen(!mobileOpen);
    }
    if (onToggle) {
      onToggle();
    }
  };

  const menuItems: MenuItem[] = [
    {
      key: "dashboard",
      icon: <DashboardIcon />,
      label: "Bảng điều khiển",
      path: `/admin/cuoc-thi/${slug}/dashboard`,
    },
    {
      key: "controls",
      icon: <DashboardIcon />,
      label: "Điều khiển",
      path: `/admin/cuoc-thi/${slug}/dieu-kien-tran-dau/${match}`,
    },
    {
      key: "round",
      icon: <SchoolIcon />,
      label: "Vòng đấu",
      path: `/admin/cuoc-thi/${slug}/vong-dau`,
    },
    {
      key: "match",
      icon: <BankIcon />,
      label: "Trận đấu",
      path: `/admin/cuoc-thi/${slug}/tran-dau`,
    },

    {
      key: "group",
      icon: <GroupIcon />,
      label: "Nhóm",
      path: `/admin/cuoc-thi/${slug}/nhom`,
    },
    {
      key: "class-videos",
      icon: <QuestionIcon fontSize="small" />,
      label: "Video lớp",
      path: `/admin/cuoc-thi/${slug}/class-videos`,
    },
    {
      key: "sponsors",
      icon: <QuestionIcon fontSize="small" />,
      label: "Nhà tài trợ",
      path: `/admin/cuoc-thi/${slug}/sponsors`,
    },

    {
      key: "results",
      icon: <QuestionIcon fontSize="small" />,
      label: "Kết quả ",
      path: `/admin/cuoc-thi/${slug}/results`,
    },
    {
      key: "rescues",
      icon: <TrophyIcon />,
      label: "Cứu trợ ",
      path: `/admin/cuoc-thi/${slug}/cuu-tro`,
    },
    {
      key: "contestant",
      icon: <SchoolIcon />,
      label: "Thí sinh",
      path: `/admin/cuoc-thi/${slug}/thi-sinh`,
    },
    {
      key: "1",
      icon: <FileIcon />,
      label: "Thông tin cuộc thi",
      path: "/Contest/about",
    },
    {
      key: "2",
      icon: <FileIcon />,
      label: "Thí sinh và trận đấu",
      path: "/Contest/about",
    },
    {
      key: "3",
      icon: <FileIcon />,
      label: "Media",
      path: "/Contest/about",
    },
    {
      key: "awards",
      icon: <FileIcon />,
      label: "Giải thưởng",
      path: `/admin/cuoc-thi/${slug}/awards`,
    },
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
                      onClick={() =>
                        isMobile && setMobileOpen && setMobileOpen(false)
                      }
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
            onClick={() => isMobile && setMobileOpen && setMobileOpen(false)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      );
    });
  };

  // Adjust drawerWidth based on mobile and open state
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
        >
          <MenuIcon />
        </IconButton>
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

export default ContestSidebar;
