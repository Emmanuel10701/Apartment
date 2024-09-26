"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FiUpload } from 'react-icons/fi';
import { CircularProgress } from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircle } from '@fortawesome/free-solid-svg-icons';
import "react-toastify/dist/ReactToastify.css";

type ApartmentFormData = {
  name: string;
  email: email;
  phoneNumber: number;
  address: string;
  minPrice: number;
  maxPrice: number;
  rentalType: "Monthly" | "Yearly";
  condoType: "1 Bedroom" | "2 Bedroom" | "3 Bedroom"| "4+ Bedroom"| "Apartment" | "House";
  description: string;
  apartmentTowerImage: FileList;
  livingRoomImage: FileList;
  kitchenImage: FileList;
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
    kitchenImage?: string;
    bedroomsImage?: string;
  }>({});

  // Watch each image input individually
  const watchApartmentTowerImage = watch("apartmentTowerImage");
  const watchLivingRoomImage = watch("livingRoomImage");
  const watchkitchenImage = watch("livingRoomImage");
  const watchBedroomsImage = watch("bedroomsImage");

  useEffect(() => {
    const newPreviews: {
      apartmentTowerImage?: string;
      livingRoomImage?: string;
      kitchenImage?: string;
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
    if (watchkitchenImage && watchkitchenImage.length > 0) {
      const file = watchkitchenImage[0];
      newPreviews.kitchenImage = URL.createObjectURL(file);
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
    if (!data.phoneNumber.trim()) validationErrors.phoneNumber = "Phone Number is required.";
    if (!data.email.trim()) validationErrors.email = "Email is required.";
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
      if (!["image/jpeg", "image/png", "image/gif", "image/avif", "image/webp", "image/jpg"].includes(file.type)) {
        validationErrors.apartmentTowerImage = "Only JPEG, JPG, PNG, GIF, AVIF, and WebP images are allowed.";
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
      if (!["image/jpeg", "image/png", "image/gif", "image/avif", "image/webp", "image/jpg"].includes(file.type)) {
        validationErrors.livingRoomImage = "Only JPEG, JPG, PNG, GIF, AVIF, and WebP images are allowed.";
    }
    
      if (file.size > 5 * 1024 * 1024) {
        validationErrors.livingRoomImage = "Image size should not exceed 5MB.";
      }
    }
    // Validate Living Room Image
    if (!data.kitchenImage || data.kitchenImage.length === 0) {
      validationErrors.kitchenImage = "Living Room image is required.";
    } else {
      const file = data.kitchenImage[0];
      if (!["image/jpeg", "image/png", "image/gif", "image/avif", "image/webp", "image/jpg"].includes(file.type)) {
        validationErrors.bedroomsImage = "Only JPEG, JPG, PNG, GIF, AVIF, and WebP images are allowed.";
    }
    
      if (file.size > 5 * 1024 * 1024) {
        validationErrors.kitchenImage = "Image size should not exceed 5MB.";
      }
    }

    // Validate Bedrooms Image
    if (!data.bedroomsImage || data.bedroomsImage.length === 0) {
      validationErrors.bedroomsImage = "Bedrooms image is required.";
    } else {
      const file = data.bedroomsImage[0];
      if (!["image/jpeg", "image/png", "image/gif", "image/avif", "image/webp", "image/jpg"].includes(file.type)) {
        validationErrors.bedroomsImage = "Only JPEG, JPG, PNG, GIF, AVIF, and WebP images are allowed.";
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
    formData.append("email", data.email);
    formData.append("phoneNumber", data.phoneNumber);
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
    if (data.kitchenImage && data.kitchenImage.length > 0) {
      formData.append("livingRoomImage", data.kitchenImage[0]);
    }

    // Append Bedrooms Image
    if (data.bedroomsImage && data.bedroomsImage.length > 0) {
      formData.append("bedroomsImage", data.bedroomsImage[0]);
    }

    try {
      await axios.post("/api/Apartment", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Apartment added successfully!");
      reset(); // Reset form fields
      setCurrentStep(0); // Reset to first step
      setImagePreviews({}); // Clear image previews
    } catch (error:any) {
      toast.error("Failed to process the request.", error);
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };


  const [uploadedImages, setUploadedImages] = useState([]);
  const handleImageChange = (event, setImage) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setUploadedImages(prevImages => [...prevImages, ...newImages]);
    setImage(newImages);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="flex flex-col space-y-6">
            {/* Step 1 Content */}

            <div>
                <label className="block text-lg font-semibold text-gray-800 mb-2">Name</label>
                <input
                  type="text"
                  {...register("name")}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-4 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>


              <div>
              <label className="block text-lg font-semibold text-gray-800 mb-2">Phone Number</label>
              <input
                type="tel"
                {...register("phoneNumber")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-4 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
              />
              {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
            </div>
            <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2">Email</label>
            <input
              type="email"
              {...register("email")}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-4 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2">Address</label>
            <input
              type="text"
              {...register("address")}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-4 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
          </div>

          </div>
        );
      case 1:
        return (
          <div className="flex flex-col space-y-6">
            {/* Step 2 Content */}
            <div className="flex gap-8">
                <div className="flex-1">
                  <label className="block text-lg font-semibold text-gray-800 mb-2">Min Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      {...register("minPrice", { valueAsNumber: true })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm pl-8 pr-3 p-4 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                      placeholder="0"
                    />
                  </div>
                  {errors.minPrice && <p className="text-red-500 text-sm mt-1">{errors.minPrice.message}</p>}
                </div>

              <div className="flex-1">
                <label className="block text-lg font-semibold text-gray-800 mb-2">Max Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    {...register("maxPrice", { valueAsNumber: true })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm pl-8 pr-3 p-4 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                    placeholder="0"
                  />
                </div>
                {errors.maxPrice && <p className="text-red-500 text-sm mt-1">{errors.maxPrice.message}</p>}
              </div>
               </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-2">Rental Type</label>
                  <select
                    {...register("rentalType")}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-4 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                  >
                    <option value="" disabled>Select Rental Type</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                  {errors.rentalType && <p className="text-red-500 text-sm mt-1">{errors.rentalType.message}</p>}
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-2">Condo Type</label>
                  <select
                    {...register("condoType")}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-4 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                  >
                    <option value="" disabled>Select Condo Type</option>
                    <option value="1 Bedroom">1 Bedroom</option>
                    <option value="2 Bedroom">2 Bedroom</option>
                    <option value="3 Bedroom">3 Bedroom</option>
                    <option value="4+ Bedroom">4+ Bedroom</option>
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                  </select>
                  {errors.condoType && <p className="text-red-500 text-sm mt-1">{errors.condoType.message}</p>}
                </div>

             <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2">Description</label>
            <textarea
              {...register("description")}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-4 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
              rows={4}
              placeholder="Enter a brief description..."
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>


            {/* Image Inputs */}

<div className="space-y-4">
  {/* Apartment Tower Image */}
  <div>
    <label className="block text-lg font-semibold text-gray-800 mb-2">Apartment Tower</label>
    <input
      type="file"
      accept="image/*"
      {...register("apartmentTowerImage", {
        onChange: () => clearErrors("apartmentTowerImage"),
      })}
      className="mt-1 hidden"
      id="apartmentTowerImage"
    />
    <label
      htmlFor="apartmentTowerImage"
      className="flex items-center justify-center cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition"
    >
      <FiUpload className="mr-2" /> Upload Apartment Image
    </label>
    {errors.apartmentTowerImage && (
      <p className="text-red-500 text-sm">{errors.apartmentTowerImage.message}</p>
    )}
  </div>

  {/* Living Room Image */}
  <div>
    <label className="block text-lg font-semibold text-gray-800 mb-2">Living Room</label>
    <input
      type="file"
      accept="image/*"
      {...register("livingRoomImage", {
        onChange: () => clearErrors("livingRoomImage"),
      })}
      className="mt-1 hidden"
      id="livingRoomImage"
    />
    <label
      htmlFor="livingRoomImage"
      className="flex items-center justify-center cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition"
    >
      <FiUpload className="mr-2" /> Upload Living Room Image
    </label>
    {errors.livingRoomImage && (
      <p className="text-red-500 text-sm">{errors.livingRoomImage.message}</p>
    )}
  </div>

  {/* Kitchen Image */}
  <div>
    <label className="block text-lg font-semibold text-gray-800 mb-2">Kitchen</label>
    <input
      type="file"
      accept="image/*"
      {...register("kitchenImage", {
        onChange: () => clearErrors("kitchenImage"),
      })}
      className="mt-1 hidden"
      id="kitchenImage"
    />
    <label
      htmlFor="kitchenImage"
      className="flex items-center justify-center cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition"
    >
      <FiUpload className="mr-2" /> Upload Kitchen Image
    </label>
    {errors.kitchenImage && (
      <p className="text-red-500 text-sm">{errors.kitchenImage.message}</p>
    )}
  </div>

  {/* Bedrooms Image */}
  <div>
    <label className="block text-lg font-semibold text-gray-800 mb-2">Bedrooms</label>
    <input
      type="file"
      accept="image/*"
      {...register("bedroomsImage", {
        onChange: () => clearErrors("bedroomsImage"),
      })}
      className="mt-1 hidden"
      id="bedroomsImage"
    />
    <label
      htmlFor="bedroomsImage"
      className="flex items-center justify-center cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition"
    >
      <FiUpload className="mr-2" /> Upload Bedrooms Image
    </label>
    {errors.bedroomsImage && (
      <p className="text-red-500 text-sm">{errors.bedroomsImage.message}</p>
    )}
  </div>

  {/* Image Preview */}
  <div className="flex flex-wrap justify-center">
    {uploadedImages.map((image, index) => (
      <img
        key={index}
        src={image}
        alt={`Preview ${index + 1}`}
        className="mt-4 mx-2 w-1/2 md:w-1/4 lg:w-1/3 rounded-md shadow-md"
      />
    ))}
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
              {imagePreviews.kitchenImage && (
                <div>
                  <h4 className="font-medium mb-2">kitchen Image Preview:</h4>
                  <img
                    src={imagePreviews.kitchenImage}
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
<div className="flex flex-col sm:flex-row sm:space-x-6">
  <div className="flex-1 mb-4">
    <p>
      <span className="font-bold text-green-600">Name:</span> {watch("name")}
    </p>
    <p>
      <span className="font-bold text-green-600">Phone:</span> {watch("phoneNumber")}
    </p>
    <p>
      <span className="font-bold text-green-600">Email:</span> {watch("email")}
    </p>
    <p>
      <span className="font-bold text-green-600">Address:</span> {watch("address")}
    </p>
  </div>
  <div className="flex-1 mb-4">
    <p>
      <span className="font-bold text-green-600">Min Price:</span> ${watch("minPrice")}
    </p>
    <p>
      <span className="font-bold text-green-600">Max Price:</span> ${watch("maxPrice")}
    </p>
    <p>
      <span className="font-bold text-green-600">Rental Type:</span> {watch("rentalType")}
    </p>
    <p>
      <span className="font-bold text-green-600">Condo Type:</span> {watch("condoType")}
    </p>
    <p>
      <span className="font-bold text-green-600">Description:</span> {watch("description")}
    </p>
  </div>
</div>


            {/* Image Previews */}
            <div className="mt-4 flex flex-wrap gap-4">
  {/* Apartment Tower Preview */}
  {imagePreviews.apartmentTowerImage && (
    <div>
      <h4 className="font-semibold text-blue-600 mb-2">Apartment Tower Image:</h4>
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
      <h4 className="font-semibold text-blue-600 mb-2">Living Room Image:</h4>
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
      <h4 className="font-semibold text-blue-600 mb-2">Bedrooms Image:</h4>
      <img
        src={imagePreviews.bedroomsImage}
        alt="Bedrooms Preview"
        className="w-full h-32 object-cover rounded-md"
      />
    </div>
  )}

  {/* Kitchen Preview */}
  {imagePreviews.kitchenImage && (
    <div>
      <h4 className="font-semibold text-blue-600 mb-2">Kitchen Image:</h4>
      <img
        src={imagePreviews.kitchenImage}
        alt="Kitchen Preview"
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


  return (
    <div className="p-12 shadow-lg rounded-lg max-w-2xl mx-auto">
      <div className="bg-slate-200  my-5 justify-center items-center mx-auto rounded-lg">
      <h2 className="text-3xl font-extrabold mb-8 text-center mt-8 pt-6 text-indigo-700 ">Add New Apartment</h2>
      
      <div className="mb-4 items-center flex   ">
        <div className="flex items-center mb-4">
          {['Step 1', 'Step 2', 'Step 3'].map((step, index) => (
            <div className="flex items-center" key={index}>
              <div className={`w-10 h-10 flex items-center justify-center rounded-full ${currentStep >= index ? 'bg-blue-500 text-white' : 'bg-slate-500 text-slate-300'}`}>
                {currentStep >= index ? (
                  <FontAwesomeIcon icon={faCheckCircle} />
                ) : (
                  <FontAwesomeIcon icon={faCircle} />
                )}
              </div>
              {index < 2 && (
                <div className={`h-1 w-20 ${currentStep > index ? 'bg-blue-700' : 'bg-gray-500'} mx-2`} />
              )}
            </div>
          ))}
        </div>
    
        
      </div>

      </div>

     
  
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
        {renderStepContent()}
        <div className="flex justify-evenly gap-10">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="text-white bg-slate-500 rounded-md float-start py-1 px-4 hover:outline-2 w-1/2"
            >
              Back
            </button>
          )}
          {currentStep < 2 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={processing}
              className={`mt-4 w-1/2 float-end py-2 px-4 text-white bg-blue-500 rounded-md shadow-sm ${
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
