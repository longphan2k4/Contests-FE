// components/QuestionDisplay/DemoControls.tsx
import React from 'react';
import type { DemoControlsProps, QuestionData } from '../../types/question.types';

const DemoControls: React.FC<DemoControlsProps> = ({
  contentVisible,
  answerVisible,
  onToggleQuestion,
  onToggleAnswer,
  onSwitchQuestionType,
  onSwitchAnswerType
}) => {
  const questionTypes: QuestionData['type'][] = ['Trắc Nghiệm', 'Hình Ảnh', 'Video', 'Âm Thanh'];
  const answerTypes: Array<{value: 'option' | 'text' | 'image' | 'video' | 'audio', label: string}> = [
    { value: 'option', label: 'Option (A,B,C,D)' },
    { value: 'text', label: 'Text' },
    { value: 'image', label: 'Hình ảnh' },
    { value: 'video', label: 'Video' },
    { value: 'audio', label: 'Âm thanh' }
  ];

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
      <h3 className="font-semibold mb-3 text-gray-800">Demo Controls:</h3>
      
      {/* Toggle Controls */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Hiển thị:</h4>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={onToggleQuestion}
            className={`px-4 py-2 rounded transition-colors ${
              contentVisible 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            {contentVisible ? '✓ Đang hiện' : 'Hiện'} Câu Hỏi
          </button>
          <button 
            onClick={onToggleAnswer}
            className={`px-4 py-2 rounded transition-colors ${
              answerVisible 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            {answerVisible ? '✓ Đang hiện' : 'Hiện'} Đáp Án
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          💡 Lưu ý: Chỉ hiển thị câu hỏi HOẶC đáp án tại một thời điểm
        </p>
      </div>
      
      {/* Question Type Controls */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Loại câu hỏi:</h4>
        <div className="flex flex-wrap gap-2">
          {questionTypes.map((type) => (
            <button 
              key={type}
              onClick={() => onSwitchQuestionType(type)}
              className="px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors border border-purple-200"
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Answer Type Controls */}
      {onSwitchAnswerType && (
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-2">Loại đáp án:</h4>
          <div className="flex flex-wrap gap-2">
            {answerTypes.map((answerType) => (
              <button 
                key={answerType.value}
                onClick={() => onSwitchAnswerType(answerType.value)}
                className="px-3 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors border border-orange-200 text-sm"
              >
                {answerType.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoControls;