import { useState, useEffect, useCallback } from "react";
import { getSchools } from "../services/schoolService";
import type { School, SchoolFilter, SchoolsResponse } from "../types/school";

export const useSchools = (initialFilter?: SchoolFilter) => {
  const [schools, setSchools] = useState<School[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<SchoolFilter>(
    initialFilter || { page: 1, limit: 10 }
  );

  const fetchSchools = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response: SchoolsResponse = await getSchools(filter);

      setSchools(response.school);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Lỗi khi tải danh sách trường học"
      );
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
    setFilter(prev => ({
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
    refresh: fetchSchools,
  };
};
