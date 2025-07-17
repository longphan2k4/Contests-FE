import React from "react";
import DOMPurify from "dompurify";

interface QuestionExplanationProp {
  explanation: string | null;
}

const QuestionExplanation: React.FC<QuestionExplanationProp> = ({
  explanation,
}) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md border transition-all duration-300">
      <h1 className="font-semibold"> Mở rộng thêm về câu hỏi : </h1>
      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(explanation || ""),
        }}
      />
    </div>
  );
};

export default QuestionExplanation;
