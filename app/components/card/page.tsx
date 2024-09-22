"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";

// Define the Apartment type
interface Apartment {
    title: string;
    images: string[];
    rating: number;
    location: string;
    availableRooms: number;
    rentalType: string;
    description: string;
    price: number;
    phoneNumber: string;
    email: string;
    minPrice: number;
}

// Sample apartment data
const apartments: Apartment[] = [
    {
        title: "Luxury Studio Apartment",
        images: [
            "/images/ap2.jpg",
            "/images/bed2.jpg",
            "/images/int2.jpg",
            "/images/kit2.webp",
        ],
        rating: 4.5,
        location: "456 Elm St, Metropolis",
        availableRooms: 1,
        rentalType: "Studio",
        description: "A modern studio apartment with luxury amenities.",
        price: 1800,
        minPrice: 1700,
        phoneNumber: "1234567890",
        email: "luxury@apartment.com",
    },
    {
        title: "Cozy Apartment in City Center",
        images: [
            "/images/ap11.webp",
            "/images/bd1.jpg",
            "/images/int3.jpeg",
            "/images/kit1.webp",
        ],
        rating: 4.0,
        location: "123 Main St, Cityville",
        availableRooms: 2,
        rentalType: "Condo",
        description: "This beautiful apartment offers stunning city views and is located near all amenities.",
        price: 1500,
        minPrice: 1400,
        phoneNumber: "0987654321",
        email: "cozy@apartment.com",
    },
];

// ApartmentCard component
const ApartmentCard = ({ apartment }: { apartment: Apartment }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % apartment.images.length);
    };

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + apartment.images.length) % apartment.images.length);
    };

    const handleCall = () => {
        window.location.href = `tel:${apartment.phoneNumber}`;
    };

    const handleEmail = () => {
        window.location.href = `mailto:${apartment.email}`;
    };

    return (
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className="relative">
                <div className="flex justify-center">
                    <Image
                        className="p-8 w-full h-full rounded-t-lg"
                        src={apartment.images[currentIndex]}
                        alt="apartment image"
                        width={300}
                        height={200}
                    />
                </div>
                <div className="absolute top-1/2 left-0 flex justify-between w-full">
                    <button onClick={handlePrevious} className="bg-gray-300 rounded-full p-2 m-2">❮</button>
                    <button onClick={handleNext} className="bg-gray-300 rounded-full p-2 m-2">❯</button>
                </div>
            </div>
            <div className="px-5 pb-5">
                <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    {apartment.title}
                </h5>
                <div className="flex items-center mt-2.5 mb-5">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                            <FaStar key={index} className={`w-4 h-4 ${index < apartment.rating ? 'text-yellow-300' : 'text-gray-200'}`} />
                        ))}
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">{apartment.rating}</span>
                </div>
                <div className="flex items-center">
                    <FaMapMarkerAlt className="text-red-500" />
                    <span className="ml-2 text-gray-700">{apartment.location}</span>
                </div>
                <p className="mt-2 text-gray-600">Available Rooms: {apartment.availableRooms}</p>
                <p className="text-gray-600">Rental Type: {apartment.rentalType}</p>
                <p className="mt-2 text-gray-500">{apartment.description}</p>
                <div className="flex items-center justify-between mt-4">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">${apartment.price}/month</span>
                    <span className="text-sm text-gray-500">Min Price: ${apartment.minPrice}</span>
                </div>
                <div className="flex justify-between mt-4">
                    <button onClick={handleEmail} className="bg-green-500 text-white px-4 py-2 rounded-lg">Email</button>
                    <button onClick={handleCall} className="bg-blue-500 text-white px-4 py-2 rounded-lg hidden sm:inline">Call</button>
                </div>
            </div>
        </div>
    );
};

// ApartmentList component
const ApartmentList = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 1; // Number of items per page
    const totalPages = Math.ceil(apartments.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const displayedApartments = apartments.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <div>
            <div className="grid grid-cols-1 gap-4">
                {displayedApartments.map((apartment, index) => (
                    <ApartmentCard key={index} apartment={apartment} />
                ))}
            </div>
            <div className="flex justify-center mt-4">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index)}
                        className={`mx-1 px-3 py-1 rounded ${currentPage === index ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ApartmentList;
