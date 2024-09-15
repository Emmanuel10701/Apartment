"use client";
import React from 'react';
import { FaUser, FaEnvelope, FaLock, FaGithub, FaMicrosoft, FaGoogle } from 'react-icons/fa'; // Icons for User, Email, Lock, GitHub, Microsoft, and Google
import Link from 'next/link';

const RegisterPage: React.FC = () => {
  const handleSocialLogin = (provider: string) => {
    console.log(`Sign in with ${provider}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-4xl font-bold text-center mb-6 text-gray-800">Register</h2>

        {/* Social Login Buttons */}
        <div className="space-y-4 mb-6">
          <button
            className="w-full py-3 bg-gray-900 text-white font-bold rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
            onClick={() => handleSocialLogin('GitHub')}
          >
            <FaGithub className="mr-2 text-2xl text-white" />
            Sign in with GitHub
          </button>
          <button
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
            onClick={() => handleSocialLogin('Microsoft')}
          >
            <FaMicrosoft className="mr-2 text-2xl text-white" />
            Sign in with Microsoft
          </button>
          <button
            className="w-full py-3 bg-red-600 text-white font-bold rounded-lg flex items-center justify-center hover:bg-red-700 transition-colors"
            onClick={() => handleSocialLogin('Google')}
          >
            <FaGoogle className="mr-2 text-2xl text-white" />
            Sign in with Google
          </button>
        </div>

        {/* Registration Form */}
        <form className="space-y-4">
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
            className="w-full py-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center mt-4">
          <Link href="/login">
            <a className="text-blue-500 hover:underline">Already have an account? Log in</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
