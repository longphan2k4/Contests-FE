import { useState, useEffect } from 'react';
import type { About, AboutData } from '../types/about';
import { getAboutInfo as getAboutFromService, updateAboutInfo as updateAboutFromService } from '../services/aboutService';

interface UseAboutReturn {
  about: About | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
  fetchAbout: () => Promise<void>;
  updateAboutInfo: (data: Partial<AboutData>, logoFile?: File | null, bannerFile?: File | null) => Promise<void>;
}

export const useAbout = (): UseAboutReturn => {
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAbout = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAboutFromService();
      setAbout(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi lấy thông tin giới thiệu');
      console.error('Error fetching about:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateAboutInfo = async (
    data: Partial<AboutData>, 
    logoFile?: File | null, 
    bannerFile?: File | null
  ): Promise<void> => {
    try {
      setUpdating(true);
      setError(null);
      const updatedAbout = await updateAboutFromService(data, logoFile, bannerFile);
      setAbout(updatedAbout);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật thông tin giới thiệu');
      console.error('Error updating about:', err);
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  return {
    about,
    loading,
    error,
    updating,
    fetchAbout,
    updateAboutInfo,
  };
};