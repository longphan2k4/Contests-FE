import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider
} from '@mui/material';
import type { School } from '../types/school';
import InfoItem from '../../about/components/InfoItem';
import {
  BuildingOfficeIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface SchoolDetailPopupProps {
  school: School;
  open: boolean;
  onClose: () => void;
}

const SchoolDetailPopup: React.FC<SchoolDetailPopupProps> = ({
  school,
  open,
  onClose
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: 'primary.main', 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <BuildingOfficeIcon className="w-6 h-6" />
        <Typography variant="h6" component="div">
          Chi tiết trường học
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Thông tin cơ bản */}
          <Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h5" gutterBottom>
                {school.name}
              </Typography>
              <Chip
                label={school.isActive ? "Đang hoạt động" : "Không hoạt động"}
                color={school.isActive ? "success" : "error"}
                icon={school.isActive ? <CheckCircleIcon className="w-4 h-4" /> : <XCircleIcon className="w-4 h-4" />}
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
            <Divider sx={{ my: 2 }} />
          </Box>

          {/* Thông tin liên hệ và bổ sung */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {/* Thông tin liên hệ */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                Thông tin liên hệ
              </Typography>
              <Box sx={{ pl: 2 }}>
                <InfoItem
                  icon={<MapPinIcon className="w-5 h-5" />}
                  label="Địa chỉ"
                  value={school.address}
                />
                <InfoItem
                  icon={<EnvelopeIcon className="w-5 h-5" />}
                  label="Email"
                  value={school.email}
                  isLink
                  linkType="email"
                />
                <InfoItem
                  icon={<PhoneIcon className="w-5 h-5" />}
                  label="Điện thoại"
                  value={school.phone}
                />
              </Box>
            </Box>

            {/* Thông tin bổ sung */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                Thông tin bổ sung
              </Typography>
              <Box sx={{ pl: 2 }}>
                <InfoItem
                  icon={<BuildingOfficeIcon className="w-5 h-5" />}
                  label="Mã trường"
                  value={String(school.id)}
                />
                {/* Có thể thêm các thông tin khác ở đây */}
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          sx={{ borderRadius: 2 }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SchoolDetailPopup; 