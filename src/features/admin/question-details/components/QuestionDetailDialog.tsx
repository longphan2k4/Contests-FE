import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch
} from '@mui/material';
import type { QuestionDetail } from '../types';

interface QuestionDetailDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  editingQuestion: QuestionDetail | null;
}

export const QuestionDetailDialog: React.FC<QuestionDetailDialogProps> = ({
  open,
  onClose,
  onSubmit,
  editingQuestion
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={onSubmit}>
        <DialogTitle>
          {editingQuestion ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}
        </DialogTitle>
        <DialogContent>
          {!editingQuestion && (
            <TextField
              autoFocus
              margin="dense"
              name="questionId"
              label="ID câu hỏi"
              type="number"
              fullWidth
              required
              sx={{ mb: 2 }}
            />
          )}
          <TextField
            margin="dense"
            name="questionOrder"
            label="Thứ tự"
            type="number"
            fullWidth
            required
            defaultValue={editingQuestion?.questionOrder}
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Switch
                name="isActive"
                defaultChecked={editingQuestion?.isActive}
              />
            }
            label="Trạng thái"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="contained">Lưu</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 