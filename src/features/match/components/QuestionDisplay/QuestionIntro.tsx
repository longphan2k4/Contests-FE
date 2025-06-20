import React from "react";

interface QuestionIntroProp {
  intro: string | null;
}

const QuestionIntro: React.FC<QuestionIntroProp> = ({ intro }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md border transition-all duration-300">
      <h1 className="font-semibold">Thông tin câu hỏi</h1>
      <div>{intro}</div>
    </div>
  );
};

export default QuestionIntro;
