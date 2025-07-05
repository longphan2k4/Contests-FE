import React from "react";
import { Switch, FormControlLabel } from "@mui/material";
import { useToggleSchoolActive } from "../hooks/crud/useToggleSchoolActive";
import { useToast } from "@/contexts/toastContext";

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
  onRefresh,
}) => {
  const { toggle, loading } = useToggleSchoolActive();
  const { showToast } = useToast();

  const handleStatusChange = async () => {
    try {
      const updatedSchool = await toggle(schoolId);
      if (updatedSchool) {
        showToast(
          `Trạng thái trường học đã được ${
            updatedSchool.isActive ? "kích hoạt" : "vô hiệu hóa"
          }`,
          "success"
        );
        onStatusChange?.(updatedSchool.isActive);
        onRefresh?.();
      }
    } catch (error) {
      showToast(`Không thể cập nhật trạng thái trường học`, "error");
    }
  };

  return (
    <FormControlLabel
      label={isActive ? "Đang hoạt động" : "Đã vô hiệu hóa"}
      control={
        <Switch
          checked={isActive}
          onChange={handleStatusChange}
          disabled={loading}
          color="primary"
        />
      }
      labelPlacement="start"
      sx={{
        margin: 0,
        "& .MuiFormControlLabel-label": {
          color: isActive ? "success.main" : "error.main",
        },
      }}
    />
  );
};

export default SchoolStatusSwitch;
