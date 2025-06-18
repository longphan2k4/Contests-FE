import { useState, useEffect } from 'react';
import type { Match } from '../types/match';
import { showAlert } from '../utils/alert';

export const useMatchSelection = () => {
  const [matches] = useState<Match[]>([
    { id: 1, match_name: 'Trận 1', start_time: '2025-06-13T10:00:00' },
    { id: 2, match_name: 'Trận 2', start_time: '2025-06-13T14:00:00' },
    { id: 3, match_name: 'Trận chung kết', start_time: '2025-06-13T18:00:00' },
  ]);
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const [isEntering, setIsEntering] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEnterRoom = () => {
    if (!selectedMatch) {
      showAlert('Vui lòng chọn một trận đấu!', 'bg-red-500');
      return;
    }

    setIsEntering(true);
    setTimeout(() => {
      window.alert(`Đang chuyển hướng đến trận đấu ${selectedMatch}`);
      // window.location.href = `/judge/${selectedMatch}`;
    }, 2000);
  };

  const selectedMatchData = matches.find((m) => m.id === selectedMatch);

  return {
    matches,
    selectedMatch,
    setSelectedMatch,
    isEntering,
    mounted,
    handleEnterRoom,
    selectedMatchData,
  };
};