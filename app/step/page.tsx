"use client";

import { useState } from "react";
import { FaCircle, FaArrowDown } from "react-icons/fa";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { LinearProgress } from "@mui/material";

// Zod validation schema
const schema = {
  name: z.string().nonempty("Name is required"),
  email: z.string().email("Invalid email address"),
};

const PersonalInfo = ({ name, onNext }: { name: string; onNext: (name: string) => void }) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name },
  });

  const onSubmit = (data: { name: string }) => {
    onNext(data.name);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      <label className="block mb-2">
        Name:
        <Controller
          name="name"
          control={control}
          rules={{ required: "Name is required" }}
          render={({ field }) => (
            <input
              type="text"
              {...field}
              className="border rounded-lg px-3 py-2 w-full md:w-2/3" // Reduced width
            />
          )}
        />
      </label>
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
        Next
      </button>
    </form>
  );
};

const AddProperty = ({ email, onNext, onBack }: { email: string; onNext: (email: string) => void; onBack: () => void }) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email },
  });

  const onSubmit = (data: { email: string }) => {
    onNext(data.email);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      <label className="block mb-2">
        Email:
        <Controller
          name="email"
          control={control}
          rules={{ required: "Email is required", validate: value => schema.email.safeParse(value).success || "Invalid email address" }}
          render={({ field }) => (
            <input
              type="email"
              {...field}
              className="border rounded-lg px-3 py-2 w-full md:w-2/3" // Reduced width
            />
          )}
        />
      </label>
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Next
        </button>
        <button type="button" onClick={onBack} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition">
          Back
        </button>
      </div>
    </form>
  );
};

const YourAnswers = ({ data, onBack, onSubmit }: { data: { name: string; email: string }; onBack: () => void; onSubmit: () => void }) => (
  <div className="p-4">
    <h2 className="text-xl font-semibold mb-4">Your Answers</h2>
    <p className="mb-2"><strong>Name:</strong> {data.name}</p>
    <p className="mb-4"><strong>Email:</strong> {data.email}</p>
    <div className="flex gap-2">
      <button onClick={onSubmit} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
        Submit
      </button>
      <button onClick={onBack} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition">
        Back
      </button>
    </div>
  </div>
);

const StepsLayout = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleNext = (data: string) => {
    setFormData(prev => ({
      ...prev,
      [currentStep === 0 ? 'name' : 'email']: data,
    }));
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      console.log("Submitting data...", formData);
      setSubmitted(true);
      setLoading(false);
    }, 1000); // Simulating a network request
  };

  const renderCurrentStep = () => {
    if (currentStep === 0) {
      return <PersonalInfo name={formData.name} onNext={handleNext} />;
    } else if (currentStep === 1) {
      return <AddProperty email={formData.email} onNext={handleNext} onBack={handleBack} />;
    } else {
      return <YourAnswers data={formData} onBack={handleBack} onSubmit={handleSubmit} />;
    }
  };

  return (
    <article className="flex flex-col sm:flex-row justify-start gap-4 min-w-[32%] min-h-screen">
      <nav className="flex flex-col px-4 sm:px-8 py-4 border-b sm:border-r-2 border-[#8586887c] border-dashed bg-gray-900 sticky top-0 z-10 w-full sm:w-[60%] h-full"> {/* Increased width */}
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex items-center gap-2 mb-4">
            <FaCircle
              className={`text-4xl rounded-full ${currentStep > index ? "bg-green-600 text-white" : "bg-transparent border border-gray-500"} transition-colors flex items-center justify-center`}
              role="button"
              onClick={() => currentStep > index && setCurrentStep(index)}
            >
              {currentStep > index ? index + 1 : ""}
            </FaCircle>
            <h2 className={`text-md ${currentStep === index ? "text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500" : "text-zinc-100"}`}>
              {index === 0 ? "Personal Info" : index === 1 ? "Add Property" : "Your Answers"}
            </h2>
            {index < 2 && (
              <FaArrowDown
                className={`text-xl ${currentStep > index ? "text-blue-500" : "text-gray-300"}`}
                role="img"
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </nav>
      <div className="flex flex-col p-4 w-full md:w-1/3"> {/* Reduced width */}
        {loading && <LinearProgress />}
        {submitted && <p className="text-green-600">Form submitted successfully!</p>}
        {renderCurrentStep()}
      </div>
    </article>
  );
};

export default StepsLayout;
