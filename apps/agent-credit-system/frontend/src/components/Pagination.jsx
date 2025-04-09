import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, search }) => {
  // Function to generate page numbers with ellipses for large number of pages
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 3; // Reduced from 5 to 3 for better space usage
    
    if (totalPages <= maxVisiblePages) {
      // If we have fewer pages than the max, just show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include page 1
      pageNumbers.push(1);
      
      // Calculate the start and end of the visible range around the current page
      let start = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(totalPages - 1, start + maxVisiblePages - 3);
      
      // Adjust start if end is too close to totalPages
      if (end === totalPages - 1) {
        start = Math.max(2, end - (maxVisiblePages - 3));
      }
      
      // Add ellipsis if start is after page 2
      if (start > 2) {
        pageNumbers.push('...');
      }
      
      // Add pages in the middle range
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis if end is before the last page - 1
      if (end < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Always include the last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center space-x-1 whitespace-nowrap overflow-x-auto py-2">
      <button
        onClick={() => onPageChange(1, search)}
        className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 text-xs sm:text-sm"
        disabled={currentPage <= 1}
        title="First Page"
      >
        «
      </button>
      
      <button
        onClick={() => onPageChange(currentPage - 1, search)}
        className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 text-xs sm:text-sm"
        disabled={currentPage <= 1}
      >
        ‹
      </button>

      {pageNumbers.map((pageNumber, index) => (
        pageNumber === '...' 
        ? (
          <span key={`ellipsis-${index}`} className="px-1 py-1 text-xs sm:text-sm">…</span>
        ) : (
          <button
            key={`page-${pageNumber}`}
            onClick={() => onPageChange(pageNumber, search)}
            className={`min-w-[28px] px-1 py-1 rounded text-xs sm:text-sm ${
              pageNumber === currentPage
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {pageNumber}
          </button>
        )
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1, search)}
        className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 text-xs sm:text-sm"
        disabled={currentPage >= totalPages}
      >
        ›
      </button>
      
      <button
        onClick={() => onPageChange(totalPages, search)}
        className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 text-xs sm:text-sm"
        disabled={currentPage >= totalPages}
        title="Last Page"
      >
        »
      </button>
    </div>
  );
};

export default Pagination; 