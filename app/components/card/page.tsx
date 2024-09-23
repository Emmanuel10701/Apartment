import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import EmailModal from "../emailModal/page"; // Adjust the path as necessary
import apartmentsData from '../../../../apartment/public/data.json'; 
import ApartmentCard from "../apartment2/page"// Adjust the path as necessary

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

// ApartmentCard component...
// (Keep your ApartmentCard component as it is)

// ApartmentList component
const ApartmentList = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
    const [apartments, setApartments] = useState<Apartment[]>([]); // State for apartments
    const itemsPerPage = 10; // Number of items per page

    useEffect(() => {
        setApartments(apartmentsData); // Set the apartments data from JSON
    }, []);

    const totalPages = Math.ceil(apartments.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleEmailClick = (apartment: Apartment) => {
        setSelectedApartment(apartment);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedApartment(null);
    };

    const displayedApartments = apartments.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <div>
            <div className="grid grid-cols-1 gap-4">
                {displayedApartments.map((apartment, index) => (
                    <ApartmentCard key={index} apartment={apartment} onEmailClick={handleEmailClick} />
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

            {isModalOpen && selectedApartment && (
                <EmailModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    apartment={selectedApartment}
                />
            )}
        </div>
    );
};

export default ApartmentList;
