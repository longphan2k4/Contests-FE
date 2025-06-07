import React from 'react';
import { Switch, FormControlLabel } from '@mui/material';
import { useToggleSchoolActive } from '../hooks/crud/useToggleSchoolActive';
import { useNotification } from '../../../../contexts/NotificationContext';

interface SchoolStatusSwitchProps {
  schoolId: number;
  isActive: boolean;
  onStatusChange?: (newStatus: boolean) => void;
  onRefresh?: () => void;
}

const SchoolStatusSwitch: React.FC<SchoolStatusSwitchProps> = ({
  schoolId,
  isActive,
  onStatusChange,
  onRefresh
}) => {
  const { toggle, loading } = useToggleSchoolActive();
  const { showSuccessNotification, showErrorNotification } = useNotification();

  const handleStatusChange = async () => {
    try {
      const updatedSchool = await toggle(schoolId);
      if (updatedSchool) {
        showSuccessNotification(
          `Trạng thái trường học đã được ${updatedSchool.isActive ? 'kích hoạt' : 'vô hiệu hóa'}`,
          'Cập nhật thành công'
        );
        onStatusChange?.(updatedSchool.isActive);
        onRefresh?.();
      }
    } catch (error) {
      console.log(error);
      showErrorNotification(
        'Không thể cập nhật trạng thái trường học',
        'Lỗi cập nhật',
      );
    }
  };

  return (
    <FormControlLabel
      label={isActive ? 'Đang hoạt động' : 'Đã vô hiệu hóa'}
      control={
        <Switch
          checked={isActive}
          onChange={handleStatusChange}
          disabled={loading}
          color="primary"
        />
      }
      labelPlacement="start"
      sx={{ margin: 0 }}
    />
  );
};

export default SchoolStatusSwitch; 