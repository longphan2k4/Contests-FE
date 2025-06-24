import { Autocomplete, TextField, createFilterOptions } from "@mui/material";
import { Controller } from "react-hook-form";
import type { Control, FieldError } from "react-hook-form";
import { CAO_THANG_COLORS } from "../../common/theme";

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
  const calculatedDefaultValue = multiple
    ? options.filter(
        opt => Array.isArray(defaultValue) && defaultValue.includes(opt.value)
      )
    : options.find(opt => opt.value === defaultValue) ?? null;

  return (
    <Controller
      name={name}
      control={control}
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
                  ? newValue.map((item: OptionType) => item.value)
                  : [];
                field.onChange(selectedValues);
              } else {
                const single = newValue as OptionType | null;
                field.onChange(single ? single.value : "");
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
              />
            )}
          />
        );
      }}
    />
  );
};

export default FormSelect;
