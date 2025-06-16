import { useState, useEffect } from 'react';
import type { Contestant, TabType, NotificationType } from '../types/contestant';
import { showNotification } from '../utils/notification';

export const useJudgeHome = () => {
  const [contestants, setContestants] = useState<Contestant[]>([
    ...Array(50).fill(null).map((_, index) => ({
      registration_number: String(index + 1).padStart(3, '0'),
      status: index % 3 === 0 ? 'Đang thi' : index % 3 === 1 ? 'Xác nhận 1' : 'Xác nhận 2',
    })),
  ] as Contestant[]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('Đang thi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: NotificationType } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const mockQuestionOrder = 1;
  const mockMatchName = 'Trận chung kết';
  const mockUsername = 'Judge01';
  const mockChotDisabled = false;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleButtonClick = (id: string) => {
    setSelectedIds((prevIds) =>
      prevIds.includes(id) ? prevIds.filter((prevId) => prevId !== id) : [...prevIds, id]
    );
  };

  const selectAll = (status: 'Đang thi' | 'Xác nhận 1') => {
    const ids = contestants.filter((c) => c.status === status).map((c) => c.registration_number);
    setSelectedIds([...new Set([...selectedIds, ...ids])]);
  };

  const deselectAll = (status: 'Đang thi' | 'Xác nhận 1') => {
    const ids = contestants.filter((c) => c.status === status).map((c) => c.registration_number);
    setSelectedIds(selectedIds.filter((id) => !ids.includes(id)));
  };

  const handleConfirm1 = async () => {
    if (selectedIds.length === 0 || !selectedIds.some((id) => contestants.find((c) => c.registration_number === id)?.status === 'Đang thi')) {
      showNotification('Vui lòng chọn ít nhất một thí sinh đang thi!', 'warning', setNotification);
      return;
    }

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setContestants((prev) =>
      prev.map((c) =>
        selectedIds.includes(c.registration_number) && c.status === 'Đang thi' ? { ...c, status: 'Xác nhận 1' } : c
      )
    );
    setSelectedIds([]);
    setActiveTab('Xác nhận 1');
    setCurrentPage(1);
    showNotification(`Đã chuyển ${selectedIds.length} thí sinh sang Xác nhận 1`, 'success', setNotification);
    setIsProcessing(false);
  };

  const handleRevoke = async () => {
    if (selectedIds.length === 0 || !selectedIds.some((id) => contestants.find((c) => c.registration_number === id)?.status === 'Xác nhận 1')) {
      showNotification('Vui lòng chọn ít nhất một thí sinh ở Xác nhận 1!', 'warning', setNotification);
      return;
    }

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setContestants((prev) =>
      prev.map((c) =>
        selectedIds.includes(c.registration_number) && c.status === 'Xác nhận 1' ? { ...c, status: 'Đang thi' } : c
      )
    );
    setSelectedIds([]);
    setActiveTab('Đang thi');
    setCurrentPage(1);
    showNotification(`Đã thu hồi ${selectedIds.length} thí sinh về Đang thi`, 'success', setNotification);
    setIsProcessing(false);
  };

  const handleConfirm2 = async () => {
    if (selectedIds.length === 0 || !selectedIds.some((id) => contestants.find((c) => c.registration_number === id)?.status === 'Xác nhận 1')) {
      showNotification('Vui lòng chọn ít nhất một thí sinh ở Xác nhận 1!', 'warning', setNotification);
      return;
    }

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setContestants((prev) =>
      prev.map((c) =>
        selectedIds.includes(c.registration_number) && c.status === 'Xác nhận 1' ? { ...c, status: 'Xác nhận 2' } : c
      )
    );
    setSelectedIds([]);
    setActiveTab('Xác nhận 2');
    setCurrentPage(1);
    showNotification(`Đã loại ${selectedIds.length} thí sinh`, 'success', setNotification);
    setIsProcessing(false);
  };

  const handleChot = async () => {
    if (contestants.some((c) => c.status === 'Xác nhận 1')) {
      showNotification('Vẫn còn thí sinh ở trạng thái Xác nhận 1!', 'error', setNotification);
      return;
    }

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setContestants((prev) => prev.filter((c) => c.status !== 'Xác nhận 2'));
    setActiveTab('Đang thi');
    setCurrentPage(1);
    showNotification('Danh sách đã được chốt thành công!', 'success', setNotification);
    setIsProcessing(false);
  };

  const handleLogout = () => {
    showNotification('Đang đăng xuất...', 'success', setNotification);
    setTimeout(() => {
      // window.location.href = '/login';
    }, 2000);
  };

  const getContestantCounts = () => {
    return {
      'Đang thi': contestants.filter((c) => c.status === 'Đang thi').length,
      'Xác nhận 1': contestants.filter((c) => c.status === 'Xác nhận 1').length,
      'Xác nhận 2': contestants.filter((c) => c.status === 'Xác nhận 2').length,
      'Đăng xuất': 0,
    };
  };

  const filteredContestants = contestants.filter((c) => c.status === activeTab);
  const totalPages = Math.ceil(filteredContestants.length / itemsPerPage);
  const paginatedContestants = filteredContestants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    contestants,
    setContestants,
    selectedIds,
    handleButtonClick,
    activeTab,
    setActiveTab,
    isProcessing,
    notification,
    mounted,
    currentPage,
    setCurrentPage,
    itemsPerPage,
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
  };
};