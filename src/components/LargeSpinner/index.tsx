import React from "react";
import { CircularProgress, Box } from "@mui/material";

const LargeSpinner: React.FC<{ size?: number }> = ({ size = 80 }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "40vh",
      }}
    >
      <CircularProgress size={size} />
    </Box>
  );
};

export default LargeSpinner;
