import React from 'react';
import type { Contestant, TabType } from '../../types/contestant';

interface ContestantListProps {
  activeTab: TabType;
  paginatedContestants: Contestant[];
  selectedIds: string[];
  handleButtonClick: (id: string) => void;
  selectAll: (status: 'Đang thi' | 'Xác nhận 1') => void;
  deselectAll: (status: 'Đang thi' | 'Xác nhận 1') => void;
  handleConfirm1: () => void;
  handleRevoke: () => void;
  handleConfirm2: () => void;
  handleChot: () => void;
  isProcessing: boolean;
  chotDisabled: boolean;
  questionOrder: number;
}

const ContestantList: React.FC<ContestantListProps> = ({
  activeTab,
  paginatedContestants,
  selectedIds,
  handleButtonClick,
  selectAll,
  deselectAll,
  handleConfirm1,
  handleRevoke,
  handleConfirm2,
  handleChot,
  isProcessing,
  chotDisabled,
  questionOrder,
}) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h2 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2 flex items-center justify-center space-x-1 sm:space-x-2">
          <span>{activeTab === 'Đang thi' ? '📝' : activeTab === 'Xác nhận 1' ? '⚠️' : '❌'}</span>
          <span>
            {activeTab === 'Đang thi'
              ? 'Danh sách thí sinh đang thi'
              : activeTab === 'Xác nhận 1'
              ? `Thí sinh đã chọn - Câu ${questionOrder}`
              : `Thí sinh bị loại - Câu ${questionOrder}`}
          </span>
        </h2>
        <p className="text-white/70 text-xs sm:text-base">
          {activeTab === 'Đang thi'
            ? 'Chọn thí sinh để chuyển sang xác nhận'
            : activeTab === 'Xác nhận 1'
            ? 'Chọn để thu hồi hoặc loại thí sinh'
            : 'Danh sách thí sinh đã bị loại'}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8 touch-action-manipulation">
        {paginatedContestants.map((contestant, index) => (
          <div
            key={contestant.registration_number}
            className={`relative max-w-[80px] sm:max-w-none mx-auto aspect-square flex items-center justify-center rounded-xl text-white font-bold text-[12px] sm:text-base p-3 transition-all duration-300 transform sm:active:scale-110 sm:active:rotate-3 ${
              activeTab === 'Xác nhận 2'
                ? 'bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-500/30 opacity-75'
                : selectedIds.includes(contestant.registration_number)
                ? activeTab === 'Đang thi'
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/30'
                  : 'bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/30'
                : activeTab === 'Đang thi'
                ? 'bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/30'
                : 'bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/30'
            } ${activeTab !== 'Xác nhận 2' && 'cursor-pointer'}`}
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={activeTab !== 'Xác nhận 2' ? () => handleButtonClick(contestant.registration_number) : undefined}
            onTouchStart={activeTab !== 'Xác nhận 2' ? () => handleButtonClick(contestant.registration_number) : undefined}
            aria-label={`Thí sinh ${contestant.registration_number} ${activeTab === 'Xác nhận 2' ? 'bị loại' : ''}`}
          >
            {contestant.registration_number}
            {activeTab === 'Xác nhận 2' ? (
              <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
                <span className="text-sm sm:text-2xl">❌</span>
              </div>
            ) : (
              selectedIds.includes(contestant.registration_number) && (
                <div className="absolute -top-3 sm:-top-3 -right-1 sm:-right-2 w-3 sm:w-6 h-3 sm:h-6 bg-green-500 rounded-full flex items-center justify-center text-[8px] sm:text-xs">
                  ✓
                </div>
              )
            )}
          </div>
        ))}
      </div>

      {activeTab !== 'Xác nhận 2' && (
        <div className="flex justify-center space-x-2 sm:space-x-4 flex-wrap gap-3">
          <button
            className="px-3 sm:px-6 py-1 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-400 hover:to-green-500 transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[100px] sm:min-w-[120px] text-[11px] sm:text-base"
            onClick={() => selectAll(activeTab as 'Đang thi' | 'Xác nhận 1')}
            aria-label={`Chọn tất cả thí sinh ${activeTab}`}
          >
            🟢 Chọn hết
          </button>
          <button
            className="px-3 sm:px-6 py-1 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[100px] sm:min-w-[120px] text-[11px] sm:text-base"
            onClick={() => deselectAll(activeTab as 'Đang thi' | 'Xác nhận 1')}
            aria-label={`Bỏ chọn tất cả thí sinh ${activeTab}`}
          >
            ⚪ Bỏ chọn
          </button>
          {activeTab === 'Đang thi' && (
            <button
              className={`px-3 sm:px-6 py-1 sm:py-3 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[100px] sm:min-w-[120px] text-[11px] sm:text-base ${
                chotDisabled || isProcessing
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500'
              }`}
              disabled={chotDisabled || isProcessing}
              onClick={handleConfirm1}
              aria-label="Xác nhận 1 cho thí sinh đã chọn"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-3 sm:w-5 h-3 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                <>⚠️ Xác nhận 1</>
              )}
            </button>
          )}
          {activeTab === 'Xác nhận 1' && (
            <>
              <button
                className={`px-3 sm:px-6 py-1 sm:py-3 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[100px] sm:min-w-[120px] text-[11px] sm:text-base ${
                  isProcessing
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-400 hover:to-yellow-500'
                }`}
                disabled={isProcessing}
                onClick={handleRevoke}
                aria-label="Thu hồi thí sinh đã chọn"
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <div className="w-3 sm:w-5 h-3 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Thu hồi...</span>
                  </div>
                ) : (
                  <>↩️ Thu hồi</>
                )}
              </button>
              <button
                className={`px-3 sm:px-6 py-1 sm:py-3 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[100px] sm:min-w-[120px] text-[11px] sm:text-base ${
                  chotDisabled || isProcessing
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500'
                }`}
                disabled={chotDisabled || isProcessing}
                onClick={handleConfirm2}
                aria-label="Xác nhận 2 cho thí sinh đã chọn"
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <div className="w-3 sm:w-5 h-3 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loại...</span>
                  </div>
                ) : (
                  <>❌ Xác nhận 2</>
                )}
              </button>
            </>
          )}
        </div>
      )}
      {activeTab === 'Xác nhận 2' && (
        <div className="flex justify-center">
          <button
            className={`px-4 sm:px-8 py-2 sm:py-4 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-[11px] sm:text-lg min-w-[120px] sm:min-w-[160px] ${
              chotDisabled || paginatedContestants.some((c) => c.status === 'Xác nhận 1') || isProcessing
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-600 to-red-800 text-white hover:from-red-500 hover:to-red-700'
            }`}
            disabled={chotDisabled || paginatedContestants.some((c) => c.status === 'Xác nhận 1') || isProcessing}
            onClick={handleChot}
            aria-label="Chốt danh sách thí sinh"
          >
            {isProcessing ? (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="w-4 sm:w-6 h-4 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang chốt...</span>
              </div>
            ) : (
              <>🔒 Chốt danh sách</>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ContestantList;