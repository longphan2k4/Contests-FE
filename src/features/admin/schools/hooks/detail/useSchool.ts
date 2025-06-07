import { useState, useEffect, useCallback } from 'react';
import { getSchoolById } from '../../services/schoolService';
import type { School } from '../../types/school';

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