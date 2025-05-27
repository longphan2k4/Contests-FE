import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";

const drawerWidth = 240;

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

export default function Sidebar({
  mobileOpen,
  handleDrawerToggle,
}: SidebarProps) {
  const drawer = (
    <div className="bg-white h-full">
      <Toolbar className="bg-blue-600 text-white text-center  ">
        <ListItemText primary="Quản trị hệ thống" />
      </Toolbar>
      <Divider />
      <List>
        {[
          {
            text: "Dashboard",
            icon: <DashboardIcon className="text-blue-600" />,
          },
          { text: "Cài đặt", icon: <SettingsIcon className="text-blue-600" /> },
        ].map(item => (
          <ListItem
            component="button"
            key={item.text}
            className="hover:bg-blue-50"
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <>
      {/* Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </>
  );
}
