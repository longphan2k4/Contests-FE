export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ChangePasswordFormProps {
  onSubmit: (formData: ChangePasswordData) => void;
  error: string;
  changePasswordStatus: string;
}