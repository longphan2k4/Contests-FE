import { useState, useCallback } from 'react';
import {
    getContests,
    getContestById,
    createContest,
    updateContest,
    toggleContestActive,
    deleteContest,
    deleteManyContests
} from '../services/contestsService';
import type { 
    Contest, 
    CreateContestData
} from '../types';

// Interface cho response của API deleteManyContests
interface DeleteManyResponse {
    success: boolean;
    messages: Array<{
        id: number;
        status: 'success' | 'error';
        msg: string;
    }>;
}

interface UseContestsReturn {
    // State
    contests: Contest[];
    currentContest: Contest | null;
    loading: boolean;
    error: string | null;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    } | null;

    // Actions
    fetchContests: (params?: { page?: number; limit?: number; search?: string }) => Promise<void>;
    fetchContestById: (id: number) => Promise<void>;
    createNewContest: (data: CreateContestData) => Promise<void>;
    updateExistingContest: (id: number, data: Partial<Contest>) => Promise<void>;
    toggleContestStatus: (id: number) => Promise<void>;
    removeContest: (id: number) => Promise<{success: boolean, message: string}>;
    removeManyContests: (ids: number[]) => Promise<{
        success: boolean;
        successfulDeletes: Array<{id: number; status: string; msg: string}>;
        failedDeletes: Array<{id: number; status: string; msg: string}>;
    }>;
}

export const useContests = (): UseContestsReturn => {
    const [contests, setContests] = useState<Contest[]>([]);
    const [currentContest, setCurrentContest] = useState<Contest | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<UseContestsReturn['pagination']>(null);

    const fetchContests = useCallback(async (params?: { page?: number; limit?: number; search?: string }) => {
        try {
            setLoading(true);
            setError(null);
            const response = await getContests(params);
            console.log('response3', response);
            if (response.success && Array.isArray(response.data.Contest)) {
                setContests(response.data.Contest);
                if (response.data.pagination) {
                    setPagination({
                        currentPage: response.data.pagination.currentPage,
                        totalPages: response.data.pagination.totalPages,
                        totalItems: response.data.pagination.total,
                        itemsPerPage: response.data.pagination.itemsPerPage
                    });
                }
            } else {
                throw new Error('Dữ liệu trả về không đúng định dạng');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi lấy danh sách cuộc thi');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchContestById = useCallback(async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await getContestById(id);
            if (response.success && response.data) {
                // Chuyển đổi kiểu dữ liệu từ response.data sang Contest
                const contestData = response.data as unknown as Contest;
                setCurrentContest(contestData);
            } else {
                throw new Error('Dữ liệu trả về không đúng định dạng');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi lấy thông tin cuộc thi');
        } finally {
            setLoading(false);
        }
    }, []);

    const createNewContest = useCallback(async (data: CreateContestData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await createContest(data);
            if (response.success && response.data.Contest) {
                // Thêm mảng Contest từ response vào danh sách hiện tại
                const newContests = [...response.data.Contest];
                setContests(prev => [...prev, ...newContests]);
            } else {
                throw new Error('Dữ liệu trả về không đúng định dạng');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo cuộc thi mới');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateExistingContest = useCallback(async (id: number, data: Partial<Contest>) => {
        try {
            setLoading(true);
            setError(null);
            const response = await updateContest(id, data);
            if (response.success) {
                const updatedContest = response.data;
                setContests(prev => prev.map(contest => 
                    contest.id === id ? updatedContest : contest
                ));
                if (currentContest?.id === id) {
                    setCurrentContest(updatedContest);
                }
            } else {
                throw new Error('Dữ liệu trả về không đúng định dạng');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật cuộc thi');
        } finally {
            setLoading(false);
        }
    }, [currentContest]);

    const toggleContestStatus = useCallback(async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await toggleContestActive(id);
            if (response.success && response.data.Contest && response.data.Contest.length > 0) {
                const updatedContest = response.data.Contest[0];
                setContests(prev => prev.map(contest => 
                    contest.id === id ? updatedContest : contest
                ));
                if (currentContest?.id === id) {
                    setCurrentContest(updatedContest);
                }
            } else {
                throw new Error('Dữ liệu trả về không đúng định dạng');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi thay đổi trạng thái cuộc thi');
        } finally {
            setLoading(false);
        }
    }, [currentContest]);

    const removeContest = useCallback(async (id: number): Promise<{success: boolean, message: string}> => {
        try {
            setLoading(true);
            setError(null);
            const response = await deleteContest(id);
            setContests(prev => prev.filter(contest => contest.id !== id));
            if (currentContest?.id === id) {
                setCurrentContest(null);
            }
            return response;    
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa cuộc thi');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [currentContest]);

    const removeManyContests = useCallback(async (ids: number[]) => {
        try {
            setLoading(true);
            setError(null);
            // Cần xác định rõ kiểu dữ liệu trả về của deleteManyContests
            const response = await deleteManyContests(ids) as unknown as DeleteManyResponse;
            console.log('removeManyContests', response);
            
            if (response.success) {
                // Lọc ra các cuộc thi có thể xóa thành công
                const successfulDeletes = response.messages.filter(msg => msg.status === 'success');
                
                // Lọc ra các cuộc thi không thể xóa
                const failedDeletes = response.messages.filter(msg => msg.status === 'error');
                
                // Cập nhật state với các cuộc thi đã xóa thành công
                if (successfulDeletes.length > 0) {
                    setContests(prev => prev.filter(contest => !ids.includes(contest.id)));
                    if (currentContest && ids.includes(currentContest.id)) {
                        setCurrentContest(null);
                    }
                }

                // Trả về object chứa thông tin về các cuộc thi xóa thành công và thất bại
                return {
                    success: true,
                    successfulDeletes,
                    failedDeletes
                };
            } else {
                throw new Error('Có lỗi xảy ra khi xóa nhiều cuộc thi');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi xóa nhiều cuộc thi');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [currentContest]);

    return {
        contests,
        currentContest,
        loading,
        error,
        pagination,
        fetchContests,
        fetchContestById,
        createNewContest,
        updateExistingContest,
        toggleContestStatus,
        removeContest,
        removeManyContests
    };
};
