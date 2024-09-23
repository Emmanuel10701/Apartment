'use client';
import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaGithub, FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa'; 
import Link from 'next/link';
import { CircularProgress } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSocialLogin = (provider: string) => {
    console.log(`Sign in with ${provider}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        setUsername('');
        setEmail('');
        setPassword('');
      } else {
        if (result.errors) {
          Object.keys(result.errors).forEach((key) => {
            toast.error(result.errors[key]);
          });
        } else {
          toast.error(result.message);
        }
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="w-full max-w-xl p-12 bg-white shadow-lg rounded-lg mb-8">
          <h2 className="text-4xl font-extrabold text-center mb-6 text-slate-600">🔏 Register</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg pl-12 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                placeholder="Email Address"
                required
              />
              <FaEnvelope className="absolute left-3 top-3 text-gray-500 text-xl" />
            </div>
            <div className="relative">
              <input
                type={passwordVisible ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg pl-12 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                placeholder="Password"
                required
              />
              <FaLock className="absolute left-3 top-3 text-gray-500 text-xl" />
              <div
                className="absolute right-3 top-3 text-gray-500 text-xl cursor-pointer"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            <button
              type="submit"
              className={`w-full py-4 text-white font-bold rounded-lg transition-colors bg-blue-500 relative ${loading ? 'bg-blue-500 border-2 border-indigo-800' : 'hover:bg-blue-600'}`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-white">Processing...</span>
                  <CircularProgress size={24} color="inherit" style={{ color: "white" }} />
                </div>
              ) : (
                "Sign Up"
              )}
            </button>

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

          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
