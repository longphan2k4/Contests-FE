import React, { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import AddUserModal from '../components/AddUserModal';
import EditUserModal from '../components/EditUserModal';
import ViewUserModal from '../components/ViewUserModal';
import UsersTable from '../components/UsersTable';
import { useUsersFilter } from '../hooks/useUsersFilter';
import { usePagination } from '../hooks/usePagination';
import { useResponsive } from '../hooks/useResponsive';
import type { User, UserFormData } from '../types/User';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { isMobile } = useResponsive();
  const { search, setSearch, roleFilter, setRoleFilter, statusFilter, setStatusFilter, filteredUsers, handleClearFilters } = useUsersFilter(users);
  const { currentPage, setCurrentPage, totalPages, paginatedItems: paginatedUsers, startIndex } = usePagination(filteredUsers, 10);

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
  }, []);

  const handleAddUser = (newUserData: UserFormData) => {
    const newUser: User = {
      ...newUserData,
      id: Math.max(...users.map((u) => u.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setUsers([...users, newUser]);
  };

  const handleEditUser = (updatedUser: User) => {
    setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
  };

  const handleDeleteUser = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
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

      <UsersTable
        users={filteredUsers}
        search={search}
        setSearch={setSearch}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        isMobile={isMobile}
        paginatedUsers={paginatedUsers}
        handleClearFilters={handleClearFilters}
        handleViewUser={(user) => {
          setSelectedUser(user);
          setViewModalOpen(true);
        }}
        handleEditUser={(user) => {
          setSelectedUser(user);
          setEditModalOpen(true);
        }}
        handleDeleteUser={handleDeleteUser}
      />

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
                  Hiển thị <span className="font-medium">{startIndex + 1}</span> đến{' '}
                  <span className="font-medium">{Math.min(startIndex + 10, filteredUsers.length)}</span>{' '}
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

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500">Tổng người dùng</h3>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500">Admin</h3>
          <p className="text-xl sm:text-2xl font-bold text-purple-600">{users.filter((u) => u.role === 'Admin').length}</p>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500">Judge</h3>
          <p className="text-xl sm:text-2xl font-bold text-blue-600">{users.filter((u) => u.role === 'Judge').length}</p>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500">Đang hoạt động</h3>
          <p className="text-xl sm:text-2xl font-bold text-green-600">{users.filter((u) => u.isActive).length}</p>
        </div>
      </div>

      <AddUserModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} onAdd={handleAddUser} />
      <EditUserModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} user={selectedUser} onSave={handleEditUser} />
      <ViewUserModal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} user={selectedUser} />
    </div>
  );
};

export default UsersPage;