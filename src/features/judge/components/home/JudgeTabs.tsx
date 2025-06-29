import React from 'react';
import type { TabType } from '../../types/contestant';

interface JudgeTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  counts: Record<TabType, number>;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Đang thi':
      return '📝';
    case 'Xác nhận 1':
      return '⚠️';
    case 'Xác nhận 2':
      return '❌';
    default:
      return '📋';
  }
};

const JudgeTabs: React.FC<JudgeTabsProps> = ({ activeTab, setActiveTab, counts }) => {
  return (
    <div className="flex justify-center space-x-1 sm:space-x-2 bg-white/10 rounded-2xl p-3 sm:p-3 mb-4 sm:mb-6 border border-white/20 flex-wrap gap-3 sm:gap-3">
      {(['Đang thi', 'Xác nhận 1', 'Xác nhận 2', 'Đăng xuất'] as const).map((tab) => (
        <button
          key={tab}
          className={`px-3 sm:px-6 py-1 sm:py-3 font-semibold rounded-xl transition-all duration-300 flex items-center space-x-1 sm:space-x-2 min-w-[100px] sm:min-w-[120px] ${
            activeTab === tab
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
          onClick={() => setActiveTab(tab)}
          aria-label={`Chuyển sang tab ${tab}`}
        >
          <span className="text-xs sm:text-base">{getStatusIcon(tab === 'Đăng xuất' ? 'default' : tab)}</span>
          <span className="text-xs sm:text-base">{tab}</span>
          {tab !== 'Đăng xuất' && (
            <span className="bg-white/20 px-1 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs">{counts[tab]}</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default JudgeTabs;