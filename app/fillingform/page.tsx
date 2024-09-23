"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ApartmentFormData = {
  name: string;
  address: string;
  minPrice: number;
  maxPrice: number;
  rentalType: "Monthly" | "Yearly";
  condoType: "1 Bedroom" | "2 Bedroom" | "3 Bedroom";
  description: string;
  images: FileList;
};

const ApartmentForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, watch, clearErrors } = useForm<ApartmentFormData>();
  const [currentStep, setCurrentStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const images = watch("images");

  useEffect(() => {
    if (images && images.length > 0) {
      const fileArray = Array.from(images).map((file) => URL.createObjectURL(file));
      setImagePreviews(fileArray);
      return () => {
        fileArray.forEach((url) => URL.revokeObjectURL(url));
      };
    } else {
      setImagePreviews([]);
    }
  }, [images]);

  const validateData = (data: ApartmentFormData) => {
    const errors: Record<string, string> = {};
    if (!data.name) errors.name = "Name is required.";
    if (!data.address) errors.address = "Address is required.";
    if (data.minPrice < 0) errors.minPrice = "Min Price cannot be negative.";
    if (data.maxPrice <= data.minPrice) errors.maxPrice = "Max Price must be greater than Min Price.";
    if (!data.rentalType) errors.rentalType = "Rental Type is required.";
    if (!data.condoType) errors.condoType = "Condo Type is required.";
    if (!data.description) errors.description = "Description is required.";
    if (!images || images.length === 0) errors.images = "At least one image is required.";
    else {
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
          errors.images = "Only JPEG, PNG, and GIF images are allowed.";
          break;
        }
      }
    }
    return errors;
  };

  const onSubmit: SubmitHandler<ApartmentFormData> = async (data) => {
    const validationErrors = validateData(data);
    if (Object.keys(validationErrors).length > 0) {
      for (const [key, message] of Object.entries(validationErrors)) {
        toast.error(message);
      }
      return;
    }

    setProcessing(true);
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("address", data.address);
    formData.append("minPrice", data.minPrice.toString());
    formData.append("maxPrice", data.maxPrice.toString());
    formData.append("rentalType", data.rentalType);
    formData.append("description", data.description);
    formData.append("condoType", data.condoType);

    if (data.images && data.images.length > 0) {
      for (let i = 0; i < data.images.length; i++) {
        formData.append("images", data.images[i]);
      }
    }

    try {
      await axios.post("/api/apartments", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Apartment added successfully!");
    } catch (error) {
      toast.error("Failed to process the request.");
    } finally {
      setProcessing(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="flex flex-col space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" {...register("name")} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3" />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input type="text" {...register("address")} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3" />
              {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="flex flex-col space-y-6">
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Min Price</label>
                <input type="number" {...register("minPrice", { valueAsNumber: true })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3" />
                {errors.minPrice && <p className="text-red-500 text-sm">{errors.minPrice.message}</p>}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Max Price</label>
                <input type="number" {...register("maxPrice", { valueAsNumber: true })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3" />
                {errors.maxPrice && <p className="text-red-500 text-sm">{errors.maxPrice.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rental Type</label>
              <select {...register("rentalType")} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3">
                <option value="">Select Rental Type</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
              {errors.rentalType && <p className="text-red-500 text-sm">{errors.rentalType.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Condo Type</label>
              <select {...register("condoType")} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3">
                <option value="">Select Condo Type</option>
                <option value="1 Bedroom">1 Bedroom</option>
                <option value="2 Bedroom">2 Bedroom</option>
                <option value="3 Bedroom">3 Bedroom</option>
              </select>
              {errors.condoType && <p className="text-red-500 text-sm">{errors.condoType.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea {...register("description")} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3" rows={4} />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Images</label>
              <input 
                type="file" 
                multiple 
                {...register("images", {
                  onChange: (e) => {
                    clearErrors("images");
                  }
                })} 
                className="mt-1 block w-full text-gray-800 border-gray-300 rounded-md shadow-sm p-3" 
              />
              {errors.images && <p className="text-red-500 text-sm">{errors.images.message}</p>}
            </div>
            <div className="mt-4">
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {imagePreviews.map((src, index) => (
                    <img key={index} src={src} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col space-y-6">
            <h3 className="text-xl font-semibold mb-4">Review Your Information</h3>
            <p><strong>Name:</strong> {watch("name")}</p>
            <p><strong>Address:</strong> {watch("address")}</p>
            <p><strong>Min Price:</strong> ${watch("minPrice")}</p>
            <p><strong>Max Price:</strong> ${watch("maxPrice")}</p>
            <p><strong>Rental Type:</strong> {watch("rentalType")}</p>
            <p><strong>Condo Type:</strong> {watch("condoType")}</p>
            <p><strong>Description:</strong> {watch("description")}</p>
            <div className="mt-4">
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {imagePreviews.map((src, index) => (
                    <img key={index} src={src} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const progressPercentage = ((currentStep + 1) / 3) * 100;

  return (
    <div className="p-12 bg-white shadow-lg rounded-lg max-w-2xl mx-auto">
      <h2 className="text-3xl font-semibold mb-8 text-gray-800">Add New Apartment</h2>
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <div className="relative w-full">
            <div className="bg-gray-200 h-2 rounded-full">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progressPercentage}%` }} />
            </div>
            <div className="absolute flex justify-between w-full text-xs font-medium">
              <span className={`transform transition-all duration-300 ${currentStep >= 0 ? "text-blue-600" : "text-gray-400"}`}>Step 1</span>
              <span className={`transform transition-all duration-300 ${currentStep >= 1 ? "text-blue-600" : "text-gray-400"}`}>Step 2</span>
              <span className={`transform transition-all duration-300 ${currentStep >= 2 ? "text-blue-600" : "text-gray-400"}`}>Step 3</span>
            </div>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
        {renderStepContent()}
        <div className="flex justify-between">
          {currentStep > 0 && (
            <button type="button" onClick={() => setCurrentStep(currentStep - 1)} className="text-blue-500 hover:underline">Back</button>
          )}
          {currentStep < 2 ? (
            <button type="button" onClick={() => handleSubmit(() => setCurrentStep(currentStep + 1))()} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Next</button>
          ) : (
            <button type="submit" disabled={processing} className={`mt-4 w-full py-2 px-4 text-white bg-blue-500 rounded-md shadow-sm ${processing ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"} transition`}>
              {processing ? "Processing..." : "Submit"}
            </button>
          )}
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ApartmentForm;
