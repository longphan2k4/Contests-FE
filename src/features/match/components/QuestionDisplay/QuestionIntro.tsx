// import React from "react";

// interface QuestionIntroProp {
//   intro: string | null;
// }

// const QuestionIntro: React.FC<QuestionIntroProp> = ({ intro }) => {
//   return (
//     <div className="min-h-[50vh] p-6 bg-white rounded-lg shadow-md border">
//     {/* quy: kích thước chữ */}
//       <h1 className="text-[clamp(14px,2.3vw,34px)] font-bold tracking-tight text-slate-900">Thông tin câu hỏi</h1>
//       <div
//         className="text-[clamp(14px,2.3vw,34px)] font-medium leading-relaxed text-slate-800 antialiased"
//       >
//         {intro}
//       </div>
//     </div>
//   );
// };

// export default QuestionIntro;

//quy: reponsive font intro
import React, { useEffect, useRef, useState } from "react";

interface QuestionIntroProp {
  intro: string | null;
}

const QuestionIntro: React.FC<QuestionIntroProp> = ({ intro }) => {
  const wrapperRef = useRef<HTMLDivElement>(null); // box giới hạn
  const textRef = useRef<HTMLDivElement>(null);    // text

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
      best = mid;     // fit → thử tăng lên
      low = mid + 1;
    } else {
      high = mid - 1; // tràn → giảm xuống
    }
  }

  text.style.fontSize = best + "px";
  setFontSize(best);
}, [intro]);

  return (
    <div
      ref={wrapperRef}
      className="min-h-[50vh] max-h-[85vh] p-6 bg-white rounded-lg shadow-md border overflow-hidden"
    >
      <h1 className="text-lg font-bold text-slate-900 mb-4">
        Thông tin câu hỏi
      </h1>

      <div
        ref={textRef}
        className="font-medium leading-relaxed text-slate-800"
        style={{ fontSize }}
      >
        {intro}
      </div>
    </div>
  );
};

export default QuestionIntro;