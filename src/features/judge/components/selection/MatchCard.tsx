import React from 'react';
import type { Match } from '../../types/match';

interface MatchCardProps {
  selectedMatchData: Match | undefined;
  isEntering: boolean;
  handleEnterRoom: () => void;
  children: React.ReactNode;
}

const MatchCard: React.FC<MatchCardProps> = ({ selectedMatchData, isEntering, handleEnterRoom, children }) => {
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent mb-2">
            Chọn trận đấu
          </h2>
          <p className="text-white/70 text-sm">Lựa chọn trận đấu để bắt đầu chấm điểm</p>
        </div>

        {/* Match Selection and Preview */}
        {children}

        {/* Selected Match Preview */}
        {selectedMatchData && (
          <div
            className={`mb-6 p-4 bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-2xl border border-green-400/30 transition-all duration-500 ${
              selectedMatchData ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div>
                <p className="text-white font-semibold">{selectedMatchData.match_name}</p>
                <p className="text-white/70 text-sm">{new Date(selectedMatchData.start_time).toLocaleString('vi-VN')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Enter Button */}
        <button
          className={`w-full relative overflow-hidden group transition-all duration-300 ${
            isEntering
              ? 'bg-green-500 scale-95'
              : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 hover:scale-105'
          } text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transform ${
            selectedMatchData ? 'cursor-pointer' : 'opacity-70 cursor-not-allowed'
          }`}
          onClick={handleEnterRoom}
          disabled={isEntering}
        >
          <div className="relative z-10 flex items-center justify-center space-x-2">
            {isEntering ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang vào phòng...</span>
              </>
            ) : (
              <>
                <span className="text-lg">Vào phòng</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </div>
          <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
        </button>
      </div>
      <div className="h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"></div>
    </div>
  );
};

export default MatchCard;