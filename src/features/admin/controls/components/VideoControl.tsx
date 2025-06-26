import React from "react";
import { type MediaType, type UpdateSceenControl } from "../type/control.type";
import { useParams } from "react-router-dom";
import { useSocket } from "@contexts/SocketContext";
import { useToast } from "@contexts/toastContext";

interface VideoControlProps {
  sponsorMedia: MediaType[];
  classVideo: MediaType[];
  controlKey?: string;
}

const VideoControl: React.FC<VideoControlProps> = ({
  sponsorMedia,
  classVideo,
  controlKey,
}) => {
  const [activeTab, setActiveTab] = React.useState<"sponsor" | "classVideo">(
    "sponsor"
  );

  const { match } = useParams();
  const { socket } = useSocket();
  const { showToast } = useToast();

  const EmitScreenUpdate = () => {
    if (!socket || !match) return;
    socket.emit(
      "screen:update",
      { match, controlKey: "video", media: select },
      (err: any) => {
        if (err) {
          showToast(err.message, "error");
          return;
        }
        showToast("Cập nhật màn hình thành công", "success");
      }
    );
  };

  const EmitControlVideo = (
    control: "start" | "pause" | "reset",
    msg: string
  ) => {
    if (!socket || !match) return;

    if (controlKey !== "video") {
      showToast("Vui lòng hiển thị video trước", "error");
      return;
    }

    if (!control) return;

    let payload: UpdateSceenControl = {
      controlValue: control,
    };

    socket.emit("screen:update", { match, ...payload }, (err: any) => {
      if (err) {
        showToast(err.message, "error");
      } else {
        showToast(msg, "success");
      }
    });
  };

  const [select, setSelect] = React.useState<string | null>(null);

  return (
    <div className="">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Video
      </h2>

      <div className="bg-white rounded-xl border border-gray-100 flex gap-6 max-h-[300px] overflow-hidden">
        <div className="w-1/3 flex flex-col bg-white rounded-xl shadow-md border border-gray-100">
          {/* Tab Header với bo tròn */}
          <div className="flex rounded-t-xl overflow-hidden">
            <button
              className={`flex-1 p-3 text-center font-medium transition-colors rounded-tl-xl ${
                activeTab === "sponsor"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab("sponsor")}
            >
              Video nhà tài trợ
            </button>
            <button
              className={`flex-1 p-3 text-center font-medium transition-colors rounded-tr-xl ${
                activeTab === "classVideo"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab("classVideo")}
            >
              Video lớp
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4 h-[300px] overflow-y-auto">
            {activeTab === "sponsor" ? (
              <ul className="space-y-2">
                {sponsorMedia.length > 0 ? (
                  sponsorMedia.map(media => (
                    <li
                      onClick={() => setSelect(media.videos)}
                      key={`sp-${media.id}`}
                      className="p-3 rounded-lg cursor-pointer bg-gray-200 text-gray-800 hover:bg-gray-300"
                    >
                      {" "}
                      {media.name}
                    </li>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Không có video nhà tài trợ
                  </div>
                )}
              </ul>
            ) : (
              <div className="space-y-2">
                {classVideo.length > 0 ? (
                  classVideo.map(media => (
                    <li
                      onClick={() => setSelect(media.videos)}
                      key={`class-${media.id}`}
                      className="p-3 rounded-lg cursor-pointer bg-gray-200 text-gray-800 hover:bg-gray-300"
                    >
                      {" "}
                      {media.name}
                    </li>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Không có video lớp
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="w-1/3 flex flex-col bg-white rounded-xl shadow-md border border-gray-100">
          <div className="bg-gray-800 text-white p-4 font-bold text-center rounded-t-xl">
            Video Preview
          </div>
          <div className="p-4 flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
              {select ? (
                <video
                  src={select}
                  controls
                  className="w-full max-h-[250px] object-contain rounded-lg"
                ></video>
              ) : (
                <p className="text-gray-500">Chọn video để xem trước</p>
              )}
            </div>
          </div>
        </div>

        {/* Điều khiển */}
        <div className="w-1/3 flex flex-col bg-white rounded-xl shadow-md border border-gray-100">
          <div className="bg-gray-800 text-white p-4 font-bold text-center rounded-t-xl">
            Điều Khiển
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                onClick={EmitScreenUpdate}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-md font-medium"
              >
                Show
              </button>
              <button
                onClick={() =>
                  EmitControlVideo("start", "Play video thành công")
                }
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md font-medium"
              >
                Play
              </button>
              <button
                onClick={() =>
                  EmitControlVideo("pause", "Pause video thành công")
                }
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 shadow-md font-medium"
              >
                Pause
              </button>
              <button
                onClick={() =>
                  EmitControlVideo("reset", "Restart video thành công")
                }
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md font-medium"
              >
                Restart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoControl;
