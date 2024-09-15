// ImageCard.tsx
import React from 'react';
import Slider from 'react-slick';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

interface ImageCardProps {
  title: string;
  logo: string;
  location: string;
  images: string[];
  priceRange: string;
  studioType: string;
  description: string;
  contactNumber: string;
  email: string;
}

const ImageCard: React.FC<ImageCardProps> = ({
  title,
  logo,
  location,
  images,
  priceRange,
  studioType,
  description,
  contactNumber,
  email,
}) => {
  // Slick slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // Function to handle email button click
  const handleEmailClick = () => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header with title, logo, and location */}
      <div className="flex items-center p-4 bg-gray-100">
        <img src={logo} alt="Logo" className="w-12 h-12 mr-4" />
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{title}</h2>
          <div className="flex items-center text-gray-600 mt-1">
            <FaMapMarkerAlt className="mr-2" />
            <span>{location}</span>
          </div>
        </div>
      </div>

      {/* Carousel for images */}
      <div className="p-4">
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index}>
              <img src={image} alt={`Image ${index + 1}`} className="w-full h-64 object-cover" />
            </div>
          ))}
        </Slider>
      </div>

      {/* Details Section */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="font-bold text-lg">{priceRange}</span>
            <div className="text-gray-600">{studioType}</div>
          </div>
        </div>

        <p className="text-gray-700 mb-4">{description}</p>

        <div className="flex flex-row items-center justify-between mb-4">
          <div className="flex items-center">
            <FaPhoneAlt className="mr-2 text-gray-600" />
            <span>{contactNumber}</span>
          </div>
          <div className="flex items-center">
            <FaEnvelope className="mr-2 text-gray-600" />
            <span>{email}</span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleEmailClick}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
          >
            Email Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
