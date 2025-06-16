import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, setCurrentPage }) => {
  return (
    totalPages > 1 && (
      <div className="flex justify-center space-x-2 sm:space-x-4 mt-3 sm:mt-4">
        <button
          className={`px-3 sm:px-4 py-1 sm:py-2 text-white rounded-xl text-[11px] sm:text-base ${
            currentPage === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          aria-label="Trang trước"
        >
          Trang trước
        </button>
        <span className="text-white text-[11px] sm:text-base">
          Trang {currentPage} / {totalPages}
        </span>
        <button
          className={`px-3 sm:px-4 py-1 sm:py-2 text-white rounded-xl text-[11px] sm:text-base ${
            currentPage === totalPages ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          aria-label="Trang sau"
        >
          Trang sau
        </button>
      </div>
    )
  );
};

export default Pagination;