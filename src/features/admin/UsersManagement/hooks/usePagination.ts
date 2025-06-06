import { useState } from 'react';

export const usePagination = (items: any[], itemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems,
    startIndex,
  };
};