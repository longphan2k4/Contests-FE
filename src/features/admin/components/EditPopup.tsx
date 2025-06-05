import { useState, useEffect, type ChangeEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import Button from './Button'; 
export type FieldConfig<T> = {
  label: string;
  field: keyof T;
  type: string;
};

type EditPopupProps<T> = {
  open: boolean;
  onClose: () => void;
  record?: T;
  onSave: (updatedRecord: T) => void;
  fields: FieldConfig<T>[];
};

const EditPopup = <T extends Record<string, any>>({
  open,
  onClose,
  record,
  onSave,
  fields,
}: EditPopupProps<T>) => {
  // Local state lưu trữ bản sao dữ liệu để edit
  const [formData, setFormData] = useState<T | undefined>(record);

  // Khi mở popup hoặc record thay đổi thì reset lại formData
  useEffect(() => {
    setFormData(record);
  }, [record, open]);

  // Xử lý thay đổi input
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof T
  ) => {
    const value = e.target.value;
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  // Lưu dữ liệu và đóng popup
  const handleSave = () => {
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chỉnh sửa</DialogTitle>
      <DialogContent>
        {fields.map(({ label, field, type }) => (
          <TextField
            key={String(field)}
            label={label}
            type={type}
            fullWidth
            margin="normal"
            value={formData?.[field] ?? ''}
            onChange={(e) => handleChange(e, field)}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSave}>Lưu</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPopup;
