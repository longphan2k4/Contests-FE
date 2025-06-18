import React from 'react';
import { UserMinusIcon, UserPlusIcon } from '@heroicons/react/24/solid';

interface ActionButtonsProps {
  canDelete: boolean;
  canRestore: boolean;
  handleSnap: (action: 'delete' | 'restore') => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ canDelete, canRestore, handleSnap }) => {
  return (
    <div className="gap-4 mt-6 justify-center flex">
      <button
        className={`p-3 rounded-lg w-14 h-14 flex items-center justify-center transition-all ${
          canDelete ? 'bg-red-600 hover:bg-red-700 cursor-pointer' : 'bg-red-800 opacity-50 cursor-not-allowed'
        }`}
        onClick={() => canDelete && handleSnap('delete')}
        disabled={!canDelete}
      >
        <UserMinusIcon className="w-7 h-7 text-white" />
      </button>
      <button
        className={`p-3 rounded-lg w-14 h-14 flex items-center justify-center transition-all ${
          canRestore ? 'bg-green-600 hover:bg-green-700 cursor-pointer' : 'bg-green-800 opacity-50 cursor-not-allowed'
        }`}
        onClick={() => canRestore && handleSnap('restore')}
        disabled={!canRestore}
      >
        <UserPlusIcon className="w-7 h-7 text-white" />
      </button>
    </div>
  );
};

export default ActionButtons;