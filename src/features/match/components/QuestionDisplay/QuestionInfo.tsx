    // components/QuestionDisplay/QuestionInfo.tsx
import React from 'react';
import { 
  QuestionMarkCircleIcon, 
  TagIcon, 
  DocumentTextIcon, 
  PhotoIcon, 
  VideoCameraIcon, 
  SpeakerWaveIcon 
} from '@heroicons/react/24/outline';
import { type QuestionInfoProps } from '../../types/question.types';

const QuestionInfo: React.FC<QuestionInfoProps> = ({ questionNumber, phase, topic, type }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Trắc Nghiệm':
        return <DocumentTextIcon className="w-5 h-5 inline-block mr-2" />;
      case 'Hình Ảnh':
        return <PhotoIcon className="w-5 h-5 inline-block mr-2" />;
      case 'Video':
        return <VideoCameraIcon className="w-5 h-5 inline-block mr-2" />;
      case 'Âm Thanh':
        return <SpeakerWaveIcon className="w-5 h-5 inline-block mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4 justify-center text-lg">
      <div className="px-4 py-2 bg-gray-200 rounded-full font-semibold">
        <QuestionMarkCircleIcon className="w-5 h-5 inline-block mr-2" />
        Câu {questionNumber}
      </div>
      <div className="px-4 py-2 bg-blue-600 text-white rounded-full font-semibold">
        {phase}
      </div>
      <div className="px-4 py-2 bg-gray-200 rounded-full font-semibold">
        <TagIcon className="w-5 h-5 inline-block mr-2" />
        {topic}
      </div>
      <div className="px-4 py-2 bg-gray-200 rounded-full font-semibold">
        {getTypeIcon(type)}
        {type}
      </div>
    </div>
  );
};

export default QuestionInfo;