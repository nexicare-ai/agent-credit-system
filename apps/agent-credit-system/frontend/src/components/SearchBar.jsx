import React, { useState, useEffect, useRef } from 'react';

const SearchBar = ({ initialSearch = '', onSearch }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const timerRef = useRef(null);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Set a new timer for 2 seconds
    timerRef.current = setTimeout(() => {
      onSearch(value);
    }, 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Clear any pending timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    onSearch(searchTerm);
  };

  return (
    <div className="mb-4">
      <form onSubmit={handleSubmit}>
        <input
          type="search"
          placeholder="Search..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={handleChange}
        />
      </form>
    </div>
  );
};

export default SearchBar; 