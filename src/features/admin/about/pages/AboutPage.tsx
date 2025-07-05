// import {
//   Box,
//   Typography,
//   Paper,
//   Card,
//   CircularProgress,
//   Alert,
// } from "@mui/material";
// import { useAbout } from "../hooks/useAbout";

// const AboutPage = () => {
//   const { about, loading, error, updating, updateAboutInfo } = useAbout();

//   if (loading) {
//     return (
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         minHeight="80vh"
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box p={3}>
//         <Alert severity="error">{error}</Alert>
//       </Box>
//     );
//   }

//   return (
//     <Box p={3}>
//       <Card>
//         <Box p={3}>
//           <Typography variant="h4" gutterBottom>
//             Thông tin giới thiệu
//           </Typography>
//           <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
//             Quản lý thông tin giới thiệu về đơn vị tổ chức hiển thị trên trang
//             web
//           </Typography>

//           {about ? (
//             <>
//               {/* <AboutForm
//                 initialData={about}
//                 isSubmitting={updating}
//                 onSubmit={updateAboutInfo}
//               /> */}
//             </>
//           ) : (
//             <Paper sx={{ p: 3, textAlign: "center" }}>
//               <Typography>Không tìm thấy dữ liệu</Typography>
//             </Paper>
//           )}
//         </Box>
//       </Card>
//     </Box>
//   );
// };
//           ) : (
//             <Paper sx={{ p: 3, textAlign: "center" }}>
//               <Typography>Không tìm thấy dữ liệu</Typography>
//             </Paper>
//           )}
//         </Box>
//       </Card>
//     </Box>
//   );
// };

// export default AboutPage;
