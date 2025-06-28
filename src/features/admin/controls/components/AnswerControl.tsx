import React from "react";
import {
  type CurrentQuestion,
  type UpdateSceenControl,
} from "../type/control.type";
import { useSocket } from "../../../../contexts/SocketContext";
import { useToast } from "../../../../contexts/toastContext";
import { useParams } from "react-router-dom";
interface AnswerControlType {
  currentQuestion: CurrentQuestion | null;
}

const AnswerControl: React.FC<AnswerControlType> = ({ currentQuestion }) => {
  const { socket } = useSocket();
  const { showToast } = useToast();
  const { match } = useParams();

  const EmitScreenUpdate = (payload: UpdateSceenControl) => {
    if (!socket || !match) return;

    socket.emit("screen:update", { match, ...payload }, (err: any) => {
      if (err) {
        showToast(err.message, "error");
      } else {
        showToast("Đã chuyển sang màn hình đáp án ", "success");
      }
    });
  };
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Điều khiển đáp án
      </h2>

      <div className="mb-6 text-center">
        <span className="text-3xl max-w-[35vw] font-bold text-red-600 bg-gray-50 px-6 py-3 rounded-lg shadow-md line-clamp-1 truncate">
          {currentQuestion?.correctAnswer}
        </span>
      </div>

      <div
        className="text-center"
        onClick={() => EmitScreenUpdate({ controlKey: "answer" })}
      >
        <button className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md font-medium w-full mb-4">
          Kết quả
        </button>
      </div>
    </div>
  );
};

export default AnswerControl;
