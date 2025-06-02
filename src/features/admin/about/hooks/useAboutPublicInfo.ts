import { useState, useEffect } from 'react';
import { getMockAboutInfo } from '../services/aboutService';
import type { About } from '../types/about';

export const useAboutPublicInfo = () => {
  const [aboutInfo, setAboutInfo] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAboutInfo = async () => {
      try {
        const data = getMockAboutInfo();
        setAboutInfo(data);
      } catch (err) {
        setError('Không thể tải thông tin website');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutInfo();
  }, []);

  return {
    aboutInfo,
    loading,
    error
  };
};

export default useAboutPublicInfo; 