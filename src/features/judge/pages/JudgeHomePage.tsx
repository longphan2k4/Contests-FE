import React, { useEffect } from 'react';
import AnimatedBackground from '../components/home/AnimatedBackground';
import JudgeHeader from '../components/home/JudgeHeader';
import JudgeTabs from '../components/home/JudgeTabs';
import ContestantList from '../components/home/ContestantList';
import Pagination from '../components/home/Pagination';
import Notification from '../components/home/Notification';
import LogoutSection from '../components/home/LogoutSection';
import { useJudgeHome } from '../hooks/useJudgeHome';

const JudgeHomePage: React.FC = () => {
  const {
    contestants,
    selectedIds,
    handleButtonClick,
    activeTab,
    setActiveTab,
    isProcessing,
    notification,
    mounted,
    currentPage,
    setCurrentPage,
    mockQuestionOrder,
    mockMatchName,
    mockUsername,
    mockChotDisabled,
    selectAll,
    deselectAll,
    handleConfirm1,
    handleRevoke,
    handleConfirm2,
    handleChot,
    handleLogout,
    getContestantCounts,
    paginatedContestants,
    totalPages,
  } = useJudgeHome();
// Thêm title cho tab
  useEffect(() => {
    document.title = 'Theo dõi trận đấu - Giám khảo';
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-3 sm:p-4 flex flex-col">
      
      <AnimatedBackground />
      {notification && <Notification message={notification.message} type={notification.type} />}
      <div className={`relative z-10 flex-1 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <JudgeHeader
          username={mockUsername}
          questionOrder={mockQuestionOrder}
          matchName={mockMatchName}
          totalContestants={contestants.length}
        />
        <JudgeTabs activeTab={activeTab} setActiveTab={setActiveTab} counts={getContestantCounts()} />
        <div className="bg-white/10 rounded-2xl shadow-2xl p-4 sm:p-8 border border-white/20">
          {activeTab === 'Đăng xuất' ? (
            <LogoutSection handleLogout={handleLogout} />
          ) : (
            <>
              <ContestantList
                activeTab={activeTab}
                paginatedContestants={paginatedContestants}
                selectedIds={selectedIds}
                handleButtonClick={handleButtonClick}
                selectAll={selectAll}
                deselectAll={deselectAll}
                handleConfirm1={handleConfirm1}
                handleRevoke={handleRevoke}
                handleConfirm2={handleConfirm2}
                handleChot={handleChot}
                isProcessing={isProcessing}
                chotDisabled={mockChotDisabled}
                questionOrder={mockQuestionOrder}
              />
              <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
            </>
          )}
        </div>
        <footer className="mt-auto text-center text-white/50">
          <p className="text-xs sm:text-base">Cuộc thi - Hệ thống quản lý trọng tài © 2025</p>
        </footer>
      </div>
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/10 rounded-3xl p-4 sm:p-8 text-center shadow-2xl border border-white/20">
            <div className="w-10 sm:w-16 h-10 sm:h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
            <p className="text-white font-semibold text-sm sm:text-lg">Đang xử lý...</p>
            <p className="text-white/70 text-xs sm:text-base mt-1 sm:mt-2">Vui lòng đợi trong giây lát</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default JudgeHomePage;