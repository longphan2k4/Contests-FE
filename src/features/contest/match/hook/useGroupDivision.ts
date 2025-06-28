import { useState, useEffect, useCallback } from 'react';
import type { GroupInfo } from '../service/group-division.service';
import { GroupDivisionService } from '../service/group-division.service';
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

// cập nhật tên nhóm: GroupDivisionService.updateGroupName
export const useUpdateGroupName = (matchId: number | null) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const updateGroupName = async (groupId: number, newName: string) => {
    if (!matchId) return;

    setIsUpdating(true);
    setError(null);

    try {
      const updatedGroup = await GroupDivisionService.updateGroupName(groupId, newName);
      showToast(`Đã cập nhật tên nhóm thành công: ${updatedGroup?.name}`, 'success');
      return updatedGroup;
    } catch (err: unknown) {
      let errorMessage = 'Lỗi khi cập nhật tên nhóm';
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as { response?: { data?: { message?: string } } }).response;
        errorMessage = response?.data?.message || errorMessage;
      }
      setError(errorMessage);
      showToast(errorMessage, 'error');
      throw new Error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateGroupName, isUpdating, error };
};

export const useBulkCreateGroups = (matchId: number | null) => {
  const { showToast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bulkCreateGroups = useCallback(
    async (groupCount: number) => {
      if (!matchId || groupCount <= 0) {
        throw new Error("Match ID không hợp lệ hoặc số lượng nhóm bằng 0.");
      }
      setIsCreating(true);
      setError(null);
      try {
        // Tạo tên nhóm tự động: "Nhóm 1", "Nhóm 2", ...
        const groupNames = Array.from({ length: groupCount }, (_, i) => `Nhóm ${i + 1}`);
        
        console.log(`Đang gọi API bulkCreateGroups với matchId: ${matchId} và tên nhóm:`, groupNames);

        const res = await GroupDivisionService.createBulkGroups({
          matchId,
          groupNames,
        });

        showToast(`Tạo ${res.createdCount} nhóm thành công`, 'success');
        return res.groups;
      } catch (err: unknown) {
        let errorMessage = 'Lỗi khi tạo nhóm hàng loạt';
        if (err && typeof err === 'object' && 'response' in err) {
          const response = (err as { response?: { data?: { message?: string } } }).response;
          errorMessage = response?.data?.message || errorMessage;
        }
        setError(errorMessage);
        showToast(errorMessage, 'error');
        // Ném lỗi ra ngoài để hàm gọi có thể bắt được
        throw new Error(errorMessage);
      } finally {
        setIsCreating(false);
      }
    },
    [matchId, showToast]
  );

  return { bulkCreateGroups, isCreating, error };
};