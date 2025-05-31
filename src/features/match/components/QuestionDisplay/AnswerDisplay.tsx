// components/QuestionDisplay/AnswerDisplay.tsx
import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import type { AnswerDisplayProps } from '../../types/question.types';

const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ answer, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="p-6 bg-blue-100 rounded-lg border border-blue-200 mt-4 transition-all duration-300">
      <div className="flex items-center mb-2">
        <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
        <h3 className="font-semibold text-green-800 text-lg">Đáp án</h3>
      </div>
      <p className="text-lg font-medium">{answer}</p>
    </div>
  );
};

export default AnswerDisplay;