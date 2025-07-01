// src/components/common/CommonSwitch.tsx
import React from "react";
import { Switch, FormControlLabel } from "@mui/material";

interface CommonSwitchProps {
  label?: string;
  value: boolean;
  onChange: (newValue: boolean) => void;
}

const FormSwitch: React.FC<CommonSwitchProps> = ({ value, onChange }) => {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={value}
          onChange={e => onChange(e.target.checked)}
          color="primary"
        />
      }
      label={value === true ? "Hoạt động" : "Không hoạt động"}
    />
  );
};

export default FormSwitch;
