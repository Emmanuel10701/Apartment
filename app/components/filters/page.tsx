"use client"; // Ensure client-side rendering in Next.js

import React, { useState, useEffect, useRef } from 'react';
import {
  FaBed,
  FaHome,
  FaBuilding,
  FaCar,
  FaSortUp,
  FaSortDown,
  FaTimes
} from 'react-icons/fa';
import { IoFilterSharp } from "react-icons/io5";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface SearchNavbarProps {
  onSearch: (filters: SearchFilters) => void;
}

interface SearchFilters {
  search: string;
  minRent?: number;
  maxRent?: number;
  rentalType?: string;
  sortOrder?: string;
  starRating?: number;
  propertyType?: string;
}

const SearchNavbar: React.FC<SearchNavbarProps> = ({
  onSearch,
}) => {
  const [search, setSearch] = useState<string>('');
  const [minRent, setMinRent] = useState<number | ''>('');
  const [maxRent, setMaxRent] = useState<number | ''>('');
  const [rentalType, setRentalType] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('ascending');
  const [starRating, setStarRating] = useState<number>(0);
  const [propertyType, setPropertyType] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [savedSearches, setSavedSearches] = useState<string[]>([]);

  const modalRef = useRef<HTMLDivElement>(null);

  // Load saved searches from localStorage
  useEffect(() => {
    const searches = localStorage.getItem('savedSearches');
    if (searches) {
      setSavedSearches(JSON.parse(searches));
    }
  }, []);

  // Handle clicks outside the modal to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showModal &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = event.target.value;
    setSearch(newSearch);
    // Optionally, you can call onSearch here for real-time search
    // onSearch({ search: newSearch });
  };

  const handleFiltersSubmit = () => {
    // Validate Price Range
    if (minRent !== '' && maxRent !== '' && minRent > maxRent) {
      toast.error("Min Rent cannot be greater than Max Rent.");
      return;
    }

    // Prepare Filters Object
    const filters: SearchFilters = {
      search: search.trim(),
    };

    if (minRent !== '' && maxRent !== '') {
      filters.minRent = Number(minRent);
      filters.maxRent = Number(maxRent);
    } else if (minRent !== '' && maxRent === '') {
      filters.minRent = Number(minRent);
    } else if (minRent === '' && maxRent !== '') {
      filters.maxRent = Number(maxRent);
    }

    if (rentalType) {
      filters.rentalType = rentalType;
    }

    if (sortOrder) {
      filters.sortOrder = sortOrder;
    }

    if (starRating > 0) {
      filters.starRating = starRating;
    }

    if (propertyType) {
      filters.propertyType = propertyType;
    }

    // Call the onSearch prop with the filters
    onSearch(filters);

    // Close the modal
    setShowModal(false);
    toast.success("Filters applied successfully!");
  };

  return (
    <div className="bg-white shadow-md py-4 px-6 w-full z-50">
      <ToastContainer />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="London, UK"
          className="w-full sm:w-80 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Filters Button */}
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-48 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          Filters
          <IoFilterSharp />
        </button>

        {/* Sort Order Button */}
        <button
          onClick={() => {
            const newOrder = sortOrder === 'ascending' ? 'descending' : 'ascending';
            setSortOrder(newOrder);
            onSearch({
              search: search.trim(),
              sortOrder: newOrder,
              rentalType,
              starRating,
              propertyType,
              minRent: minRent !== '' ? Number(minRent) : undefined,
              maxRent: maxRent !== '' ? Number(maxRent) : undefined,
            });
          }}
          className={`w-full sm:w-48 px-3 py-1 border rounded-lg flex items-center justify-between focus:outline-none focus:ring-2 ${
            sortOrder === 'ascending'
              ? 'bg-white text-blue-600 focus:ring-blue-500'
              : 'bg-red-100 text-red-600 focus:ring-red-500'
          } text-sm`}
        >
          <span>Sort: {sortOrder === 'ascending' ? 'Ascending' : 'Descending'}</span>
          {sortOrder === 'ascending' ? <FaSortUp /> : <FaSortDown />}
        </button>
      </div>

      {/* Filters Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <FaTimes className="h-6 w-6" />
            </button>

            <h2 className="text-2xl font-semibold mb-4">Filters</h2>

            <div className="space-y-4">
              {/* Star Rating Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Star Rating
                </label>
                <select
                  value={starRating}
                  onChange={(e) => setStarRating(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="0">Select Star Rating</option>
                  <option value="1">1 Star</option>
                  <option value="2">2 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>

              {/* Rental Type Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rental Type
                </label>
                <select
                  value={rentalType}
                  onChange={(e) => setRentalType(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Select Rental Type</option>
                  <option value="studio">Studio <FaHome className="inline-block ml-2" /></option>
                  <option value="one-bedroom">1 Bedroom <FaBed className="inline-block ml-2" /></option>
                  <option value="two-bedrooms">2 Bedrooms <FaBuilding className="inline-block ml-2" /></option>
                  <option value="three-bedrooms">3 Bedrooms <FaCar className="inline-block ml-2" /></option>
                  <option value="four-bedrooms">4+ Bedrooms <FaCar className="inline-block ml-2" /></option>
                </select>
              </div>

              {/* Property Type Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Select Property Type</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="apartment">Apartment</option>
                  <option value="townhouse">Townhouse</option>
                </select>
              </div>

              {/* Price Range Inputs */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Range
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={minRent}
                    onChange={(e) => setMinRent(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    placeholder="Min Rent"
                    className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <input
                    type="number"
                    value={maxRent}
                    onChange={(e) => setMaxRent(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    placeholder="Max Rent"
                    className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={handleFiltersSubmit}
              className="mt-6 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              Search
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchNavbar;
