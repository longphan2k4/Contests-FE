import React from "react";
import { useSocket } from "@contexts/SocketContext";
import { useToast } from "@contexts/toastContext";
import { useParams } from "react-router-dom";

const ChartControl: React.FC = ({}) => {
  const { socket } = useSocket();
  const { showToast } = useToast();
  const { match } = useParams();

  const handleShowChart = () => {
    if (!socket) return;

    socket.emit("statistics:update", { match }, (err: any) => {
      if (err) {
        showToast(err.message, "error");
      } else {
        showToast("Hiển thị biểu đồ thành công", "success");
      }
    });
  };

  const handleShowChartContestant = () => {
    if (!socket) return;
    socket.emit("statisticsContestant:update", { match }, (err: any) => {
      if (err) {
        showToast(err.message, "error");
      } else {
        showToast("Hiển thị biểu đồ thí sinh thành công", "success");
      }
    });
  };

  return (
    <div className="flex flex-row gap-2 p-4 bg-white rounded-lg shadow-md">
      <div
        className="block text-center  w-full btn bg-red-500 hover:bg-red-600 cursor-pointer text-white font-bold p-2 rounded-lg"
        onClick={handleShowChart}
      >
        Hiển thị thống kê câu hỏi
      </div>
      <div
        className="block text-center  w-full btn bg-red-500 hover:bg-red-600 cursor-pointer text-white font-bold p-2 rounded-lg"
        onClick={handleShowChartContestant}
      >
        Hiển thị thống kê thí sinh
      </div>
    </div>
  );
};

export default ChartControl;
