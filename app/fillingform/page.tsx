"use client";

import { useSession } from 'next-auth/react';
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress';

const PropertyForm: React.FC = () => {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    name: '',
    minPrice: '500',
    maxPrice: '1000',
    rentalType: '',
    starRating: '0',
    propertyType: '',
    phoneNumber: '',
    email: '', 
    address: '',
    AvailableRooms: '',
    kitchenImage: '',
    livingRoomImage: '',
    bedroomImage: '',
    apartmentImage: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (session) {
      setFormData((prev) => ({
        ...prev,
        email: session.user?.email || '',
      }));
    }
  }, [session]);

  const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if user is logged in
    if (!session) {
      toast.error('You must be logged in to submit this form.');
      return;
    }

    // Validate min and max price
    if (Number(formData.minPrice) >= Number(formData.maxPrice)) {
      toast.error('Minimum price must be less than maximum price.');
      return;
    }

    const dataToSubmit = { ...formData };

    try {
      const response = await fetch('/api/Apartment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }

      console.log('Apartment created:', data);

      // Reset form
      setFormData({
        name: '',
        minPrice: '500',
        maxPrice: '1000',
        rentalType: '',
        starRating: '0',
        propertyType: '',
        phoneNumber: '',
        email: session.user?.email || '',
        address: '',
        AvailableRooms: '',
        kitchenImage: '',
        livingRoomImage: '',
        bedroomImage: '',
        apartmentImage: '',
      });

      toast.success('Apartment created successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to create apartment. Please try again.');
    }
  };

  // Display loading state if the session is still being fetched
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="md:w-[70%] w-full mx-auto p-4 md:p-14 shadow-lg border rounded hover:shadow-xl">
      {session && (
        <h2 className="text-purple-700 text-center font-semibold mb-4">
          Hi, {session.user?.name}
        </h2>
      )}
      <h1 className="text-4xl my-10 font-bold mb-4 text-slate-400">Create New Apartment</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 focus-within:text-blue-600" htmlFor="name">Apartment Name</label>
          <input
            type="text"
            name="name"
            placeholder="Property Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Price Selection */}
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 focus-within:text-blue-600" htmlFor="minPrice">Min Price</label>
            <select
              id="minPrice"
              name="minPrice"
              value={formData.minPrice}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded outline-none shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
              {Array.from({ length: 11 }, (_, index) => (500 + index * 50)).map((price) => (
                <option key={price} value={price}>{price}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block mb-1 focus-within:text-blue-600" htmlFor="maxPrice">Max Price</label>
            <select
              id="maxPrice"
              name="maxPrice"
              value={formData.maxPrice}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded outline-none shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
              {Array.from({ length: 11 }, (_, index) => (1000 + index * 50)).map((price) => (
                <option key={price} value={price}>{price}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Rental Type Dropdown */}
        <div className="mb-4">
          <label className="block mb-1 focus-within:text-blue-600" htmlFor="rentalType">Rental Type</label>
          <select
            id="rentalType"
            name="rentalType"
            value={formData.rentalType}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded outline-none shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            <option value="">Select rental type</option>
            <option value="Studio">Studio</option>
            <option value="One-bedroom">1 Bedroom</option>
            <option value="Two-bedrooms">2 Bedrooms</option>
            <option value="Three-bedrooms">3 Bedrooms</option>
            <option value="Four-bedrooms">4+ Bedrooms</option>
          </select>
        </div>

        {/* Star Rating Dropdown */}
        <div className="mb-4">
          <label className="block mb-1 focus-within:text-blue-600" htmlFor="starRating">Star Rating</label>
          <select
            id="starRating"
            name="starRating"
            value={formData.starRating}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded outline-none shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            <option value="0">Select Star Rating</option>
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        {/* Property Type Dropdown */}
        <div className="mb-4">
          <label className="block mb-1 focus-within:text-blue-600" htmlFor="propertyType">Property Type</label>
          <select
            id="propertyType"
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded outline-none shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            <option value="">Select Property Type</option>
            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
            <option value="Condo">Condo</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700 font-semibold" htmlFor="phoneNumber">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            id="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700 font-semibold" htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700 font-semibold" htmlFor="address">Address</label>
          <input
            type="text"
            name="address"
            id="address"
            placeholder="Enter the address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          />
        </div>

        {/* Available Rooms Input */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700 font-semibold" htmlFor="AvailableRooms">Available Rooms</label>
          <input
            type="number"
            name="AvailableRooms"
            id="AvailableRooms"
            placeholder="Enter number of available rooms"
            value={formData.AvailableRooms}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          />
        </div>

        {/* Submit and Cancel buttons */}
        <div className='flex gap-6'>
          <button 
            type="submit" 
            className="w-[60%] py-3 bg-transparent border-2 border-blue-600 text-blue-600 rounded-full transition duration-200 hover:bg-blue-600 hover:text-white hover:border-transparent focus:outline-none"
          >
            Submit
          </button>
          
          <button 
            type="button" 
            className="w-[60%] py-3 bg-transparent border-2 border-slate-600 text-slate-600 rounded-full transition duration-200 hover:bg-slate-600 hover:text-white hover:border-transparent focus:outline-none"
          >
            Cancel
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default PropertyForm;
