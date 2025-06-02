import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

export type FieldConfig<T> = {
  label: string;
  field: keyof T;
  type: 'text' | 'email' | 'tel' | 'date' | 'number' | 'password';
};

type Props<T> = {
  open: boolean;
  onClose: () => void;
  fields: FieldConfig<T>[];
  onAdd: (newRecord: T) => void;
  title?: string;
};

function AddPopup<T extends Record<string, any>>({
  open,
  onClose,
  fields,
  onAdd,
  title,
}: Props<T>) {

  const [formData, setFormData] = useState<Partial<T>>({});

 useEffect(() => {
  if (open) {
    const emptyData = {} as Partial<T>;

    const getDefaultValue = (type: FieldConfig<T>['type']): any => {
      switch (type) {
        case 'text':
        case 'email':
        case 'tel':
        case 'password':
          return '';
        case 'date':
          return '';
        case 'number':
          return 0;
        default:
          return '';
      }
    };

    fields.forEach(({ field, type }) => {
      emptyData[field] = getDefaultValue(type);
    });

    setFormData(emptyData);
  }
}, [open, fields]);


  const handleChange = (field: keyof T, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onAdd(formData as T);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title || 'Thêm mới'}</DialogTitle>
      <DialogContent>
        {fields.map(({ label, field, type }) => (
          <TextField
            key={String(field)}
            label={label}
            type={type}
            value={formData[field] ?? ''}
            onChange={(e) => handleChange(field, e.target.value)}
            margin="normal"
            fullWidth
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddPopup;
