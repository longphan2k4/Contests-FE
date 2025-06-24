import React from 'react';
import ConfirmDeleteDialog from '../../../../components/ConfirmDeleteDialog';

interface ConfirmDeleteManyProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count: number;
}

const ConfirmDeleteMany: React.FC<ConfirmDeleteManyProps> = ({
  open,
  onClose,
  onConfirm,
  count
}) => {
  const title = 'Xác nhận xóa nhiều nhà tài trợ';
  const content = `Bạn có chắc chắn muốn xóa ${count} nhà tài trợ đã chọn? Hành động này không thể hoàn tác.`;

  return (
    <ConfirmDeleteDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      content={content}
    />
  );
};

export default ConfirmDeleteMany;
