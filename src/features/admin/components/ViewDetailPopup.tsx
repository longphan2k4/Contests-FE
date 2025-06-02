import { Dialog, DialogTitle, DialogContent } from '@mui/material';

type FieldConfig<T> = {
  label: string;
  field: keyof T;
};

type Props<T> = {
  open: boolean;
  onClose: () => void;
  record?: T;
  title?: string;
  fields: FieldConfig<T>[];
};

function ViewDetailPopup<T>({ open, onClose, record, title, fields }: Props<T>) {
  if (!record) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title || 'Chi tiết'}</DialogTitle>
      <DialogContent>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {fields.map(({ label, field }) => (
              <tr key={String(field)} style={{ borderBottom: '1px solid #ddd' }}>
                <td
                  style={{
                    fontWeight: 'bold',
                    padding: '8px',
                    width: '40%',
                    verticalAlign: 'top',
                  }}
                >
                  {label}
                </td>
                <td style={{ padding: '8px', verticalAlign: 'top' }}>
                  {String(record[field])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DialogContent>
    </Dialog>
  );
}

export default ViewDetailPopup;
