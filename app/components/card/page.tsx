import { useState, useEffect } from 'react';
import EmailModal from "../emailModal/page";
import Image from 'next/image';
import { FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import apartmentsData from '../../../../apartment/public/data.json';

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
    minPrice: number;
    email: string;
}

// ApartmentCard component
const ApartmentCard = ({ apartment }: { apartment: Apartment }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % apartment.images.length);
        }, 3000); // Change image every 3 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [apartment.images.length]);

    const handleEmailClick = () => {
        setSelectedApartment(apartment);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedApartment(null);
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % apartment.images.length);
    };

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + apartment.images.length) % apartment.images.length);
    };

    const handleCallClick = () => {
        window.location.href = `tel:${process.env.NEXT_PUBLIC_PHONE_NUMBER}`;
    };

    return (
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative">
                <div className="flex justify-center">
                    <Image
                        className="w-full h-56 object-cover rounded-t-lg"
                        src={apartment.images[currentIndex]}
                        alt="apartment image"
                        width={300}
                        height={200}
                    />
                </div>
                <div className="absolute top-1/2 left-0 flex justify-between w-full">
                    <button onClick={handlePrevious} className="bg-gray-300 rounded-full p-2 m-2 hover:bg-gray-400 transition duration-200">❮</button>
                    <button onClick={handleNext} className="bg-gray-300 rounded-full p-2 m-2 hover:bg-gray-400 transition duration-200">❯</button>
                </div>
            </div>
            <div className="px-5 pb-5">
                <h5 className="text-xl font-semibold tracking-tight text-gray-900">{apartment.title}</h5>
                <div className="flex items-center mt-2.5 mb-5">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                            <FaStar key={index} className={`w-4 h-4 ${index < apartment.rating ? 'text-yellow-300' : 'text-gray-200'}`} />
                        ))}
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded ms-3">{apartment.rating}</span>
                </div>
                <div className="flex items-center">
                    <FaMapMarkerAlt className="text-red-500" />
                    <span className="ml-2 text-gray-700">{apartment.location}</span>
                </div>
                <p className="mt-2 text-gray-600">Available Rooms: {apartment.availableRooms}</p>
                <p className="text-gray-600">Rental Type: {apartment.rentalType}</p>
                <p className="mt-2 text-gray-500">{apartment.description}</p>
                <div className="flex items-center justify-between mt-4">
                    <span className="text-3xl font-bold text-gray-900">${apartment.price}/month</span>
                    <span className="text-sm text-gray-500">Min Price: ${apartment.minPrice}</span>
                </div>
            </div>
            <div className="flex items-center justify-center space-x-4 p-4 bg-gray-50 rounded-b-lg">
                <button onClick={handleCallClick} className="bg-indigo-600 text-white rounded-full px-5 py-2 transition duration-300 hover:bg-indigo-700 flex items-center">
                    <FaPhone className="mr-1" /> Call
                </button>
                <button onClick={handleEmailClick} className="bg-green-600 text-white rounded-full px-5 py-2 transition duration-300 hover:bg-green-700 flex items-center">
                    <FaEnvelope className="mr-1" /> Email
                </button>
            </div>
            {isModalOpen && selectedApartment && (
                <EmailModal isOpen={isModalOpen} onClose={closeModal} apartment={selectedApartment} />
            )}
        </div>
    );
};

// ApartmentList component with pagination
const ApartmentList = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [apartments, setApartments] = useState<Apartment[]>([]);
    const itemsPerPage = 10; // Number of items per page

    useEffect(() => {
        setApartments(apartmentsData); // Assuming apartmentsData is fetched from a JSON file
    }, []);

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
                        className={`mx-1 px-3 py-1 rounded ${currentPage === index ? 'bg-blue-600 text-white' : 'bg-gray-300 hover:bg-gray-400'}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ApartmentList;
