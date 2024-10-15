"use client"; // Ensure client-side rendering in Next.js

import React, { useState, useEffect, useRef } from 'react';
import {
  FaBed,
  FaHome,
  FaBuilding,
  FaCar,
  FaTimes
} from 'react-icons/fa';
import { FaArrowDown } from "react-icons/fa6";
import { FaArrowUp } from "react-icons/fa6";
import { IoFilterSharp } from "react-icons/io5";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface SearchNavbarProps {
  onSearch: (filters: SearchFilters) => void;
}

interface SearchFilters {
  search: string;
  location: string;  // Added location property
  minRent?: number;
  maxRent?: number;
  rentalType?: string;
  sortOrder?: string;
  starRating?: number;
  propertyType?: string;
}

const SearchNavbar: React.FC<SearchNavbarProps> = ({ onSearch }) => {
  const [search, setSearch] = useState<string>('');
  const [location, setLocation] = useState<string>('');  // New state for location
  const [minRent, setMinRent] = useState<number | ''>('');  
  const [maxRent, setMaxRent] = useState<number | ''>('');  
  const [rentalType, setRentalType] = useState<string>('');  
  const [sortOrder, setSortOrder] = useState<string>('ascending');  
  const [starRating, setStarRating] = useState<number>(0);  
  const [propertyType, setPropertyType] = useState<string>('');  
  const [showModal, setShowModal] = useState<boolean>(false);  

  const modalRef = useRef<HTMLDivElement>(null);

 

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showModal && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value);  // Handle location input
  };

  const handleFiltersSubmit = () => {
    if (minRent !== '' && maxRent !== '' && minRent > maxRent) {
      toast.error("Min Rent cannot be greater than Max Rent.");
      return;
    }

    const filters: SearchFilters = {
      search: search.trim(),
      location: location.trim(),  // Include location in filters
    };

    if (minRent !== '' && maxRent !== '') {
      filters.minRent = Number(minRent);
      filters.maxRent = Number(maxRent);
    } else if (minRent !== '' && maxRent === '') {
      filters.minRent = Number(minRent);
    } else if (minRent === '' && maxRent !== '') {
      filters.maxRent = Number(maxRent);
    }

    if (rentalType) filters.rentalType = rentalType;
    if (sortOrder) filters.sortOrder = sortOrder;
    if (starRating > 0) filters.starRating = starRating;
    if (propertyType) filters.propertyType = propertyType;

    onSearch(filters);
    setShowModal(false);
    toast.success("Filters applied successfully!");
  };

  const clearFilters = () => {
    setSearch('');
    setLocation('');  // Clear location state
    setMinRent('');
    setMaxRent('');
    setRentalType('');
    setSortOrder('ascending');
    setStarRating(0);
    setPropertyType('');

    onSearch({
      search: '',
      location: '',  // Clear location in filters
      minRent: undefined,
      maxRent: undefined,
      rentalType: '',
      sortOrder: 'ascending',
      starRating: 0,
      propertyType: '',
    });

    toast.success("Filters cleared!");
  };

  return (
    <div className="bg-white shadow-md py-4 px- my-4 w-full z-50">
      <ToastContainer />
      <div className="flex flex-col sm:flex-row items-center justify-evenly gap-4">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center w-full sm:w-48 px-4 py-3 hover:outline-2 bg-slate-100 text-slate-500 rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <IoFilterSharp className="mr-2" />
          Filters
        </button>

        <button
          onClick={() => {
            const newOrder = sortOrder === 'ascending' ? 'descending' : 'ascending';
            setSortOrder(newOrder);
            onSearch({
              search: search.trim(),
              location: location.trim(),  // Include location in sorting
              sortOrder: newOrder,
              rentalType,
              starRating,
              propertyType,
              minRent: minRent !== '' ? Number(minRent) : undefined,
              maxRent: maxRent !== '' ? Number(maxRent) : undefined,
            });
          }}
          className={`w-full sm:w-48 px-3 py-3 border rounded-md flex items-center justify-between focus:outline-2 hover:outline-2 focus:ring-2 ${
            sortOrder === 'ascending'
              ? 'bg-white text-blue-600 focus:ring-blue-500'
              : 'bg-red-100 text-red-600 focus:ring-red-500'
          } text-sm`}
        >
          <span>Sort: {sortOrder === 'ascending' ? 'Ascending' : 'Descending'}</span>
          {sortOrder === 'ascending' ? <FaArrowUp /> : <FaArrowDown />}
        </button>

        <button
          onClick={clearFilters}
          className="w-full sm:w-48 px-4 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-2 focus:ring-2 focus:ring-gray-500 text-sm"
        >
          Clear Filters
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <FaTimes className="h-6 w-6" />
            </button>

            <h2 className="text-2xl font-semibold mb-4">Filters</h2>

            <div className="space-y-4">
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
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <option key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

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
                  <option value="studio">Studio</option>
                  <option value="one-bedroom">1 Bedroom</option>
                  <option value="two-bedrooms">2 Bedrooms</option>
                  <option value="three-bedrooms">3 Bedrooms</option>
                  <option value="four-bedrooms">4+ Bedrooms</option>
                </select>
              </div>

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
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="loft">Loft</option>
                </select>
              </div>

              <div className="flex gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Rent
                  </label>
                  <input
                    type="number"
                    value={minRent}
                    onChange={(e) => setMinRent(e.target.value !== '' ? Number(e.target.value) : '')}
                    placeholder="Min Rent"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Rent
                  </label>
                  <input
                    type="number"
                    value={maxRent}
                    onChange={(e) => setMaxRent(e.target.value !== '' ? Number(e.target.value) : '')}
                    placeholder="Max Rent"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
              <div className='flex gap-2 items-center justify-evenly'>

              <div className="mt-4">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
                >
                  Clear Filters
                </button>
              </div>

              <div className="mt-4">
                <button
                  onClick={handleFiltersSubmit}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  Apply Filters
                </button>
              </div>
                
              </div>

             
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchNavbar;
