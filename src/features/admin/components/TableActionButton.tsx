import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

interface TableActionButtonProps {
  onView: () => void;
  onEdit: () => void;
}

const TableActionButton: React.FC<TableActionButtonProps> = ({ onView, onEdit }) => {
  return (
    <>
      <Tooltip title="Xem chi tiết">
        <IconButton color="primary" onClick={onView}>
          <VisibilityIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Chỉnh sửa">
        <IconButton color="secondary" onClick={onEdit}>
          <EditIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default TableActionButton;
