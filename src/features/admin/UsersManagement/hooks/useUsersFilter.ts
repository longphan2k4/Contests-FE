import { useState, useEffect } from 'react';
import type { User } from '../types/User';
import { filterUsers } from '../utils/filterUsers';

export const useUsersFilter = (users: User[]) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);

  useEffect(() => {
    const filtered = filterUsers(users, search, roleFilter, statusFilter);
    setFilteredUsers(filtered);
  }, [users, search, roleFilter, statusFilter]);

  const handleClearFilters = () => {
    setSearch('');
    setRoleFilter('');
    setStatusFilter('');
  };

  return {
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    filteredUsers,
    handleClearFilters,
  };
};