import { useState, useEffect, useCallback } from 'react';
import type { GroupInfo } from '../services/group-division.service';
import { GroupDivisionService } from '../services/group-division.service';
import { useToast } from '../../../../contexts/toastContext';

export const useGroupDivision = (matchId: number | null) => {
  const [groups, setGroups] = useState<GroupInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  // Fetch current groups
  const fetchCurrentGroups = useCallback(async () => {
    if (!matchId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await GroupDivisionService.getCurrentGroups(matchId);
      setGroups(data);    } catch (err: unknown) {
      let errorMessage = 'Lỗi khi tải danh sách nhóm';
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as { response?: { data?: { message?: string } } }).response;
        errorMessage = response?.data?.message || errorMessage;
      }
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [matchId, showToast]);

  // Load groups when component mounts or matchId changes
  useEffect(() => {
    fetchCurrentGroups();
  }, [fetchCurrentGroups]);

  // Refetch groups
  const refetch = useCallback(() => {
    fetchCurrentGroups();
  }, [fetchCurrentGroups]);

  return {
    groups,
    isLoading,
    error,
    refetch,
    hasGroups: groups.length > 0
  };
};
