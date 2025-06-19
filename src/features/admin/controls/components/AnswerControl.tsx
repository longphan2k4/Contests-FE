import React from "react";
import { PlayIcon, PauseIcon } from "@heroicons/react/24/solid";
import { type CurrentQuestion } from "../type/control.type";
interface AnswerControlType {
  currentQuestion: CurrentQuestion | null;
}

const AnswerControl: React.FC<AnswerControlType> = ({ currentQuestion }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Điều khiển đáp án
      </h2>

      <div className="mb-6 text-center">
        <span className="text-3xl max-w-[35vw] font-bold text-red-600 bg-gray-50 px-6 py-3 rounded-lg shadow-md line-clamp-1">
          {currentQuestion?.correctAnswer}
        </span>
      </div>

      <div className="text-center">
        <button className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md font-medium w-full mb-4">
          Kết quả
        </button>

        <div className="grid grid-cols-3 gap-2">
          <h3 className="col-span-3 text-xl font-semibold text-gray-700 mb-3">
            Điều khiển video/Audio
          </h3>

          <button
            className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 shadow-md font-medium flex items-center justify-center"
            title="Play"
          >
            <PlayIcon className="h-5 w-5" />
          </button>

          <button
            className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 shadow-md font-medium flex items-center justify-center"
            title="Pause"
          >
            <PauseIcon className="h-5 w-5" />
          </button>

          <button
            className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 shadow-md font-medium flex items-center justify-center"
            title="Restart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M20.015 5.25v4.99"
              />
            </svg>
          </button>

          <button
            className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 shadow-md font-medium flex items-center justify-center"
            title="Open Video"
          >
            Open
          </button>

          <button
            className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 shadow-md font-medium flex items-center justify-center"
            title="Close Video"
          >
            Close
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 ml-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnswerControl;
