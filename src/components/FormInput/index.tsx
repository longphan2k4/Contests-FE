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
}: FormInputProps) => {  return (
    <TextField
      margin="none" // ❌ bỏ margin mặc định
      fullWidth
      type={type}
      id={id}
      label={label}
      placeholder={placeholder}
      autoComplete="off"
      autoFocus
      {...register}
      error={!!error}
      {...(value !== undefined && { value })}
      {...(error?.message && { helperText: error.message })}
      variant="outlined"
      InputLabelProps={{ shrink: true }}
      sx={{
        my: "16px",
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
