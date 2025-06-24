import React from 'react';
import ConfirmDeleteDialog from '../../../../components/ConfirmDeleteDialog';

interface ConfirmDeleteProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  sponsorName?: string;
}

const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({
  open,
  onClose,
  onConfirm,
  sponsorName
}) => {
  const title = 'Xác nhận xóa nhà tài trợ';
  const content = sponsorName 
    ? `Bạn có chắc chắn muốn xóa nhà tài trợ "${sponsorName}"? Hành động này không thể hoàn tác.`
    : 'Bạn có chắc chắn muốn xóa nhà tài trợ này? Hành động này không thể hoàn tác.';

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

export default ConfirmDelete;
