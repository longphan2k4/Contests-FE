import { useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from '@mui/material';

type SelectFilterProps<T> = {
  label: string;
  field: keyof T;
  options: string[];
  data: T[];
  onFilter: (filteredData: T[]) => void;
};

const SelectFilter = <T extends Record<string, any>>({
  label,
  field,
  options,
  data,
  onFilter,
}: SelectFilterProps<T>) => {
  const [selected, setSelected] = useState('');

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setSelected(value);
    const filtered = value
      ? data.filter((item) => item[field] === value)
      : data;
    onFilter(filtered);
  };

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel>{label}</InputLabel>
      <Select value={selected} label={label} onChange={handleChange}>
        <MenuItem value="">Tất cả</MenuItem>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectFilter;
