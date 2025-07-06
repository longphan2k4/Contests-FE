import React from "react";
import type { Contestant, TabType } from "../../types/contestant";

interface ContestantListProps {
  activeTab: TabType;
  contestants: Contestant[];
  selectedIds: string[];
  handleButtonClick: (id: string) => void;
  selectAll: (status: "in_progress" | "confirmed1") => void;
  deselectAll: (status: "in_progress" | "confirmed1") => void;
  handleConfirm1: () => void;
  handleRevoke: () => void;
  handleConfirm2: () => void;
  handleChot: () => void;
  chotDisabled: boolean;
  questionOrder: number;
}

const ContestantList: React.FC<ContestantListProps> = ({
  activeTab,
  contestants,
  selectedIds,
  handleButtonClick,
  selectAll,
  deselectAll,
  handleConfirm1,
  handleRevoke,
  handleConfirm2,
  handleChot,
  chotDisabled,
  questionOrder,
}) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center bg-blue-50 p-4 rounded-xl border border-blue-200">
        <h2 className="text-lg sm:text-2xl font-bold text-blue-900 mb-1 sm:mb-2 flex items-center justify-center space-x-1 sm:space-x-2">
          <span>
            {activeTab === "Đang thi"
              ? "📝"
              : activeTab === "Xác nhận 1"
              ? "⚠️"
              : "❌"}
          </span>
          <span>
            {activeTab === "Đang thi"
              ? "Danh sách thí sinh đang thi"
              : activeTab === "Xác nhận 1"
              ? `Thí sinh đã chọn - Câu ${questionOrder}`
              : `Thí sinh bị loại - Câu ${questionOrder}`}
          </span>
        </h2>
        <p className="text-blue-700 text-xs sm:text-base font-medium">
          {activeTab === "Đang thi"
            ? "Chọn thí sinh để chuyển sang xác nhận"
            : activeTab === "Xác nhận 1"
            ? "Chọn để thu hồi hoặc loại thí sinh"
            : "Danh sách thí sinh đã bị loại"}
        </p>
      </div>

      {activeTab === "Đang thi" && (
        <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-10 lg:grid-cols-10 gap-3 sm:gap-4 mb-6 sm:mb-8 touch-action-manipulation">
          {contestants.map(contestant => {
            const isSelected = selectedIds.includes(
              contestant.registrationNumber
            );
            const isInProgress = contestant.status === "in_progress";

            return (
              <button
                key={contestant.registrationNumber}
                className={`${
                  !isInProgress ? "invisible" : ""
                } relative px-3 xs:px-4 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-lg transition-all duration-300 transform flex items-center justify-center ${
                  isSelected 
                    ? 'bg-blue-700 text-white border-2 border-blue-800 shadow-lg scale-105' 
                    : 'bg-white text-blue-700 border-2 border-blue-300 hover:bg-blue-50 hover:border-blue-400 shadow-md'
                }`}
                onClick={() => handleButtonClick(contestant.registrationNumber)}
                aria-label={`Chọn thí sinh ${contestant.registrationNumber}`}
              >
                <span className="text-sm xs:text-sm sm:text-base font-semibold">
                  {contestant.registrationNumber}
                </span>
                {isSelected && (
                  <span className="absolute -top-1 -right-1 text-xs bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {activeTab === "Xác nhận 1" && (
        <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-10 lg:grid-cols-10 gap-3 sm:gap-4 mb-6 sm:mb-8 touch-action-manipulation">
          {contestants.map(contestant => {
            const isSelected = selectedIds.includes(
              contestant.registrationNumber
            );
            const isConfirmed1 = contestant.status === "confirmed1";

            return (
              <button
                key={contestant.registrationNumber}
                className={`${
                  !isConfirmed1 ? "invisible" : ""
                } relative px-3 xs:px-4 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-lg transition-all duration-300 transform flex items-center justify-center ${
                  isSelected 
                    ? 'bg-yellow-500 text-white border-2 border-yellow-600 shadow-lg scale-105' 
                    : 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300 hover:bg-yellow-200 hover:border-yellow-400 shadow-md'
                }`}
                onClick={() => handleButtonClick(contestant.registrationNumber)}
                aria-label={`Chọn thí sinh ${contestant.registrationNumber}`}
              >
                <span className="text-sm xs:text-sm sm:text-base font-semibold">
                  {contestant.registrationNumber}
                </span>
                {isSelected && (
                  <span className="absolute -top-1 -right-1 text-xs bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {activeTab === "Xác nhận 2" && (
        <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-10 lg:grid-cols-10 gap-3 sm:gap-4 mb-6 sm:mb-8 touch-action-manipulation">
          {contestants.map(contestant => {
            const isSelected = selectedIds.includes(
              contestant.registrationNumber
            );
            const isConfirmed2 = contestant.status === "confirmed2";

            return (
              <button
                key={contestant.registrationNumber}
                className={`${
                  !isConfirmed2 ? "invisible" : ""
                } relative px-3 xs:px-4 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-lg transition-all duration-300 transform flex items-center justify-center ${
                  isSelected 
                    ? 'bg-red-600 text-white border-2 border-red-700 shadow-lg scale-105' 
                    : 'bg-red-100 text-red-800 border-2 border-red-300 hover:bg-red-200 hover:border-red-400 shadow-md'
                }`}
                onClick={() => handleButtonClick(contestant.registrationNumber)}
                aria-label={`Chọn thí sinh ${contestant.registrationNumber}`}
              >
                <span className="text-sm xs:text-sm sm:text-base font-semibold">
                  {contestant.registrationNumber}
                </span>
                {isSelected && (
                  <span className="absolute -top-1 -right-1 text-xs bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                    ✓
                  </span>
                )}
              </button>
            );
          })}

          <div className="col-span-full flex justify-center mt-4">
            <button
              className={`px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[80px] xs:min-w-[100px] sm:min-w-[120px] text-[11px] xs:text-sm sm:text-base border-2 ${
                chotDisabled
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300"
                  : "bg-white text-red-700 border-red-300 hover:bg-red-50 hover:border-red-400"
              }`}
              disabled={chotDisabled}
              onClick={handleChot}
              aria-label="Xác nhận 1 danh sách thí sinh"
            >
              ⚠️ Xác nhận danh sách
            </button>
          </div>
        </div>
      )}

      {activeTab !== "Xác nhận 2" && (
        <div className="flex justify-center space-x-2 sm:space-x-4 flex-wrap gap-y-3 gap-x-3 xs:gap-x-4 sm:gap-x-6">
          <button
            className="px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 bg-white text-green-700 font-semibold rounded-xl border-2 border-green-300 hover:bg-green-50 hover:border-green-400 transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[80px] xs:min-w-[100px] sm:min-w-[120px] text-[11px] xs:text-sm sm:text-base"
            onClick={() => {
              const status =
                activeTab === "Đang thi"
                  ? "in_progress"
                  : activeTab === "Xác nhận 1"
                  ? "confirmed1"
                  : null;
              if (status) selectAll(status);
            }}
            aria-label={`Chọn tất cả thí sinh ${
              activeTab === "Đang thi" ? "đang thi" : "xác nhận 1"
            }`}
          >
            🟢 Chọn hết
          </button>
          <button
            className="px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 bg-white text-blue-700 font-semibold rounded-xl border-2 border-blue-300 hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[80px] xs:min-w-[100px] sm:min-w-[120px] text-[11px] xs:text-sm sm:text-base"
            onClick={() => {
              const status =
                activeTab === "Đang thi"
                  ? "in_progress"
                  : activeTab === "Xác nhận 1"
                  ? "confirmed1"
                  : null;
              if (status) deselectAll(status);
            }}
            aria-label={`Bỏ chọn tất cả thí sinh ${
              activeTab === "Đang thi" ? "đang thi" : "xác nhận 1"
            }`}
          >
            ⚪ Bỏ chọn
          </button>

          {activeTab === "Đang thi" && (
            <button
              className={`px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[80px] xs:min-w-[100px] sm:min-w-[120px] text-[11px] xs:text-sm sm:text-base border-2 ${
                chotDisabled
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300"
                  : "bg-white text-red-700 border-red-300 hover:bg-red-50 hover:border-red-400"
              }`}
              disabled={chotDisabled}
              onClick={handleConfirm1}
              aria-label="Xác nhận 1 danh sách thí sinh"
            >
              ⚠️ Xác nhận 1
            </button>
          )}

          {activeTab === "Xác nhận 1" && (
            <>
              <button
                className="px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 font-semibold rounded-xl bg-white text-yellow-700 border-2 border-yellow-300 hover:bg-yellow-50 hover:border-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[80px] xs:min-w-[100px] sm:min-w-[120px] text-[11px] xs:text-sm sm:text-base"
                onClick={handleRevoke}
                aria-label="Thu hồi lựa chọn thí sinh"
              >
                ↩️ Thu hồi
              </button>
              <button
                className={`px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[80px] xs:min-w-[100px] sm:min-w-[120px] text-[11px] xs:text-sm sm:text-base border-2 ${
                  chotDisabled
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300"
                    : "bg-white text-red-700 border-red-300 hover:bg-red-50 hover:border-red-400"
                }`}
                disabled={chotDisabled}
                onClick={handleConfirm2}
                aria-label="Xác nhận 2 danh sách thí sinh"
              >
                ❌ Xác nhận 2
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ContestantList;