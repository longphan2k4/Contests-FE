import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  label: string;
}

const FilterSelect = ({ value, onChange, options, label }: Props) => {
  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        onChange={e => onChange(e.target.value)}
      >
        <MenuItem value="">Tất cả</MenuItem>
        {options.map(option => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FilterSelect;
