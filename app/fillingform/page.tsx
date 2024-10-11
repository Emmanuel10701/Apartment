"use client";
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
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
  kitchenImage: File | null; 
  livingRoomImage: File | null; 
  bedroomImage: File | null; 
  apartmentImage: File | null; 
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string; 
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
    userId: session?.user?.id || '',
    kitchenImage: null,
    livingRoomImage: null,
    bedroomImage: null,
    apartmentImage: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'file') {
      const files = (e.target as HTMLInputElement).files;
      setFormValues((prev) => ({
        ...prev,
        [name]: files ? files[0] : null,
      }));
    } else {
      setFormValues((prev) => ({
        ...prev,
        [name]: name === 'minPrice' || name === 'maxPrice' || name === 'starRating'
          ? Number(value)
          : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      setIsModalOpen(true);
      return;
    }
  
    setIsSubmitting(true);
    setFeedbackMessage('');
  
    const formData = new FormData();
    formData.append('name', formValues.name);
    formData.append('minPrice', formValues.minPrice.toString());
    formData.append('maxPrice', formValues.maxPrice.toString());
    formData.append('rentalType', formValues.rentalType);
    formData.append('starRating', formValues.starRating.toString());
    formData.append('propertyType', formValues.propertyType);
    formData.append('phoneNumber', formValues.phoneNumber);
    formData.append('email', formValues.email);
    formData.append('address', formValues.address);
    formData.append('userId', session.user.id);
    
    if (formValues.kitchenImage) formData.append('kitchenImage', formValues.kitchenImage);
    if (formValues.livingRoomImage) formData.append('livingRoomImage', formValues.livingRoomImage);
    if (formValues.bedroomImage) formData.append('bedroomImage', formValues.bedroomImage);
    if (formValues.apartmentImage) formData.append('apartmentImage', formValues.apartmentImage);

    try {
      const response = await fetch('/api/Apartment', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit property');
      }
  
      setFeedbackMessage('Property submitted successfully!');
      handleCancel(); // Reset the form
    } catch (error) {
      console.error('Error submitting form:', error);
      setFeedbackMessage('Error submitting property: ' + (error instanceof Error ? error.message : 'Unknown error'));
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
      kitchenImage: null,
      livingRoomImage: null,
      bedroomImage: null,
      apartmentImage: null,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 border border-gray-300 rounded-md bg-white shadow-md">
      <h2 className="text-2xl mb-4">Property Details</h2>
      <form onSubmit={handleSubmit}>
        {/* Property Name */}
        <div className="mb-6">
          <label className="block mb-1 focus-within:text-blue-600" htmlFor="name">Property Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
          />
        </div>

        {/* Price Inputs */}
        <div className="mb-6">
          <label className="block mb-1 focus-within:text-blue-600" htmlFor="minPrice">Minimum Price</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            value={formValues.minPrice}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 focus-within:text-blue-600" htmlFor="maxPrice">Maximum Price</label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            value={formValues.maxPrice}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
          />
        </div>

        {/* Rental Type Dropdown */}
        <div className="mb-6">
          <label className="block mb-1 focus-within:text-blue-600" htmlFor="rentalType">Rental Type</label>
          <select
            id="rentalType"
            name="rentalType"
            value={formValues.rentalType}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
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
        <div className="mb-6">
          <label className="block mb-1 focus-within:text-blue-600" htmlFor="starRating">Star Rating</label>
          <select
            id="starRating"
            name="starRating"
            value={formValues.starRating}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
          >
            <option value="0">Select Star Rating</option>
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        {/* Property Type Dropdown */}
        <div className="mb-6">
          <label className="block mb-1 focus-within:text-blue-600" htmlFor="propertyType">Property Type</label>
          <select
            id="propertyType"
            name="propertyType"
            value={formValues.propertyType}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
          >
            <option value="">Select Property Type</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Condo">Condo</option>
            <option value="Loft">Loft</option>
          </select>
        </div>

        {/* Contact Information */}
        <h2 className="text-2xl mb-4">Contact Information</h2>

        <div className="mb-6">
          <label className="block mb-1 focus-within:text-blue-600" htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formValues.phoneNumber}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 focus-within:text-blue-600" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 focus-within:text-blue-600" htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formValues.address}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
          />
        </div>

        {/* Image Uploads Section */}
        <h2 className="text-2xl mb-4">Upload Images</h2>

        {['kitchenImage', 'livingRoomImage', 'bedroomImage', 'apartmentImage'].map((imageField) => (
          <div className="mb-6" key={imageField}>
            <label className="block mb-1 focus-within:text-blue-600" htmlFor={imageField}>
              {imageField.replace('Image', ' Image').replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <input
              type="file"
              id={imageField}
              name={imageField}
              accept="image/*"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
            />
          </div>
        ))}

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

      {/* Feedback Message */}
      {feedbackMessage && <div className="mt-4 text-red-600">{feedbackMessage}</div>}

      {/* Modal for login/register */}
      {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default PropertyForm;
