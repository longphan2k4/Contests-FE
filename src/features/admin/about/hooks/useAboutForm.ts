import { useState, useEffect } from 'react';
import type { About, AboutData } from '../types/about';
import { aboutSchema } from '../validations/aboutValidation';
import type { ZodIssue } from 'zod';

type FormErrors = Partial<Record<keyof AboutData, string>>;

interface UseAboutFormProps {
  initialData: About;
  onSubmit: (data: Partial<AboutData>, logoFile?: File | null, bannerFile?: File | null) => Promise<void>;
}

export const useAboutForm = ({ initialData, onSubmit }: UseAboutFormProps) => {
  const [formData, setFormData] = useState<Partial<AboutData>>(initialData.data);
  const [errors, setErrors] = useState<FormErrors>({});
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  useEffect(() => {
    setFormData(initialData.data);
  }, [initialData]);
  
  const validate = (): boolean => {
    const result = aboutSchema.safeParse(formData);
    
    if (!result.success) {
      const formattedErrors: FormErrors = {};
      result.error.errors.forEach((error: ZodIssue) => {
        const path = error.path[0];
        formattedErrors[path as keyof AboutData] = error.message;
      });
      setErrors(formattedErrors);
      return false;
    }
    
    setErrors({});
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when field is edited
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleLogoSelected = (file: File | null) => {
    setLogoFile(file);
  };

  const handleBannerSelected = (file: File | null) => {
    setBannerFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    // Làm sạch dữ liệu trước khi gửi
    const cleanedData = {
      ...formData,
      website: formData.website ? formData.website.trim().replace(/`/g, '') : '',
      fanpage: formData.fanpage ? formData.fanpage.trim().replace(/`/g, '') : '',
      mapEmbedCode: formData.mapEmbedCode ? formData.mapEmbedCode.replace(/`/g, '').replace(/\s+src=\s*"/g, ' src="') : ''
    };

    // Log dữ liệu để kiểm tra
    console.log('Form data to be submitted:', cleanedData);
    
    // Kiểm tra xem dữ liệu có trống không
    if (!cleanedData.schoolName || !cleanedData.departmentName) {
      setErrors({
        ...errors,
        schoolName: !cleanedData.schoolName ? 'Tên đơn vị không được để trống' : undefined,
        departmentName: !cleanedData.departmentName ? 'Tên phòng ban không được để trống' : undefined
      });
      return;
    }

    try {
      // Gửi cả dữ liệu và file trong một API duy nhất
      await onSubmit(cleanedData, logoFile, bannerFile);
    } catch (error) {
      console.error('Failed to submit form:', error);
    }
  };

  return {
    formData,
    errors,
    uploadError,
    setUploadError,
    handleChange,
    handleLogoSelected,
    handleBannerSelected,
    handleSubmit
  };
};

export default useAboutForm;