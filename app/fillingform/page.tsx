// components/PropertyForm.tsx
"use client"
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { AiOutlineUser } from 'react-icons/ai';
import { CircularProgress } from '@mui/material';
import Modal from '../components/modal2/page'; // Create a Modal component for login/register

interface PropertyFormValues {
  name: string;
  minPrice: number;
  maxPrice: number;
  rentalType: string;
  starRating: number;
  propertyType: string;
  phoneNumber: string;
  email: string;
  address: string;
  userId: string; 
  kitchenImage: string; 
  livingRoomImage: string; 
  bedroomImage: string; 
  apartmentImage: string; 
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string; // Ensure id property exists
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

const PropertyForm: React.FC = () => {
  const { data: session } = useSession();
  const [formValues, setFormValues] = useState<PropertyFormValues>({
    name: '',
    minPrice: 0,
    maxPrice: 0,
    rentalType: '',
    starRating: 0,
    propertyType: '',
    phoneNumber: '',
    email: '',
    address: '',
    userId: session?.user?.id || '', // Safe access to user id
    kitchenImage: '',
    livingRoomImage: '',
    bedroomImage: '',
    apartmentImage: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: name === 'minPrice' || name === 'maxPrice' || name === 'starRating'
        ? Number(value)
        : value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      setIsModalOpen(true);
      return;
    }

    setIsSubmitting(true);

    const imagesArray = [
      formValues.kitchenImage,
      formValues.livingRoomImage,
      formValues.bedroomImage,
      formValues.apartmentImage,
    ].filter(image => image); // Filter out any empty image URLs

    const propertyData = {
      ...formValues,
      images: imagesArray,
    };

    try {
      const response = await fetch('http://localhost:3000/api/Apartment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Handle success (reset form or show a success message)
      console.log('Property submitted:', propertyData);
      handleCancel(); // Reset the form
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleCancel = () => {
    setFormValues({
      name: '',
      minPrice: 0,
      maxPrice: 0,
      rentalType: '',
      starRating: 0,
      propertyType: '',
      phoneNumber: '',
      email: '',
      address: '',
      userId: session?.user?.id || '',
      kitchenImage: '',
      livingRoomImage: '',
      bedroomImage: '',
      apartmentImage: '',
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 border border-gray-300 rounded-md bg-white shadow-md">
      {/* Image placeholders */}
      <div className="flex justify-center mb-4">
        <img src={formValues.kitchenImage || "/images/kitchen_placeholder.jpg"} alt="Kitchen" className="w-1/4 h-auto rounded-lg shadow-lg mx-2" />
        <img src={formValues.livingRoomImage || "/images/livingroom_placeholder.jpg"} alt="Living Room" className="w-1/4 h-auto rounded-lg shadow-lg mx-2" />
        <img src={formValues.bedroomImage || "/images/bedroom_placeholder.jpg"} alt="Bedroom" className="w-1/4 h-auto rounded-lg shadow-lg mx-2" />
        <img src={formValues.apartmentImage || "/images/apartment_placeholder.jpg"} alt="Apartment" className="w-1/4 h-auto rounded-lg shadow-lg mx-2" />
      </div>

      <h2 className="text-2xl mb-4">Property Details</h2>

      <form onSubmit={handleSubmit}>
        {/* Property Details Section */}
        <div className="mb-6">
          <label className="block mb-1" htmlFor="name">Property Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1" htmlFor="minPrice">Minimum Price</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            value={formValues.minPrice}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1" htmlFor="maxPrice">Maximum Price</label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            value={formValues.maxPrice}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1" htmlFor="rentalType">Rental Type</label>
          <select
            id="rentalType"
            name="rentalType"
            value={formValues.rentalType}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            <option value="">Select rental type</option>
            <option value="Loft">Loft</option>
            <option value="Penthouse">Penthouse</option>
            <option value="Townhouse">Townhouse</option>
            <option value="Apartment">Apartment</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-1" htmlFor="starRating">Star Rating</label>
          <input
            type="number"
            id="starRating"
            name="starRating"
            value={formValues.starRating}
            onChange={handleChange}
            min="1"
            max="5"
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/* Contact Information Section */}
        <h2 className="text-2xl mb-4">Contact Information</h2>

        <div className="mb-6">
          <label className="block mb-1" htmlFor="propertyType">Property Type</label>
          <input
            type="text"
            id="propertyType"
            name="propertyType"
            value={formValues.propertyType}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1" htmlFor="phoneNumber">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formValues.phoneNumber}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1" htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formValues.address}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/* Image Uploads Section */}
        <h2 className="text-2xl mb-4">Upload Images</h2>

        <div className="mb-6">
          <label className="block mb-1" htmlFor="kitchenImage">Kitchen Image URL</label>
          <input
            type="text"
            id="kitchenImage"
            name="kitchenImage"
            value={formValues.kitchenImage}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1" htmlFor="livingRoomImage">Living Room Image URL</label>
          <input
            type="text"
            id="livingRoomImage"
            name="livingRoomImage"
            value={formValues.livingRoomImage}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1" htmlFor="bedroomImage">Bedroom Image URL</label>
          <input
            type="text"
            id="bedroomImage"
            name="bedroomImage"
            value={formValues.bedroomImage}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1" htmlFor="apartmentImage">Apartment Image URL</label>
          <input
            type="text"
            id="apartmentImage"
            name="apartmentImage"
            value={formValues.apartmentImage}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        <div className="flex justify-between mt-4">
      <button
        type="button"
        onClick={handleCancel}
        className="w-1/3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200"
      >
        Cancel
      </button>
      <button
        type="submit"
        onClick={handleSubmit}
        className="relative w-1/3 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <CircularProgress size={24} className="absolute left-1/2 transform -translate-x-1/2" />
        ) : (
          'Submit'
        )}
      </button>
    </div>
      </form>

      {/* Modal for login/register */}
      {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default PropertyForm;
