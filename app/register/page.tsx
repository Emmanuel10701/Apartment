"use client";
import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaGithub, FaMicrosoft, FaGoogle } from 'react-icons/fa';
import Link from 'next/link';
import CircularProgress from '@mui/material/CircularProgress';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSocialLogin = (provider: string) => {
    console.log(`Sign in with ${provider}`);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    // Simulate an API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Registration successful!');
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg relative">
        <h2 className="text-4xl font-bold text-center mb-6 text-gray-800">Register</h2>

        {/* Social Login Buttons */}
        <div className="space-y-4 mb-6">
          <button
            className="w-full py-3 text-gray-900 font-bold rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
            onClick={() => handleSocialLogin('GitHub')}
          >
            <FaGithub className="mr-2 text-2xl" />
          </button>
          <button
            className="w-full py-3 text-blue-600 font-bold rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors"
            onClick={() => handleSocialLogin('Microsoft')}
          >
            <FaMicrosoft className="mr-2 text-2xl" />
          </button>
          <button
            className="w-full py-3 text-red-600 font-bold rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors"
            onClick={() => handleSocialLogin('Google')}
          >
            <FaGoogle className="mr-2 text-2xl" />
          </button>
        </div>

        {/* Registration Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="text"
              id="username"
              className="w-full p-4 border border-gray-300 rounded-lg pl-12 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              placeholder="Username"
            />
            <FaUser className="absolute left-3 top-3 text-gray-500 text-xl" />
          </div>
          <div className="relative">
            <input
              type="email"
              id="email"
              className="w-full p-4 border border-gray-300 rounded-lg pl-12 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              placeholder="Email Address"
            />
            <FaEnvelope className="absolute left-3 top-3 text-gray-500 text-xl" />
          </div>
          <div className="relative">
            <input
              type="password"
              id="password"
              className="w-full p-4 border border-gray-300 rounded-lg pl-12 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              placeholder="Password"
            />
            <FaLock className="absolute left-3 top-3 text-gray-500 text-xl" />
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link href="/login">
            <span className="text-blue-500 hover:underline">Already have an account? Log in</span>
          </Link>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default RegisterPage;
