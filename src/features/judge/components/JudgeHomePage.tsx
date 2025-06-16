import React, { useState, useEffect } from 'react';

// Định nghĩa type cho thí sinh
interface Contestant {
  registration_number: string;
  status: 'Đang thi' | 'Xác nhận 1' | 'Xác nhận 2';
}

const JudgeHomePage: React.FC = () => {
  // State quản lý mock data
  const [contestants, setContestants] = useState<Contestant[]>([
    ...Array(50).fill(null).map((_, index) => ({
      registration_number: String(index + 1).padStart(3, '0'),
      status: index % 3 === 0 ? 'Đang thi' : index % 3 === 1 ? 'Xác nhận 1' : 'Xác nhận 2',
    })),
  ] as Contestant[]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'Đang thi' | 'Xác nhận 1' | 'Xác nhận 2' | 'Đăng xuất'>('Đang thi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const mockQuestionOrder: number = 1;
  const mockMatchName: string = 'Trận chung kết';
  const mockUsername: string = 'Judge01';
  const mockChotDisabled: boolean = false;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show notification function
  const showNotification = (message: string, type: 'success' | 'error' | 'warning') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Xử lý chọn/bỏ chọn thí sinh
  const handleButtonClick = (id: string) => {
    setSelectedIds((prevIds) =>
      prevIds.includes(id) ? prevIds.filter((prevId) => prevId !== id) : [...prevIds, id]
    );
  };

  // Chọn tất cả thí sinh trong tab hiện tại
  const selectAll = (status: 'Đang thi' | 'Xác nhận 1') => {
    const ids = contestants
      .filter((c) => c.status === status)
      .map((c) => c.registration_number);
    setSelectedIds([...new Set([...selectedIds, ...ids])]);
  };

  // Bỏ chọn tất cả thí sinh trong tab hiện tại
  const deselectAll = (status: 'Đang thi' | 'Xác nhận 1') => {
    const ids = contestants
      .filter((c) => c.status === status)
      .map((c) => c.registration_number);
    setSelectedIds(selectedIds.filter((id) => !ids.includes(id)));
  };

  // Xử lý xác nhận 1
  const handleConfirm1 = async () => {
    if (selectedIds.length === 0 || !selectedIds.some((id) => contestants.find((c) => c.registration_number === id)?.status === 'Đang thi')) {
      showNotification('Vui lòng chọn ít nhất một thí sinh đang thi!', 'warning');
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setContestants((prev) =>
      prev.map((c) =>
        selectedIds.includes(c.registration_number) && c.status === 'Đang thi'
          ? { ...c, status: 'Xác nhận 1' }
          : c
      )
    );
    setSelectedIds([]);
    setActiveTab('Xác nhận 1');
    setCurrentPage(1);
    showNotification(`Đã chuyển ${selectedIds.length} thí sinh sang Xác nhận 1`, 'success');
    setIsProcessing(false);
  };

  // Xử lý thu hồi
  const handleRevoke = async () => {
    if (selectedIds.length === 0 || !selectedIds.some((id) => contestants.find((c) => c.registration_number === id)?.status === 'Xác nhận 1')) {
      showNotification('Vui lòng chọn ít nhất một thí sinh ở Xác nhận 1!', 'warning');
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setContestants((prev) =>
      prev.map((c) =>
        selectedIds.includes(c.registration_number) && c.status === 'Xác nhận 1'
          ? { ...c, status: 'Đang thi' }
          : c
      )
    );
    setSelectedIds([]);
    setActiveTab('Đang thi');
    setCurrentPage(1);
    showNotification(`Đã thu hồi ${selectedIds.length} thí sinh về Đang thi`, 'success');
    setIsProcessing(false);
  };

  // Xử lý xác nhận 2
  const handleConfirm2 = async () => {
    if (selectedIds.length === 0 || !selectedIds.some((id) => contestants.find((c) => c.registration_number === id)?.status === 'Xác nhận 1')) {
      showNotification('Vui lòng chọn ít nhất một thí sinh ở Xác nhận 1!', 'warning');
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setContestants((prev) =>
      prev.map((c) =>
        selectedIds.includes(c.registration_number) && c.status === 'Xác nhận 1'
          ? { ...c, status: 'Xác nhận 2' }
          : c
      )
    );
    setSelectedIds([]);
    setActiveTab('Xác nhận 2');
    setCurrentPage(1);
    showNotification(`Đã loại ${selectedIds.length} thí sinh`, 'success');
    setIsProcessing(false);
  };

  // Xử lý chốt danh sách
  const handleChot = async () => {
    if (contestants.some((c) => c.status === 'Xác nhận 1')) {
      showNotification('Vẫn còn thí sinh ở trạng thái Xác nhận 1!', 'error');
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    setContestants((prev) => prev.filter((c) => c.status !== 'Xác nhận 2'));
    setActiveTab('Đang thi');
    setCurrentPage(1);
    showNotification('Danh sách đã được chốt thành công!', 'success');
    setIsProcessing(false);
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    showNotification('Đang đăng xuất...', 'success');
    setTimeout(() => {
      // window.location.href = '/login';
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Đang thi': return '📝';
      case 'Xác nhận 1': return '⚠️';
      case 'Xác nhận 2': return '❌';
      default: return '📋';
    }
  };

  const getContestantCounts = () => {
    return {
      'Đang thi': contestants.filter(c => c.status === 'Đang thi').length,
      'Xác nhận 1': contestants.filter(c => c.status === 'Xác nhận 1').length,
      'Xác nhận 2': contestants.filter(c => c.status === 'Xác nhận 2').length,
    };
  };

  const counts = getContestantCounts();

  // Phân trang
  const filteredContestants = contestants.filter((c) => c.status === activeTab);
  const totalPages = Math.ceil(filteredContestants.length / itemsPerPage);
  const paginatedContestants = filteredContestants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-3 sm:p-4 flex flex-col">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-3/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply opacity-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply opacity-10"></div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-3 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-50 p-3 sm:p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
          notification.type === 'success' ? 'bg-green-500' :
          notification.type === 'error' ? 'bg-red-500' : 'bg-yellow-500'
        } text-white animate-bounce sm:max-w-md sm:mx-auto`}>
          <div className="flex items-center space-x-2">
            <div className="text-base sm:text-lg">
              {notification.type === 'success' ? '✅' :
               notification.type === 'error' ? '❌' : '⚠️'}
            </div>
            <span className="text-sm sm:text-base">{notification.message}</span>
          </div>
        </div>
      )}

      <div className={`relative z-10 flex-1 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white p-4 sm:p-6 rounded-2xl shadow-2xl mb-4 sm:mb-6 border border-white/10">
          <div className="flex items-center justify-between flex-col sm:flex-row">
            <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-0">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-xl sm:text-2xl">
                👨‍⚖️
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold">
                  {mockUsername} - Câu {mockQuestionOrder}
                </h1>
                <p className="text-blue-100 text-xs sm:text-base">{mockMatchName}</p>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-xs sm:text-base text-blue-200">Tổng thí sinh</div>
              <div className="text-lg sm:text-2xl font-bold">{contestants.length}</div>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex justify-center space-x-1 sm:space-x-2 bg-white/10 rounded-2xl p-3 sm:p-3 mb-4 sm:mb-6 border border-white/20 flex-wrap gap-3 sm:gap-3">
          {(['Đang thi', 'Xác nhận 1', 'Xác nhận 2', 'Đăng xuất'] as const).map((tab) => (
            <button
              key={tab}
              className={`px-3 sm:px-6 py-1 sm:py-3 font-semibold rounded-xl transition-all duration-300 flex items-center space-x-1 sm:space-x-2 min-w-[100px] sm:min-w-[120px] ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
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

        {/* Content */}
        <div className="bg-white/10 rounded-2xl shadow-2xl p-4 sm:p-8 border border-white/20">
          {activeTab === 'Đang thi' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center">
                <h2 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2 flex items-center justify-center space-x-1 sm:space-x-2">
                  <span>📝</span>
                  <span>Danh sách thí sinh đang thi</span>
                </h2>
                <p className="text-white/70 text-xs sm:text-base">Chọn thí sinh để chuyển sang xác nhận</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8 touch-action-manipulation">
                {paginatedContestants
                  .filter((c) => c.status === 'Đang thi')
                  .map((contestant, index) => (
                    <div
                      key={contestant.registration_number}
                      className={`relative max-w-[80px] sm:max-w-none mx-auto aspect-square flex items-center justify-center rounded-xl text-white font-bold text-[12px] sm:text-base p-3 cursor-pointer transition-all duration-300 transform sm:active:scale-110 sm:active:rotate-3 ${
                        selectedIds.includes(contestant.registration_number)
                          ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/30'
                          : 'bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/30'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => handleButtonClick(contestant.registration_number)}
                      onTouchStart={() => handleButtonClick(contestant.registration_number)}
                      aria-label={`Chọn thí sinh ${contestant.registration_number}`}
                    >
                      {contestant.registration_number}
                      {selectedIds.includes(contestant.registration_number) && (
                        <div className="absolute -top-3 sm:-top-3 -right-1 sm:-right-2 w-3 sm:w-6 h-3 sm:h-6 bg-green-500 rounded-full flex items-center justify-center text-[8px] sm:text-xs">
                          ✓
                        </div>
                      )}
                    </div>
                  ))}
              </div>

              <div className="flex justify-center space-x-2 sm:space-x-4 flex-wrap gap-3">
                <button
                  className="px-3 sm:px-6 py-1 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-400 hover:to-green-500 transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[100px] sm:min-w-[120px] text-[11px] sm:text-base"
                  onClick={() => selectAll('Đang thi')}
                  aria-label="Chọn tất cả thí sinh đang thi"
                >
                  🟢 Chọn hết
                </button>
                <button
                  className="px-3 sm:px-6 py-1 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[100px] sm:min-w-[120px] text-[11px] sm:text-base"
                  onClick={() => deselectAll('Đang thi')}
                  aria-label="Bỏ chọn tất cả thí sinh đang thi"
                >
                  ⚪ Bỏ chọn
                </button>
                <button
                  className={`px-3 sm:px-6 py-1 sm:py-3 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[100px] sm:min-w-[120px] text-[11px] sm:text-base ${
                    mockChotDisabled || isProcessing
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500'
                  }`}
                  disabled={mockChotDisabled || isProcessing}
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
              </div>

              {/* Phân trang */}
              {totalPages > 1 && (
                <div className="flex justify-center space-x-2 sm:space-x-4 mt-3 sm:mt-4">
                  <button
                    className={`px-3 sm:px-4 py-1 sm:py-2 text-white rounded-xl text-[11px] sm:text-base ${
                      currentPage === 1
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    aria-label="Trang trước"
                  >
                    Trang trước
                  </button>
                  <span className="text-white text-[11px] sm:text-base">
                    Trang {currentPage} / {totalPages}
                  </span>
                  <button
                    className={`px-3 sm:px-4 py-1 sm:py-2 text-white rounded-xl text-[11px] sm:text-base ${
                      currentPage === totalPages
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    aria-label="Trang sau"
                  >
                    Trang sau
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Xác nhận 1' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center">
                <h2 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2 flex items-center justify-center space-x-1 sm:space-x-2">
                  <span>⚠️</span>
                  <span>Thí sinh đã chọn - Câu {mockQuestionOrder}</span>
                </h2>
                <p className="text-white/70 text-xs sm:text-base">Chọn để thu hồi hoặc loại thí sinh</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8 touch-action-manipulation">
                {paginatedContestants
                  .filter((c) => c.status === 'Xác nhận 1')
                  .map((contestant, index) => (
                    <div
                      key={contestant.registration_number}
                      className={`relative max-w-[80px] sm:max-w-none mx-auto aspect-square flex items-center justify-center rounded-xl text-white font-bold text-[12px] sm:text-base p-3 cursor-pointer transition-all duration-300 transform sm:active:scale-110 sm:active:rotate-3 ${
                        selectedIds.includes(contestant.registration_number)
                          ? 'bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/30'
                          : 'bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/30'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => handleButtonClick(contestant.registration_number)}
                      onTouchStart={() => handleButtonClick(contestant.registration_number)}
                      aria-label={`Chọn thí sinh ${contestant.registration_number}`}
                    >
                      {contestant.registration_number}
                      {selectedIds.includes(contestant.registration_number) && (
                        <div className="absolute -top-3 sm:-top-3 -right-1 sm:-right-2 w-3 sm:w-6 h-3 sm:h-6 bg-green-500 rounded-full flex items-center justify-center text-[8px] sm:text-xs">
                          ✓
                        </div>
                      )}
                    </div>
                  ))}
              </div>

              <div className="flex justify-center space-x-2 sm:space-x-4 flex-wrap gap-3">
                <button
                  className="px-3 sm:px-6 py-1 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-400 hover:to-green-500 transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[100px] sm:min-w-[120px] text-[11px] sm:text-base"
                  onClick={() => selectAll('Xác nhận 1')}
                  aria-label="Chọn tất cả thí sinh xác nhận 1"
                >
                  🟢 Chọn hết
                </button>
                <button
                  className="px-3 sm:px-6 py-1 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[100px] sm:min-w-[120px] text-[11px] sm:text-base"
                  onClick={() => deselectAll('Xác nhận 1')}
                  aria-label="Bỏ chọn tất cả thí sinh xác nhận 1"
                >
                  ⚪ Bỏ chọn
                </button>
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
                    mockChotDisabled || isProcessing
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500'
                  }`}
                  disabled={mockChotDisabled || isProcessing}
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
              </div>

              {/* Phân trang */}
              {totalPages > 1 && (
                <div className="flex justify-center space-x-2 sm:space-x-4 mt-3 sm:mt-4">
                  <button
                    className={`px-3 sm:px-4 py-1 sm:py-2 text-white rounded-xl text-[11px] sm:text-base ${
                      currentPage === 1
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    aria-label="Trang trước"
                  >
                    Trang trước
                  </button>
                  <span className="text-white text-[11px] sm:text-base">
                    Trang {currentPage} / {totalPages}
                  </span>
                  <button
                    className={`px-3 sm:px-4 py-1 sm:py-2 text-white rounded-xl text-[11px] sm:text-base ${
                      currentPage === totalPages
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    aria-label="Trang sau"
                  >
                    Trang sau
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Xác nhận 2' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center">
                <h2 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2 flex items-center justify-center space-x-1 sm:space-x-2">
                  <span>❌</span>
                  <span>Thí sinh bị loại - Câu {mockQuestionOrder}</span>
                </h2>
                <p className="text-white/70 text-xs sm:text-base">Danh sách thí sinh đã bị loại</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8 touch-action-manipulation">
                {paginatedContestants
                  .filter((c) => c.status === 'Xác nhận 2')
                  .map((contestant, index) => (
                    <div
                      key={contestant.registration_number}
                      className="relative max-w-[80px] sm:max-w-none mx-auto aspect-square flex items-center justify-center rounded-xl text-white font-bold text-[12px] sm:text-base p-3 bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-500/30 opacity-75"
                      style={{ animationDelay: `${index * 100}ms` }}
                      aria-label={`Thí sinh bị loại ${contestant.registration_number}`}
                    >
                      {contestant.registration_number}
                      <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
                        <span className="text-sm sm:text-2xl">❌</span>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="flex justify-center">
                <button
                  className={`px-4 sm:px-8 py-2 sm:py-4 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-[11px] sm:text-lg min-w-[120px] sm:min-w-[160px] ${
                    mockChotDisabled || contestants.some((c) => c.status === 'Xác nhận 1') || isProcessing
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-600 to-red-800 text-white hover:from-red-500 hover:to-red-700'
                  }`}
                  disabled={mockChotDisabled || contestants.some((c) => c.status === 'Xác nhận 1') || isProcessing}
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

              {/* Phân trang */}
              {totalPages > 1 && (
                <div className="flex justify-center space-x-2 sm:space-x-4 mt-3 sm:mt-4">
                  <button
                    className={`px-3 sm:px-4 py-1 sm:py-2 text-white rounded-xl text-[11px] sm:text-base ${
                      currentPage === 1
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    aria-label="Trang trước"
                  >
                    Trang trước
                  </button>
                  <span className="text-white text-[11px] sm:text-base">
                    Trang {currentPage} / {totalPages}
                  </span>
                  <button
                    className={`px-3 sm:px-4 py-1 sm:py-2 text-white rounded-xl text-[11px] sm:text-base ${
                      currentPage === totalPages
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    aria-label="Trang sau"
                  >
                    Trang sau
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Đăng xuất' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center">
                <div className="w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-2xl sm:text-4xl mx-auto animate-pulse">
                  🚪
                </div>
                <h2 className="text-lg sm:text-2xl font-bold text-white">
                  Đăng xuất trọng tài
                </h2>
                <p className="text-white/70 text-xs sm:text-base">
                  Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?
                </p>
                <button
                  className="px-4 sm:px-8 py-2 sm:py-4 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold rounded-xl hover:from-red-500 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-[11px] sm:text-lg min-w-[120px] sm:min-w-[160px]"
                  onClick={handleLogout}
                  aria-label="Đăng xuất khỏi hệ thống"
                >
                  🚪 Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-auto text-center text-white/50">
          <p className="text-xs sm:text-base">Cuộc thi - Hệ thống quản lý trọng tài © 2025</p>
        </footer>
      </div>

      {/* Processing Overlay */}
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