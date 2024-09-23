// app/reset-password/page.tsx

'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPasswordPage: React.FC = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const token = new URLSearchParams(window.location.search).get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        router.push('/login'); // Redirect to login after reset
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to reset password');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
          required
        />
        <button
          type="submit"
          className={`w-full py-2 bg-blue-500 text-white rounded-md ${loading ? 'opacity-50' : ''}`}
          disabled={loading}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ResetPasswordPage;
