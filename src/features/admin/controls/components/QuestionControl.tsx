import React, { useEffect, useState } from "react";
import { PlayIcon, PauseIcon } from "@heroicons/react/24/outline";
import {
  type CurrentQuestion,
  type UpdateSceenControl,
} from "../type/control.type";
import { useSocket } from "../../../../contexts/SocketContext";
import { useToast } from "../../../../contexts/toastContext";
import { useParams } from "react-router-dom";

interface QuestionControlProp {
  currentQuestion?: CurrentQuestion;
  remainingTime?: number;
  controlKey?: string;
}

const QuestionControl: React.FC<QuestionControlProp> = ({
  remainingTime,
  controlKey,
}) => {
  // QuestionControl.tsx (Component con)
  const [localTime, setLocalTime] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (typeof remainingTime === "number") {
      setLocalTime(remainingTime);
    }
  }, [remainingTime]);

  const [inputTime, setInputTime] = useState<string>("30");

  const { socket } = useSocket();
  const { showToast } = useToast();
  const { match } = useParams();

  const EmitScreenUpdate = (payload: UpdateSceenControl, msg: string) => {
    if (!socket || !match) return;

    socket.emit("screen:update", { match, ...payload }, (err: any) => {
      if (err) {
        showToast(err.message, "error");
      } else {
        showToast(msg, "success");
      }
    });
  };

  const handlePlay = () => {
    if (!socket || !match) return;

    if (controlKey !== "question") {
      showToast("Vui lòng hiển thị câu hỏi trước", "error");
      return;
    }

    socket.emit("timer:play", { match }, (err: any, res: any) => {
      if (err) {
        showToast(err.message, "error");
      } else {
        showToast(res.message, "success");
      }
    });
  };

  const handlePause = () => {
    if (!socket || !match) return;
    if (controlKey !== "question") {
      showToast("Vui lòng hiển thị câu hỏi trước", "error");
      return;
    }

    socket.emit("timer:pause", { match }, (err: any, res: any) => {
      if (err) {
        showToast(err.message, "error");
      } else {
        showToast(res.message, "success");
      }
    });
  };

  const handleReset = () => {
    if (!socket || !match) return;
    if (controlKey !== "question") {
      showToast("Vui lòng hiển thị câu hỏi trước", "error");
      return;
    }

    socket.emit("timer:reset", { match }, (err: any, res: any) => {
      if (err) {
        showToast(err.message, "error");
      } else {
        showToast(res.message, "success");
      }
    });
  };

  const handleUpdate = () => {
    if (!socket || !match) return;

    socket.emit(
      "timer:update",
      { match, newTime: Number(inputTime) },
      (err: any, res: any) => {
        if (err) {
          showToast(err.message, "error");
        } else {
          showToast(res.message, "success");
        }
      }
    );
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Điều khiển câu hỏi
      </h2>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <button
          className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 shadow-md font-medium"
          onClick={() =>
            EmitScreenUpdate(
              {
                controlKey: "questionInfo",
              },
              "Đã chuyển sang màn hình thông tin câu hỏi"
            )
          }
        >
          Intro
        </button>
        <button
          className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 shadow-md font-medium"
          onClick={() =>
            EmitScreenUpdate(
              {
                controlKey: "question",
              },
              "Đã chuyển sang màn hình câu hỏi"
            )
          }
        >
          Show
        </button>
        <button
          className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 shadow-md font-medium"
          onClick={() =>
            EmitScreenUpdate(
              {
                controlKey: "explanation",
              },
              "Đã chuyển sang màn hình giải thích"
            )
          }
        >
          Explanation
        </button>
      </div>

      <div className="flex flex-wrap mb-4">
        <div className="grid grid-cols-2 items-center w-full mb-4 gap-3">
          <div className="text-center">
            <span className="text-7xl font-bold text-red-600">{localTime}</span>
          </div>
          {/* <button
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 shadow-md font-medium w-full"
            // onClick={() => handleClick("restart")}
          >
            Restart
          </button> */}
        </div>

        <div className="flex gap-2 w-full mb-4 flex-col">
          <div className="flex gap-2 w-full">
            <input
              type="number"
              min={0}
              placeholder="Nhập thời gian"
              value={inputTime}
              onChange={e => setInputTime(e.target.value)}
              className="p-3 w-1/2 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-sm placeholder-gray-400"
            />
            <button
              className="px-4 py-2 bg-gray-500 text-white hover:bg-gray-600 shadow-md font-medium w-1/2 rounded-lg"
              onClick={() => handleUpdate()}
            >
              Update
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <h3 className="col-span-3 text-xl font-semibold text-gray-700 mb-3">
          Điều khiển thời gian
        </h3>

        <button
          className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 shadow-md font-medium flex items-center justify-center"
          title="Play"
          onClick={() => handlePlay()}
        >
          <PlayIcon className="h-5 w-5" />
        </button>

        <button
          className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 shadow-md font-medium flex items-center justify-center"
          title="Pause"
          onClick={() => handlePause()}
        >
          <PauseIcon className="h-5 w-5" />
        </button>

        <button
          className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 shadow-md font-medium flex items-center justify-center"
          title="Restart"
          onClick={() => handleReset()}
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
      </div>
    </div>
  );
};

export default QuestionControl;
