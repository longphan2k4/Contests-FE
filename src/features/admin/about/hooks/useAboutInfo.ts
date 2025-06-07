import { useState, useEffect, useCallback } from 'react';
import { getAboutInfo, updateAboutInfo } from '../services/aboutService';
import type { About } from '../types/about';

export const useAboutInfo = () => {
  const [aboutInfo, setAboutInfo] = useState<About>({
    data: {
      schoolName: '',
      website: '',
      departmentName: '',
      email: '',
      fanpage: '',
      mapEmbedCode: '',
      isActive: true,
      logo: '',
      banner: '',
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAboutInfo = useCallback(async () => {
    try {
      setLoading(true);
      const aboutData = await getAboutInfo();
      setAboutInfo(aboutData);
    } catch (err) {
      setError('Không thể tải thông tin website');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAboutInfo();
  }, [fetchAboutInfo]);

  const handleSubmit = async (data: About): Promise<void> => {
    try {
      setLoading(true);
      await updateAboutInfo(data.data);
      setAboutInfo(data);
    } catch (err) {
      setError('Không thể cập nhật thông tin website');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleResetToDefault = useCallback(async () => {
    try {
      const defaultData = await getAboutInfo();
      setAboutInfo(defaultData);
    } catch (err) {
      setError('Không thể tải thông tin mặc định');
      console.error(err);
    }
  }, []);

  return {
    aboutInfo,
    loading,
    error,
    handleSubmit,
    handleResetToDefault
  };
};

export default useAboutInfo;