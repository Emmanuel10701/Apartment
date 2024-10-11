"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import CircularProgress from '@mui/material/CircularProgress';
import apartmentsData from '../../../../apartment/public/data.json';
import EmailModal from "../../components/emailModal/page";

interface Apartment {
    id: number;
    email: string;
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
    const [mainImage, setMainImage] = useState<string | null>(null);
    const [imageIndex, setImageIndex] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchApartment = () => {
            if (id) {
                const apartmentFound = apartmentsData.find((apt: Apartment) => apt.id.toString() === id);
                if (apartmentFound) {
                    setApartment(apartmentFound);
                    setMainImage(apartmentFound.images[0]);
                } else {
                    console.error('Apartment not found');
                }
                setLoading(false);
            }
        };

        fetchApartment();
    }, [id]);

    const handleImageClick = (index: number) => {
        setMainImage(apartment!.images[index]);
        setImageIndex(index);
    };

    const openEmailModal = () => {
        setIsModalOpen(true);
    };

    const closeEmailModal = () => {
        setIsModalOpen(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    if (!apartment) {
        return <div>No apartment found.</div>;
    }

    return (
        <div className="max-w-full mx-auto p-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                {apartment.title}
            </h1>
            <div className="relative flex">
                <div className="flex gap-6 p-8">
                    <Image
                        src={mainImage || apartment.images[0]}
                        alt={apartment.title}
                        width={800}
                        height={500}
                        className="rounded-lg col-span-1 row-span-2 cursor-pointer mt-4"
                    />
                    <div className="flex gap-6 p-8 flex-col">
                        {apartment.images.map((image, index) => {
                            if (index !== imageIndex) {
                                return (
                                    <Image
                                        src={image}
                                        alt={apartment.title}
                                        width={400}
                                        height={300}
                                        className="rounded-lg cursor-pointer"
                                        key={index}
                                        onClick={() => handleImageClick(index)}
                                    />
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
            </div>
            <div className='md:w-[70%] mx-auto w-full shadow-lg rounded-lg'>
                <div className="p-4 bg-white">
                    <div className="flex items-center mt-2">
                        <FaMapMarkerAlt className="text-red-500" />
                        <span className="ml-2 text-lg font-semibold text-gray-800">{apartment.location}</span>
                    </div>

                    <div className="flex items-center mt-2">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, index) => (
                                <FaStar key={index} className={`w-4 h-4 ${index < apartment.rating ? 'text-yellow-300' : 'text-gray-200'}`} />
                            ))}
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded ml-3">{apartment.rating}</span>
                    </div>

                    <p>
                        Discover modern apartments designed for comfort and style, featuring spacious layouts and contemporary amenities. Enjoy convenient locations that put you close to shopping, dining, and recreational activities. Experience a vibrant community atmosphere, perfect for both relaxation and socializing.
                        <span className=" text-blue-800 text-md font-semibold px-2.5 py-0.5 ml-3">{apartment.description}</span>
                    </p>

                    <div className="flex items-center justify-between mt-4">
                        <span className="text-4xl font-bold text-green-600">${apartment.price}/month</span>
                        <span className="text-sm text-gray-500">Min Price: <span className="text-gray-800 font-semibold">${apartment.minPrice}</span></span>
                    </div>

                    <div className="flex justify-center mt-4">
                        <button
                            className="bg-transparent border border-blue-600 text-blue-600 font-semibold py-2 px-4 rounded-full hover:bg-blue-600 hover:text-white transition duration-300"
                            onClick={() => window.open('tel:+1234567890')} // Replace with the actual phone number
                        >
                            Call
                        </button>
                        <button
                            className="bg-transparent border border-blue-600 text-blue-600 font-semibold py-2 px-4 rounded-full hover:bg-blue-600 hover:text-white transition duration-300 ml-4"
                            onClick={openEmailModal}
                        >
                            Email
                        </button>
                    </div>
                </div>
            </div>

            {/* Email Modal */}
            <EmailModal isOpen={isModalOpen} onClose={closeEmailModal} apartment={apartment} />

            {/* Related apartments section */}
            <h2 className="text-4xl text-center my-4 font-bold mt-6 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 text-transparent bg-clip-text">
                Related Apartments
            </h2>
            <div className="flex w-full md:w-2/3 flex-wrap gap-6 mx-auto">
                {apartmentsData.slice(0, 4).map((relatedApartment) => {
                    if (relatedApartment.id === apartment?.id) return null;

                    return (
                        <Link href={`/homepage/${relatedApartment.id}`} key={relatedApartment.id}>
                            <div className="bg-white rounded-lg shadow-md p-2 cursor-pointer hover:shadow-lg transition-shadow duration-300">
                                <Image
                                    src={relatedApartment.images[0]}
                                    alt={relatedApartment.title}
                                    width={100}
                                    height={100}
                                    className="rounded-lg"
                                />
                                            <h3 className="font-bold text-2xl mt-2 bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                    {relatedApartment.title}
                    </h3>
                    <p className="font-bold text-xl text-gray-800">${relatedApartment.price}/month</p>
               </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default ApartmentDetail;
