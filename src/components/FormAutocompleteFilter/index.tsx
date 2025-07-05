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
  loading?: boolean;
  disabled?: boolean;
  disableClearable?: boolean;
}

export default function FormAutocompleteFilter({
  label,
  options,
  value,
  onChange,
  sx,
  loading = false,
  disabled = false,
  disableClearable = false,
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
      loading={loading}
      disabled={disabled}
      sx={sx}
      disableClearable={disableClearable}
      ListboxProps={{
        style: {
          maxHeight: 48 * 10 + 8,
        },
      }}
      renderOption={(props, option) => (
        <li {...props} key={`${option.value}-${option.label}`}>
          {option.label}
        </li>
      )}
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
