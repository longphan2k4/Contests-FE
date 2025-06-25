import { type SceenControl } from "../type/control.type";

interface StatusControlProp {
  isConnected: boolean;
  screenControl: SceenControl | null;
}

const StatusControl: React.FC<StatusControlProp> = ({
  isConnected,
  screenControl,
}) => {
  const controlKeyTextMap: Record<
    | "background"
    | "question"
    | "questionInfo"
    | "answer"
    | "matchDiagram"
    | "explanation"
    | "firstPrize"
    | "secondPrize"
    | "thirdPrize"
    | "fourthPrize"
    | "impressiveVideo"
    | "excellentVideo"
    | "allPrize"
    | "topWin"
    | "listEliminated"
    | "listRescued"
    | "video"
    | "audio"
    | "image",
    { color: string; label: string }
  > = {
    background: { color: "text-gray-600", label: "background" },
    question: { color: "text-blue-600", label: "câu hỏi" },
    questionInfo: { color: "text-cyan-600", label: "thông tin câu hỏi" },
    answer: { color: "text-green-600", label: "đáp án" },
    matchDiagram: { color: "text-purple-600", label: "sơ đồ trận" },
    explanation: { color: "text-indigo-600", label: "giải thích" },
    firstPrize: { color: "text-yellow-500", label: "giải nhất" },
    secondPrize: { color: "text-yellow-400", label: "giải nhì" },
    thirdPrize: { color: "text-yellow-300", label: "giải ba" },
    fourthPrize: { color: "text-yellow-200", label: "giải tư" },
    impressiveVideo: { color: "text-pink-600", label: "video ấn tượng" },
    excellentVideo: { color: "text-pink-500", label: "video xuất sắc" },
    allPrize: { color: "text-yellow-600", label: "tổng kết giải" },
    topWin: { color: "text-lime-600", label: "top chiến thắng" },
    listEliminated: { color: "text-red-600", label: "bị loại" },
    listRescued: { color: "text-orange-600", label: "dược cứu" },
    video: { color: "text-teal-600", label: "video" },
    audio: { color: "text-amber-600", label: "âm thanh" },
    image: { color: "text-pink-400", label: "hình ảnh" },
  };

  const control = screenControl?.controlKey as keyof typeof controlKeyTextMap;
  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 tracking-tight mb-4">
        Trạng thái điều khiển
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-green-100 p-4 rounded-lg border border-green-200">
          <h3 className="text-green-800 font-medium mb-1">Socket.IO</h3>
          <p className="text-green-700 text-sm">
            {isConnected === true ? `Đã kết nối ` : "Chưa kết nối"}
          </p>
        </div>
        <div className="bg-indigo-100 p-4 rounded-lg border border-indigo-200">
          <h3 className="text-indigo-800 font-medium mb-1">Đang chiếu</h3>
          <p
            className={`text-indigo-700 text-sm font-semibold ${controlKeyTextMap[control]?.color}`}
          >
            Màn hình {controlKeyTextMap[control]?.label || "Không xác định"}
          </p>
        </div>
      </div>
    </div>
  );
};
export default StatusControl;
