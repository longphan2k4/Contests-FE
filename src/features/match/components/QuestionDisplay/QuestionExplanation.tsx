// import React from "react";
// import DOMPurify from "dompurify";

// interface QuestionExplanationProp {
//   explanation: string | null;
// }

// const QuestionExplanation: React.FC<QuestionExplanationProp> = ({
//   explanation,
// }) => {
//   return (
//     // <div className="p-6 bg-white rounded-lg shadow-md border transition-all duration-300">
//     //   <h1 className="text-3xl font-semibold"> Mở rộng thêm về câu hỏi : </h1>
//     //   {/* quy: kích thước chữ */}
//     //   <div
//     //     className="text-2xl leading-relaxed"
//     //     dangerouslySetInnerHTML={{
//     //       __html: DOMPurify.sanitize(explanation || ""),
//     //     }}
//     //   />
//     // </div>
//     // quy: thay đổi kích thước text-[clamp(18px,2.5vw,35px)]
//     <div className="min-h-[50vh] w-full p-6 bg-white rounded-lg shadow-md border transition-all duration-300 break-words overflow-auto">
      
//       {/* Title */}
//       <h1 className="font-semibold text-[clamp(14px,2.3vw,36px)]">
//         Mở rộng thêm về câu hỏi:
//       </h1>

//       {/* Content */}
//       <div
//         className="text-[clamp(14px,2.3vw,35px)]"
//         dangerouslySetInnerHTML={{
//           __html: DOMPurify.sanitize(explanation || ""),
//         }}
//       />
//     </div>
//   );
// };

// export default QuestionExplanation;

//quy: responsive font explanation
import React, { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";

interface QuestionExplanationProp {
  explanation: string | null;
}

const QuestionExplanation: React.FC<QuestionExplanationProp> = ({
  explanation,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const [fontSize, setFontSize] = useState(34);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const text = textRef.current;
    if (!wrapper || !text) return;

    const header = wrapper.querySelector("h1");

    const getAvailableHeight = () => {
      const wrapperRect = wrapper.getBoundingClientRect();
      const headerRect = header?.getBoundingClientRect();
      return wrapperRect.height - (headerRect?.height || 0) - 32;
    };

    let low = 13;
    let high = 34;
    let best = 13;

    const availableHeight = getAvailableHeight();

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      text.style.fontSize = mid + "px";

      const textHeight = text.getBoundingClientRect().height;

      if (textHeight <= availableHeight) {
        best = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    text.style.fontSize = best + "px";
    setFontSize(best);
  }, [explanation]);

  return (
    <div
      ref={wrapperRef}
      className="min-h-[50vh] max-h-[85vh] w-full p-6 bg-white rounded-lg shadow-md border overflow-hidden"
    >
      {/* Title */}
      <h1 className="font-semibold text-lg mb-4">
        Mở rộng thêm về câu hỏi:
      </h1>

      {/* Content */}
      <div
        ref={textRef}
        className="leading-relaxed break-words text-slate-800"
        style={{ fontSize }}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(explanation || ""),
        }}
      />
    </div>
  );
};

export default QuestionExplanation;