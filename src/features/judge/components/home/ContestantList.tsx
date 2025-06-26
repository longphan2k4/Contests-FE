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
      <div className="text-center">
        <h2 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2 flex items-center justify-center space-x-1 sm:space-x-2">
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
        <p className="text-white/70 text-xs sm:text-base">
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
                } px-3 xs:px-4 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-lg transition-all duration-300 transform flex items-center justify-center space-x-2 bg-blue-500 text-white hover:bg-blue-400`}
                onClick={() => handleButtonClick(contestant.registrationNumber)}
                aria-label={`Chọn thí sinh ${contestant.registrationNumber}`}
              >
                <span className="text-sm xs:text-sm sm:text-base font-semibold">
                  {contestant.registrationNumber}
                </span>
                {isSelected && (
                  <span className="text-sm xs:text-sm sm:text-base">✅</span>
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
                } px-3 xs:px-4 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-lg transition-all duration-300 transform flex items-center justify-center space-x-2 bg-yellow-400 text-yellow-900 hover:bg-yellow-300`}
                onClick={() => handleButtonClick(contestant.registrationNumber)}
                aria-label={`Chọn thí sinh ${contestant.registrationNumber}`}
              >
                <span className="text-sm xs:text-sm sm:text-base font-semibold">
                  {contestant.registrationNumber}
                </span>
                {isSelected && (
                  <span className="text-sm xs:text-sm sm:text-base">✅</span>
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
                } px-3 xs:px-4 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-lg transition-all duration-300 transform flex items-center justify-center space-x-2 bg-orange-500 text-white hover:bg-orange-400`}
                onClick={() => handleButtonClick(contestant.registrationNumber)}
                aria-label={`Chọn thí sinh ${contestant.registrationNumber}`}
              >
                <span className="text-sm xs:text-sm sm:text-base font-semibold">
                  {contestant.registrationNumber}
                </span>
                {isSelected && (
                  <span className="text-sm xs:text-sm sm:text-base">✅</span>
                )}
              </button>
            );
          })}

          <div className="col-span-full flex justify-center mt-4">
            <button
              className={`px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[80px] xs:min-w-[100px] sm:min-w-[120px] text-[11px] xs:text-sm sm:text-base ${
                chotDisabled
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500"
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
            className="px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-400 hover:to-green-500 transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[80px] xs:min-w-[100px] sm:min-w-[120px] text-[11px] xs:text-sm sm:text-base"
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
            className="px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[80px] xs:min-w-[100px] sm:min-w-[120px] text-[11px] xs:text-sm sm:text-base"
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
              className={`px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[80px] xs:min-w-[100px] sm:min-w-[120px] text-[11px] xs:text-sm sm:text-base ${
                chotDisabled
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500"
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
                className="px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 font-semibold rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[80px] xs:min-w-[100px] sm:min-w-[120px] text-[11px] xs:text-sm sm:text-base"
                onClick={handleRevoke}
                aria-label="Thu hồi lựa chọn thí sinh"
              >
                ↩️ Thu hồi
              </button>
              <button
                className={`px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[80px] xs:min-w-[100px] sm:min-w-[120px] text-[11px] xs:text-sm sm:text-base ${
                  chotDisabled
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500"
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
