import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface FormSelectProps {
  label: string;
  id: string;
  options: { label: string; value: string | number }[];
  register?: UseFormRegisterReturn;
  error?: FieldError;
  defaultValue?: string;
}

const FormSelect = ({
  label,
  id,
  options,
  register,
  error,
  defaultValue,
}: FormSelectProps) => {
  return (
    <FormControl fullWidth margin="normal" error={!!error}>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <Select
        labelId={`${id}-label`}
        id={id}
        label={label}
        defaultValue={defaultValue}
        {...register}
      >
        {options.map(opt => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  );
};

export default FormSelect;
