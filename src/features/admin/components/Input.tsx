import React, { type ChangeEvent } from 'react';
import TextField from '@mui/material/TextField';
import type { TextFieldProps } from '@mui/material/TextField';

type InputProps = TextFieldProps & {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};


const Input: React.FC<InputProps> = ({ label, value, onChange, ...props }) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      fullWidth
      value={value}
      onChange={onChange}
      {...props}
    />
  );
};

export default Input;
