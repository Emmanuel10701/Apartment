"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import Map from "./components/map/page"; // Adjust the path as needed

const apartments = [
  {
    id: 1,
    name: "Luxury Apartment",
    address: "123 Luxury St, Chicago, IL 60601",
    minPrice: 2000,
    maxPrice: 2500,
    rentalType: "Monthly",
    lat: 41.8801,
    lng: -87.6308,
    image: "https://via.placeholder.com/150",
    description: "A luxurious apartment with modern amenities and a great view.",
  },
  // Add more apartments as needed
];

const SearchNavbar: React.FC<{
  onSearch: (search: string) => void;
  onPriceFilter: (min: number, max: number) => void;
  onRentalTypeChange: (type: string) => void;
  onSortChange: (order: string) => void;
}> = ({ onSearch, onPriceFilter, onRentalTypeChange, onSortChange }) => {
  return (
    <div className="bg-gray-800 text-white p-4">
      <input
        type="text"
        placeholder="Search"
        className="p-2 bg-gray-900 rounded"
        onChange={(e) => onSearch(e.target.value)}
      />
      <div className="my-4">
        <label>
          Min Price:
          <input
            type="number"
            onChange={(e) => onPriceFilter(Number(e.target.value), Number(e.target.max))}
            className="ml-2"
          />
        </label>
        <label>
          Max Price:
          <input
            type="number"
            onChange={(e) => onPriceFilter(Number(e.target.min), Number(e.target.value))}
            className="ml-2"
          />
        </label>
      </div>
      <div className="my-4">
        <button onClick={() => onRentalTypeChange("Monthly")} className="mr-2">Monthly</button>
        <button onClick={() => onRentalTypeChange("Yearly")} className="mr-2">Yearly</button>
        <button onClick={() => onRentalTypeChange("All")} className="mr-2">All</button>
      </div>
      <div className="my-4">
        <button onClick={() => onSortChange("ascending")} className="mr-2">Sort by Price Ascending</button>
        <button onClick={() => onSortChange("descending")} className="mr-2">Sort by Price Descending</button>
      </div>
    </div>
  );
};

const LeafletMapPage: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filteredApartments, setFilteredApartments] = useState(apartments);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const handleSearch = (search: string) => {
    const filtered = apartments.filter((apartment) =>
      apartment.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredApartments(filtered);
  };

  const handlePriceFilter = (min: number, max: number) => {
    const filtered = apartments.filter(
      (apartment) => apartment.minPrice >= min && apartment.maxPrice <= max
    );
    setFilteredApartments(filtered);
  };

  const handleRentalTypeChange = (type: string) => {
    const filtered = apartments.filter(
      (apartment) => apartment.rentalType === type || type === "All"
    );
    setFilteredApartments(filtered);
  };

  const handleSortChange = (order: string) => {
    const sorted = [...filteredApartments].sort((a, b) =>
      order === "ascending" ? a.minPrice - b.minPrice : b.minPrice - a.minPrice
    );
    setFilteredApartments(sorted);
  };

  return (
    <div className="relative h-screen flex flex-col mt-20 lg:flex-row">
      <SearchNavbar
        onSearch={handleSearch}
        onPriceFilter={handlePriceFilter}
        onRentalTypeChange={handleRentalTypeChange}
        onSortChange={handleSortChange}
      />

      <button
        onClick={toggleDrawer}
        className="lg:hidden fixed top-4 left-4 z-10 p-2 bg-gray-800 text-white rounded-full"
        aria-label={drawerOpen ? "Close menu" : "Open menu"}
      >
        <FontAwesomeIcon icon={drawerOpen ? faTimes : faBars} />
      </button>

      <div
        className={`fixed inset-0 lg:hidden z-20 bg-gray-800 text-white p-4 transition-transform transform ${drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <button
          onClick={toggleDrawer}
          className="absolute top-4 right-4 text-white"
          aria-label="Close menu"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2 className="text-2xl font-bold mb-4">Map Controls</h2>
        <button
          onClick={() => { }}
          className="block w-full mb-2 bg-blue-500 text-white p-2 rounded"
        >
          Roadmap
        </button>
        <button
          onClick={() => { }}
          className="block w-full mb-2 bg-blue-500 text-white p-2 rounded"
        >
          Satellite
        </button>
        <button
          onClick={() => { }}
          className="block w-full mb-2 bg-blue-500 text-white p-2 rounded"
        >
          Terrain
        </button>
      </div>

      <div className="relative flex-grow">
        <div className="relative flex">
          <Map />
          <input
            type="text"
            placeholder="Search places"
            className="absolute top-4 left-4 bg-white text-black p-2 rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default LeafletMapPage;
