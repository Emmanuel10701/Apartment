"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import apartmentsData from '../../../../apartment/public/data.json';

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

const ApartmentDetail = () => {
    const { id } = useParams();
    const [apartment, setApartment] = useState<Apartment | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApartment = () => {
            if (id) {
                const apartmentFound = apartmentsData.find((apt: Apartment) => apt.id.toString() === id);
                if (apartmentFound) {
                    setApartment(apartmentFound);
                } else {
                    console.error('Apartment not found');
                }
                setLoading(false);
            }
        };

        fetchApartment();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!apartment) {
        return <div>No apartment found.</div>;
    }

    return (
        <div className="max-w-lg mx-auto p-4">
            <h1 className="text-2xl font-bold">{apartment.title}</h1>
            <div className="relative">
                {/* Map through images and display each one */}
                {apartment.images.map((image, index) => (
                    <Image
                        key={index}
                        src={image} // Ensure this path starts with /
                        alt={apartment.title}
                        width={600}
                        height={400}
                        className="rounded-lg mt-4"
                    />
                ))}
            </div>
            <div className="flex items-center mt-2">
                <FaMapMarkerAlt className="text-red-500" />
                <span className="ml-2">{apartment.location}</span>
            </div>
            <div className="flex items-center mt-2">
                <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                        <FaStar key={index} className={`w-4 h-4 ${index < apartment.rating ? 'text-yellow-300' : 'text-gray-200'}`} />
                    ))}
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded ml-3">{apartment.rating}</span>
            </div>
            <p className="mt-2">Available Rooms: {apartment.availableRooms}</p>
            <p>Rental Type: {apartment.rentalType}</p>
            <p className="mt-2">{apartment.description}</p>
            <div className="flex items-center justify-between mt-4">
                <span className="text-3xl font-bold">${apartment.price}/month</span>
                <span className="text-sm text-gray-500">Min Price: ${apartment.minPrice}</span>
            </div>
        </div>
    );
};

export default ApartmentDetail;
