import React from "react";

interface QuestionIntroProp {
  intro: string | null;
}

const QuestionIntro: React.FC<QuestionIntroProp> = ({ intro }) => {
  return (
    <div className="min-h-[50vh] p-6 bg-white rounded-lg shadow-md border">
    {/* quy: kích thước chữ */}
      <h1 className="text-[clamp(18px,2.5vw,35px)] font-semibold">Thông tin câu hỏi</h1>
      <div className="text-[clamp(18px,2.5vw,35px)] leading-normal">{intro}</div>
    </div>
  );
};

export default QuestionIntro;
