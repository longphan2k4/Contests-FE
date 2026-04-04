import React from "react";
import DOMPurify from "dompurify";

interface QuestionExplanationProp {
  explanation: string | null;
}

const QuestionExplanation: React.FC<QuestionExplanationProp> = ({
  explanation,
}) => {
  return (
    // <div className="p-6 bg-white rounded-lg shadow-md border transition-all duration-300">
    //   <h1 className="text-3xl font-semibold"> Mở rộng thêm về câu hỏi : </h1>
    //   {/* quy: kích thước chữ */}
    //   <div
    //     className="text-2xl leading-relaxed"
    //     dangerouslySetInnerHTML={{
    //       __html: DOMPurify.sanitize(explanation || ""),
    //     }}
    //   />
    // </div>
    // quy: thay đổi kích thước text-[clamp(18px,2.5vw,35px)]
    <div className="min-h-[55vh] w-full p-6 bg-white rounded-lg shadow-md border transition-all duration-300 break-words overflow-auto">
      
      {/* Title */}
      <h1 className="font-semibold text-[clamp(14px,2.3vw,36px)]">
        Mở rộng thêm về câu hỏi:
      </h1>

      {/* Content */}
      <div
        className="text-[clamp(14px,2.3vw,35px)]"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(explanation || ""),
        }}
      />
    </div>
  );
};

export default QuestionExplanation;
