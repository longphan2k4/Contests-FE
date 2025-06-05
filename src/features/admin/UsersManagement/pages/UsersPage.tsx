import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  EyeIcon, 
  PencilIcon, 
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';

// Type định nghĩa cho User
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

const ActionDropdown: React.FC<{
  user: User;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}> = ({ user, onView, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-gray-600"
      >
        <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <button
            onClick={() => onView(user)}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Xem chi tiết
          </button>
          <button
            onClick={() => onEdit(user)}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Chỉnh sửa
          </button>
          <button
            onClick={() => onDelete(user.id)}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Xóa
          </button>
        </div>
      )}
    </div>
  );
};

// AddUserModal
const AddUserModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAdd: (user: UserFormData) => void;
}> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    password: '',
    email: '',
    role: 'Judge',
    isActive: true,
  });
  const [isVisible, setIsVisible] = useState(false);

  // Handle fade-in and fade-out animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200); // Match fade-out duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      username: '',
      password: '',
      email: '',
      role: 'Judge',
      isActive: true,
    });
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-200 ease-in-out ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose} // Close modal when clicking outside
    >
      <div
        className={`bg-white rounded-lg w-full h-full md:w-auto md:h-auto md:max-w-md max-h-[90vh] overflow-y-auto p-6 transform transition-transform duration-200 ease-in-out ${
          isOpen ? 'scale-100' : 'scale-90'
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h2 className="text-xl font-semibold mb-4">Thêm người dùng mới</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Tên đăng nhập</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Mật khẩu</label>
              <input
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Vai trò</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'Admin' | 'Judge' })}
              >
                <option value="Judge">Judge</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="flex items-center pt-6">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="isActive" className="text-sm font-medium">Kích hoạt</label>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto min-h-[44px] px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto min-h-[44px] px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// EditUserModal
const EditUserModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (user: User) => void;
}> = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState<User | null>(user);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  // Handle fade-in and fade-out animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200); // Match fade-out duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave({ ...formData, updatedAt: new Date().toISOString() });
      onClose();
    }
  };

  if (!isVisible || !formData) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-200 ease-in-out ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg w-full h-full md:w-auto md:h-auto md:max-w-md max-h-[90vh] overflow-y-auto p-6 transform transition-transform duration-200 ease-in-out ${
          isOpen ? 'scale-100' : 'scale-90'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Chỉnh sửa người dùng</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Tên đăng nhập</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Vai trò</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'Admin' | 'Judge' })}
              >
                <option value="Judge">Judge</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="flex items-center pt-6">
              <input
                type="checkbox"
                id="editIsActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="editIsActive" className="text-sm font-medium">Kích hoạt</label>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto min-h-[44px] px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto min-h-[44px] px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ViewUserModal
const ViewUserModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}> = ({ isOpen, onClose, user }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Handle fade-in and fade-out animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200); // Match fade-out duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible || !user) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-200 ease-in-out ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg w-full h-full md:w-auto md:h-auto md:max-w-md max-h-[90vh] overflow-y-auto p-6 transform transition-transform duration-200 ease-in-out ${
          isOpen ? 'scale-100' : 'scale-90'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Chi tiết người dùng</h2>
        <div className="space-y-3">
          <div className="flex">
            <span className="font-medium w-24">ID:</span>
            <span>{user.id}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-24">Tên:</span>
            <span>{user.username}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-24">Email:</span>
            <span>{user.email}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-24">Vai trò:</span>
            <span className={`px-2 py-1 rounded text-xs ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
              {user.role}
            </span>
          </div>
          <div className="flex">
            <span className="font-medium w-24">Trạng thái:</span>
            <span className={`px-2 py-1 rounded text-xs ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
            </span>
          </div>
          <div className="flex">
            <span className="font-medium w-24">Tạo lúc:</span>
            <span>{new Date(user.createdAt).toLocaleString('vi-VN')}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-24">Cập nhật:</span>
            <span>{new Date(user.updatedAt).toLocaleString('vi-VN')}</span>
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="w-full sm:w-auto min-h-[44px] px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
// Main Component
const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const itemsPerPage = 10;

  // Check mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Mock data
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: 1,
        username: 'admin',
        password: '***hidden***',
       

 email: 'admin@example.com',
        role: 'Admin',
        isActive: true,
        createdAt: '2024-01-15T10:30:00.000Z',
        updatedAt: '2024-01-15T10:30:00.000Z',
      },
      {
        id: 2,
        username: 'judge01',
        password: '***hidden***',
        email: 'judge01@example.com',
        role: 'Judge',
        isActive: true,
        createdAt: '2024-01-16T09:15:00.000Z',
        updatedAt: '2024-01-16T09:15:00.000Z',
      },
      {
        id: 3,
        username: 'judge02',
        password: '***hidden***',
        email: 'judge02@example.com',
        role: 'Judge',
        isActive: false,
        createdAt: '2024-01-17T14:20:00.000Z',
        updatedAt: '2024-01-17T14:20:00.000Z',
      },
      {
        id: 4,
        username: 'moderator',
        password: '***hidden***',
        email: 'mod@example.com',
        role: 'Admin',
        isActive: true,
        createdAt: '2024-01-18T11:45:00.000Z',
        updatedAt: '2024-01-18T11:45:00.000Z',
      },
    ];
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  // Filter effect
  useEffect(() => {
    let filtered = users;

    if (search) {
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (roleFilter) {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    if (statusFilter) {
      const isActive = statusFilter === 'active';
      filtered = filtered.filter((user) => user.isActive === isActive);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [users, search, roleFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handleAddUser = (newUserData: UserFormData) => {
    const newUser: User = {
      ...newUserData,
      id: Math.max(...users.map(u => u.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setUsers([...users, newUser]);
  };

  const handleEditUser = (updatedUser: User) => {
    setUsers(users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
  };

  const handleDeleteUser = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setRoleFilter('');
    setStatusFilter('');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
        <button
          onClick={() => setAddModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center min-h-[44px] px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Thêm người dùng
        </button>
      </div>

      {/* Filters */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">Tất cả vai trò</option>
            <option value="Admin">Admin</option>
            <option value="Judge">Judge</option>
          </select>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
          <button
            onClick={handleClearFilters}
            className="px-3 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Table/Card Layout */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm sm:text-base font-medium text-gray-900">Không có người dùng</h3>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">Bắt đầu bằng cách thêm người dùng mới.</p>
        </div>
      ) : isMobile ? (
        <div className="space-y-4">
          {paginatedUsers.map((user) => (
            <div key={user.id} className="bg-white p-4 rounded-lg shadow border">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{user.username}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <ActionDropdown
                  user={user}
                  onView={() => {
                    setSelectedUser(user);
                    setViewModalOpen(true);
                  }}
                  onEdit={() => {
                    setSelectedUser(user);
                    setEditModalOpen(true);
                  }}
                  onDelete={() => handleDeleteUser(user.id)}
                />
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className={`px-2 py-1 rounded-full ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                  {user.role}
                </span>
                <span className={`px-2 py-1 rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên đăng nhập
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setViewModalOpen(true);
                          }}
                          className="p-2 sm:p-1 text-blue-600 hover:text-blue-900 transition-colors"
                          title="Xem chi tiết"
                        >
                          <EyeIcon className="w-5 h-5 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setEditModalOpen(true);
                          }}
                          className="p-2 sm:p-1 text-green-600 hover:text-green-900 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <PencilIcon className="w-5 h-5 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 sm:p-1 text-red-600 hover:text-red-900 transition-colors"
                          title="Xóa"
                        >
                          <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex sm:hidden w-full justify-between">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex-1 mr-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Trước
              </button>
              <span className="flex items-center px-4 text-sm text-gray-700">
                {currentPage}/{totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex-1 ml-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau →
              </button>
            </div>
            <div className="hidden sm:flex sm:items-center sm:justify-between w-full">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị{' '}
                  <span className="font-medium">{startIndex + 1}</span> đến{' '}
                  <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredUsers.length)}</span>{' '}
                  trong tổng số <span className="font-medium">{filteredUsers.length}</span> kết quả
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Trang trước</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNumber
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Trang sau</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500">Tổng người dùng</h3>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500">Admin</h3>
          <p className="text-xl sm:text-2xl font-bold text-purple-600">{users.filter(u => u.role === 'Admin').length}</p>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500">Judge</h3>
          <p className="text-xl sm:text-2xl font-bold text-blue-600">{users.filter(u => u.role === 'Judge').length}</p>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500">Đang hoạt động</h3>
          <p className="text-xl sm:text-2xl font-bold text-green-600">{users.filter(u => u.isActive).length}</p>
        </div>
      </div>

      {/* Modals */}
      <AddUserModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} onAdd={handleAddUser} />
      <EditUserModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} user={selectedUser} onSave={handleEditUser} />
      <ViewUserModal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} user={selectedUser} />
    </div>
  );
};

export default UsersPage;