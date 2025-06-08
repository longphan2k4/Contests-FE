import { Switch, FormControlLabel, Typography } from "@mui/material";
import { Controller, type Control } from "react-hook-form";

interface FormSwitchProps {
  name: string;
  control: Control<any>;
  label?: string;
  labelPlacement?: "start" | "end" | "top" | "bottom";
  disabled?: boolean;
  showLabel?: boolean;
}

const FormSwitch: React.FC<FormSwitchProps> = ({
  name,
  control,
  label,
  labelPlacement = "end",
  disabled = false,
  showLabel = true,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) =>
        showLabel && label ? (
          <FormControlLabel
            control={
              <Switch
                checked={value}
                onChange={onChange}
                disabled={disabled}
                color="primary"
              />
            }
            label={label}
            labelPlacement={labelPlacement}
            sx={{ margin: 0 }}
          />
        ) : (
          <Switch
            checked={value}
            onChange={onChange}
            disabled={disabled}
            color="primary"
          />
        )
      }
    />
  );
};

export default FormSwitch;
