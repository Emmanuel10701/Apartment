"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import SwiperCore, { Navigation, Pagination } from "swiper";

// Initialize Swiper modules
SwiperCore.use([Navigation, Pagination]);

// Define the Zod schema with enhanced validations
const apartmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  // Optional Email Field (Uncomment if needed)
  // email: z.string().email("Invalid email address").optional(),
  minPrice: z
    .number({ invalid_type_error: "Min Price must be a number" })
    .min(0, "Min Price cannot be negative"),
  maxPrice: z
    .number({ invalid_type_error: "Max Price must be a number" })
    .min(z.refine((val, ctx) => val > ctx.parent.minPrice, {
      message: "Max Price must be greater than Min Price",
    }), "Max Price must be greater than Min Price"),
  rentalType: z.enum(["Monthly", "Yearly"], {
    errorMap: () => ({ message: "Rental Type is required" }),
  }),
  condoType: z.enum(["1 Bedroom", "2 Bedroom", "3 Bedroom"], {
    errorMap: () => ({ message: "Condo Type is required" }),
  }),
  description: z.string().min(1, "Description is required"),
  images: z
    .any()
    .refine((files) => files?.length > 0, "At least one image is required")
    .refine(
      (files) => {
        if (!files) return false;
        for (let file of files) {
          if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
            return false;
          }
        }
        return true;
      },
      "Only JPEG, PNG, and GIF images are allowed"
    ),
});

type ApartmentFormData = z.infer<typeof apartmentSchema>;

const ApartmentForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors,
  } = useForm<ApartmentFormData>({
    resolver: zodResolver(apartmentSchema),
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const images = watch("images");

  useEffect(() => {
    if (images && images.length > 0) {
      const fileArray = Array.from(images).map((file) =>
        URL.createObjectURL(file)
      );
      setImagePreviews(fileArray);

      // Free memory when component unmounts
      return () => {
        fileArray.forEach((url) => URL.revokeObjectURL(url));
      };
    } else {
      setImagePreviews([]);
    }
  }, [images]);

  const onSubmit: SubmitHandler<ApartmentFormData> = async (data) => {
    setProcessing(true);
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("address", data.address);
    // Optional Email Field (Uncomment if needed)
    // if (data.email) formData.append("email", data.email);
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
      // Reset form or navigate as needed
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
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                {...register("name")}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                {...register("address")}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
              />
              {errors.address && (
                <p className="text-red-500 text-sm">
                  {errors.address.message}
                </p>
              )}
            </div>
            {/* Optional Email Field (Uncomment if needed)
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>
            */}
          </div>
        );
      case 1:
        return (
          <div className="flex flex-col space-y-6">
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Min Price
                </label>
                <input
                  type="number"
                  {...register("minPrice", { valueAsNumber: true })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                />
                {errors.minPrice && (
                  <p className="text-red-500 text-sm">
                    {errors.minPrice.message}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Max Price
                </label>
                <input
                  type="number"
                  {...register("maxPrice", { valueAsNumber: true })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                />
                {errors.maxPrice && (
                  <p className="text-red-500 text-sm">
                    {errors.maxPrice.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rental Type
              </label>
              <select
                {...register("rentalType")}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
              >
                <option value="">Select Rental Type</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
              {errors.rentalType && (
                <p className="text-red-500 text-sm">
                  {errors.rentalType.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Condo Type
              </label>
              <select
                {...register("condoType")}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
              >
                <option value="">Select Condo Type</option>
                <option value="1 Bedroom">1 Bedroom</option>
                <option value="2 Bedroom">2 Bedroom</option>
                <option value="3 Bedroom">3 Bedroom</option>
              </select>
              {errors.condoType && (
                <p className="text-red-500 text-sm">
                  {errors.condoType.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                {...register("description")}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                rows={4}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Images
              </label>
              <input
                type="file"
                {...register("images")}
                multiple
                onChange={() => {
                  // Clear previous errors if any
                  if (images && images.length > 0) {
                    clearErrors("images");
                  }
                }}
                className="mt-1 block w-full text-gray-800 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
              />
              {errors.images && (
                <p className="text-red-500 text-sm">
                </p>
              )}
            </div>
            <div className="mt-4">
              {imagePreviews.length > 0 && (
                <Swiper
                  spaceBetween={10}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                >
                  {imagePreviews.map((src, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={src}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-64 object-cover rounded-md"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col space-y-6">
            <h3 className="text-xl font-semibold mb-4">Review Your Information</h3>
            <p>
              <strong>Name:</strong> {watch("name")}
            </p>
            <p>
              <strong>Address:</strong> {watch("address")}
            </p>
            {/* Optional Email Field (Uncomment if needed)
            {watch("email") && (
              <p>
                <strong>Email:</strong> {watch("email")}
              </p>
            )}
            */}
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
            <div className="mt-4">
              {imagePreviews.length > 0 && (
                <Swiper
                  spaceBetween={10}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                >
                  {imagePreviews.map((src, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={src}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-64 object-cover rounded-md"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
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
      <h2 className="text-3xl font-semibold mb-8 text-gray-800">
        Add New Apartment
      </h2>
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <div className="relative w-full">
            <div className="bg-gray-200 h-2 rounded-full">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="absolute flex justify-between w-full text-xs font-medium">
              <span
                className={`transform transition-all duration-300 ${
                  currentStep >= 0
                    ? "text-blue-600"
                    : "text-gray-400"
                }`}
              >
                Step 1
              </span>
              <span
                className={`transform transition-all duration-300 ${
                  currentStep >= 1
                    ? "text-blue-600"
                    : "text-gray-400"
                }`}
              >
                Step 2
              </span>
              <span
                className={`transform transition-all duration-300 ${
                  currentStep >= 2
                    ? "text-blue-600"
                    : "text-gray-400"
                }`}
              >
                Step 3
              </span>
            </div>
          </div>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
        noValidate
      >
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
              onClick={() => {
                // Validate current step before proceeding
                handleSubmit(() => setCurrentStep(currentStep + 1))();
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={processing}
              className={`mt-4 w-full py-2 px-4 text-white bg-blue-500 rounded-md shadow-sm ${
                processing
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-600"
              } transition`}
            >
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
