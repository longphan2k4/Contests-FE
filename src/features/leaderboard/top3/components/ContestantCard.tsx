import React from "react";
import { TrophyIcon, StarIcon, FireIcon } from "@heroicons/react/24/solid";
import type { CardStyles } from "../types/CardStyles";

interface ContestantCardProps {
  actualRank: number;
  isRevealed: boolean;
  styles: CardStyles;
  fullName: string | null;
}

const ContestantCard: React.FC<ContestantCardProps> = ({
  fullName,
  actualRank,
  isRevealed,
  styles,
}) => {
  return (
    <div
      className={`relative overflow-hidden transition-all duration-1000 ease-out transform ${
        isRevealed ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      } ${actualRank === 1 && isRevealed ? "animate-wiggle" : ""}`}
    >
      {isRevealed && (
        <div
          className={`absolute -top-32 left-1/2 transform -translate-x-1/2 w-24 h-64 bg-gradient-to-b ${
            actualRank === 1
              ? "from-yellow-100"
              : actualRank === 2
              ? "from-gray-100"
              : "from-amber-100"
          } to-transparent opacity-40 animate-spotlight`}
        ></div>
      )}
      {actualRank === 1 && isRevealed && (
        <div className="absolute inset-0 rounded-full bg-yellow-300 opacity-30 animate-aura"></div>
      )}
      <div
        className={`relative p-4 md:p-6 rounded-full flex flex-col justify-center items-center text-center border-8 bg-gradient-to-b ${
          styles.border
        } ${styles.bg} ${
          actualRank === 1
            ? "w-72 h-72 md:w-80 md:h-80"
            : actualRank === 2
            ? "w-60 h-60 md:w-72 md:h-72"
            : "w-52 h-52 md:w-64 md:h-64"
        }`}
      >
        {isRevealed && (
          <div
            className="absolute inset-0 bg-white opacity-20 rounded-full animate-glow"
            style={{ animationDelay: `${actualRank * 0.2}s` }}
          ></div>
        )}
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          {isRevealed && (
            <>
              <div
                className={`mb-2 md:mb-4 animate-bounce`}
                style={{ animationDuration: "1s" }}
              >
                {actualRank === 1 ? (
                  <TrophyIcon className="h-14 w-14 md:h-16 md:w-16 text-yellow-300 mx-auto" />
                ) : actualRank === 2 ? (
                  <StarIcon className="h-12 w-12 md:h-14 md:w-14 text-gray-300 mx-auto" />
                ) : (
                  <FireIcon className="h-10 w-10 md:h-12 md:w-12 text-amber-400 mx-auto" />
                )}
              </div>
              <h3
                className={`text-2xl md:text-3xl font-extrabold mb-1 md:mb-2 ${styles.text}`}
              >
                {actualRank === 1
                  ? "Hạng Nhất"
                  : actualRank === 2
                  ? "Hạng Nhì"
                  : "Hạng Ba"}
              </h3>
              <h4 className="text-lg md:text-xl font-bold mb-1 text-white drop-shadow-md">
                {fullName || "Chưa có thí sinh"}
              </h4>
              {/* <div
                className={`px-4 py-1 md:px-6 md:py-2 rounded-full font-bold text-base md:text-lg ${styles.badge} shadow-md`}
              >
                {contestant.score} điểm
              </div> */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestantCard;
