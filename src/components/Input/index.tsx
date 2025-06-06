import React, { type ChangeEvent } from "react";
import TextField from "@mui/material/TextField";
import type { TextFieldProps } from "@mui/material/TextField";

type InputProps = TextFieldProps & {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string; // lỗi từ zod hoặc từ server
  className?: string;
};

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  errorMessage,
  className,
  ...props
}) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      fullWidth
      value={value}
      onChange={onChange}
      error={!!errorMessage}
      helperText={errorMessage}
      className={className}
      {...props}
    />
  );
};

export default Input;
