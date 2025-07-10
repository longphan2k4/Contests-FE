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
  return (
    <div>
      <div
        className="block text-center w-full btn bg-red-500 hover:bg-red-600 cursor-pointer text-white font-bold p-2 rounded-lg"
        onClick={handleShowChart}
      >
        Hiển thị biểu đồ thống kê
      </div>
    </div>
  );
};

export default ChartControl;
