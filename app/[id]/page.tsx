// /pages/apartments/[id].tsx
"use client"
import { useRouter } from 'next/router';
import apartments from '../../app/components/data/page'; // Adjust the path as necessary
import Image from 'next/image';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';

const ApartmentDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  // Find the apartment by ID (assuming IDs are numerical indices for this example)
  const apartment = apartments[Number(id)];

  if (!apartment) {
    return <p>Loading...</p>; // Handle loading state or error here
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{apartment.title}</h1>
      <Image
        src={apartment.images[0]} // Show the first image
        alt={apartment.title}
        width={600}
        height={400}
      />
      <div className="flex items-center mt-2">
        <FaStar className={`w-4 h-4 ${apartment.rating >= 1 ? 'text-yellow-300' : 'text-gray-200'}`} />
        <span className="ml-2">{apartment.rating}</span>
        <FaMapMarkerAlt className="ml-4 text-red-500" />
        <span className="ml-2">{apartment.location}</span>
      </div>
      <p className="mt-4">{apartment.description}</p>
      <p className="mt-4">Price: ${apartment.price}/month</p>
      <p>Available Rooms: {apartment.availableRooms}</p>
      <p>Rental Type: {apartment.rentalType}</p>
      <p>Contact: {apartment.email}</p>
    </div>
  );
};

export default ApartmentDetail;
