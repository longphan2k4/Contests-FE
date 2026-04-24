import { Autocomplete, TextField, createFilterOptions } from "@mui/material";
import { Controller } from "react-hook-form";
import type { Control, FieldError, FieldValues } from "react-hook-form";
import { CAO_THANG_COLORS } from "../../common/theme";

export interface OptionType {
  label: string;
  value: string | number;
}

interface FormSelectProps<T extends FieldValues = any> {
  id: string;
  name: string;
  label: string;
  control: Control<T>;
  options: OptionType[];
  error?: FieldError;
  defaultValue?: string | number | (string | number)[];
  disabled?: boolean;
  placeholder?: string;
  multiple?: boolean;
}

const filter = createFilterOptions<OptionType>({ limit: 10 });

const FormSelect = <T extends FieldValues = any>({
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
}: FormSelectProps<T>) => {
  // Tính toán giá trị mặc định từ value
  const calculatedDefaultValue = multiple
    ? options.filter(
        opt => Array.isArray(defaultValue) && defaultValue.includes(opt.value)
      )
    : options.find(opt => opt.value === defaultValue) ?? null;

  return (
    <Controller
      name={name}
      control={control as Control<FieldValues>}
      defaultValue={calculatedDefaultValue}
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
                const single = newValue as OptionType | null;
                field.onChange(single ? single.value : undefined);
              }
            }}
            filterOptions={(opts, state) => filter(opts, state)}
            renderOption={(props, option) => (
              <li {...props} key={`${option.value}-${option.label}`}>
                {option.label}
              </li>
            )}
            renderInput={params => (
              <TextField
                {...params}
                label={label}
                placeholder={placeholder}
                error={!!error}
                helperText={error?.message}
                InputLabelProps={{ shrink: true }}
                sx={{
                  my: 2,
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
              />
            )}
          />
        );
      }}
    />
  );
};

export default FormSelect;
