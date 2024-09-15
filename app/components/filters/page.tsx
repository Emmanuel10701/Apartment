import React, { useState, useEffect } from 'react';
import { FaBed, FaHome, FaBuilding, FaCar } from 'react-icons/fa'; // Updated icons

interface SearchNavbarProps {
  onSearch: (search: string) => void;
  onPriceFilter: (min: number, max: number) => void;
  onRentalTypeChange: (type: string) => void;
  onSortChange: (order: string) => void;
}

const SearchNavbar: React.FC<SearchNavbarProps> = ({ onSearch, onPriceFilter, onRentalTypeChange, onSortChange }) => {
  const [search, setSearch] = useState<string>('');
  const [minRent, setMinRent] = useState<number | ''>('');
  const [maxRent, setMaxRent] = useState<number | ''>('');
  const [showPriceFilter, setShowPriceFilter] = useState<boolean>(false);
  const [rentalType, setRentalType] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('ascending');
  const [showSavedSearches, setShowSavedSearches] = useState<boolean>(false);
  const [savedSearches, setSavedSearches] = useState<string[]>([]);

  useEffect(() => {
    // Load saved searches from local storage
    const searches = localStorage.getItem('savedSearches');
    if (searches) {
      setSavedSearches(JSON.parse(searches));
    }
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = event.target.value;
    setSearch(newSearch);
    onSearch(newSearch);
  };

  const handlePriceFilterClick = () => {
    setShowPriceFilter(prev => !prev);
  };

  const handlePriceRangeChange = () => {
    if (typeof minRent === 'number' && typeof maxRent === 'number') {
      onPriceFilter(minRent, maxRent);
    }
  };

  const handleMinRentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinRent(parseFloat(event.target.value));
  };

  const handleMaxRentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxRent(parseFloat(event.target.value));
  };

  const handleRentalTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = event.target.value;
    setRentalType(newType);
    onRentalTypeChange(newType);
  };

  const handleSortChange = () => {
    const newOrder = sortOrder === 'ascending' ? 'descending' : 'ascending';
    setSortOrder(newOrder);
    onSortChange(newOrder);
  };

  const handleSaveSearch = () => {
    // Save search to local storage
    if (search.trim()) {
      const updatedSearches = [search, ...savedSearches];
      setSavedSearches(updatedSearches);
      localStorage.setItem('savedSearches', JSON.stringify(updatedSearches));
      setSearch('');
    }
  };

  const handleShowSavedSearches = () => {
    setShowSavedSearches(prev => !prev);
  };

  const handleModalClose = () => {
    setShowSavedSearches(false);
  };

  return (
    <div className="bg-white shadow-md py-4 px-6 fixed top-0 left-0 w-full z-50">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="London, UK"
          className="w-full sm:w-80 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Filters Container */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Price Filter */}
          <div className="relative w-full sm:w-48">
            <button
              onClick={handlePriceFilterClick}
              className="w-full px-4 py-2 border rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Price
            </button>
            {showPriceFilter && (
              <div className="absolute top-full left-0 mt-2 p-4 border bg-white shadow-lg rounded-lg w-full">
                <label className="block mb-2">Min Rent</label>
                <input
                  type="number"
                  value={minRent || ''}
                  onChange={handleMinRentChange}
                  placeholder="Min Rent"
                  className="w-full px-4 py-2 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label className="block mb-2">Max Rent</label>
                <input
                  type="number"
                  value={maxRent || ''}
                  onChange={handleMaxRentChange}
                  placeholder="Max Rent"
                  className="w-full px-4 py-2 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handlePriceRangeChange}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Rental Type Filter */}
          <div className="relative w-full sm:w-48">
            <select
              value={rentalType}
              onChange={handleRentalTypeChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              <option value="">Rental Type</option>
              <option value="studio">Studio <FaHome className="inline-block ml-2 text-green-600" /></option>
              <option value="one-bedroom">1 Bedroom <FaBed className="inline-block ml-2 text-blue-600" /></option>
              <option value="two-bedrooms">2 Bedrooms <FaBuilding className="inline-block ml-2 text-orange-600" /></option>
              <option value="three-bedrooms">3 Bedrooms <FaCar className="inline-block ml-2 text-indigo-600" /></option>
              <option value="four-bedrooms">4+ Bedrooms <FaCar className="inline-block ml-2 text-slate-600" /></option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={handleSaveSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save Search
          </button>
          <button
            type="button"
            onClick={handleSortChange}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Sort {sortOrder === 'ascending' ? '▲' : '▼'}
          </button>
          <button
            type="button"
            onClick={handleShowSavedSearches}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Show Saved Searches
          </button>
        </div>
      </div>

      {/* Saved Searches Modal */}
      {showSavedSearches && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Saved Searches</h2>
            <ul>
              {savedSearches.length > 0 ? (
                savedSearches.map((search, index) => (
                  <li
                    key={index}
                    className={`p-2 mb-2 border rounded-lg cursor-pointer hover:bg-transparent hover:border-blue-500 ${index % 2 === 0 ? 'bg-slate-100' : 'bg-indigo-100'}`}
                  >
                    {search}
                  </li>
                ))
              ) : (
                <p>No saved searches</p>
              )}
            </ul>
            <button
              onClick={handleModalClose}
              className="mt-4 px-4 py-2 items-center flex justify-center bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchNavbar;
