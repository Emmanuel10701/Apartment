"use client";
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Link from 'next/link'; // Import Link from Next.js

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/forgot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        setEmail('');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to send reset link');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-slate-100">
      <form onSubmit={handleSubmit} className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl mt-10 text-slate-700 font-extrabold mb-6 text-center">🔓Forgot Password</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:border-green-500 focus:outline-none transition-colors"
          required
        />
        <div className="flex justify-center mb-4"></div>

        <Button
          type="submit"
          variant="contained"
          className={`w-full text-white ${loading ? 'bg-green-500' : 'bg-indigo-600'} transition-all duration-300`}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <CircularProgress size={24} color="inherit" />
              <span className="ml-2">Processing...</span>
            </div>
          ) : (
            'Send Link'
          )}
        </Button>

        {/* Link to go back to the login page */}
        <div className="text-center mt-4">
          <p className="text-sm">
            Remembered your password? 
            <Link href="/login" className="text-blue-500 hover:underline ml-1">Log in</Link>
          </p>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ForgotPasswordPage;
