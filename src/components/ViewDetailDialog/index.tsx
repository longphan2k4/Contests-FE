import { Dialog, DialogTitle, DialogContent } from "@mui/material";

type FieldConfig<T> = {
  label: string;
  field: keyof T;
};

type Props<T> = {
  open: boolean;
  onClose: () => void;
  record?: T;
  title?: string;
  fields?: FieldConfig<T>[];
};

function ViewDetailDialog<T>({ open, onClose, record, title }: Props<T>) {
  if (!record) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title || "Chi tiết"}</DialogTitle>
      <DialogContent></DialogContent>
    </Dialog>
  );
}

export default ViewDetailDialog;
