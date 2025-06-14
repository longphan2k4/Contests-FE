// components/FormAutocompleteFilter.tsx
import React from "react";
import { Autocomplete, TextField } from "@mui/material";

export interface OptionType {
  label: string;
  value: string | number;
}

interface FormAutocompleteFilterProps {
  label: string;
  options: OptionType[];
  value?: string | number;
  onChange: (value: string | number | undefined) => void;
  sx?: object; // Cho phép truyền style từ bên ngoài (ví dụ: flex, width)
}

export default function FormAutocompleteFilter({
  label,
  options,
  value,
  onChange,
  sx,
}: FormAutocompleteFilterProps) {
  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <Autocomplete
      size="small"
      fullWidth
      options={options}
      getOptionLabel={option => option.label}
      value={selectedOption}
      disableClearable
      onChange={(_, newValue) =>
        onChange(newValue?.value === "all" ? undefined : newValue?.value)
      }
      sx={sx} // Apply custom styles from parent
      renderInput={params => (
        <TextField
          {...params}
          fullWidth
          label={label}
          placeholder={`Chọn ${label.toLowerCase()}`}
        />
      )}
    />
  );
}
