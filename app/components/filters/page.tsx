"use client"; // Add this directive for client-side rendering in Next.js

import React, { useState, useEffect } from 'react';
import { FaBed, FaHome, FaBuilding, FaCar } from 'react-icons/fa'; // Updated icons
import { FaStar, FaStarHalf } from 'react-icons/fa'; // For star rating

interface SearchNavbarProps {
  onSearch: (search: string) => void;
  onPriceFilter: (min: number, max: number) => void;
  onRentalTypeChange: (type: string) => void;
  onSortChange: (order: string) => void;
  onStarRatingChange: (rating: number) => void;
  onPropertyTypeChange: (type: string) => void;
}

const SearchNavbar: React.FC<SearchNavbarProps> = ({
  onSearch,
  onPriceFilter,
  onRentalTypeChange,
  onSortChange,
  onStarRatingChange,
  onPropertyTypeChange,
}) => {
  const [search, setSearch] = useState<string>('');
  const [minRent, setMinRent] = useState<number | ''>('');
  const [maxRent, setMaxRent] = useState<number | ''>('');
  const [showPriceFilter, setShowPriceFilter] = useState<boolean>(false);
  const [rentalType, setRentalType] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('ascending');
  const [starRating, setStarRating] = useState<number>(0);
  const [propertyType, setPropertyType] = useState<string>('');
  const [showSavedSearches, setShowSavedSearches] = useState<boolean>(false);
  const [savedSearches, setSavedSearches] = useState<string[]>([]);

  useEffect(() => {
    // Load saved searches from local storage
    const searches = localStorage.getItem('savedSearches');
    if (searches) {
      setSavedSearches(JSON.parse(searches));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const priceFilter = document.getElementById('price-filter');
      const savedSearchesButton = document.getElementById('saved-searches-button');

      if (
        priceFilter &&
        !priceFilter.contains(target) &&
        savedSearchesButton &&
        !savedSearchesButton.contains(target)
      ) {
        setShowPriceFilter(false);
        setShowSavedSearches(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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

  const handleStarRatingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const rating = parseInt(event.target.value, 10);
    setStarRating(rating);
    onStarRatingChange(rating);
  };

  const handlePropertyTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = event.target.value;
    setPropertyType(newType);
    onPropertyTypeChange(newType);
  };


  const handleShowSavedSearches = () => {
    setShowSavedSearches(prev => !prev);
  };

  const handleModalClose = () => {
    setShowSavedSearches(false);
  };

  return (
    <div className="bg-white shadow-md py-4 px-6 w-full z-50">
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
          <div id="price-filter" className="relative w-full sm:w-48">
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
              <option value="studio">Studio <FaHome className="inline-block ml-2" /></option>
              <option value="one-bedroom">1 Bedroom <FaBed className="inline-block ml-2" /></option>
              <option value="two-bedrooms">2 Bedrooms <FaBuilding className="inline-block ml-2" /></option>
              <option value="three-bedrooms">3 Bedrooms <FaCar className="inline-block ml-2" /></option>
              <option value="four-bedrooms">4+ Bedrooms <FaCar className="inline-block ml-2" /></option>
            </select>
          </div>

          {/* Star Rating Filter */}
          <div className="relative w-full sm:w-48">
            <select
              value={starRating}
              onChange={handleStarRatingChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              <option value="0">Select Star Rating</option>
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>

          {/* Property Type Filter */}
          <div className="relative w-full sm:w-48">
            <select
              value={propertyType}
              onChange={handlePropertyTypeChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              <option value="">Property Type</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="apartment">Apartment</option>
              <option value="townhouse">Townhouse</option>
            </select>
          </div>

          {/* Sort Order */}
          <button
            onClick={handleSortChange}
            className="w-full sm:w-48 px-4 py-2 border rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sort: {sortOrder === 'ascending' ? 'Ascending' : 'Descending'}
          </button>
        </div>
        

        {/* Saved Searches Button */}
        <button
          id="saved-searches-button"
          onClick={handleShowSavedSearches}
          className="w-full sm:w-48 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Saved Searches
        </button>

        {/* Saved Searches Modal */}
        {showSavedSearches && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
              <h2 className="text-xl font-semibold mb-4">Saved Searches</h2>
              <ul>
                {savedSearches.map((search, index) => (
                  <li key={index} className="border-b py-2">{search}</li>
                ))}
              </ul>
              <button
                onClick={handleModalClose}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchNavbar;
