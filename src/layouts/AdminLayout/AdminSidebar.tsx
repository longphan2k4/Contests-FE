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
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Group as GroupIcon,
  QuestionMark as QuestionIcon,
  EmojiEvents as TrophyIcon,
  BarChart as BarChartIcon,
  Description as FileIcon,
  Settings as SettingsIcon,
  AccountBalance as BankIcon,
  Videocam as VideoIcon,
  MenuBook as BookIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

interface AdminSidebarProps {
  collapsed: boolean;
}

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  path?: string;
  children?: MenuItem[];
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  const handleClick = (key: string) => {
    setOpenSubMenu(openSubMenu === key ? null : key);
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
    // Ky long: quản lý người dùng
    {
      key: 'users',
      icon: <GroupIcon />,
      label: "Quản lý người dùng",
      path: "/admin/users",
    },
    {
      key: "question-management",
      icon: <QuestionIcon />,
      label: "Quản lý câu hỏi",
      children: [
        {
          key: "topics",
          icon: <QuestionIcon fontSize="small" />,
          label: "Chủ đề",
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
        // giả lập chi tiết câu hỏi
        {
          key: "question-packages",
          icon: <QuestionIcon fontSize="small" />,
          label: "Chi tiết câu hỏi",
          path: "/admin/question-packages/1",
        },
      ],
    },
    {
      key: "contests",
      icon: <TrophyIcon />,
      label: "Cuộc thi",
      path: "/admin/contests",
    },
    {
      key: 'contestants',
      icon: <GroupIcon />,
      label: 'Thí sinh',
      path: '/admin/contestants',
    },
    {
      key: 'students',
      icon: <GroupIcon />,
      label: 'Quản lý sinh viên',
      path: '/admin/students',
    },
    {
      key: "results",
      icon: <BarChartIcon />,
      label: "Kết quả",
      path: "/admin/results",
    },
    {
      key: "rescues",
      icon: <BarChartIcon />,
      label: "Cứu trợ",
      path: "/admin/rescues",
    },
    {
      key: "awards",
      icon: <TrophyIcon />,
      label: "Giải thưởng",
      path: "/admin/awards",
    },
    {
      key: "sponsors",
      icon: <BookIcon />,
      label: "Nhà tài trợ",
      path: "/admin/sponsors",
    },
    {
      key: "videos",
      icon: <VideoIcon />,
      label: "Videos",
      path: "/admin/class-videos",
    },
    {
      key: "about",
      icon: <FileIcon />,
      label: "Thông tin website",
      path: "/admin/about",
    },
    {
      key: "settings",
      icon: <SettingsIcon />,
      label: "Cài đặt",
      path: "/admin/settings",
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
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      );
    });
  };

  const drawerWidth = collapsed ? 64 : 240;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          whiteSpace: collapsed ? "nowrap" : "normal",
          overflowX: "hidden",
          transition: theme =>
            theme.transitions.create("width", {
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
            display: collapsed ? "none" : "block",
          }}
        >
          Quản lý cuộc thi
        </Typography>
        {collapsed && (
          <Typography variant="h6" fontWeight="bold">
            QCT
          </Typography>
        )}
      </Box>
      <Divider />
      <List>{renderMenuItems(menuItems)}</List>
    </Drawer>
  );
};

export default AdminSidebar;
