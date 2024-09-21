// components/Contact.tsx

"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { IoLocation } from 'react-icons/io5';
import { MdMarkEmailRead } from 'react-icons/md';
import { FaPhone } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define the structure for form data
interface FormData {
  name: string;
  email: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        setFormData({ name: '', email: '', message: '' }); // Clear form fields
      } else {
        toast.error(result.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      toast.error('Oops! Something went wrong. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-10 bg-gray-50 min-h-screen">
      <motion.h1
        className="text-center text-3xl mx-auto my-10 font-extrabold bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 text-transparent bg-clip-text"
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } }}
        initial="hidden"
        animate="visible"
      >
        Let's Connect
      </motion.h1>

      <div className="flex flex-col md:flex-row px-8 gap-8">
        <motion.div
          className="flex flex-col flex-1 md:pl-20"
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-4xl font-extrabold mb-9 text-center md:text-start mt-5 bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 text-transparent bg-clip-text">
            Reach Out to Us
          </h1>
          <p className="text-sm text-slate-500 mb-5">
            We're excited to assist you with any inquiries regarding our apartments. Whether you're interested in availability, pricing, or have any other questions, feel free to get in touch. Your comfort and satisfaction are our top priorities.
          </p>
          <div className="flex items-start mt-6">
            <MdMarkEmailRead className="text-green-500 text-xl" />
            <h2 className="text-sm font-bold ml-2">info@apartmentsite.com</h2>
          </div>
          <div className="flex items-start mt-6">
            <FaPhone className="text-green-500 text-xl" />
            <h2 className="text-sm font-bold ml-2">+1 (234) 567-8901</h2>
          </div>
          <div className="flex items-start mt-6">
            <IoLocation className="text-green-500 text-xl" />
            <h2 className="text-sm font-bold ml-2">New York, USA</h2>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col flex-1 mt-10 md:mt-0"
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
          initial="hidden"
          animate="visible"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col mt-3 w-full max-w-md mx-auto">
              <label htmlFor="name" className="mb-1 text-sm font-semibold">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="bg-slate-100 p-3 text-sm rounded-md"
                placeholder="Your Name"
                required
              />
            </div>
            <div className="flex flex-col mt-3 w-full max-w-md mx-auto">
              <label htmlFor="email" className="mb-1 text-sm font-semibold">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-slate-100 p-3 text-sm rounded-md"
                placeholder="Your Email"
                required
              />
            </div>
            <div className="flex flex-col mt-3 w-full max-w-md mx-auto">
              <label htmlFor="message" className="mb-1 text-sm font-semibold">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="bg-slate-100 resize-none text-sm rounded-md p-3"
                placeholder="Enter your message here"
                rows={4}
                required
              />
            </div>
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Contact;
