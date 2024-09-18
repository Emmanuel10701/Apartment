"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ApartmentFormData = {
  name: string;
  address: string;
  minPrice: number;
  maxPrice: number;
  rentalType: string;
  description: string;
  condoType: string;
  images: FileList; // Use FileList for file inputs
};

const ApartmentForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ApartmentFormData>();
  const [processing, setProcessing] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const onSubmit: SubmitHandler<ApartmentFormData> = async (data) => {
    setProcessing(true);
    const formData = new FormData();

    // Append other form data
    formData.append("name", data.name);
    formData.append("address", data.address);
    formData.append("minPrice", data.minPrice.toString());
    formData.append("maxPrice", data.maxPrice.toString());
    formData.append("rentalType", data.rentalType);
    formData.append("description", data.description);
    formData.append("condoType", data.condoType);

    // Append images
    if (data.images.length > 0) {
      for (let i = 0; i < data.images.length; i++) {
        formData.append("images", data.images[i]);
      }
    }

    try {
      await axios.post("/api/apartments", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Apartment added successfully!");
    } catch (error) {
      toast.error("Failed to process the request.");
    } finally {
      setProcessing(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setImagePreviews(fileArray);
    }
  };

  return (
    <div className="p-12 bg-white shadow-lg rounded-lg max-w-2xl mx-auto">
      <h2 className="text-3xl font-semibold mb-8 text-gray-800">Add New Apartment</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              {...register("address", { required: "Address is required" })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Min Price</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                <input
                  type="number"
                  {...register("minPrice", { required: "Min Price is required" })}
                  className="mt-1 block w-full pl-8 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                />
              </div>
              {errors.minPrice && <p className="text-red-500 text-sm">{errors.minPrice.message}</p>}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Max Price</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                <input
                  type="number"
                  {...register("maxPrice", { required: "Max Price is required" })}
                  className="mt-1 block w-full pl-8 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                />
              </div>
              {errors.maxPrice && <p className="text-red-500 text-sm">{errors.maxPrice.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rental Type</label>
            <select
              {...register("rentalType", { required: "Rental Type is required" })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
            >
              <option value="">Select Rental Type</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
            {errors.rentalType && <p className="text-red-500 text-sm">{errors.rentalType.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Condo Type</label>
            <select
              {...register("condoType", { required: "Condo Type is required" })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
            >
              <option value="">Select Condo Type</option>
              <option value="3 Bedroom">3 Bedroom</option>
              <option value="2 Bedroom">2 Bedroom</option>
              <option value="1 Bedroom">1 Bedroom</option>
            </select>
            {errors.condoType && <p className="text-red-500 text-sm">{errors.condoType.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              {...register("description", { required: "Description is required" })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
              rows={4}
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Images</label>
            <input
              type="file"
              {...register("images")}
              multiple
              onChange={handleImageChange}
              className="mt-1 block w-full text-gray-800 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
            />
            {errors.images && <p className="text-red-500 text-sm">{errors.images.message}</p>}
          </div>
          <div className="mt-4">
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {imagePreviews.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                ))}
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={processing}
            className={`mt-4 w-full py-2 px-4 text-white bg-blue-500 rounded-md shadow-sm ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {processing ? "Processing..." : "Add Apartment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApartmentForm;
