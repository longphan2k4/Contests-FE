import React, { useState } from "react";
import { type ListContestant } from "../type/control.type";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useSocket } from "@contexts/SocketContext";
import { useParams } from "react-router-dom";
import { useToast } from "@contexts/toastContext";
interface ContestantProps {
  questionOrder: number;
  ListContestant: ListContestant[];
}

interface UpdateContestantPayload {
  match: string;
  status: string;
  ids: number[];
}
const ContestantsControlUI: React.FC<ContestantProps> = ({
  questionOrder,
  ListContestant,
}) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { socket } = useSocket();
  const { match } = useParams<{ match: string }>();
  const { showToast } = useToast();
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Hàm xử lý class theo status
  const getStatusClass = (status: string) => {
    switch (status) {
      case "not_started":
        return "bg-gray-300 text-gray-700";
      case "in_progress":
        return "bg-blue-500 text-white";
      case "confirmed1":
        return "bg-yellow-400 text-yellow-900";
      case "confirmed2":
        return "bg-orange-500 text-white";
      case "eliminated":
        return "bg-red-500 text-white";
      case "rescued":
        return "bg-green-500 text-white";
      case "banned":
        return "bg-black text-white";
      case "completed":
        return "bg-emerald-500 text-white";
      default:
        return "";
    }
  };

  const EmitContestantUpdate = (status: string) => {
    if (!socket || !match) return;

    const data: UpdateContestantPayload = {
      match: match,
      status: status,
      ids: selectedIds,
    };

    socket.emit("contestant:status-update-admin", data, (err: any) => {
      if (err) {
        showToast(err.message, "error");
      } else {
        showToast(`Cập nhật trạng thái ${status} thành công`, "success");
      }
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-center">Danh sách thí sinh</h2>

      <div className="flex flex-wrap gap-4">
        {ListContestant.map((group) => (
          <div
            key={group.id}
            className={`border-2 ${
              group.confirmCurrentQuestion >= questionOrder
                ? "border-blue-500"
                : "border-red-500"
            } rounded-lg p-3 w-full`}
          >
            <div className="grid grid-cols-10 gap-2">
              {group.contestantMatches.map((contestant) => (
                <button
                  key={contestant.registrationNumber}
                  onClick={() => toggleSelect(contestant.registrationNumber)}
                  className={`relative p-2 rounded-md font-semibold text-sm transition
             ${getStatusClass(contestant.status)}
            `}
                >
                  {contestant.registrationNumber}
                  {selectedIds.includes(contestant.registrationNumber) && (
                    <CheckCircleIcon className="absolute top-0 right-0 h-6 w-6 text-white drop-shadow" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4 flex-wrap ">
        <div className="flex flex-wrap gap-2 flex-row w-full justify-center">
          {ListContestant.map((group) => (
            <button
              key={group.id}
              className={`border-2 ${
                group.confirmCurrentQuestion >= questionOrder
                  ? "border-blue-500"
                  : "border-red-500"
              } rounded-lg p-2`}
            >
              {group.user.username} - {group.contestantMatches.length} thí sinh
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-4 flex-wrap justify-center">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => EmitContestantUpdate("not_started")}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded font-semibold text-sm"
          >
            Chưa bắt đầu
          </button>

          <button
            onClick={() => EmitContestantUpdate("in_progress")}
            className="bg-blue-500 text-white px-4 py-2 rounded font-semibold text-sm"
          >
            Đang thi
          </button>

          <button
            onClick={() => EmitContestantUpdate("confirmed1")}
            className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded font-semibold text-sm"
          >
            Xác nhận 1
          </button>

          <button
            onClick={() => EmitContestantUpdate("confirmed2")}
            className="bg-orange-500 text-white px-4 py-2 rounded font-semibold text-sm"
          >
            Xác nhận 2
          </button>

          <button
            onClick={() => EmitContestantUpdate("eliminated")}
            className="bg-red-500 text-white px-4 py-2 rounded font-semibold text-sm"
          >
            Loại
          </button>

          <button
            onClick={() => EmitContestantUpdate("rescued")}
            className="bg-green-500 text-white px-4 py-2 rounded font-semibold text-sm"
          >
            Cứu trợ
          </button>

          <button
            onClick={() => EmitContestantUpdate("banned")}
            className="bg-black text-white px-4 py-2 rounded font-semibold text-sm"
          >
            Bị cấm
          </button>

          <button
            onClick={() => EmitContestantUpdate("completed")}
            className="bg-emerald-500 text-white px-4 py-2 rounded font-semibold text-sm"
          >
            Qua vòng
          </button>
          <button
            onClick={() => setSelectedIds([])}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Bỏ chọn
          </button>
          <button
            onClick={() =>
              setSelectedIds(
                ListContestant.flatMap((group) =>
                  group.contestantMatches.map(
                    (contestant) => contestant.registrationNumber
                  )
                )
              )
            }
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Chọn tất cả
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContestantsControlUI;
