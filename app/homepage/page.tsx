"use client";

import { useState } from "react";
import Footer from "../components/Footer/page"; 
import SearchNavbar from "../components/filters/page"; 
import ApartmentCard from "../components/card/page"; 
import Carousel from "../components/courusel/page"; 
import apartmentsData from '../../../apartment/public/data.json'; 
import CircularProgress from '@mui/material/CircularProgress';

interface Apartment {
    id: number;
    title: string;
    images: string[];
    rating: number;
    location: string;
    availableRooms: number;
    rentalType: string;
    description: string;
    price: number;
    minPrice: number;
    phoneNumber: string;
    email: string;
}

interface SearchFilters {
    search: string;
    location: string;  
    minRent?: number;
    maxRent?: number;
    rentalType?: string;
    propertyType?: string;
}

const MainComponent: React.FC = () => {
    const [filteredApartments, setFilteredApartments] = useState<Apartment[]>(apartmentsData);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 6; 
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSearch = (filters: SearchFilters) => {
        setIsLoading(true); // Set loading state
        let filtered = apartmentsData;

        // Apply search filters
        if (filters.search) {
            const lowercasedSearch = filters.search.toLowerCase();
            filtered = filtered.filter(
                (apartment) =>
                    apartment.title.toLowerCase().includes(lowercasedSearch) ||
                    apartment.location.toLowerCase().includes(lowercasedSearch) ||
                    apartment.rentalType.toLowerCase().includes(lowercasedSearch)
            );
        }

        if (filters.location) {
            const lowercasedLocation = filters.location.toLowerCase();
            filtered = filtered.filter(apartment =>
                apartment.location.toLowerCase().includes(lowercasedLocation)
            );
        }

        if (filters.minRent !== undefined) {
            filtered = filtered.filter(apartment => apartment.price >= (filters.minRent || 0));
        }

        if (filters.maxRent !== undefined) {
            filtered = filtered.filter(apartment => apartment.price <= (filters.maxRent || Infinity));
        }

        if (filters.rentalType) {
            filtered = filtered.filter(apartment => apartment.rentalType === filters.rentalType);
        }

        setFilteredApartments(filtered);
        setCurrentPage(0); 
        setIsLoading(false); // Reset loading state
    };

    const handleSearchSubmit = () => {
        handleSearch({ search: searchTerm, location });
    };

    const totalPages = Math.ceil(filteredApartments.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const displayedApartments = filteredApartments.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    return (
        <div className="flex flex-col p-4">
            <Carousel />
            <div className="flex flex-col sm:flex-row items-center justify-evenly mt-20  mx-20 mb-4">
    <input
        type="text"
        placeholder="Search apartments..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={(e) => e.target.classList.add("shadow-md")}
        onBlur={(e) => e.target.classList.remove("shadow-md")}
        className="w-full sm:w-1/2 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-300"
    />
    <input
        type="text"
        placeholder="Location..."
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        onFocus={(e) => e.target.classList.add("shadow-md")}
        onBlur={(e) => e.target.classList.remove("shadow-md")}
        className="w-full sm:w-1/2 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 sm:mt-0 sm:ml-2 transition-shadow duration-300"
    />
    <button
        onClick={() => {
            handleSearchSubmit();
            setSearchTerm(''); // Clear the search input
            setLocation(''); // Clear the location input
        }}
        className="mt-2 sm:mt-0 bg-transparent border border-blue-600 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
        Search
    </button>
</div>

            <SearchNavbar onSearch={handleSearch} />
            <div className="flex items-center flex-col">
            <h1 className="text-6xl font-bold mt-[5%] text-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
                    Available Apartments
                </h1>
                  <p className="text-center mt-6 mb-20 w-[70%] text-slate-500 text-md">
                    Browse our collection of apartments and find your ideal home. 
                    Whether you're looking for a cozy studio or a spacious multi-bedroom, 
                    we offer a variety of options to suit every lifestyle and budget.
                </p>
                {isLoading ? (
                    <div className="flex justify-center mt-4">
                        <CircularProgress />
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-between space-y-4">
                        {displayedApartments.length === 0 ? (
                            <p className="text-center text-slate-700 text-lg my-10 ">No apartments found matching your search criteria.</p>
                        ) : (
                            displayedApartments.map((apartment) => (
                                <div className="w-full sm:w-1/2 lg:w-1/3 p-2" key={apartment.id}>
                                    <ApartmentCard apartment={apartment} />
                                </div>
                            ))
                        )}
                    </div>
                )}
             {totalPages > 1 && (
    <div className="flex justify-center mb-20 mt-4 space-x-2">
        <button
            onClick={() => handlePageChange(currentPage > 0 ? currentPage - 1 : 0)}
            disabled={currentPage === 0}
            className={`px-4 py-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition duration-300 ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
            <button
                key={index}
                onClick={() => handlePageChange(index)}
                className={`px-4 py-2 rounded-full border border-gray-300 transition duration-300 ${currentPage === index ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}`}
            >
                {index + 1}
            </button>
        ))}
        <button
            onClick={() => handlePageChange(currentPage < totalPages - 1 ? currentPage + 1 : totalPages - 1)}
            disabled={currentPage >= totalPages - 1}
            className={`px-4 py-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition duration-300 ${currentPage >= totalPages - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            Next
        </button>
    </div>
)}

            </div>
            <Footer />
        </div>
    );
};

export default MainComponent;
