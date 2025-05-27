import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';
import AdminSidebar from './AdminSidebar';

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const drawerWidth = collapsed ? 0 : 0;

  return (
    <Box sx={{ display: 'flex', minHeight: '120vh' }}>
      <CssBaseline />
      <AdminHeader toggle={toggle} />
      <AdminSidebar collapsed={collapsed} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          display: 'flex',
          flexDirection: 'column',
          transition: (theme) => theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar /> {/* Spacer to prevent content from going under AppBar */}
        <Box sx={{ 
          flex: 1, 
          mb: 2, 
          backgroundColor: 'white', 
          borderRadius: 1,
          boxShadow: 1,
          p: 3
        }}>
          <Outlet />
        </Box>
        <AdminFooter />
      </Box>
    </Box>
  );
};

export default AdminLayout; 