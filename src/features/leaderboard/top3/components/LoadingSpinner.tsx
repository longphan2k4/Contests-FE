import React from 'react';
import { TrophyIcon } from '@heroicons/react/24/solid';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="relative animate-bounce">
        <TrophyIcon className="h-16 w-16 text-yellow-500" />
        <div className="absolute bottom-0 left-0 w-full h-2 bg-yellow-300 animate-pulse rounded-full"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;