import { TextField } from "@mui/material";

interface Props {
  searchTerm: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const SearchInput = ({ searchTerm, onChange, placeholder }: Props) => {
  return (
    <TextField
      fullWidth
      label={placeholder || "Tìm kiếm"}
      variant="outlined"
      value={searchTerm}
      onChange={onChange}
      sx={{ mb: 2 }}
    />
  );
};

export default SearchInput;
