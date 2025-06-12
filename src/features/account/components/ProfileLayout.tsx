import React from "react";
import { Box, Container, Paper, Typography, alpha } from "@mui/material";
import { CAO_THANG_COLORS } from "../../../common/theme";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `linear-gradient(135deg, ${CAO_THANG_COLORS.primary} 0%, ${CAO_THANG_COLORS.secondary} 100%)`,
        position: "relative",
        overflow: "hidden",
        py: 4,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: alpha("#fff", 0.05),
          top: "-250px",
          right: "-150px",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: alpha("#fff", 0.05),
          bottom: "-150px",
          left: "-100px",
        }}
      />
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 2 }}>
        <Paper
          elevation={10}
          sx={{
            p: 5,
            borderRadius: "16px",
            backdropFilter: "blur(10px)",
            background: alpha("#fff", 0.9),
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: `linear-gradient(45deg, ${CAO_THANG_COLORS.primary}, ${CAO_THANG_COLORS.light})`,
              backgroundClip: "text",
              textFillColor: "transparent",
              mb: 4,
            }}
          >
            TÀI KHOẢN
          </Typography>
          {children}
        </Paper>
      </Container>
    </Box>
  );
};

export default ProfileLayout;