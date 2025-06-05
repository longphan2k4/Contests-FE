import { useState, useEffect, useCallback } from 'react';
import { getSchools, getSchoolById, createSchool, updateSchool, deleteSchool } from '../services';
import type { School, SchoolFilter, SchoolsResponse } from '../types/school';

// Hook để lấy danh sách trường học
export const useSchools = (initialFilter?: SchoolFilter) => {
  const [schools, setSchools] = useState<School[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<SchoolFilter>(initialFilter || {});

  const fetchSchools = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSchools(filter);
      setSchools(response.schools);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải danh sách trường học');
      setSchools([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  // Chỉ fetch khi component mount hoặc filter thay đổi căn bản
  // Không fetch lại khi isActive thay đổi (được xử lý ở client)
  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  // Dùng debounce để tránh fetch quá nhiều lần
  const updateFilter = useCallback((newFilter: Partial<SchoolFilter>) => {
    // Nếu chỉ là isActive thay đổi, không cần fetch lại
    if (Object.keys(newFilter).length === 1 && 'isActive' in newFilter) {
      setFilter(prev => ({
        ...prev,
        isActive: newFilter.isActive
      }));
      return;
    }

    setFilter((prev) => ({
      ...prev,
      ...newFilter,
      // Reset về trang đầu khi thay đổi bộ lọc
      page: newFilter.page !== undefined ? newFilter.page : 0
    }));
  }, []);

  return {
    schools,
    total,
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
      setError(err instanceof Error ? err.message : 'Lỗi khi tạo trường học mới');
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
      setError(err instanceof Error ? err.message : 'Lỗi khi cập nhật trường học');
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
      setError(err instanceof Error ? err.message : 'Lỗi khi xóa trường học');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error, success };
}; 