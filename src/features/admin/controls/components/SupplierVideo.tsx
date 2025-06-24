import React, { useState, useEffect } from "react";
import {
  type CurrentQuestion,
  type MediaFile,
  type UpdateSceenControl,
} from "../type/control.type";
import { useSocket } from "@contexts/SocketContext";
import { useParams } from "react-router-dom";
import { useToast } from "@contexts/toastContext";

interface SupplierVideoProps {
  currentQuestion?: CurrentQuestion | null;
}

interface fileMedia {
  url: string;
  type: string;
}

const SupplierVideo: React.FC<SupplierVideoProps> = ({ currentQuestion }) => {
  const { match } = useParams();
  const [activeTab, setActiveTab] = useState<"question" | "answer">("question");
  const [selectedMedia, setSelectedMedia] = useState<fileMedia | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoThumbnails, setVideoThumbnails] = useState<
    Record<string, string>
  >({});

  const getMediaArray = (
    media: MediaFile[] | string | null | undefined
  ): MediaFile[] => {
    if (!media) return [];

    if (typeof media === "string") {
      // Nếu là string, chuyển thành array MediaFile
      return [
        {
          url: media,
          filename: media.split("/").pop() || "unknown",
          size: 0,
          type: "unknown",
          mimeType: "unknown",
        },
      ];
    }

    if (Array.isArray(media)) {
      return media;
    }

    return [];
  };

  const { socket } = useSocket();
  const { showToast } = useToast();

  const EmitScreenUpdate = () => {
    if (!socket || !match) return;

    let payload: UpdateSceenControl = {};

    if (selectedMedia?.type === "image") {
      payload = {
        controlKey: "image",
        media: selectedMedia.url,
      };
    }
    if (selectedMedia?.type === "video") {
      payload = {
        controlKey: "video",
        media: selectedMedia.url,
      };
    }

    socket.emit("screen:update", { match, ...payload }, () => {
      showToast("Cập nhật màn hình thành công", "success");
    });
  };

  const EmitControlVideo = (
    control: "start" | "pause" | "reset",
    msg: string
  ) => {
    if (!socket || !match) return;

    if (!control) return;

    let payload: UpdateSceenControl = {
      controlValue: control,
    };

    socket.emit("screen:update", { match, ...payload }, () => {
      showToast(msg, "success");
    });
  };

  const questionMedia = getMediaArray(currentQuestion?.questionMedia);
  const mediaAnswer = getMediaArray(currentQuestion?.mediaAnswer);

  // Tạo thumbnail từ video
  const generateVideoThumbnail = (videoUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      video.crossOrigin = "anonymous";
      video.currentTime = 1; // Lấy frame ở giây thứ 1

      video.onloadeddata = () => {
        canvas.width = video.videoWidth || 320;
        canvas.height = video.videoHeight || 240;

        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnailUrl = canvas.toDataURL("image/jpeg", 0.7);
          resolve(thumbnailUrl);
        } else {
          reject(new Error("Cannot get canvas context"));
        }
      };

      video.onerror = () => reject(new Error("Error loading video"));
      video.src = videoUrl;
      video.load();
    });
  };

  // Load thumbnail cho video khi component mount
  const loadVideoThumbnails = async () => {
    const allMedia = [...questionMedia, ...mediaAnswer];
    const videoFiles = allMedia.filter(media =>
      /\.(mp4|avi|mov|wmv|flv|webm)$/i.test(media.url)
    );

    const thumbnailPromises = videoFiles.map(async media => {
      try {
        const thumbnail = await generateVideoThumbnail(media.url);
        return { url: media.url, thumbnail };
      } catch (error) {
        console.error("Error generating thumbnail for", media.url, error);
        return null;
      }
    });

    const thumbnails = await Promise.all(thumbnailPromises);
    const thumbnailMap: Record<string, string> = {};

    thumbnails.forEach(result => {
      if (result) {
        thumbnailMap[result.url] = result.thumbnail;
      }
    });

    setVideoThumbnails(thumbnailMap);
  };

  // Load thumbnails khi media thay đổi
  useEffect(() => {
    if (questionMedia.length > 0 || mediaAnswer.length > 0) {
      loadVideoThumbnails();
    }
  }, [currentQuestion?.questionMedia, currentQuestion?.mediaAnswer]);

  const handleMediaSelect = (data: fileMedia) => {
    setSelectedMedia(data);
  };

  const handleClearPreview = () => {
    setSelectedMedia(null);
  };

  const handleOpenModal = () => {
    if (selectedMedia) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const renderMediaThumbnail = (mediaFile: MediaFile, label: string) => {
    const mediaUrl = mediaFile.url;
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(mediaUrl);
    const isVideo = /\.(mp4|avi|mov|wmv|flv|webm)$/i.test(mediaUrl);

    return (
      <div
        key={`${mediaFile.filename}-${Date.now()}`}
        className="p-2 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-200"
        onClick={() =>
          handleMediaSelect({ type: mediaFile.type, url: mediaUrl })
        }
      >
        {isImage ? (
          <div className="flex flex-col items-center">
            <img
              src={mediaUrl}
              alt={label}
              className="w-16 h-16 object-cover rounded mb-2"
            />
            <span className="text-xs text-gray-600 truncate max-w-full">
              {mediaFile.filename}
            </span>
          </div>
        ) : isVideo ? (
          <div className="flex flex-col items-center">
            {videoThumbnails[mediaUrl] ? (
              <div className="relative">
                <img
                  src={videoThumbnails[mediaUrl]}
                  alt={label}
                  className="w-16 h-16 object-cover rounded mb-2"
                />
                {/* Play icon overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-50 rounded-full p-1">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-16 h-16 bg-blue-100 rounded flex items-center justify-center mb-2">
                <svg
                  className="w-8 h-8 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            )}
            <span className="text-xs text-gray-600 truncate max-w-full">
              {mediaFile.filename}
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center mb-2">
              <svg
                className="w-8 h-8 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-xs text-gray-600 truncate max-w-full">
              {mediaFile.filename}
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderPreview = () => {
    if (!selectedMedia) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
          <p className="text-gray-500">Chọn media để xem trước</p>
        </div>
      );
    }

    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(selectedMedia.url);
    const isVideo = /\.(mp4|avi|mov|wmv|flv|webm)$/i.test(selectedMedia.url);

    return (
      <div className="relative w-full h-full group">
        {/* Nút xóa preview */}
        <button
          onClick={handleClearPreview}
          className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
          title="Xóa preview"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Nút phóng to */}
        <button
          onClick={handleOpenModal}
          className="absolute top-2 left-2 z-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1 transition-colors opacity-0 group-hover:opacity-100"
          title="Phóng to"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
            />
          </svg>
        </button>

        {isImage ? (
          <img
            src={selectedMedia.url}
            alt="Preview"
            className="w-full h-full object-contain rounded-lg cursor-pointer"
            onClick={handleOpenModal}
          />
        ) : isVideo ? (
          <video
            src={selectedMedia.url}
            controls
            className="w-full h-full rounded-lg object-contain"
          >
            Trình duyệt không hỗ trợ video
          </video>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
            <p className="text-gray-500">Không thể xem trước định dạng này</p>
          </div>
        )}
      </div>
    );
  };

  const renderModal = () => {
    if (!isModalOpen || !selectedMedia) return null;

    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(selectedMedia.url);
    const isVideo = /\.(mp4|avi|mov|wmv|flv|webm)$/i.test(selectedMedia.url);

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
        onClick={handleCloseModal}
      >
        <div
          className="relative max-w-2xl max-h-2xl p-4"
          onClick={e => e.stopPropagation()}
        >
          {/* Nút đóng modal */}
          <button
            onClick={handleCloseModal}
            className="absolute top-2 right-2 z-20 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
            title="Đóng"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {isImage ? (
            <img
              src={selectedMedia.url}
              alt="Preview phóng to"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          ) : isVideo ? (
            <video
              src={selectedMedia.url}
              controls
              autoPlay
              className="max-w-full max-h-full rounded-lg"
            >
              Trình duyệt không hỗ trợ video
            </video>
          ) : (
            <div className="w-96 h-96 flex items-center justify-center bg-gray-100 rounded-lg">
              <p className="text-gray-500">Không thể xem trước định dạng này</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Media Câu Hỏi
      </h2>

      <div className="bg-white rounded-xl border border-gray-100 flex gap-6">
        {/* Danh sách media với tabs */}
        <div className="w-1/3 flex flex-col bg-white rounded-xl shadow-md border border-gray-100">
          {/* Tab Header với bo tròn */}
          <div className="flex rounded-t-xl overflow-hidden">
            <button
              className={`flex-1 p-3 text-center font-medium transition-colors rounded-tl-xl ${
                activeTab === "question"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab("question")}
            >
              Media Câu Hỏi
            </button>
            <button
              className={`flex-1 p-3 text-center font-medium transition-colors rounded-tr-xl ${
                activeTab === "answer"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab("answer")}
            >
              Media Đáp Án
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4 h-[300px] overflow-y-auto">
            {activeTab === "question" ? (
              <div className="space-y-2">
                {questionMedia.length > 0 ? (
                  questionMedia.map(media =>
                    renderMediaThumbnail(media, "Câu hỏi")
                  )
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Không có media câu hỏi
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {mediaAnswer.length > 0 ? (
                  mediaAnswer.map(media =>
                    renderMediaThumbnail(media, "Đáp án")
                  )
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Không có media đáp án
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="w-1/3 flex flex-col bg-white rounded-xl shadow-md border border-gray-100">
          <div className="bg-gray-800 text-white p-4 font-bold text-center rounded-t-xl">
            Preview
          </div>
          <div className="p-4 h-[350px] flex flex-col">{renderPreview()}</div>
        </div>

        {/* Điều khiển */}
        <div className="w-1/3 flex flex-col bg-white rounded-xl shadow-md border border-gray-100">
          <div className="bg-gray-800 text-white p-4 font-bold text-center rounded-t-xl">
            Điều Khiển Media
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                onClick={EmitScreenUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md font-medium"
              >
                Show
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-md font-medium">
                Hiện Đáp Án
              </button>
              <button
                onClick={() =>
                  EmitControlVideo("start", "Start video thành công")
                }
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 shadow-md font-medium"
              >
                Play
              </button>
              <button
                onClick={() =>
                  EmitControlVideo("pause", "Pause video thành công")
                }
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 shadow-md font-medium"
              >
                Pause
              </button>
              <button
                onClick={() =>
                  EmitControlVideo("reset", "Reset video thành công")
                }
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md font-medium"
              >
                Reset
              </button>
              <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 shadow-md font-medium">
                Ẩn
              </button>
            </div>
            {selectedMedia && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-2">Media đã chọn:</p>
                <p className="text-sm font-medium truncate">
                  {selectedMedia.url}
                </p>
                <button
                  onClick={handleClearPreview}
                  className="mt-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-colors"
                >
                  Xóa preview
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {renderModal()}
    </div>
  );
};

export default SupplierVideo;
