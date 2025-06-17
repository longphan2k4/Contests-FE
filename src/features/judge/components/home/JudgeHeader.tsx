import React from 'react';

interface JudgeHeaderProps {
  username: string;
  questionOrder: number;
  matchName: string;
  totalContestants: number;
}

const JudgeHeader: React.FC<JudgeHeaderProps> = ({ username, questionOrder, matchName, totalContestants }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white p-4 sm:p-6 rounded-2xl shadow-2xl mb-4 sm:mb-6 border border-white/10">
      <div className="flex items-center justify-between flex-col sm:flex-row">
        <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-0">
          <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-xl sm:text-2xl">
            👨‍⚖️
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-bold">{username} - Câu {questionOrder}</h1>
            <p className="text-blue-100 text-xs sm:text-base">{matchName}</p>
          </div>
        </div>
        <div className="text-center sm:text-right">
          <div className="text-xs sm:text-base text-blue-200">Tổng thí sinh</div>
          <div className="text-lg sm:text-2xl font-bold">{totalContestants}</div>
        </div>
      </div>
    </header>
  );
};

export default JudgeHeader;