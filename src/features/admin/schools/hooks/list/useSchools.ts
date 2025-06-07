import { useState, useEffect, useCallback } from 'react';
import { getSchools } from '../../services/schoolService';
import type { School, SchoolFilter } from '../../types/school';

export const useSchools = (initialFilter?: SchoolFilter) => {
  const [schools, setSchools] = useState<School[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<SchoolFilter>({
    page: 1,
    limit: 10,
    ...initialFilter
  });
  const fetchSchools = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSchools(filter);
      setSchools(response.school);
      setTotal(response.pagination.total);
      setTotalPages(response.pagination.totalPages);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải danh sách trường học');
      setSchools([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  const updateFilter = useCallback((newFilter: Partial<SchoolFilter>) => {
    setFilter((prev) => {
      // Nếu thay đổi search hoặc isActive thì reset page về 1
      if (newFilter.search !== undefined || newFilter.isActive !== undefined) {
        return {
          ...prev,
          ...newFilter,
          page: 1
        };
      }
      // Nếu chỉ thay đổi page hoặc limit thì giữ nguyên
      return {
        ...prev,
        ...newFilter
      };
    });
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