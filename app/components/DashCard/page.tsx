"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FaStar, FaMapMarkerAlt, FaChevronRight } from "react-icons/fa";
import CircularProgress from "@mui/material/CircularProgress";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface Apartment {
    id: string;
    name: string;
    minPrice: number;
    maxPrice: number;
    rentalType: string;
    availableRooms: string | null;
    starRating: number;
    description: string | null;
    propertyType: string;
    kitchenImage: string;
    livingRoomImage: string;
    bedroomImage: string;
    apartmentImage: string;
    phoneNumber: string;
    email: string;
    address: string;
    createdAt: string;
    updatedAt: string;
}

const ApartmentList = () => {
    const { data: session } = useSession();
    const [apartments, setApartments] = useState<Apartment[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 1;
    const [loading, setLoading] = useState(true);
    const [editingApartment, setEditingApartment] = useState<Apartment | null>(null);
    const [formData, setFormData] = useState<Apartment | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchApartments = async () => {
            if (session?.user?.email) {
                const response = await fetch(`/api/Apartment/${session.user.email}`);
                const data = await response.json();
                setApartments(data);
            }
            setLoading(false);
        };

        fetchApartments();
    }, [session]);

    const totalPages = Math.ceil(apartments.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
        }
    };

    const displayedApartments = Array.isArray(apartments) 
        ? apartments.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage) 
        : [];

    const handleEditClick = (apartment: Apartment) => {
        setEditingApartment(apartment);
        setFormData(apartment);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (formData) {
            const { name, value } = e.target;
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleUpdateApartment = async () => {
        if (formData) {
            // Create a new object without image fields
            const { kitchenImage, livingRoomImage, bedroomImage, apartmentImage, ...updatedData } = formData;

            const response = await fetch(`/api/Apartment/${formData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData), // Send only updated data
            });

            if (response.ok) {
                const updatedApartment = await response.json();
                setApartments((prev) => prev.map((apt) => (apt.id === updatedApartment.id ? updatedApartment : apt)));
                setEditingApartment(null);
                setFormData(null);
                toast.success("Apartment updated successfully!");
            } else {
                toast.error("Failed to update apartment.");
            }
        }
    };

    const handleDeleteApartment = async (apartmentId: string) => {
        const response = await fetch(`/api/Apartment/${apartmentId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setApartments((prev) => prev.filter((apt) => apt.id !== apartmentId));
            toast.success("Apartment deleted successfully!");
        } else {
            toast.error("Failed to delete apartment.");
        }
    };

    const goToNextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 3 ? 0 : prevIndex + 1)); // Adjust based on actual number of images
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <div>
            <ToastContainer />
            {apartments.length === 0 ? (
                <div className="text-center mt-20">
                    <h2 className="text-xl font-semibold text-gray-700">You have no apartments listed.</h2>
                    <p className="text-gray-500 mt-2">Start adding apartments to your dashboard!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {displayedApartments.map((apartment) => (
                        <div key={apartment.id} className="w-full max-w-xs -400 border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 mb-4">
                            <div className="relative cursor-pointer h-44">
                                <Image
                                    className="w-full h-full object-cover"
                                    src={apartment.apartmentImage}
                                    alt={`Image of ${apartment.name}`}
                                    width={240}
                                    height={160}
                                />
                                <button
                                    onClick={goToNextImage}
                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-lg"
                                >
                                    <FaChevronRight className="text-gray-700" />
                                </button>
                            </div>
                            <div className="p-4 h-full flex flex-col justify-between">
                                {editingApartment?.id === apartment.id ? (
                                    <div>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData?.name || ''}
                                            onChange={handleInputChange}
                                            className="border p-2 rounded w-full mb-2"
                                            placeholder="Apartment Name"
                                        />
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData?.address || ''}
                                            onChange={handleInputChange}
                                            className="border p-2 rounded w-full mb-2"
                                            placeholder="Address"
                                        />
                                        <input
                                            type="number"
                                            name="minPrice"
                                            value={formData?.minPrice || ''}
                                            onChange={handleInputChange}
                                            className="border p-2 rounded w-full mb-2"
                                            placeholder="Minimum Price"
                                        />
                                        <input
                                            type="number"
                                            name="maxPrice"
                                            value={formData?.maxPrice || ''}
                                            onChange={handleInputChange}
                                            className="border p-2 rounded w-full mb-2"
                                            placeholder="Maximum Price"
                                        />
                                        <button onClick={handleUpdateApartment} className="bg-green-600 text-white rounded px-4 py-2">
                                            Update
                                        </button>
                                        <button onClick={() => setEditingApartment(null)} className="bg-red-600 text-white rounded px-4 py-2 ml-2">
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <h5 className="text-xl font-bold text-slate-600">{apartment.name}</h5>
                                        <div className="flex items-center mt-2 mb-2">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, index) => (
                                                    <FaStar key={index} className={`w-4 h-4 ${index < apartment.starRating ? 'text-yellow-300' : 'text-gray-200'}`} />
                                                ))}
                                            </div>
                                            <span className="ml-2 text-sm text-slate-600">{apartment.starRating}</span>
                                        </div>
                                        <div className="flex items-center text-slate-600 mb-2">
                                            <FaMapMarkerAlt className="text-red-500 mr-1" />
                                            <span>{apartment.address}</span>
                                        </div>
                                        <p className="text-slate-600">Rooms: {apartment.availableRooms} | Type: {apartment.rentalType}</p>
                                        <button onClick={() => handleEditClick(apartment)} className="bg-indigo-600 text-white rounded px-4 py-2 mt-2">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDeleteApartment(apartment.id)} className="bg-red-600 text-white rounded px-4 py-2 mt-2 ml-2">
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {totalPages > 1 && apartments.length > 0 && (
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
            )}
        </div>
    );
};

export default ApartmentList;
