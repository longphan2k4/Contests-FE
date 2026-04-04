import React from "react";

interface QuestionIntroProp {
  intro: string | null;
}

const QuestionIntro: React.FC<QuestionIntroProp> = ({ intro }) => {
  return (
    <div className="min-h-[50vh] p-6 bg-white rounded-lg shadow-md border">
    {/* quy: kích thước chữ */}
      <h1 className="text-[clamp(14px,2.3vw,34px)] font-bold tracking-tight text-slate-900">Thông tin câu hỏi</h1>
      <div
        className="text-[clamp(14px,2.3vw,34px)] font-medium leading-relaxed text-slate-800 antialiased"
      >
        {intro}
      </div>
    </div>
  );
};

export default QuestionIntro;
