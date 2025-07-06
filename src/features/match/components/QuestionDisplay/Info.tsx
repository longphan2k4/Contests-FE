import React from "react";
import "../css/info.css";

// Icons
import {
  QuestionMarkCircleIcon,
  TagIcon,
  DocumentTextIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { type CurrentQuestion } from "../../types/control.type.ts";

// Define the shape of questionData
interface QuestionData {
  currentQuestion: CurrentQuestion | null;
}

const Intro: React.FC<QuestionData> = ({ currentQuestion }) => {
  return (
    <>
      <div className="absolute inset-0 z-20 bg-gradient-to-b from-blue-900/80 via-indigo-900/80 to-purple-900/80 backdrop-blur-md flex flex-col items-center justify-center overflow-hidden transition-all duration-1000 animate-fadeIn">
        {/* Particle effects */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/30 animate-float"
              style={{
                width: `${Math.random() * 30 + 10}px`,
                height: `${Math.random() * 30 + 10}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 10 + 10}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        {/* Main intro content */}
        <div className="relative p-12 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1
              className="text-5xl font-bold text-white mb-2 tracking-wider animate-slideUpFade"
              style={{ animationDelay: "0.2s" }}
            >
              CÂU HỎI {currentQuestion?.questionOrder}
            </h1>
            <div
              className="h-1 w-32 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto animate-growWidth"
              style={{ animationDelay: "0.4s" }}
            />
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-3 gap-8 mt-10">
            {/* Difficulty level */}
            <div
              className="bg-gradient-to-br from-blue-800/70 to-blue-600/70 p-6 rounded-2xl border border-blue-400/30 backdrop-blur-sm shadow-glow transition-transform hover:scale-105 animate-fadeSlideUp"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="flex flex-col items-center">
                <SparklesIcon className="w-16 h-16 text-yellow-400 mb-3 animate-pulse" />
                <h3 className="text-lg text-blue-200 uppercase tracking-wide mb-1">
                  Độ khó
                </h3>
                <p className="text-3xl font-bold text-white">
                  {currentQuestion?.difficulty}
                </p>
              </div>
            </div>

            {/* Question type */}
            <div
              className="bg-gradient-to-br from-purple-800/70 to-purple-600/70 p-6 rounded-2xl border border-purple-400/30 backdrop-blur-sm shadow-glow transition-transform hover:scale-105 animate-fadeSlideUp"
              style={{ animationDelay: "0.8s" }}
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 flex items-center justify-center mb-3">
                  {currentQuestion?.questionType == "multiple_choice" ? (
                    <DocumentTextIcon className="w-16 h-16 text-purple-200 animate-pulse" />
                  ) : (
                    <QuestionMarkCircleIcon className="w-16 h-16 text-gray-300 animate-pulse" />
                  )}
                </div>
                <h3 className="text-lg text-purple-200 uppercase tracking-wide mb-1">
                  Loại câu hỏi
                </h3>
                <p className="text-3xl font-bold text-white">
                  {currentQuestion?.questionType === "multiple_choice"
                    ? "Trắc nghiệm"
                    : "Tự luận"}
                </p>
              </div>
            </div>

            {/* Topic */}
            <div
              className="bg-gradient-to-br from-indigo-800/70 to-indigo-600/70 p-6 rounded-2xl border border-indigo-400/30 backdrop-blur-sm shadow-glow transition-transform hover:scale-105 animate-fadeSlideUp"
              style={{ animationDelay: "1s" }}
            >
              <div className="flex flex-col items-center">
                <TagIcon className="w-16 h-16 text-indigo-200 mb-3 animate-pulse" />
                <h3 className="text-lg text-indigo-200 uppercase tracking-wide mb-1">
                  Chủ đề
                </h3>
                <p className="text-3xl font-bold text-white text-center">
                  {currentQuestion?.questionTopicName}
                </p>
              </div>
            </div>
          </div>

          {/* Ready message */}
          {/* <div
              className="text-center mt-16 animate-fadeIn invisible"
              style={{ animationDelay: "1.5s" }}
            >
              <p className="text-xl text-white/80 mb-6">
                Chuẩn bị cho câu hỏi tiếp theo...
              </p>
              <div className="inline-block relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse blur-md"></div>
                <button
                  onClick={() => setShowIntro(false)}
                  className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-bold text-lg transition-all hover:scale-105 hover:shadow-xl"
                >
                  SẴN SÀNG
                </button>
              </div>
            </div> */}
        </div>
      </div>
    </>
  );
};

export default Intro;
