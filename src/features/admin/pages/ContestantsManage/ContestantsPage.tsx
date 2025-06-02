import { Typography, Box } from '@mui/material';
import ContestantsManage from '../../components/ContestantsManage/ContestansManage';
const ContestantsPage = () => {
  return (
    <Box p={4}>
      <Typography variant="h5" mb={2}>Danh sách thí sinh</Typography>
      <ContestantsManage />
    </Box>
  );
};

export default ContestantsPage;
