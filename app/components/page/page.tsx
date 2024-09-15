"use client";

import React, { useState } from 'react';
import Filter from '../filters/page'; // Adjust the import path as needed
import Map from '../map/page';

const MapPage = () => {
  const [search, setSearch] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [rentalType, setRentalType] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('ascending');

  const handleSearch = (search: string) => {
    setSearch(search);
    // Handle search
  };

  const handlePriceFilter = (min: number, max: number) => {
    setPriceRange([min, max]);
    // Handle price filter
  };

  const handleRentalTypeChange = (type: string) => {
    setRentalType(type);
    // Handle rental type change
  };

  const handleSortChange = (order: string) => {
    setSortOrder(order);
    // Handle sort change
  };

  // Example map configuration
  const mapLocation: [number, number] = [51.505, -0.09];
  const mapZoom: number = 13;

  return (
    <div className="flex flex-col md:flex-row w-full h-screen p-4 md:p-10">
      <div className="md:w-1/3 flex-shrink-0 md:pr-4">
        <Filter
          onSearch={handleSearch}
          onPriceFilter={handlePriceFilter}
          onRentalTypeChange={handleRentalTypeChange}
          onSortChange={handleSortChange}
        />
      </div>
      <div className="md:w-1/3 flex-1">
        <Map
          location={mapLocation}
          zoom={mapZoom}
        />
      </div>
    </div>
  );
};

export default MapPage;
