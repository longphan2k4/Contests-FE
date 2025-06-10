import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface Option {
  label: string;
  value: string;
}

interface Props {
  value: string | boolean;
  onChange: (value: string) => void;
  options: Option[];
  label: string;
}

const FilterSelect = ({ value, onChange, options, label }: Props) => {
  const labelId = `${label}-label`;

  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        value={value}
        label={label}
        onChange={e => onChange(e.target.value as string)}
      >
        <MenuItem value="">Tất cả</MenuItem>
        {options.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FilterSelect;
