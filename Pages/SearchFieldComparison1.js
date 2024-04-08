import React, { useState } from 'react';

const SearchField = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Enter card name"
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchField;
