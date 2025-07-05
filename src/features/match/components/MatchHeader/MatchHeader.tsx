import React, { useEffect, useState } from "react";
import {
  QuestionMarkCircleIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import phao1 from "./images/phao1.png";
import khangia from "./images/khangia.png";
import khongdung from "./images/delete.png";
import QuestionInfo from "../../components/QuestionDisplay/QuestionInfo";

import {
  type CurrentQuestion,
  type countContestant,
  // type updateRescuedDataType,
  type updatedRescuesType,
} from "../../types/control.type";

import { useSocket } from "../../../../contexts/SocketContext";

type HelpStatusKey = "revive1" | "revive2" | "airplane";
type HelpStatus = Record<
  HelpStatusKey,
  "available" | "used" | "unused" | "disabled"
>;

interface MatchHeaderProps {
  remainingTime?: number;
  currentQuestion: CurrentQuestion | null;
  countContestant: countContestant | null;
  countQuestion?: number;
}

const MatchHeader: React.FC<MatchHeaderProps> = ({
  remainingTime,
  currentQuestion,
  countContestant,
  countQuestion,
}) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(
    currentQuestion?.defaultTime ?? 30
  );
  const [hasPlayedHelpStatusSound, setHasPlayedHelpStatusSound] =
    useState(false);
  const helpStatus: HelpStatus = {
    revive1: "available",
    revive2: "unused",
    airplane: "disabled",
  };

  const { socket } = useSocket();
  const [updateRescuedData, setUpdateRescuedData] = useState<updatedRescuesType | null>(null);

  useEffect(() => {
    setTimeRemaining(remainingTime ?? 30);
  }, [remainingTime]);

  useEffect(() => {
    if (timeRemaining === 0) {
    } else if (timeRemaining <= 10) {
    }
  }, [timeRemaining]);

  useEffect(() => {
    const availableHelp = Object.values(helpStatus).some(
      status => status === "available"
    );
    if (availableHelp && !hasPlayedHelpStatusSound) {
      console.log("Phát âm thanh trợ giúp");
      setHasPlayedHelpStatusSound(true);
    } else if (
      !availableHelp &&
      (countContestant?.countIn_progress ?? 0) > 10
    ) {
      setHasPlayedHelpStatusSound(false);
    }
  }, [helpStatus, countContestant, hasPlayedHelpStatusSound]);

  useEffect(() => {
    if (!socket) {
      return () => { }; // Empty cleanup function
    }
    const getRescueStatus = (data: any) => {
      console.log("Rescue status data:", data);
      setUpdateRescuedData(data.data.updatedRescues);
      console.log("Updated rescued data:", updateRescuedData);
    };

    socket.on("rescue:statusUpdated", getRescueStatus);

    return () => {
      socket.off("rescue:statusUpdated", getRescueStatus);
    };
  }, [socket]);

  const renderHelpIcon = (
    key: HelpStatusKey,
    status: HelpStatus[HelpStatusKey]
  ) => {
    const isRevive = key === "revive1" || key === "revive2";
    const isAirplane = key === "airplane";
    const icon = isRevive ? phao1 : isAirplane ? khangia : null;

    let filterClass = "";
    let animationClass = "";
    if (status === "available") {
      animationClass = "animate-pulse";
      filterClass = "brightness-110";
    } else if (status === "unused") {
      filterClass = isAirplane
        ? "grayscale brightness-50"
        : "grayscale brightness-100";
    } else {
      filterClass = "brightness-100";
    }

    return (
      <div key={key} className="relative group">
        <div
          className={`relative w-10 h-10 md:w-16 md:h-16 ${filterClass} rounded-4xl shadow-lg ${animationClass}`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={icon ?? ""}
              className="w-10 h-10 md:w-16 md:h-16 object-contain"
              alt={key}
            />
          </div>
          {(status === "used" || status === "disabled") && (
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={khongdung}
                className="w-10 h-10 md:w-16 md:h-16"
                alt="Sử dụng xong"
              />
            </div>
          )}
        </div>
        <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 bg-black text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-50">
          {status === "available"
            ? "Sẵn sàng"
            : status === "used"
              ? "Đã dùng"
              : status === "disabled"
                ? "Hết hạn"
                : "Chưa khả dụng"}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="relative w-full bg-gradient-to-r from-blue-900 to-blue-800 px-4 py-3 shadow-lg border-b-2 border-blue-700 z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
          {/* LEFT */}
          <div className="flex justify-center md:justify-start">
            <div className="px-6 py-3 bg-white/20 backdrop-blur-lg rounded-xl shadow-2xl border-2 border-blue-300">
              <div className="font-bold text-white flex items-center space-x-1">
                <QuestionMarkCircleIcon className="w-8 h-8 text-yellow-400" />
                <span className="text-3xl font-extrabold">
                  <span className="text-yellow-400">
                    {currentQuestion?.questionOrder
                      ?.toString()
                      .padStart(2, "0")}
                  </span>
                  <span className="text-blue-200 mx-2">/</span>
                  <span className="text-blue-100">
                    {countQuestion?.toString().padStart(2, "0")}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* CENTER - TIMER */}
          <div className="flex justify-center">
            <div className="relative">
              <div
                className={`w-24 h-24 flex items-center justify-center rounded-full border-4 
                ${timeRemaining <= 5
                    ? "border-red-800 animate-pulse"
                    : timeRemaining <= 10
                      ? "border-yellow-700"
                      : "border-blue-500"
                  } 
                bg-blue-900 shadow-lg transition-all duration-300`}
              >
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div
                    className={`absolute bottom-0 w-full bg-gradient-to-t 
                      ${timeRemaining <= 5
                        ? "from-red-600 to-red-400"
                        : timeRemaining <= 10
                          ? "from-yellow-600 to-yellow-400"
                          : "from-blue-600 to-blue-400"
                      }`}
                    style={{
                      height: `${(timeRemaining / (currentQuestion?.defaultTime ?? 30)) *
                        100
                        }%`,
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
                      opacity:
                        i * 30 <
                          (timeRemaining / (currentQuestion?.defaultTime ?? 30)) *
                          360
                          ? 1
                          : 0.3,
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT - HELP + CONTESTANT */}
          <div className="flex justify-center md:justify-end gap-4 items-center flex-wrap">
            {Object.entries(helpStatus).map(([key, status]) =>
              renderHelpIcon(key as HelpStatusKey, status)
            )}
            <div className="px-4 py-2 bg-white/20 backdrop-blur-lg rounded-xl shadow-2xl border-2 border-blue-300">
              <div
                className={`font-bold text-black flex items-center space-x-1
                ${(countContestant?.countIn_progress ?? 0) <= 5
                    ? "animate-pulse text-red-400"
                    : (countContestant?.countIn_progress ?? 0) <= 10
                      ? "text-orange-300"
                      : "text-green-300"
                  }`}
              >
                <TrophyIcon className="w-6 h-6" />
                <span className="text-xl font-extrabold">
                  {(countContestant?.countIn_progress ?? 0)
                    .toString()
                    .padStart(2, "0")}
                  <span className="text-blue-200 mx-1">/</span>
                  {(countContestant?.total ?? 0).toString().padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Info */}
      <div className="space-y-6"></div>
      {currentQuestion && (
        <QuestionInfo
          questionNumber={currentQuestion.questionOrder}
          phase={currentQuestion.difficulty}
          topic={currentQuestion.questionTopicName}
          type={currentQuestion.questionType}
        />
      )}
    </div>
  );
};

export default MatchHeader;
