"use client";
import React, { useState } from 'react';
import Filter from './components/filters/page'; // Adjust the import path as needed
import Map from './components/map/page';

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
    <div className="md:flex flex-col w-1/2 h-screen p-10">
      <div className="flex-1 p-10">
        <Filter
          onSearch={handleSearch}
          onPriceFilter={handlePriceFilter}
          onRentalTypeChange={handleRentalTypeChange}
          onSortChange={handleSortChange}
        />
        <Map
          location={mapLocation}
          zoom={mapZoom}
        />
      </div>
    </div>
  );
};

export default MapPage;
