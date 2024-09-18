"use client";
import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaGithub, FaMicrosoft, FaGoogle } from 'react-icons/fa'; // Icons for User, Email, Lock, GitHub, Microsoft, and Google
import Link from 'next/link';
import { CircularProgress } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleSocialLogin = (provider: string) => {
    console.log(`Sign in with ${provider}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      toast.success('Registration successful!');
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="w-full max-w-xl p-12 bg-white shadow-lg rounded-lg mb-8">
          <h2 className="text-4xl font-extrabold text-center mb-6 text-slate-600 ">🔏 Register</h2>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                id="username"
                className="w-full p-4 border border-gray-300 rounded-lg pl-12 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                placeholder="Username"
                required
              />
              <FaUser className="absolute left-3 top-3 text-gray-500 text-xl" />
            </div>
            <div className="relative">
              <input
                type="email"
                id="email"
                className="w-full p-4 border border-gray-300 rounded-lg pl-12 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                placeholder="Email Address"
                required
              />
              <FaEnvelope className="absolute left-3 top-3 text-gray-500 text-xl" />
            </div>
            <div className="relative">
              <input
                type="password"
                id="password"
                className="w-full p-4 border border-gray-300 rounded-lg pl-12 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                placeholder="Password"
                required
              />
              <FaLock className="absolute left-3 top-3 text-gray-500 text-xl" />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors relative"
            >
              {loading ? (
                <>
                  <CircularProgress size={24} className="absolute left-1/2 top-1/2 text-white transform -translate-x-1/2 -translate-y-1/2" />
                  <span className="invisible text-white">Signing Up...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </button>

            {/* Social Login Icons with Labels */}
            <div className="mt-8 text-center">
              <p className="text-lg font-semibold mb-4">Or sign up with</p>
              <div className="flex justify-center space-x-8">
                <div className="flex flex-col items-center">
                  <FaGithub
                    onClick={() => handleSocialLogin('GitHub')}
                    className="text-gray-800 text-2xl cursor-pointer hover:text-gray-600"
                  />
                  <span className="text-gray-600 mt-2">GitHub</span>
                </div>
                <div className="flex flex-col items-center">
                  <FaMicrosoft
                    onClick={() => handleSocialLogin('Microsoft')}
                    className="text-blue-600 text-2xl cursor-pointer hover:text-blue-400"
                  />
                  <span className="text-blue-600 mt-2">Microsoft</span>
                </div>
                <div className="flex flex-col items-center">
                  <FaGoogle
                    onClick={() => handleSocialLogin('Google')}
                    className="text-red-600 text-2xl cursor-pointer hover:text-red-400"
                  />
                  <span className="text-red-600 mt-2">Google</span>
                </div>
              </div>
            </div>
            
        <div className="text-center mt-4">
        Already have an account?
          <Link href="/login">
            <span className="text-blue-500 hover:underline"> Log in</span>
          </Link>
        </div>
          </form>

          {/* Toast Notifications */}
          <ToastContainer />
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
