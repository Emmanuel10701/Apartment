"use client";
import React from 'react';
import { FaUser, FaLock, FaGithub, FaMicrosoft, FaGoogle } from 'react-icons/fa'; // User, Lock, GitHub, Microsoft, and Google icons
import Link from 'next/link'; // Import Next.js Link component

const LoginPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg mb-8">
        <h2 className="text-4xl font-bold text-center mb-6 text-gray-800">Login</h2>

        {/* Social Login Buttons */}
        <div className="space-y-4 mb-6">
          <button
            className="w-full py-4 bg-gray-900 text-white font-bold rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
            onClick={() => console.log('Sign in with GitHub')}
          >
            <FaGithub className="mr-3 text-3xl text-white" />
            Sign in with GitHub
          </button>
          <button
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
            onClick={() => console.log('Sign in with Microsoft')}
          >
            <FaMicrosoft className="mr-3 text-3xl text-white" />
            Sign in with Microsoft
          </button>
          <button
            className="w-full py-4 bg-red-500 text-white font-bold rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
            onClick={() => console.log('Sign in with Google')}
          >
            <FaGoogle className="mr-3 text-3xl text-white" />
            Sign in with Google
          </button>
        </div>

        {/* Login Form */}
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
            Sign In
          </button>
        </form>

        <div className="text-center mt-4">
          <Link href="/forgot-password">
            <span className="text-blue-500 hover:underline">Forgot Password?</span>
          </Link>
        </div>
      </div>

      {/* Footer with Icons */}
      <div className="flex justify-center space-x-6">
        <FaGithub className="text-gray-800 text-2xl cursor-pointer hover:text-gray-600" />
        <FaMicrosoft className="text-blue-600 text-2xl cursor-pointer hover:text-blue-400" />
        <FaGoogle className="text-red-600 text-2xl cursor-pointer hover:text-red-400" />
      </div>
    </div>
  );
};

export default LoginPage;
