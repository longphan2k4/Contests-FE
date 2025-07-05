// import React from 'react';
// import {
//   Box,
//   TextField,
//   FormControlLabel,
//   Switch,
//   Stack,
//   Alert,
//   AlertTitle,
//   Typography,
//   Divider,
//   Snackbar
// } from '@mui/material';
// import type { About, AboutData } from '../types/about';
// import SaveIcon from '@mui/icons-material/Save';
// import { LoadingButton } from '@mui/lab';
// import FileUpload from '../../components/FileUpload';
// import { useAboutForm } from '../hooks/useAboutForm';

// interface AboutFormProps {
//   initialData: About;
//   onSubmit: (data: Partial<AboutData>, logoFile?: File | null, bannerFile?: File | null) => Promise<void>;
//   isSubmitting: boolean;
// }

// /**
//  * Component form chỉnh sửa thông tin giới thiệu
//  */
// const AboutForm: React.FC<AboutFormProps> = ({ initialData, onSubmit, isSubmitting }) => {
//   const {
//     formData,
//     errors,
//     uploadError,
//     setUploadError,
//     handleChange,
//     handleLogoSelected,
//     handleBannerSelected,
//     handleSubmit
//   } = useAboutForm({ initialData, onSubmit });

//   return (
//     <Box component="form" onSubmit={handleSubmit} noValidate>
//       <Stack spacing={3}>
//         <Typography variant="h6">Thông tin cơ bản</Typography>
//         <Stack direction="row" spacing={2}>
//           <TextField
//             fullWidth
//             label="Tên đơn vị"
//             name="schoolName"
//             value={formData.schoolName || ''}
//             onChange={handleChange}
//             error={!!errors.schoolName}
//             helperText={errors.schoolName}
//             required
//           />
//           <TextField
//             fullWidth
//             label="Tên phòng ban"
//             name="departmentName"
//             value={formData.departmentName || ''}
//             onChange={handleChange}
//             error={!!errors.departmentName}
//             helperText={errors.departmentName}
//             required
//           />
//         </Stack>

//         <Stack direction="row" spacing={2}>
//           <TextField
//             fullWidth
//             label="Email"
//             name="email"
//             value={formData.email || ''}
//             onChange={handleChange}
//             error={!!errors.email}
//             helperText={errors.email}
//           />
//           <TextField
//             fullWidth
//             label="Website"
//             name="website"
//             value={formData.website || ''}
//             onChange={handleChange}
//             error={!!errors.website}
//             helperText={errors.website}
//           />
//         </Stack>

//         <TextField
//           fullWidth
//           label="Fanpage"
//           name="fanpage"
//           value={formData.fanpage || ''}
//           onChange={handleChange}
//           error={!!errors.fanpage}
//           helperText={errors.fanpage}
//         />

//         <Divider />
//         <Typography variant="h6">Logo</Typography>
//         <FileUpload
//           currentFile={formData.logo || null}
//           onFileSelected={handleLogoSelected}
//           acceptTypes="image/png, image/jpeg"
//           label="Tải lên logo"
//           maxSize={2}
//           previewWidth={300}
//         />

//         {errors.logo && (
//           <Alert severity="error">{errors.logo}</Alert>
//         )}

//         <Typography variant="h6">Banner</Typography>
//         <FileUpload
//           currentFile={formData.banner || null}
//           onFileSelected={handleBannerSelected}
//           acceptTypes="image/png, image/jpeg"
//           label="Tải lên banner"
//           maxSize={5}
//           previewWidth={300}
//         />

//         {errors.banner && (
//           <Alert severity="error">{errors.banner}</Alert>
//         )}

//         <Typography variant="h6">Bản đồ</Typography>
//         <TextField
//           fullWidth
//           label="Mã nhúng Google Maps"
//           name="mapEmbedCode"
//           value={formData.mapEmbedCode || ''}
//           onChange={handleChange}
//           multiline
//           rows={4}
//           placeholder="<iframe src='https://www.google.com/maps/embed?...'></iframe>"
//         />

//         {formData.mapEmbedCode && (
//           <Box>
//             <Typography variant="subtitle2" gutterBottom>Xem trước:</Typography>
//             <Box sx={{ border: '1px solid #ddd', p: 1, borderRadius: 1, minHeight: 300 }}>
//               <div dangerouslySetInnerHTML={{ __html: formData.mapEmbedCode || '' }} />
//             </Box>
//           </Box>
//         )}

//         <Divider />

//         <Stack direction="row" justifyContent="space-between" alignItems="center">
//           <FormControlLabel
//             control={
//               <Switch
//                 checked={formData.isActive || false}
//                 onChange={handleChange}
//                 name="isActive"
//                 color="primary"
//               />
//             }
//             label="Hiển thị trên trang web"
//           />

//           <LoadingButton
//             type="submit"
//             variant="contained"
//             loading={isSubmitting}
//             loadingPosition="start"
//             startIcon={<SaveIcon />}
//           >
//             Lưu thay đổi
//           </LoadingButton>
//         </Stack>
//       </Stack>

//       {uploadError && (
//         <Snackbar
//           open={!!uploadError}
//           autoHideDuration={6000}
//           onClose={() => setUploadError(null)}
//           anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//         >
//           <Alert onClose={() => setUploadError(null)} severity="error">
//             <AlertTitle>Lỗi tải lên</AlertTitle>
//             {uploadError}
//           </Alert>
//         </Snackbar>
//       )}
//     </Box>
//   );
// };

// export default AboutForm;
