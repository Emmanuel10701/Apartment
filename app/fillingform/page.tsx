"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import Modal from '../components/modal2/page'; // Modal component for login/register

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
  kitchenImage?: File | null;
  livingRoomImage?: File | null;
  bedroomImage?: File | null;
  apartmentImage?: File | null;
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
      const file = e.target.files?.[0] || null;
      setFormValues((prev) => ({
        ...prev,
        [name]: file,
      }));
    } else {
      setFormValues((prev) => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      setIsModalOpen(true);
      return;
    }

    if (formValues.minPrice >= formValues.maxPrice) {
      setFeedbackMessage('Minimum price must be less than maximum price.');
      return;
    }

    setIsSubmitting(true);
    setFeedbackMessage('');

    const formData = new FormData();
    Object.entries(formValues).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value instanceof File ? value : value.toString());
      }
    });

    try {
      const response = await axios.post('/api/Apartment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        setFeedbackMessage('Property submitted successfully!');
        handleCancel(); // Reset the form
      } else {
        throw new Error('Failed to submit property');
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Error submitting property';
      setFeedbackMessage(errorMessage);
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
    setIsModalOpen(false); // Reset modal state if needed
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
            className="w-full p-3 border border-gray-300 rounded outline-none shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </div>

        {/* Price Inputs */}
        <div className="mb-6">
          <label className="block mb-1 focus-within:text-blue-600" htmlFor="minPrice">Minimum Price ($)</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            value={formValues.minPrice}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded outline-none shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 focus-within:text-blue-600" htmlFor="maxPrice">Maximum Price ($)</label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            value={formValues.maxPrice}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded outline-none shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
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
        <div className="mb-6">
          <label className="block mb-1 focus-within:text-blue-600" htmlFor="starRating">Star Rating</label>
          <select
            id="starRating"
            name="starRating"
            value={formValues.starRating}
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
        <div className="mb-6">
          <label className="block mb-1 focus-within:text-blue-600" htmlFor="propertyType">Property Type</label>
          <select
            id="propertyType"
            name="propertyType"
            value={formValues.propertyType}
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

        {/* Contact Information */}
        <div className="mb-6">
          <label className="block mb-1 focus-within:text-blue-600" htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formValues.phoneNumber}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded outline-none shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
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
            className="w-full p-3 border border-gray-300 rounded outline-none shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
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
            className="w-full p-3 border border-gray-300 rounded outline-none shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </div>

        {/* Image Uploads */}
        {['kitchenImage', 'livingRoomImage', 'bedroomImage', 'apartmentImage'].map((imageKey) => (
          <div className="mb-6" key={imageKey}>
            <label className="block mb-1 focus-within:text-blue-600" htmlFor={imageKey}>
              {imageKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} Image
            </label>
            <input
              type="file"
              id={imageKey}
              name={imageKey}
              onChange={handleChange}
              accept="image/*"
              required
              className="w-full p-3 border border-gray-300 rounded outline-none shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
        ))}

        {/* Feedback Message */}
        {feedbackMessage && (
          <div className="mb-4 text-green-600">{feedbackMessage}</div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
        >
          {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Property'}
        </button>
      </form>

      {/* Modal for Login/Register */}
      {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default PropertyForm;
