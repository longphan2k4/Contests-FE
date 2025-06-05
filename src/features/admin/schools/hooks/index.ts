import { useState, useEffect, useCallback } from 'react';
import { getSchools, getSchoolById, createSchool, updateSchool, deleteSchool, toggleSchoolActive } from '../services/schoolService';
import type { School, SchoolFilter} from '../types/school';

// Hook để lấy danh sách trường học
export const useSchools = (initialFilter?: SchoolFilter) => {
  const [schools, setSchools] = useState<School[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<SchoolFilter>(initialFilter || { page: 1, limit: 10 });

  const fetchSchools = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSchools(filter);
      
      // API trả về cấu trúc mới
      setSchools(response.school);
      setTotal(response.pagination.total);
      setTotalPages(response.pagination.totalPages);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải danh sách trường học');
      setSchools([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  // Chỉ fetch khi component mount hoặc filter thay đổi căn bản
  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  // Dùng debounce để tránh fetch quá nhiều lần
  const updateFilter = useCallback((newFilter: Partial<SchoolFilter>) => {
    setFilter((prev) => ({
      ...prev,
      ...newFilter,
    }));
  }, []);

  return {
    schools,
    total,
    totalPages,
    loading,
    error,
    filter,
    updateFilter,
    refresh: fetchSchools
  };
};

// Hook để lấy chi tiết một trường học
export const useSchool = (id?: number) => {
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchool = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getSchoolById(id);
      setSchool(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải thông tin trường học');
      setSchool(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSchool();
  }, [fetchSchool]);

  return { school, loading, error, refresh: fetchSchool };
};

// Hook để tạo trường học mới
export const useCreateSchool = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const create = async (schoolData: Partial<School>): Promise<School | null> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      const newSchool = await createSchool(schoolData);
      setSuccess(true);
      return newSchool;
    } catch (err) {
      // Xử lý lỗi từ backend
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        // Lấy thông báo lỗi từ response nếu có
        const errorMessage = axiosError.response?.data?.message || 'Lỗi khi tạo trường học mới';
        setError(errorMessage);
      } else {
        setError(err instanceof Error ? err.message : 'Lỗi khi tạo trường học mới');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error, success };
};

// Hook để cập nhật trường học
export const useUpdateSchool = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const update = async (id: number, schoolData: Partial<School>): Promise<School | null> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      const updatedSchool = await updateSchool(id, schoolData);
      setSuccess(true);
      return updatedSchool;
    } catch (err) {
      // Xử lý lỗi từ backend
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        // Lấy thông báo lỗi từ response nếu có
        const errorMessage = axiosError.response?.data?.message || `Lỗi khi cập nhật trường học (ID: ${id})`;
        setError(errorMessage);
      } else {
        setError(err instanceof Error ? err.message : `Lỗi khi cập nhật trường học (ID: ${id})`);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error, success };
};

// Hook để xóa trường học
export const useDeleteSchool = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const remove = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      await deleteSchool(id);
      setSuccess(true);
      return true;
    } catch (err) {
      // Xử lý lỗi từ backend
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        // Lấy thông báo lỗi từ response nếu có
        const errorMessage = axiosError.response?.data?.message || `Lỗi khi xóa trường học (ID: ${id})`;
        setError(errorMessage);
      } else {
        setError(err instanceof Error ? err.message : `Lỗi khi xóa trường học (ID: ${id})`);
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error, success };
};

// Hook để chuyển đổi trạng thái hoạt động của trường học
export const useToggleSchoolActive = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const toggle = async (id: number): Promise<School | null> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      const updatedSchool = await toggleSchoolActive(id);
      setSuccess(true);
      return updatedSchool;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi chuyển đổi trạng thái trường học');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { toggle, loading, error, success };
};