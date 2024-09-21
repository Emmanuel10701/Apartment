"use client";
import React, { useState } from 'react';

interface ApartmentProps {
  id: number;
  name: string;
  minPrice: number;
  rentalType: string;
  starRating: number;
  propertyType: string;
  images: string[];
  phoneNumber: string;
  email: string;
  address: string; // Added address field
}

const Apartment: React.FC<ApartmentProps> = ({
  id,
  name,
  minPrice,
  rentalType,
  starRating,
  propertyType,
  images,
  phoneNumber,
  email,
  address, // Destructure address
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isActive, setIsActive] = useState<string | null>(null);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleButtonClick = (type: string) => {
    setIsActive(type);
    setTimeout(() => setIsActive(null), 200);
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="apartment-card border border-gray-200 rounded-lg shadow-md overflow-hidden transition-transform transform">
      <div className="relative">
        <img
          src={images[currentImageIndex]}
          alt={name}
          className="w-full h-48 object-cover cursor-pointer"
          onClick={() => handleImageClick(currentImageIndex)}
        />
        <button
          onClick={() => { handlePrevImage(); handleButtonClick('prev'); }}
          className={`absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${isActive === 'prev' ? 'bg-gray-200 ring-2 ring-blue-500' : 'bg-white'} shadow-md transition duration-300`}
        >
          &#10094; {/* Left arrow */}
        </button>
        <button
          onClick={() => { handleNextImage(); handleButtonClick('next'); }}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${isActive === 'next' ? 'bg-gray-200 ring-2 ring-blue-500' : 'bg-white'} shadow-md transition duration-300`}
        >
          &#10095; {/* Right arrow */}
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
        <p className="text-gray-600">ID: {id}</p>
        <p className="text-gray-800 font-medium">Min Price: ${minPrice}</p>
        <p className="text-gray-800">Rental Type: {rentalType}</p>
        <p className="text-gray-800">Property Type: {propertyType}</p>
        <p className="text-gray-800">Address: {address}</p> {/* Display address */}
        <div className="flex items-center mt-2">
          {Array.from({ length: 5 }, (_, index) => (
            <span key={index}>
              {index < starRating ? (
                <span className="text-yellow-500">★</span>
              ) : (
                <span className="text-gray-300">★</span>
              )}
            </span>
          ))}
        </div>
        <div className="flex gap-4 mt-4">
          <span
            onClick={handleCall}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 cursor-pointer"
          >
            Call
          </span>
          <span
            onClick={handleEmail}
            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-300 cursor-pointer"
          >
            Email
          </span>
        </div>
      </div>
    </div>
  );
};

export default Apartment;

// Example apartments with clickable image URLs
const apartments = [
  {
    id: 1,
    name: "Luxury Apartment",
    minPrice: 1500,
    rentalType: "Monthly",
    starRating: 4,
    propertyType: "Apartment",
    images: [
      "https://images.pexels.com/photos/2080588/pexels-photo-2080588.jpeg", // New image
      "https://images.pexels.com/photos/1860780/pexels-photo-1860780.jpeg", // New image
      "https://images.pexels.com/photos/4502083/pexels-photo-4502083.jpeg", // New image
    ],
    phoneNumber: "1234567890",
    email: "luxury@apartment.com",
    address: "123 Luxury St, Beverly Hills, CA", // Added address
  },
  {
    id: 2,
    name: "Cozy Studio",
    minPrice: 800,
    rentalType: "Monthly",
    starRating: 5,
    propertyType: "Studio",
    images: [
      "https://images.pexels.com/photos/4518355/pexels-photo-4518355.jpeg", // New image
      "https://images.pexels.com/photos/4518347/pexels-photo-4518347.jpeg", // New image
      "https://images.pexels.com/photos/4502029/pexels-photo-4502029.jpeg", // New image
    ],
    phoneNumber: "0987654321",
    email: "cozy@studio.com",
    address: "456 Cozy Ave, Seattle, WA", // Added address
  },
];
