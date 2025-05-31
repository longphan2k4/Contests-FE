// components/QuestionDisplay/DemoControls.tsx
import React from 'react';
import type { DemoControlsProps, QuestionData } from '../../types/question.types';

const DemoControls: React.FC<DemoControlsProps> = ({
  contentVisible,
  answerVisible,
  onToggleQuestion,
  onToggleAnswer,
  onSwitchQuestionType
}) => {
  const questionTypes: QuestionData['type'][] = ['Trắc Nghiệm', 'Hình Ảnh', 'Video', 'Âm Thanh'];

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
      <h3 className="font-semibold mb-3">Demo Controls:</h3>
      
      {/* Toggle Controls */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button 
          onClick={onToggleQuestion}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {contentVisible ? 'Ẩn' : 'Hiện'} Câu Hỏi
        </button>
        <button 
          onClick={onToggleAnswer}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          {answerVisible ? 'Ẩn' : 'Hiện'} Đáp Án
        </button>
      </div>
      
      {/* Question Type Controls */}
      <div className="flex flex-wrap gap-2">
        {questionTypes.map((type) => (
          <button 
            key={type}
            onClick={() => onSwitchQuestionType(type)}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DemoControls;