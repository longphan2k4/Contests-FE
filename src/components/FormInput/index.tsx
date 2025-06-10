import { TextField, InputAdornment } from "@mui/material";
import { CAO_THANG_COLORS } from "../../common/theme";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface FormInputProps {
  label: string;
  id: string;
  placeholder?: string;
  register?: UseFormRegisterReturn;
  error?: FieldError;
  icon?: React.ReactNode;
  type?: string;
  value?: string | number | Date;
}

const FormInput = ({
  label,
  id,
  placeholder,
  register,
  error,
  icon,
  value,
  type = "text",
}: FormInputProps) => {
  return (
    <TextField
      margin="normal"
      fullWidth
      type={type}
      id={id}
      label={label}
      placeholder={placeholder}
      autoComplete="email"
      autoFocus
      {...register}
      error={!!error}
      value={value}
      helperText={error?.message}
      variant="outlined"
      sx={{
        mb: 3,
        "& .MuiOutlinedInput-root": {
          borderRadius: "10px",
          transition: "0.3s",
          "&:hover fieldset": {
            borderColor: CAO_THANG_COLORS.accent,
          },
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: CAO_THANG_COLORS.secondary,
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
          {
            borderColor: CAO_THANG_COLORS.secondary,
          },
      }}
      InputProps={{
        startAdornment: icon ? (
          <InputAdornment position="start">{icon}</InputAdornment>
        ) : undefined,
      }}
    />
  );
};

export default FormInput;
