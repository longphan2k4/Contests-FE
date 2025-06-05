import { useState, useEffect } from 'react';
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
      banner: ''}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Lấy dữ liệu ban đầu
  useEffect(() => {
    const fetchAboutInfo = async () => {
      try {
        // const data = getMockAboutInfo();
        const aboutInfo = await getAboutInfo();
        console.log(aboutInfo);
        setAboutInfo(aboutInfo);
      } catch (err) {
        setError('Không thể tải thông tin website');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutInfo();
  }, []);

  // Xử lý submit form
  const handleSubmit = async (data: About): Promise<void> => {
    try {
      setLoading(true);
      await updateAboutInfo(data.data);
      setAboutInfo(data);
    } catch (err) {
      setError('Không thể cập nhật thông tin website');
      console.error(err);
      throw err; // Ném lỗi để component có thể xử lý
    } finally {
      setLoading(false);
    }
  };

  // Khôi phục dữ liệu mặc định
  const handleResetToDefault = () => {
    const defaultData = getMockAboutInfo();
    setAboutInfo(defaultData);
  };

  return {
    aboutInfo,
    loading,
    error,
    handleSubmit,
    handleResetToDefault
  };
};

export default useAboutInfo;