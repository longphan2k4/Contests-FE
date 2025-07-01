import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Forbidden403 = () => {
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
        403
      </Typography>
      <Typography variant="h5" mt={2}>
        Bạn không có quyền truy cập trang này
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 4 }}
        onClick={() => navigate("/trang-chu")}
      >
        Quay về trang chủ
      </Button>
    </Box>
  );
};

export default Forbidden403;
