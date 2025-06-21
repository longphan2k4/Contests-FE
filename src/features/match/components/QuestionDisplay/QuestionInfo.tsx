// components/QuestionDisplay/QuestionInfo.tsx
import React from "react";
import {
  QuestionMarkCircleIcon,
  TagIcon,
  DocumentTextIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { type QuestionInfoProps } from "../../types/question.types";

const QuestionInfo: React.FC<QuestionInfoProps> = ({
  questionNumber,
  phase,
  topic,
  type,
}) => {
  const getTypeIcon = (type: "essay" | "multiple_choice") => {
    switch (type) {
      case "multiple_choice":
        return <DocumentTextIcon className="w-5 h-5 inline-block mr-2" />;
      case "essay":
        return <PhotoIcon className="w-5 h-5 inline-block mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-wrap gap-2 my-4 justify-center text-lg">
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
        {type === "multiple_choice" ? "Trắc nghiệm" : "Tự luận"}
      </div>
    </div>
  );
};

export default QuestionInfo;
