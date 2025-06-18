import React, { useEffect, useState } from "react";
import { QuestionMarkCircleIcon, TrophyIcon } from "@heroicons/react/24/outline";
import phao1 from "./images/phao1.png"
import khangia from "./images/khangia.png";
import khongdung from "./images/delete.png";
// Định nghĩa interfaces cho mock data
interface QuestionData {
  questionNumber: number;
  phase: string;
  type: string;
}

type HelpStatusKey = "revive1" | "revive2" | "airplane";
type HelpStatus = {
  [key in HelpStatusKey]: "available" | "used" | "unused" | "disabled";
};

const MatchHeader: React.FC = () => {
  // Mock data
  const [questionData] = useState<QuestionData>({
    questionNumber: 1,
    phase: "Phase 1",
    type: "Multiple Choice",
  });

  const timer = 30; // Tổng thời gian (giây)
  const [timeRemaining, setTimeRemaining] = useState<number>(timer);

  const [helpStatus] = useState<HelpStatus>({
    revive1: "available",
    revive2: "unused",
    airplane: "disabled",
  });

  const [remainingContestants] = useState<number>(15);
  const totalContestants = 20;

  // Hàm mock cho renderQuestionTypeIcon
  const renderQuestionTypeIcon = (type: string, className: string): React.ReactElement => {
    switch (type) {
      case "Multiple Choice":
        return <span className={className}>MC</span>;
      default:
        return <span className={className}>?</span>;
    }
  };

  // Giả lập đồng hồ đếm ngược
  useEffect(() => {
    if (timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeRemaining]);

  // Giả lập logic âm thanh
  useEffect(() => {
    if (timeRemaining === 0) {
      console.log("Hết giờ! Phát âm thanh kết thúc.");
    } else if (timeRemaining <= 10 && timeRemaining > 0) {
      console.log("Còn dưới 10 giây! Phát âm thanh cảnh báo.");
    }
  }, [timeRemaining]);

  // Giả lập âm thanh cho trợ giúp
  const [hasPlayedHelpStatusSound, setHasPlayedHelpStatusSound] = useState(false);
  useEffect(() => {
    const availableHelp = Object.values(helpStatus).some((status) => status === "available");
    if (availableHelp && !hasPlayedHelpStatusSound) {
      console.log("Phát âm thanh trợ giúp");
      setHasPlayedHelpStatusSound(true);
    } else if (!availableHelp && remainingContestants > 10) {
      setHasPlayedHelpStatusSound(false);
    }
  }, [helpStatus, remainingContestants]);

  return (
    <div className="relative w-full bg-gradient-to-r from-blue-900 to-blue-800 px-4 py-3 shadow-lg border-b-2 border-blue-700 z-20">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Số câu hỏi */}
        <div className="px-6 py-3 bg-white/20 backdrop-blur-lg rounded-xl shadow-2xl border-2 border-blue-300">
          <div className="font-bold text-white flex items-center space-x-1">
            <QuestionMarkCircleIcon className="w-8 h-8 text-yellow-400" />
            <span className="text-3xl font-extrabold">
              <span className="text-yellow-400 text-outline">
                {questionData.questionNumber < 10
                  ? `0${questionData.questionNumber}`
                  : questionData.questionNumber}
              </span>
              <span className="text-blue-200 mx-2 text-outline">/</span>
              <span className="text-blue-100 text-outline">13</span>
            </span>
          </div>
        </div>

        {/* Thông tin câu hỏi */}
        <div className="flex flex-wrap gap-4">
          {/* Phase */}
          <div className="px-6 py-3 bg-blue-600/90 backdrop-blur-md rounded-full font-bold text-white shadow-xl flex items-center space-x-3 transition-all hover:scale-105 cursor-pointer text-lg">
            <span className="text-2xl text-outline">{questionData.phase}</span>
          </div>
          {/* Loại câu hỏi */}
          <div className="px-6 py-3 bg-purple-600/90 backdrop-blur-md rounded-full font-bold text-white shadow-xl flex items-center space-x-3 transition-all hover:scale-105 cursor-pointer text-lg">
            {renderQuestionTypeIcon(questionData.type, "w-7 h-7")}
            <span className="text-2xl text-outline">{questionData.type}</span>
          </div>
        </div>

        {/* Đồng hồ đếm ngược */}
        <div className="relative">
          <div
            className={`w-24 h-24 flex items-center justify-center rounded-full border-4 
              ${timeRemaining <= 5 ? "border-red-800 animate-pulse" : timeRemaining <= 10 ? "border-yellow-700" : "border-blue-500"} 
              bg-blue-900 shadow-lg transition-all duration-300`}
          >
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <div
                className={`absolute bottom-0 w-full bg-gradient-to-t 
                  ${timeRemaining <= 5 ? "from-red-600 to-red-400" : timeRemaining <= 10 ? "from-yellow-600 to-yellow-400" : "from-blue-600 to-blue-400"}`}
                style={{
                  height: `${(timeRemaining / timer) * 100}%`,
                  transition: "height 1s linear",
                }}
              ></div>
            </div>
            <div
              className="relative z-10 text-5xl font-mono font-bold text-white"
              style={{
                textShadow:
                  "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000",
              }}
            >
              {timeRemaining}
            </div>
          </div>
          <div className="absolute inset-0 rounded-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-white bg-opacity-60"
                style={{
                  transform: `rotate(${i * 30}deg) translateY(-40px)`,
                  transformOrigin: "center center",
                  left: "calc(50% - 4px)",
                  top: "calc(50% - 4px)",
                  opacity: i * 30 < (timeRemaining / timer) * 360 ? 1 : 0.3,
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Trợ giúp */}
        <div className="flex gap-4 items-center">
          {Object.entries(helpStatus).map(([key, status]) => {
            const isRevive = key === "revive1" || key === "revive2";
            const isAirplane = key === "airplane";
            let icon: React.ReactElement;

            if (isRevive) {
              icon = (
                <img
                  src={phao1}
                  className="w-16 h-16 md:w-24 md:h-24 object-contain"
                  alt={`Cứu trợ ${key === "revive1" ? "1" : "2"}`}
                />
              );
            } else if (isAirplane) {
              icon = (
                <img
                  src={khangia}
                  className="w-16 h-16 md:w-24 md:h-24 transform"
                  alt="Máy bay"
                />
              );
            } else {
              icon = <></>;
            }

            let filterClass = "";
            let animationClass = "";

            switch (status) {
              case "available":
                animationClass = "animate-pulse";
                filterClass = "brightness-110";
                break;
              case "used":
                filterClass = "brightness-100";
                break;
              case "unused":
                filterClass = isAirplane
                  ? "grayscale contrast-100 brightness-50"
                  : "grayscale contrast-100 brightness-100";
                break;
              case "disabled":
                filterClass = "brightness-100";
                break;
            }

            return (
              <div key={key} className="relative group">
                <div
                  className={`relative w-16 h-16 md:w-24 md:h-24 ${filterClass} rounded-4xl shadow-lg ${animationClass} transition-all duration-300`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    {icon}
                  </div>
                  {(status === "used" || status === "disabled") && (
                    <div className="absolute inset-0 flex items-center justify-center text-red-500">
                      <img
                        src={khongdung}
                        className="w-16 h-16 md:w-24 md:h-24 transform"
                        alt="Sử dụng xong"
                      />
                    </div>
                  )}
                </div>
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 bg-black text-white text-sm rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {status === "available"
                    ? "Sẵn sàng sử dụng"
                    : status === "used"
                    ? "Đã sử dụng"
                    : status === "disabled"
                    ? "Đã quá thời gian sử dụng"
                    : "Chưa khả dụng"}
                </div>
              </div>
            );
          })}
        </div>

        {/* Số thí sinh còn lại */}
        <div className="px-6 py-3 bg-white/20 backdrop-blur-lg rounded-xl shadow-2xl border-2 border-blue-300">
          <div
            className={`font-bold text-black flex items-center space-x-1
              ${remainingContestants <= 5 ? "animate-pulse text-red-400" : remainingContestants <= 10 ? "text-orange-300" : "text-green-300"}`}
          >
            <TrophyIcon className="w-8 h-8 text-400" />
            <span className="text-3xl font-extrabold">
              <span className="text-400 text-outline">
                {remainingContestants < 10
                  ? `0${remainingContestants}`
                  : remainingContestants}
              </span>
              <span className="text-blue-200 mx-2 text-outline">/</span>
              <span className="text-blue-100 text-outline">
                {totalContestants < 10 ? `0${totalContestants}` : totalContestants}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchHeader;