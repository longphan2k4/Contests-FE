import React from "react";
import { useToast } from "../../../../contexts/toastContext";
import { useSocket } from "../../../../contexts/SocketContext";

import { useParams } from "react-router-dom";
import { type UpdateSceenControl } from "../type/control.type";

const BackgroundControl: React.FC = () => {
  const { socket } = useSocket();
  const { showToast } = useToast();
  const { match } = useParams();

  const EmitScreenUpdate = (payload: UpdateSceenControl) => {
    if (!socket || !match) return;

    socket.emit("screen:update", { match, ...payload }, (_response: any) => {});
    showToast("Cập nhật màn hình thành công", "success");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Điều khiển hiển thị
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <button
          onClick={() =>
            EmitScreenUpdate({
              controlKey: "background",
            })
          }
          className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md font-medium"
        >
          Màn hình chờ
        </button>

        <button
          onClick={() => window.open(`/tran-dau/${match}`, "_blank")}
          className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-md font-medium"
        >
          Màn hình chiếu
        </button>
        {/* <button className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md font-medium">
          Bắt đầu
        </button>
        <button className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md font-medium">
          Kết thúc
        </button> */}
      </div>
    </div>
  );
};

export default BackgroundControl;
