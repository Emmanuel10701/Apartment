"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { CircularProgress } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";

type ApartmentFormData = {
  name: string;
  address: string;
  minPrice: number;
  maxPrice: number;
  rentalType: "Monthly" | "Yearly";
  condoType: "1 Bedroom" | "2 Bedroom" | "3 Bedroom";
  description: string;
  apartmentTowerImage: FileList;
  livingRoomImage: FileList;
  bedroomsImage: FileList;
};

const ApartmentForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    clearErrors,
    reset,
  } = useForm<ApartmentFormData>();

  const [currentStep, setCurrentStep] = useState(0);
  const [processing, setProcessing] = useState(false);

  // Image Previews as an object with single URLs per category
  const [imagePreviews, setImagePreviews] = useState<{
    apartmentTowerImage?: string;
    livingRoomImage?: string;
    bedroomsImage?: string;
  }>({});

  // Watch each image input individually
  const watchApartmentTowerImage = watch("apartmentTowerImage");
  const watchLivingRoomImage = watch("livingRoomImage");
  const watchBedroomsImage = watch("bedroomsImage");

  useEffect(() => {
    const newPreviews: {
      apartmentTowerImage?: string;
      livingRoomImage?: string;
      bedroomsImage?: string;
    } = {};

    // Apartment Tower Image
    if (watchApartmentTowerImage && watchApartmentTowerImage.length > 0) {
      const file = watchApartmentTowerImage[0];
      newPreviews.apartmentTowerImage = URL.createObjectURL(file);
    }

    // Living Room Image
    if (watchLivingRoomImage && watchLivingRoomImage.length > 0) {
      const file = watchLivingRoomImage[0];
      newPreviews.livingRoomImage = URL.createObjectURL(file);
    }

    // Bedrooms Image
    if (watchBedroomsImage && watchBedroomsImage.length > 0) {
      const file = watchBedroomsImage[0];
      newPreviews.bedroomsImage = URL.createObjectURL(file);
    }

    setImagePreviews(newPreviews);

    // Cleanup URLs to avoid memory leaks
    return () => {
      Object.values(newPreviews).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [watchApartmentTowerImage, watchLivingRoomImage, watchBedroomsImage]);

  const validateData = (data: ApartmentFormData) => {
    const validationErrors: Record<string, string> = {};

    if (!data.name.trim()) validationErrors.name = "Name is required.";
    if (!data.address.trim()) validationErrors.address = "Address is required.";
    if (data.minPrice < 0) validationErrors.minPrice = "Min Price cannot be negative.";
    if (data.maxPrice <= data.minPrice) validationErrors.maxPrice = "Max Price must be greater than Min Price.";
    if (!data.rentalType) validationErrors.rentalType = "Rental Type is required.";
    if (!data.condoType) validationErrors.condoType = "Condo Type is required.";
    if (!data.description.trim()) validationErrors.description = "Description is required.";

    // Validate Apartment Tower Image
    if (!data.apartmentTowerImage || data.apartmentTowerImage.length === 0) {
      validationErrors.apartmentTowerImage = "Apartment Tower image is required.";
    } else {
      const file = data.apartmentTowerImage[0];
      if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
        validationErrors.apartmentTowerImage = "Only JPEG, PNG, and GIF images are allowed.";
      }
      // Optional: Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        validationErrors.apartmentTowerImage = "Image size should not exceed 5MB.";
      }
    }

    // Validate Living Room Image
    if (!data.livingRoomImage || data.livingRoomImage.length === 0) {
      validationErrors.livingRoomImage = "Living Room image is required.";
    } else {
      const file = data.livingRoomImage[0];
      if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
        validationErrors.livingRoomImage = "Only JPEG, PNG, and GIF images are allowed.";
      }
      if (file.size > 5 * 1024 * 1024) {
        validationErrors.livingRoomImage = "Image size should not exceed 5MB.";
      }
    }

    // Validate Bedrooms Image
    if (!data.bedroomsImage || data.bedroomsImage.length === 0) {
      validationErrors.bedroomsImage = "Bedrooms image is required.";
    } else {
      const file = data.bedroomsImage[0];
      if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
        validationErrors.bedroomsImage = "Only JPEG, PNG, and GIF images are allowed.";
      }
      if (file.size > 5 * 1024 * 1024) {
        validationErrors.bedroomsImage = "Image size should not exceed 5MB.";
      }
    }

    return validationErrors;
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

    // Append Apartment Tower Image
    if (data.apartmentTowerImage && data.apartmentTowerImage.length > 0) {
      formData.append("apartmentTowerImage", data.apartmentTowerImage[0]);
    }

    // Append Living Room Image
    if (data.livingRoomImage && data.livingRoomImage.length > 0) {
      formData.append("livingRoomImage", data.livingRoomImage[0]);
    }

    // Append Bedrooms Image
    if (data.bedroomsImage && data.bedroomsImage.length > 0) {
      formData.append("bedroomsImage", data.bedroomsImage[0]);
    }

    try {
      await axios.post("/api/apartments", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Apartment added successfully!");
      reset(); // Reset form fields
      setCurrentStep(0); // Reset to first step
      setImagePreviews({}); // Clear image previews
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
            {/* Step 1 Content */}

            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                {...register("name")}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                {...register("address")}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3"
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="flex flex-col space-y-6">
            {/* Step 2 Content */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Min Price</label>
                <input
                  type="number"
                  {...register("minPrice", { valueAsNumber: true })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3"
                />
                {errors.minPrice && <p className="text-red-500 text-sm">{errors.minPrice.message}</p>}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Max Price</label>
                <input
                  type="number"
                  {...register("maxPrice", { valueAsNumber: true })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3"
                />
                {errors.maxPrice && <p className="text-red-500 text-sm">{errors.maxPrice.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rental Type</label>
              <select
                {...register("rentalType")}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3"
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
                {...register("condoType")}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3"
              >
                <option value="">Select Condo Type</option>
                <option value="1 Bedroom">1 Bedroom</option>
                <option value="2 Bedroom">2 Bedroom</option>
                <option value="3 Bedroom">3 Bedroom</option>
              </select>
              {errors.condoType && <p className="text-red-500 text-sm">{errors.condoType.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                {...register("description")}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3"
                rows={4}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            {/* Image Inputs */}
            <div className="space-y-4">
              {/* Apartment Tower Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Apartment Tower</label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("apartmentTowerImage", {
                    onChange: () => clearErrors("apartmentTowerImage"),
                  })}
                  className="mt-1 block w-full text-gray-800 border-gray-300 rounded-md shadow-sm p-3"
                />
                {errors.apartmentTowerImage && (
                  <p className="text-red-500 text-sm">{errors.apartmentTowerImage.message}</p>
                )}
              </div>

              {/* Living Room Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Living Room</label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("livingRoomImage", {
                    onChange: () => clearErrors("livingRoomImage"),
                  })}
                  className="mt-1 block w-full text-gray-800 border-gray-300 rounded-md shadow-sm p-3"
                />
                {errors.livingRoomImage && (
                  <p className="text-red-500 text-sm">{errors.livingRoomImage.message}</p>
                )}
              </div>

              {/* Bedrooms Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("bedroomsImage", {
                    onChange: () => clearErrors("bedroomsImage"),
                  })}
                  className="mt-1 block w-full text-gray-800 border-gray-300 rounded-md shadow-sm p-3"
                />
                {errors.bedroomsImage && (
                  <p className="text-red-500 text-sm">{errors.bedroomsImage.message}</p>
                )}
              </div>
            </div>

            {/* Image Previews */}
            <div className="mt-4 grid grid-cols-1 gap-4">
              {/* Apartment Tower Preview */}
              {imagePreviews.apartmentTowerImage && (
                <div>
                  <h4 className="font-medium mb-2">Apartment Tower Image Preview:</h4>
                  <img
                    src={imagePreviews.apartmentTowerImage}
                    alt="Apartment Tower Preview"
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              )}

              {/* Living Room Preview */}
              {imagePreviews.livingRoomImage && (
                <div>
                  <h4 className="font-medium mb-2">Living Room Image Preview:</h4>
                  <img
                    src={imagePreviews.livingRoomImage}
                    alt="Living Room Preview"
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              )}

              {/* Bedrooms Preview */}
              {imagePreviews.bedroomsImage && (
                <div>
                  <h4 className="font-medium mb-2">Bedrooms Image Preview:</h4>
                  <img
                    src={imagePreviews.bedroomsImage}
                    alt="Bedrooms Preview"
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col space-y-6">
            {/* Step 3 Content - Review */}
            <h3 className="text-2xl font-bold mt-10 text-slate-700 mb-4">Review Your Information</h3>
            <p>
              <strong>Name:</strong> {watch("name")}
            </p>
            <p>
              <strong>Address:</strong> {watch("address")}
            </p>
            <p>
              <strong>Min Price:</strong> ${watch("minPrice")}
            </p>
            <p>
              <strong>Max Price:</strong> ${watch("maxPrice")}
            </p>
            <p>
              <strong>Rental Type:</strong> {watch("rentalType")}
            </p>
            <p>
              <strong>Condo Type:</strong> {watch("condoType")}
            </p>
            <p>
              <strong>Description:</strong> {watch("description")}
            </p>

            {/* Image Previews */}
            <div className="mt-4  flex flex-wrap  gap-4">
              {/* Apartment Tower Preview */}
              {imagePreviews.apartmentTowerImage && (
                <div>
                  <h4 className="font-medium mb-2">Apartment Tower Image:</h4>
                  <img
                    src={imagePreviews.apartmentTowerImage}
                    alt="Apartment Tower Preview"
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              )}

              {/* Living Room Preview */}
              {imagePreviews.livingRoomImage && (
                <div>
                  <h4 className="font-medium mb-2">Living Room Image:</h4>
                  <img
                    src={imagePreviews.livingRoomImage}
                    alt="Living Room Preview"
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              )}

              {/* Bedrooms Preview */}
              {imagePreviews.bedroomsImage && (
                <div>
                  <h4 className="font-medium mb-2">Bedrooms Image:</h4>
                  <img
                    src={imagePreviews.bedroomsImage}
                    alt="Bedrooms Preview"
                    className="w-full h-32 object-cover rounded-md"
                  />
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
              <span className={`transform transition-all duration-300 ${currentStep >= 0 ? "text-blue-600" : "text-gray-400"}`}>
                Step 1
              </span>
              <span className={`transform transition-all duration-300 ${currentStep >= 1 ? "text-blue-600" : "text-gray-400"}`}>
                Step 2
              </span>
              <span className={`transform transition-all duration-300 ${currentStep >= 2 ? "text-blue-600" : "text-gray-400"}`}>
                Step 3
              </span>
            </div>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
        {renderStepContent()}
        <div className="flex justify-between">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="text-blue-500 hover:underline"
            >
              Back
            </button>
          )}
          {currentStep < 2 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={processing}
              className={`mt-4 w-full py-2 px-4 text-white bg-blue-500 rounded-md shadow-sm ${
                processing ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
              } transition`}
            >
              {processing ? <CircularProgress size={24} color="inherit" /> : "Submit"}
            </button>
          )}
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ApartmentForm;
