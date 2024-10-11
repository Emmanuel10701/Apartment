import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation'; // Import useRouter

interface ModalProps {
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter(); // Initialize useRouter

  const handleLogin = () => {
    setIsProcessing(true);
    // Simulate login process
    setTimeout(() => {
      console.log('User logged in'); // Add your login logic here
      setIsProcessing(false);
      onClose(); // Close modal after processing

      // Redirect to the desired route after login
      router.push('/login'); // Change '/desired-route' to the route you want to navigate to
    }, 2000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-xl mb-4 text-blue-600">Please Log In or Register</h2>
        <p className="text-gray-700 mb-4">To submit a property form, you need to be logged in.</p>
        <div className="flex justify-between mt-4">
          <button 
            onClick={onClose} 
            className="bg-transparent border border-gray-400 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 transition duration-200"
          >
            Close
          </button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleLogin} 
            className="rounded-full" 
            disabled={isProcessing}
          >
            {isProcessing ? (
              <CircularProgress size={24} className="mr-2" />
            ) : (
              'Login'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
