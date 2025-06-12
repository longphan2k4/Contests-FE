export interface ChangeAccountInfoData {
  username: string;
  email: string;
}

export interface ChangeAccountInfoFormProps {
  onSubmit: (formData: ChangeAccountInfoData) => void;
  error: string;
  changeAccountInfoStatus: string;
  initialData: ChangeAccountInfoData;
}