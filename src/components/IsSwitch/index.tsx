// src/components/common/CommonSwitch.tsx
import React from "react";
import { Switch, FormControlLabel } from "@mui/material";

interface CommonSwitchProps {
  label?: string;
  value: boolean;
  onChange: (newValue: boolean) => void;
}

const IsSwitch: React.FC<CommonSwitchProps> = ({ label, value, onChange }) => {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={value}
          onChange={e => onChange(e.target.checked)}
          color="primary"
        />
      }
      label={value === true ? "Đang hoạt động" : "Đã vô hiệu hóa"}
    />
  );
};

export default IsSwitch;
