import React from "react";
import { Box, TextField, InputAdornment, Typography } from "@mui/material";
import { Person } from "@mui/icons-material";
import { CAO_THANG_COLORS } from "../../../common/theme";
import type { User } from "../types/auth.types";

interface AccountInfoProps {
  user: User;
}

const AccountInfo: React.FC<AccountInfoProps> = ({ user }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Thông tin tài khoản
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Tên người dùng"
          value={user.username}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person sx={{ color: CAO_THANG_COLORS.secondary }} />
              </InputAdornment>
            ),
            readOnly: true,
          }}
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Email"
          value={user.email}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person sx={{ color: CAO_THANG_COLORS.secondary }} />
              </InputAdornment>
            ),
            readOnly: true,
          }}
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Vai trò"
          value={user.role}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person sx={{ color: CAO_THANG_COLORS.secondary }} />
              </InputAdornment>
            ),
            readOnly: true,
          }}
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Trạng thái"
          value={user.isActive ? "Hoạt động" : "Không hoạt động"}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person sx={{ color: CAO_THANG_COLORS.secondary }} />
              </InputAdornment>
            ),
            readOnly: true,
          }}
          fullWidth
          variant="outlined"
        />
      </Box>
    </Box>
  );
};

export default AccountInfo;