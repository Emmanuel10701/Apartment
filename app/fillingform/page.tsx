"use client";

import { useSession } from 'next-auth/react';
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress';
import {useRouter} from "next/navigation"

const PropertyForm: React.FC = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);


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
    availableRooms: '',
    kitchenImage: '',
    livingRoomImage: '',  
    description: '', // Add this line

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

  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLSelectElement |HTMLTextAreaElement| HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!session) {
      toast.error('You must be logged in to submit this form.');
      return;
    }
  
    if (Number(formData.minPrice) >= Number(formData.maxPrice)) {
      toast.error('Minimum price must be less than maximum price.');
      return;
    }
  
    const dataToSubmit = { ...formData };
    setSubmitting(true); // Set submitting state
  
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
        availableRooms: '',
        kitchenImage: '',
        livingRoomImage: '',
        description: '',
        bedroomImage: '',
        apartmentImage: '',
      });
  
      toast.success('Apartment created successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to create apartment. Please try again.');
    } finally {
      setSubmitting(false); // Reset submitting state
    }
  };
  
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );
  }


  if (!session) {
    return (
      <div className='flex items-center justify-center'>
        <div className="flex flex-col items-center justify-center mt-20 w-full max-w-md p-6 border border-gray-300 rounded-xl shadow-lg bg-white mx-auto my-4">
          <h2 className="text-2xl font-bold">Please Log In</h2>
          <p className="mt-2 text-gray-600">You need to log in to access this page. Security is needed</p>
          <button
            className={`mt-4 w-full py-2 rounded-full transition-all duration-300 ${loading ? 'border border-blue-600 bg-blue-600 text-white' : 'border border-blue-600 text-blue-600 bg-white hover:bg-blue-600 hover:text-white'} `}
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                window.location.href = '/login';
              }, 2000);
            }}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <CircularProgress size={24} color="inherit" className="mr-2" />
                <span>Processing...</span>
              </div>
            ) : (
              'Go to Login'
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="md:w-[70%] w-full mx-auto p-4 md:p-14 shadow-lg border rounded hover:shadow-xl">
          {session && (
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
          Hi, {session.user?.name}
      </h2>
   
      )}
      <h1 className="text-4xl my-10 font-bold text-slate-600  ">Create New Apartment</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">        <div className="mb-4 w-4/5 mx-auto"> {/* Reduce width by 20% */}
    <label className="block mb-1 text-2xl font-bold text-slate-400" htmlFor="name">
        Apartment Name
    </label>
    <input
        type="text"
        name="name"
        placeholder="Property Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-md focus:shadow-blue-500 transition-all duration-200"
    />
</div>


<div className="md:flex  gap-4">
    <div className="flex-1 w-4/5 mx-auto"> {/* Reduce width by 20% */}
        <label className="block mb-1 text-2xl font-bold text-slate-400" htmlFor="minPrice">
            Min Price
        </label>
        <select
            id="minPrice"
            name="minPrice"
            value={formData.minPrice}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-md focus:shadow-blue-500 transition-all duration-200"
        >
            {Array.from({ length: 11 }, (_, index) => (500 + index * 50)).map((price) => (
                <option key={price} value={price}>{price}</option>
            ))}
        </select>
    </div>
    <div className="flex-1 w-4/5 mx-auto"> {/* Reduce width by 20% */}
        <label className="block mb-1 text-2xl font-bold text-slate-400" htmlFor="maxPrice">
            Max Price
        </label>
        <select
            id="maxPrice"
            name="maxPrice"
            value={formData.maxPrice}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-md focus:shadow-blue-500 transition-all duration-200"
        >
            {Array.from({ length: 11 }, (_, index) => (1000 + index * 50)).map((price) => (
                <option key={price} value={price}>{price}</option>
            ))}
        </select>
    </div>
</div>


<div className="w-4/5 mx-auto"> {/* Reduce width by 20% */}
    <label className="block mb-1 text-2xl font-bold text-slate-400" htmlFor="rentalType">
        Rental Type
    </label>
    <select
        id="rentalType"
        name="rentalType"
        value={formData.rentalType}
        onChange={handleChange}
        required
        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-md focus:shadow-blue-500 transition-all duration-200"
    >
        <option value="">Select rental type</option>
        <option value="Studio" className="bg-orange-200">Studio</option>
        <option value="One-bedroom" className="bg-green-200">1 Bedroom</option>
        <option value="Two-bedrooms" className="bg-purple-200">2 Bedrooms</option>
        <option value="Three-bedrooms" className="bg-indigo-200">3 Bedrooms</option>
        <option value="Four-bedrooms" className="bg-blue-200">4+ Bedrooms</option>
    </select>
</div>

<div className="w-4/5 mx-auto"> {/* Reduce width by 20% */}
    <label className="block mb-1 text-2xl font-bold text-slate-400" htmlFor="starRating">
        Star Rating
    </label>
    <select
        id="starRating"
        name="starRating"
        value={formData.starRating}
        onChange={handleChange}
        required
        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-md focus:shadow-blue-500 transition-all duration-200"
    >
        <option value="0">Select Star Rating</option>
        {[1, 2, 3, 4, 5].map((rating) => (
            <option key={rating} value={rating}>
                {`${'⭐'.repeat(rating)} ${rating} Star${rating > 1 ? 's' : ''}`}
            </option>
        ))}
    </select>
</div>


<div className="w-4/5 mx-auto"> {/* Reduce width by 20% */}
    <label className="block mb-1 text-2xl font-bold text-slate-400" htmlFor="propertyType">
        Property Type
    </label>
    <select
        id="propertyType"
        name="propertyType"
        value={formData.propertyType}
        onChange={handleChange}
        required
        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-md focus:shadow-blue-500 transition-all duration-200"
    >
        <option value="">Select Property Type</option>
        <option value="House" className="text-orange-500">House</option>
        <option value="Apartment" className="text-green-500">Apartment</option>
        <option value="Condo" className="text-purple-500">Condo</option>
    </select>
</div>


<div className="w-4/5 mx-auto"> {/* Reduce width by 20% */}
    <label className="block mb-1 text-2xl font-bold text-slate-400" htmlFor="phoneNumber">
        Phone Number
    </label>
    <input
        type="text"
        name="phoneNumber"
        id="phoneNumber"
        placeholder="Phone Number"
        value={formData.phoneNumber}
        onChange={handleChange}
        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-md focus:shadow-blue-500 transition-all duration-200"
    />
</div>


<div className="w-4/5 mx-auto"> {/* Reduce width by 20% */}
    <label className="block mb-1 text-2xl font-bold text-slate-400" htmlFor="email">
        Email
    </label>
    <input
        type="email"
        name="email"
        id="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-md focus:shadow-blue-500 transition-all duration-200"
    />
</div>

<div className="w-4/5 mx-auto">
    <label className="block mb-1 text-2xl font-bold text-slate-400" htmlFor="address">
        Address
    </label>
    <input
        type="text"
        name="address"
        id="address"
        placeholder="Enter Address"
        value={formData.address}
        onChange={handleChange}
        required
        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-md focus:shadow-blue-500 transition-all duration-200"
    />
</div>


<div className="w-4/5 mx-auto"> {/* Reduce width by 20% */}
    <label className="block mb-1 text-2xl font-bold text-slate-400" htmlFor="availableRooms">
        Available Rooms
    </label>
    <input
        type="number"
        name="availableRooms"
        id="availableRooms"
        placeholder="Available Rooms"
        value={formData.availableRooms}
        onChange={handleChange}
        required
        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-md focus:shadow-blue-500 transition-all duration-200"
    />
</div>
<div>
    <label className="block mb-1 text-2xl font-bold text-slate-400" htmlFor="description">
        Description
    </label>
    <textarea
        name="description"
        id="description"
        placeholder="Enter a brief description of the apartment"
        value={formData.description}
        onChange={handleChange}
        required
        rows={4} // Set a fixed number of rows
        className="w-full p-3 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-md focus:shadow-blue-500 transition-all duration-200"
    />
</div>


{/* Kitchen Image URL Input */}
<div>
    <label className="block mb-1 text-2xl font-bold text-slate-400" htmlFor="kitchenImage">
        Kitchen Image URL
    </label>
    <input
        type="text"
        name="kitchenImage"
        id="kitchenImage"
        placeholder="Enter Kitchen Image URL"
        value={formData.kitchenImage}
        onChange={handleChange}
        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-md transition-all duration-200"
    />
</div>

{/* Living Room Image URL Input */}
<div>
    <label className="block mb-1 text-2xl font-bold text-slate-400" htmlFor="livingRoomImage">
        Living Room Image URL
    </label>
    <input
        type="text"
        name="livingRoomImage"
        id="livingRoomImage"
        placeholder="Enter Living Room Image URL"
        value={formData.livingRoomImage}
        onChange={handleChange}
        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-md transition-all duration-200"
    />
</div>

{/* Bedroom Image URL Input */}
<div>
    <label className="block mb-1 text-2xl font-bold text-slate-400" htmlFor="bedroomImage">
        Bedroom Image URL
    </label>
    <input
        type="text"
        name="bedroomImage"
        id="bedroomImage"
        placeholder="Enter Bedroom Image URL"
        value={formData.bedroomImage}
        onChange={handleChange}
        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-md transition-all duration-200"
    />
</div>

{/* Apartment Image URL Input */}
<div>
    <label className="block mb-1 text-2xl font-bold text-slate-400" htmlFor="apartmentImage">
        Apartment Image URL
    </label>
    <input
        type="text"
        name="apartmentImage"
        id="apartmentImage"
        placeholder="Enter Apartment Image URL"
        value={formData.apartmentImage}
        onChange={handleChange}
        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-md transition-all duration-200"
    />
</div>


        {/* Submit and Cancel buttons */}
        <div className='flex gap-6'>
        <button 
            type="submit" 
            className={`w-[60%] py-3 ${submitting ? 'bg-gray-400' : 'bg-blue-600'} text-white rounded-full transition duration-200 hover:bg-blue-700 focus:outline-none`}
            disabled={submitting} // Disable button while submitting
          >
            {submitting ? (
              <div className="flex items-center justify-center">
                <CircularProgress size={24} color="inherit" className="mr-2" />
                <span>Submitting...</span>
              </div>
            ) : (
              'Submit'
            )}
          </button>

          
          <button 
            type="button" 
            className="w-[60%] py-3 bg-gray-600 text-white rounded-full transition duration-200 hover:bg-gray-700 focus:outline-none"
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
