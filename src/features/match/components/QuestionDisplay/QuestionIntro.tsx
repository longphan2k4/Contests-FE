import React from "react";

interface QuestionIntroProp {
  intro: string | null;
}

const QuestionIntro: React.FC<QuestionIntroProp> = ({ intro }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md border transition-all duration-300">
    {/* quy: kích thước chữ */}
      <h1 className="text-2xl font-semibold">Thông tin câu hỏi</h1>
      <div className="text-2xl leading-normal">{intro}</div>
    </div>
  );
};

export default QuestionIntro;
