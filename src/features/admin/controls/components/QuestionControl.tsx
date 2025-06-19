import React, { useState } from "react";
import { PlayIcon, PauseIcon } from "@heroicons/react/24/outline";
import { type CurrentQuestion } from "../type/control.type";
interface QuestionControlProp {
  currentQuestion?: CurrentQuestion;
  remainingTime?: number;
}

const QuestionControl: React.FC<QuestionControlProp> = ({ remainingTime }) => {
  const [timerStatus, setTimerStatus] = useState<"running" | "paused">(
    "paused"
  );
  const [timeRemaining, setTimeRemaining] = useState<number>(30);
  const [inputTime, setInputTime] = useState<number>(30);

  const handleClick = (action?: string) => {
    switch (action) {
      case "start":
        setTimerStatus("running");
        break;
      case "pause":
        setTimerStatus("paused");
        break;
      case "restart":
        setTimeRemaining(inputTime);
        setTimerStatus("paused");
        break;
      case "update":
        setTimeRemaining(inputTime);
        break;
      default:
        // handle other buttons if needed
        break;
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Điều khiển câu hỏi
      </h2>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <button
          className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 shadow-md font-medium"
          onClick={() => handleClick("intro")}
        >
          Intro
        </button>
        <button
          className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 shadow-md font-medium"
          onClick={() => handleClick("show")}
        >
          Show
        </button>
        <button
          className={`px-4 py-3 ${
            timerStatus === "running"
              ? "bg-orange-500 hover:bg-orange-600"
              : "bg-green-500 hover:bg-green-600"
          } text-white rounded-lg shadow-md font-medium flex items-center justify-center gap-2`}
          onClick={() =>
            handleClick(timerStatus === "running" ? "pause" : "start")
          }
        >
          {timerStatus === "running" ? (
            <>
              <PauseIcon className="h-5 w-5" />
              Pause
            </>
          ) : (
            <>
              <PlayIcon className="h-5 w-5" />
              Start
            </>
          )}
        </button>
      </div>

      <div className="flex flex-wrap mb-4">
        <div className="grid grid-cols-2 items-center w-full mb-4 gap-3">
          <div className="text-center">
            <span className="text-7xl font-bold text-red-600">
              {remainingTime}
            </span>
          </div>
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 shadow-md font-medium w-full"
            onClick={() => handleClick("restart")}
          >
            Restart
          </button>
        </div>

        <div className="flex gap-2 w-full mb-4 flex-col">
          <div className="flex gap-2 w-full">
            <input
              className="p-3 w-1/2 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-sm placeholder-gray-400"
              type="number"
              min={0}
              placeholder="Nhập thời gian"
              value={inputTime}
              onChange={e => setInputTime(Number(e.target.value))}
            />
            <button
              className="px-4 py-2 bg-gray-500 text-white hover:bg-gray-600 shadow-md font-medium w-1/2 rounded-lg"
              onClick={() => handleClick("update")}
            >
              Update
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <h3 className="col-span-3 text-xl font-semibold text-gray-700 mb-3">
          Điều khiển video/Audio
        </h3>

        <button
          className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 shadow-md font-medium flex items-center justify-center"
          title="Play"
          onClick={() => handleClick("videoPlay")}
        >
          <PlayIcon className="h-5 w-5" />
        </button>

        <button
          className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 shadow-md font-medium flex items-center justify-center"
          title="Pause"
          onClick={() => handleClick("videoPause")}
        >
          <PauseIcon className="h-5 w-5" />
        </button>

        <button
          className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 shadow-md font-medium flex items-center justify-center"
          title="Restart"
          onClick={() => handleClick("videoRestart")}
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
          onClick={() => handleClick("videoOpen")}
        >
          Open
        </button>

        <button
          className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 shadow-md font-medium flex items-center justify-center"
          title="Close Video"
          onClick={() => handleClick("videoClose")}
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
  );
};

export default QuestionControl;
