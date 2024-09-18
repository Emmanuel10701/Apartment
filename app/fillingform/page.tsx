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
  images: string[];
};

interface ApartmentFormProps {
  apartment?: ApartmentFormData;
  onSuccess?: () => void;
}

const ApartmentForm: React.FC<ApartmentFormProps> = ({ apartment, onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ApartmentFormData>({
    defaultValues: {
      ...apartment,
      images: apartment?.images || ["", "", ""],
    },
  });

  const [processing, setProcessing] = useState(false);

  const onSubmit: SubmitHandler<ApartmentFormData> = async (data) => {
    setProcessing(true);
    try {
      if (apartment && apartment.id) {
        await axios.put(`/api/apartments/${apartment.id}`, data);
        toast.success("Apartment details updated successfully!");
      } else {
        await axios.post("/api/apartments", data);
        toast.success("Apartment added successfully!");
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Failed to process the request.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-8 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-semibold mb-6">{apartment?.id ? "Update Apartment" : "Add New Apartment"}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="space-y-4">
          {[
            { label: "Name", name: "name", type: "text", required: true },
            { label: "Address", name: "address", type: "text", required: true },
            { label: "Min Price", name: "minPrice", type: "number", required: true },
            { label: "Max Price", name: "maxPrice", type: "number", required: true },
            {
              label: "Rental Type",
              name: "rentalType",
              type: "select",
              options: ["Monthly", "Yearly"],
              required: true,
            },
            { label: "Description", name: "description", type: "text", required: true },
          ].map(({ label, name, type, options, required }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700">{label}</label>
              {type === "select" ? (
                <select
                  {...register(name, { required: required && `${label} is required` })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {options?.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={type}
                  {...register(name, { required: required && `${label} is required` })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              )}
              {errors[name] && <p className="text-red-500 text-sm">{errors[name]?.message}</p>}
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700">Image URLs (Up to 3)</label>
            {[0, 1, 2].map(index => (
              <input
                key={index}
                type="text"
                {...register(`images.${index}`, { required: "Image URL is required" })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder={`Image URL ${index + 1}`}
              />
            ))}
            {errors.images && <p className="text-red-500 text-sm">All image URLs are required.</p>}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={processing}
          className={`mt-4 inline-flex items-center justify-center w-1/2 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            processing ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {processing ? "Processing..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ApartmentForm;
