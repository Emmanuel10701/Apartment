"use client";

import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Apartment {
  title: string;
  email: string;
}

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  apartment: Apartment;
}

const EmailModal: React.FC<EmailModalProps> = ({ isOpen, onClose, apartment }) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [houseType, setHouseType] = useState<string>("");
  const [starRating, setStarRating] = useState<number>(0);
  const [occupation, setOccupation] = useState<string>("");
  const [userLocation, setUserLocation] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setName("");
      setEmail("");
      setHouseType("");
      setStarRating(0);
      setOccupation("");
      setUserLocation("");
      setMessage("");
    }
  }, [isOpen]);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Name, email, and message are required.");
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch("/api/cardEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          to: apartment.email,
          subject: `Inquiry about ${apartment.title}`,
          message,
          filters: {
            houseType: houseType || "N/A",
            starRating: starRating || "N/A",
            occupation: occupation || "N/A",
            userLocation: userLocation || "N/A",
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Email sent successfully!");
        // Reset form
        setName("");
        setEmail("");
        setHouseType("");
        setStarRating(0);
        setOccupation("");
        setUserLocation("");
        setMessage("");
        onClose();
      } else {
        throw new Error(data.error || "Failed to send email.");
      }
    } catch (error: any) {
      console.error("Error sending email:", error);
      toast.error(error.message || "An error occurred.");
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      ></div>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative overflow-y-auto max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            <FaTimes size={20} />
          </button>

          <h2 className="text-2xl font-semibold mb-4">Send Email</h2>

          <form onSubmit={handleSendEmail} className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>

            {/* House Type Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                House Type
              </label>
              <select
                value={houseType}
                onChange={(e) => setHouseType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              >
                <option value="">Select House Type</option>
                <option value="Studio">Studio</option>
                <option value="1 Bedroom">1 Bedroom</option>
                <option value="2 Bedrooms">2 Bedrooms</option>
                <option value="3 Bedrooms">3 Bedrooms</option>
                <option value="4+ Bedrooms">4+ Bedrooms</option>
              </select>
            </div>

            {/* Star Rating Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Star Rating
              </label>
              <select
                value={starRating}
                onChange={(e) => setStarRating(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              >
                <option value={0}>Select Star Rating</option>
                <option value={1}>1 Star</option>
                <option value={2}>2 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={5}>5 Stars</option>
              </select>
            </div>

            {/* Occupation Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Occupation
              </label>
              <select
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              >
                <option value="">Select Occupation</option>
                <option value="Student">Student</option>
                <option value="Worker">Worker</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* User Location Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Location
              </label>
              <input
                type="text"
                value={userLocation}
                onChange={(e) => setUserLocation(e.target.value)}
                placeholder="Enter your location"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>

            {/* Message Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="mr-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSending}
                className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                  isSending ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSending ? "Sending..." : "Send Email"}
              </button>
            </div>
          </form>
          <ToastContainer />
        </div>
      </div>
    </>
  );
};

export default EmailModal;
