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
          className={`px-3 sm:px-4 py-1 sm:py-2 rounded-xl text-[11px] sm:text-base font-semibold border-2 transition-all duration-300 shadow-md ${
            currentPage === 1 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
              : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50 hover:border-blue-400'
          }`}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          aria-label="Trang trước"
        >
          Trang trước
        </button>
        <span className="text-blue-800 text-[11px] sm:text-base font-semibold flex items-center px-3 bg-blue-50 rounded-xl border border-blue-200">
          Trang {currentPage} / {totalPages}
        </span>
        <button
          className={`px-3 sm:px-4 py-1 sm:py-2 rounded-xl text-[11px] sm:text-base font-semibold border-2 transition-all duration-300 shadow-md ${
            currentPage === totalPages 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
              : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50 hover:border-blue-400'
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