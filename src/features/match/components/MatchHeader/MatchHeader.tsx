import React, { useEffect, useState } from "react";
import {
  QuestionMarkCircleIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
//import phao1 from "./images/phao1.png";
import khangia from "./images/khangia.png";
//import khongdung from "./images/delete.png";
import close from "./images/close.png";
import lifesaver from "./images/lifesaver.png";
import QuestionInfo from "../../components/QuestionDisplay/QuestionInfo";

import {
  type CurrentQuestion,
  type countContestant,
  type updatedRescuesType,
  RescueStatus,
} from "../../types/control.type";

// import { useSocket } from "../../../../contexts/SocketContext";

interface MatchHeaderProps {
  remainingTime?: number;
  currentQuestion: CurrentQuestion | null;
  countContestant: countContestant | null;
  countQuestion?: number;
  updateRescuedData: updatedRescuesType[];
}

const MatchHeader: React.FC<MatchHeaderProps> = ({
  remainingTime,
  currentQuestion,
  countContestant,
  countQuestion,
  updateRescuedData,
}) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(
    currentQuestion?.defaultTime ?? 30
  );
  const [hasPlayedHelpStatusSound, setHasPlayedHelpStatusSound] =
    useState(false);

  // const { socket } = useSocket();
  // const [updateRescuedData, setUpdateRescuedData] = useState<updatedRescuesType[]>(
  //   []
  // );

  useEffect(() => {
    setTimeRemaining(remainingTime ?? 30);
  }, [remainingTime]);

  useEffect(() => {
    if (timeRemaining === 0) {
    } else if (timeRemaining <= 10) {
    }
  }, [timeRemaining]);

  useEffect(() => {
    const availableHelp = updateRescuedData.some(
      rescue =>
        rescue.status === RescueStatus.notUsed && rescue.isEffect
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateRescuedData, countContestant, hasPlayedHelpStatusSound]);

  // Lắng nghe sự kiện rescue:statusUpdated từ server
  // useEffect(() => {
  //   if (!socket) {
  //     return () => {}; // Empty cleanup function
  //   }
  // const getRescueStatus = (data: any) => {
  //   console.log("Rescue status data:", data);
  //   setUpdateRescuedData(data.data.updatedRescues);
  //   console.log("Updated rescued data:", updateRescuedData);
  // };

  //   socket.on("rescue:statusUpdated", getRescueStatus);

  //   return () => {
  //     socket.off("rescue:statusUpdated", getRescueStatus);
  //   };
  // }, [socket]);

  // hàm kiểm tra trên client xem rescue có đủ điều kiện để sử dụng hay không
  // const isRescueEligible = (rescue: updatedRescuesType): boolean => {
  //   const currentContestants =
  //     (countContestant?.total ?? 0) - (countContestant?.countEliminated ?? 0);
  //   return currentContestants <= rescue.remainingContestants;
  // };

  const getRescueIcon = (rescueType: string): string => {
    if (rescueType === "lifelineUsed") {
      return khangia;
    }
    return lifesaver; // For resurrected and other types
  };

  const renderRescueIcon = (rescue: updatedRescuesType) => {
    const icon = getRescueIcon(rescue.rescueType);
    const isEligible = rescue.isEffect;

    let filterClass = "";
    let animationClass = "";

    switch (rescue.status) {
      case RescueStatus.notUsed:
        if (isEligible) {
          animationClass = "animate-pulse";
          filterClass = "brightness-110";
        } else {
          filterClass = "brightness-100";
        }
        break;
      case RescueStatus.used:
      case RescueStatus.passed:
        filterClass = "brightness-100";
        break;
      case RescueStatus.notEligible:
        filterClass = "grayscale brightness-50";
        break;
      default:
        filterClass = "brightness-100";
    }

    // Add bubble effect for eligible rescues
    if (rescue.status === RescueStatus.notUsed && isEligible) {
      animationClass += " animate-bounce";
    }

    return (
      <div key={rescue.id} className="relative group">
        <div
          className={`relative w-10 h-10 md:w-16 md:h-16 ${filterClass} rounded-4xl shadow-lg ${animationClass}`}
        >
          {/* Bubble effect for eligible rescues */}
          {rescue.status === RescueStatus.notUsed && isEligible && (
            <div className="absolute -inset-2 rounded-full border-2 border-yellow-400 animate-ping opacity-75"></div>
          )}

          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={icon}
              className="w-10 h-10 md:w-16 md:h-16 object-contain"
              alt={rescue.name}
            />
          </div>
          {(rescue.status === RescueStatus.used ||
            rescue.status === RescueStatus.passed) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={close}
                className="w-10 h-10 md:w-16 md:h-16"
                alt="Đã sử dụng"
              />
            </div>
          )}
        </div>
        <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 bg-black text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-50">
          {rescue.status === RescueStatus.notUsed
            ? isEligible
              ? "Sẵn sàng"
              : "Chưa đủ điều kiện"
            : rescue.status === RescueStatus.used
            ? "Đã dùng"
            : rescue.status === RescueStatus.passed
            ? "Đã qua"
            : "Không khả dụng"}
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
          {/* 
          <>
          {updateRescuedData.map((item) => (
            <div key={item.id}>{item.name}</div>
          ))}
          </> */}

          {/* CENTER - TIMER */}
          <div className="flex justify-center">
            <div className="relative">
              <div
                className={`w-24 h-24 flex items-center justify-center rounded-full border-4 
                ${
                  timeRemaining <= 5
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
                      ${
                        timeRemaining <= 5
                          ? "from-red-600 to-red-400"
                          : timeRemaining <= 10
                          ? "from-yellow-600 to-yellow-400"
                          : "from-blue-600 to-blue-400"
                      }`}
                    style={{
                      height: `${
                        (timeRemaining / (currentQuestion?.defaultTime ?? 30)) *
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
          <div className="flex justify-center md:justify-end items-center flex-col md:flex-row gap-2">
            {/* Rescue items container */}
            <div className="flex justify-center md:justify-end gap-2 items-center flex-wrap max-w-xs md:max-w-md">
              {updateRescuedData.map(rescue => renderRescueIcon(rescue))}
            </div>

            {/* Contestant count - always at the end */}
            <div className="flex-shrink-0 flex items-center">
              <div className="px-4 py-2 bg-white/20 backdrop-blur-lg rounded-xl shadow-2xl border-2 border-blue-300">
                <div
                  className={`font-bold text-black flex items-center space-x-1
                  ${
                    (countContestant?.countIn_progress ?? 0) <= 5
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
