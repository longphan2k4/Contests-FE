import React from "react";

interface QuestionExplanationProp {
  explanation: string | null;
}

const QuestionExplanation: React.FC<QuestionExplanationProp> = ({
  explanation,
}) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md border transition-all duration-300">
      <h1 className="font-semibold"> Mở rộng thêm về câu hỏi : </h1>
      <div>{explanation}</div>
    </div>
  );
};

export default QuestionExplanation;
