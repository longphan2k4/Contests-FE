import { useState, useEffect } from 'react';
import { ZodError } from 'zod';
import type { School } from '../../types/school';
import type { ValidationError } from '../../types/validation';
import { CreateSchoolSchema, UpdateSchoolSchema } from '../../schemas/schoolSchema';
import { useNotification } from '../../../../../hooks';

const DEFAULT_FORM_DATA: Partial<School> = {
  name: '',
  address: '',
  email: '',
  phone: '',
  isActive: true
};

export const useSchoolForm = (
  initialData: Partial<School> = {},
  onSubmit: (data: Partial<School>) => void,
  validationErrors: ValidationError[] = []
) => {
  const [formData, setFormData] = useState<Partial<School>>({
    ...DEFAULT_FORM_DATA,
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    showErrorNotification,
  } = useNotification();

  // Cập nhật lỗi validation từ backend
  useEffect(() => {
    const newErrors: Record<string, string> = {};
    validationErrors.forEach((error) => {
      newErrors[error.field] = error.message;
    });
    setErrors(newErrors);
  }, [validationErrors]);

  useEffect(() => {
    if (
      initialData &&
      Object.keys(initialData).length > 0
    ) {
      setFormData({
        ...DEFAULT_FORM_DATA,
        ...initialData
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    try {
      const schema = Object.keys(initialData).length > 0 ? UpdateSchoolSchema : CreateSchoolSchema;
      schema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0];
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
        const firstError = Object.values(newErrors)[0];
        showErrorNotification(firstError);
      }
      return false;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return {
    formData,
    errors,
    handleChange,
    handleSwitchChange,
    handleSubmit
  };
}; 