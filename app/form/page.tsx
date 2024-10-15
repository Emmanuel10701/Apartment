"use client"
import { useSession } from 'next-auth/react';
import { useState, ChangeEvent, FormEvent } from 'react';

// TypeScript declaration for next-auth
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
  const [formData, setFormData] = useState({
    name: '',
    minPrice: '',
    maxPrice: '',
    rentalType: '',
    starRating: '',
    propertyType: '',
    phoneNumber: '',
    email: "", // Autofilled from session
    address: '',
    userId: session?.user?.id || '', // Autofilled from session
    kitchenImage: '',
    livingRoomImage: '',
    bedroomImage: '',
    apartmentImage: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if user is logged in
    if (!session) {
      setError('You must be logged in to submit this form.');
      return;
    }

    try {
      const response = await fetch('/api/Apartment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      console.log('Apartment created:', data);

      // Reset form
      setFormData({
        name: '',
        minPrice: '',
        maxPrice: '',
        rentalType: '',
        starRating: '',
        propertyType: '',
        phoneNumber: '',
        email: '', // Reset email to session email
        address: '',
        userId: session?.user?.id || '', // Reset user ID to session user ID
        kitchenImage: '',
        livingRoomImage: '',
        bedroomImage: '',
        apartmentImage: '',
      });
      setError(''); // Clear error message if submission is successful
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to create apartment. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow">
      <h1 className="text-xl font-bold mb-4">Create New Apartment</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>} {/* Error message display */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
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
        <div className="mb-4">
          <input
            type="number"
            name="minPrice"
            placeholder="Minimum Price"
            value={formData.minPrice}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            name="maxPrice"
            placeholder="Maximum Price"
            value={formData.maxPrice}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="rentalType"
            placeholder="Rental Type"
            value={formData.rentalType}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            name="starRating"
            placeholder="Star Rating"
            value={formData.starRating}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="propertyType"
            placeholder="Property Type"
            value={formData.propertyType}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <input
            type="url"
            name="kitchenImage"
            placeholder="Kitchen Image URL"
            value={formData.kitchenImage}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <input
            type="url"
            name="livingRoomImage"
            placeholder="Living Room Image URL"
            value={formData.livingRoomImage}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <input
            type="url"
            name="bedroomImage"
            placeholder="Bedroom Image URL"
            value={formData.bedroomImage}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <input
            type="url"
            name="apartmentImage"
            placeholder="Apartment Image URL"
            value={formData.apartmentImage}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="userId"
            placeholder="User ID"
            value={formData.userId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">Submit</button>
      </form>
    </div>
  );
};

export default PropertyForm;
