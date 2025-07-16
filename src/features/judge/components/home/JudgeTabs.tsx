import React, { useState, useEffect } from 'react';
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
      return '�';
  }
};

const getStatusColor = (status: string, isActive: boolean) => {
  if (isActive) {
    switch (status) {
      case 'Đang thi':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg';
      case 'Xác nhận 1':
        return 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg';
      case 'Xác nhận 2':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg';
    }
  } else {
    switch (status) {
      case 'Đang thi':
        return 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200';
      case 'Xác nhận 1':
        return 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200';
      case 'Xác nhận 2':
        return 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200';
    }
  }
};

const JudgeTabs: React.FC<JudgeTabsProps> = ({ activeTab, setActiveTab, counts }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
      isScrolled ? 'scale-90' : 'scale-100'
    }`}>
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 px-4 py-2">
        <div className="flex justify-center space-x-2 gap-2">
          {(['Đang thi', 'Xác nhận 1', 'Xác nhận 2', 'Đăng xuất'] as const).map((tab) => {
            const isActive = activeTab === tab;
            const count = counts[tab];
            
            return (
              <button
                key={tab}
                className={`relative px-3 py-2 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  getStatusColor(tab, isActive)
                } ${isActive ? 'shadow-lg' : 'shadow-sm hover:shadow-md'}`}
                onClick={() => setActiveTab(tab)}
                aria-label={`Chuyển sang tab ${tab}${tab !== 'Đăng xuất' ? ` (${count} thí sinh)` : ''}`}
              >
                <div className="flex items-center space-x-1.5">
                  <span className="text-base">
                    {getStatusIcon(tab === 'Đăng xuất' ? 'default' : tab)}
                  </span>
                  
                  <span className="text-sm whitespace-nowrap font-medium">
                    {tab}
                  </span>
                  
                  {tab !== 'Đăng xuất' && (
                    <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                      isActive 
                        ? 'bg-white/25 text-white shadow-inner' 
                        : 'bg-white text-gray-700 shadow-sm'
                    } ${count > 0 ? 'animate-pulse' : ''}`}>
                      {count}
                    </span>
                  )}
                </div>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
                )}

                {/* Notification dot for high counts */}
                {tab !== 'Đăng xuất' && count > 5 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white animate-bounce" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JudgeTabs;