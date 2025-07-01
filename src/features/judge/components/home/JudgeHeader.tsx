import React from 'react';

interface JudgeHeaderProps {
  username: string;
  questionOrder: number;
  matchName: string;
  totalContestants: number;
}

const JudgeHeader: React.FC<JudgeHeaderProps> = ({ username, questionOrder, matchName, totalContestants }) => {
  return (
    <header className="bg-white text-blue-900 p-4 sm:p-6 rounded-2xl shadow-xl mb-4 sm:mb-6 border-2 border-blue-200">
      <div className="flex items-center justify-between flex-col sm:flex-row">
        <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-0">
          <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-xl sm:text-2xl shadow-lg">
            👨‍⚖️
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-blue-800">{username} - Câu {questionOrder}</h1>
            <p className="text-blue-600 text-xs sm:text-base font-medium">{matchName}</p>
          </div>
        </div>
        <div className="text-center sm:text-right bg-blue-50 px-4 py-2 rounded-xl border border-blue-200">
          <div className="text-xs sm:text-base text-blue-700 font-semibold">Tổng thí sinh</div>
          <div className="text-lg sm:text-2xl font-bold text-blue-900">{totalContestants}</div>
        </div>
      </div>
    </header>
  );
};

export default JudgeHeader;