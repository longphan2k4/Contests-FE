export type User = {
  id: number;
  username: string;
  password: string;
  email: string;
  role: 'Admin' | 'Judge';
  isActive: boolean;
  token?: string;
  createdAt: string;
  updatedAt: string;
};

export type UserFormData = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'token'>;