import { useState } from 'react';
import Image from 'next/image';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import CircularProgress from '@mui/material/CircularProgress';

// Define the Apartment type
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
}

const ApartmentCard = ({ apartment, onDelete }: { apartment: Apartment; onDelete: (id: number) => void }) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Apartment>(apartment);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://your-api-url/apartments/${apartment.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const updatedApartment = await response.json();
                setFormData(updatedApartment);
                setIsEditing(false);
            } else {
                console.error('Failed to update apartment');
            }
        } catch (error) {
            console.error('Error updating apartment:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://your-api-url/apartments/${apartment.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                onDelete(apartment.id);
            } else {
                console.error('Failed to delete apartment');
            }
        } catch (error) {
            console.error('Error deleting apartment:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNextImage = () => {
        setCurrentImage((prev) => (prev + 1) % apartment.images.length);
    };

    const handlePrevImage = () => {
        setCurrentImage((prev) => (prev - 1 + apartment.images.length) % apartment.images.length);
    };

    return (
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className="relative">
                <div className="flex justify-center">
                    <Image
                        className="p-8 w-full h-full rounded-t-lg"
                        src={`/${apartment.images[currentImage]}`} // Ensure leading slash
                        alt="apartment image"
                        width={300}
                        height={200}
                    />
                </div>
                <div className="absolute top-1/2 left-0 flex justify-between w-full">
                    <button onClick={handlePrevImage} className="bg-gray-300 rounded-full p-2 m-2">❮</button>
                    <button onClick={handleNextImage} className="bg-gray-300 rounded-full p-2 m-2">❯</button>
                </div>
            </div>
            <div className="px-5 pb-5">
                <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    {isEditing ? (
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="border border-gray-300 p-2 rounded w-full"
                        />
                    ) : (
                        <span>{formData.title}</span> // Display title normally when not editing
                    )}
                </h5>
                {isEditing ? (
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="border border-gray-300 p-2 rounded w-full mt-2"
                    />
                ) : (
                    <div className="flex items-center mt-2">
                        <FaMapMarkerAlt className="text-red-500" />
                        <span className="ml-2 text-gray-700">{formData.location}</span>
                    </div>
                )}
                <div className="flex items-center mt-2.5 mb-5">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                            <FaStar key={index} className={`w-4 h-4 ${index < apartment.rating ? 'text-yellow-300' : 'text-gray-200'}`} />
                        ))}
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">{apartment.rating}</span>
                </div>
                <p className="mt-2 text-gray-600">Available Rooms: {formData.availableRooms}</p>
                <p className="text-gray-600">Rental Type: {formData.rentalType}</p>
                <p className="mt-2 text-gray-500">{formData.description}</p>
                <div className="flex items-center justify-between mt-4">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">${formData.price}/month</span>
                    <span className="text-sm text-gray-500">Min Price: ${formData.minPrice}</span>
                </div>
            </div>
            <div className="flex items-center justify-between">
                {isEditing ? (
                    <>
                        <button
                            onClick={handleUpdate}
                            className="flex items-center text-slate-100 bg-green-600 cursor-pointer hover:bg-green-700 ml-3 border-2 rounded-full px-5 py-2 transition duration-300"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Apply Changes'}
                        </button>
                        <button onClick={() => setIsEditing(false)} className="text-slate-100 bg-red-600 cursor-pointer hover:bg-red-700 ml-3 flex items-center border-2 rounded-full px-5 py-2 transition duration-300">
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setIsEditing(true)} className="text-slate-100 bg-indigo-600 cursor-pointer hover:bg-indigo-700 ml-3 flex items-center border-2 rounded-full px-5 py-2 transition duration-300">
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex items-center text-slate-100 bg-red-600 cursor-pointer hover:bg-red-700 ml-3 border-2 rounded-full px-5 py-2 transition duration-300"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Delete'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

// Mock data for apartments
const apartments: Apartment[] = [
    {
        id: 1,
        title: "Cozy Apartment in the City",
        images: ["images/image1.jpg", "images/image2.jpg"],
        rating: 4,
        location: "Downtown",
        availableRooms: 2,
        rentalType: "Short-term",
        description: "A cozy apartment with all the amenities.",
        price: 1500,
        minPrice: 1200,
    },
    // Add more apartments as needed
];

// ApartmentList component with pagination
const ApartmentList = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 1; // Number of items per page
    const totalPages = Math.ceil(apartments.length / itemsPerPage); 

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleDelete = (id: number) => {
        // Handle deletion logic here
    };

    const displayedApartments = apartments.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <div>
            <div className="grid grid-cols-1 gap-4">
                {displayedApartments.map((apartment) => (
                    <ApartmentCard key={apartment.id} apartment={apartment} onDelete={handleDelete} />
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
