import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound404 = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="80vh"
      textAlign="center"
    >
      <Typography variant="h1" color="error" fontWeight={700}>
        404
      </Typography>
      <Typography variant="h5" mt={2}>
        Trang không tồn tại
      </Typography>
      <Button variant="contained" sx={{ mt: 4 }} onClick={() => navigate("/")}>
        Quay về trang chủ
      </Button>
    </Box>
  );
};

export default NotFound404;
