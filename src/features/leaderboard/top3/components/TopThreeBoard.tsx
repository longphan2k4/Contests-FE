import React, { useRef } from "react";
import type { CardStyles } from "../types/CardStyles";
import { useParticles } from "../hooks/useParticles";
import ContestantCard from "./ContestantCard";
import type { Award } from "@features/match/types/control.type";

type Top3Props = {
  ListAward: {
    firstPrize: Award | null;
    secondPrize: Award | null;
    thirdPrize: Award | null;
  } | null;
};

const TopThreeBoard: React.FC<Top3Props> = ({ ListAward }) => {
  const particlesRef = useRef<HTMLDivElement>(null);
  useParticles(particlesRef);

  console.log("Awards", {
    first: ListAward?.firstPrize,
    second: ListAward?.secondPrize,
    third: ListAward?.thirdPrize,
  });

  const getCardStyles = (actualRank: number): CardStyles => ({
    border:
      actualRank === 1
        ? "border-yellow-500"
        : actualRank === 2
        ? "border-gray-400"
        : "border-amber-700",
    bg:
      actualRank === 1
        ? "from-yellow-400 to-yellow-600"
        : actualRank === 2
        ? "from-gray-300 to-gray-500"
        : "from-amber-600 to-amber-800",
    text:
      actualRank === 1
        ? "text-yellow-700"
        : actualRank === 2
        ? "text-gray-700"
        : "text-amber-900",
    badge:
      actualRank === 1
        ? "bg-yellow-200 text-yellow-800"
        : actualRank === 2
        ? "bg-gray-200 text-gray-800"
        : "bg-amber-200 text-amber-900",
  });

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-400 overflow-hidden p-4">
      <div
        ref={particlesRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none hexagon-grid" />
      <div className="relative z-20 w-full max-w-6xl mx-auto p-4 md:p-8">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 pb-2 relative inline-block">
            TOP 3 THÍ SINH
            <div className="absolute -inset-1 bg-yellow-300 opacity-20 blur-md rounded-lg z-0" />
          </h1>
          <p className="mt-2 md:mt-4 text-gray-600 italic font-extrabold md:text-3xl">
            Cuộc thi Olympic Tin học 2025
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mt-6 md:mt-12 justify-items-center">
          {[
            ListAward?.secondPrize,
            ListAward?.firstPrize,
            ListAward?.thirdPrize,
          ].map((data, index) => {
            if (!data) return null;

            const rank = index === 0 ? 2 : index === 1 ? 1 : 3;

            return (
              <ContestantCard
                key={data?.id}
                fullName={data?.fullName}
                actualRank={rank}
                isRevealed={true}
                styles={getCardStyles(rank)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopThreeBoard;
