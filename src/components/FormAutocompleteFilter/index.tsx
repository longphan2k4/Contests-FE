import { Autocomplete, TextField } from "@mui/material";
import { useMemo } from "react";

export interface OptionType {
  label: string;
  value: string | number;
}

interface FormAutocompleteFilterProps {
  label: string;
  options: OptionType[];
  value?: string | number;
  onChange: (value: string | number | undefined) => void;
  sx?: object;
}

export default function FormAutocompleteFilter({
  label,
  options,
  value,
  onChange,
  sx,
}: FormAutocompleteFilterProps) {
  const selectedOption = useMemo(() => {
    return options.find(opt => opt.value === value) ?? null;
  }, [options, value]);

  return (
    <Autocomplete
      size="small"
      options={options}
      getOptionLabel={option => option.label}
      value={selectedOption}
      isOptionEqualToValue={(option, val) => option.value === val?.value}
      onChange={(_, newValue) =>
        onChange(newValue?.value === "all" ? undefined : newValue?.value)
      }
      sx={sx}
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
