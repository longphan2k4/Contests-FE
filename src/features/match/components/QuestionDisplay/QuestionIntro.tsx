import React from "react";

interface QuestionIntroProp {
  intro: string | null;
}

const QuestionIntro: React.FC<QuestionIntroProp> = ({ intro }) => {
  return (
    <div className="min-h-[50vh] p-6 bg-white rounded-lg shadow-md border">
    {/* quy: kích thước chữ */}
      <h1 className="text-[2vw] font-semibold">Thông tin câu hỏi</h1>
      <div className="text-[2.5vw] leading-normal">{intro}</div>
    </div>
  );
};

export default QuestionIntro;
