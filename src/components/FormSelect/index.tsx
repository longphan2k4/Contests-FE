import { Autocomplete, TextField, createFilterOptions } from "@mui/material";
import { Controller } from "react-hook-form";
import type { Control, FieldError } from "react-hook-form";

export interface OptionType {
  label: string;
  value: string | number;
}

interface FormSelectProps {
  id: string;
  name: string;
  label: string;
  control: Control<any>;
  options: OptionType[];
  error?: FieldError;
  defaultValue?: string | number | (string | number)[];
  disabled?: boolean;
  placeholder?: string;
  multiple?: boolean;
}

const filter = createFilterOptions<OptionType>({ limit: 10 });

const FormSelect = ({
  id,
  name,
  label,
  control,
  options,
  error,
  defaultValue,
  disabled = false,
  placeholder,
  multiple = false,
}: FormSelectProps) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={
        multiple
          ? options.filter(
              opt =>
                Array.isArray(defaultValue) && defaultValue.includes(opt.value)
            )
          : options.find(opt => opt.value === defaultValue) ?? null
      }
      render={({ field }) => {
        const currentValue = field.value;

        return (
          <Autocomplete
            id={id}
            multiple={multiple}
            options={options}
            fullWidth
            disabled={disabled}
            getOptionLabel={option =>
              typeof option === "string" ? option : option.label
            }
            isOptionEqualToValue={(option, value) =>
              option?.value === value?.value
            }
            value={
              multiple
                ? options.filter(opt =>
                    Array.isArray(currentValue)
                      ? currentValue.includes(opt.value)
                      : false
                  )
                : options.find(opt => opt.value === currentValue) ?? null
            }
            onChange={(_, newValue) => {
              if (multiple) {
                const selectedValues = Array.isArray(newValue)
                  ? newValue.map(item => item.value)
                  : [];
                field.onChange(selectedValues);
              } else {
                field.onChange(
                  newValue && !Array.isArray(newValue) ? newValue.value : ""
                );
              }
            }}
            filterOptions={(opts, state) => filter(opts, state)}
            renderInput={params => (
              <TextField
                {...params}
                label={label}
                placeholder={placeholder}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        );
      }}
    />
  );
};

export default FormSelect;
