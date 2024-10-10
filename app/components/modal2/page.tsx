// components/Modal.tsx
import React from 'react';

interface ModalProps {
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2 className="text-xl mb-4">Please Log In or Register</h2>
        <p>To submit a property form, you need to be logged in.</p>
        <div className="flex justify-between mt-4">
          <button onClick={onClose} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
