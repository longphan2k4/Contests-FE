import type { User } from '../types/User';

export const filterUsers = (users: User[], search: string, roleFilter: string, statusFilter: string) => {
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

  return filtered;
};