"use client"
import React from 'react';
const Footer: React.FC = () => {
  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-gray-800 text-white p-4  w-full">
      <div className="container mx-auto text-center mb-4">
        <p className="text-lg font-semibold mb-4">Contact Us</p>
        <p className="mb-4">123 Apartment St, Suite 101<br />City, State, 12345</p>
        <p className="mb-4">
          Email: <span onClick={() => handleLinkClick('mailto:info@apartmentrental.com')} className="text-blue-400 hover:underline cursor-pointer">info@apartmentrental.com</span>
        </p>
        <p className="mb-4">
          Phone: <span onClick={() => handleLinkClick('tel:+1234567890')} className="text-blue-400 hover:underline cursor-pointer">+1 (234) 567-890</span>
        </p>
      </div>
      <div className="container mx-auto text-center mb-4">
        <p className="text-lg font-semibold mb-4">Follow Us</p>
        <div className="flex justify-center space-x-6 mb-4">
          <span 
            onClick={() => handleLinkClick('https://facebook.com')} 
            className="text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.004C6.479 2.004 2 6.483 2 12c0 5.518 4.479 10.007 10 10.007 5.519 0 10-4.49 10-10.007 0-5.517-4.481-10.007-10-10.007zm-1 16v-6h-2v-2h2v-1.5c0-2.56 1.49-3.5 3-3.5.846 0 1.577.062 1.783.09v2.09h-1.223c-1.073 0-1.287.511-1.287 1.233V10h2.573l-.334 2h-2.239v6h-2z"/>
            </svg>
          </span>
          <span 
            onClick={() => handleLinkClick('https://twitter.com')} 
            className="text-blue-400 hover:text-blue-600 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.633 7.997c.014.186.014.373.014.56 0 5.712-4.337 12.27-12.27 12.27-2.435 0-4.693-.714-6.58-1.934.336.039.671.057 1.009.057 1.986 0 3.815-.675 5.273-1.81-1.855-.033-3.417-1.257-3.964-2.926.261.05.527.08.8.08.391 0 .769-.053 1.132-.146-1.939-.391-3.413-2.094-3.413-4.141v-.052c.573.319 1.228.511 1.93.534-1.146-.764-1.902-2.068-1.902-3.548 0-.781.208-1.515.572-2.147 2.09 2.565 5.214 4.246 8.722 4.431-.073-.311-.112-.637-.112-.971 0-2.356 1.937-4.276 4.316-4.276 1.244 0 2.369.527 3.151 1.372.983-.194 1.918-.556 2.747-1.053-.322.995-1.003 1.835-1.892 2.375.875-.105 1.717-.337 2.493-.676-.583.872-1.318 1.636-2.158 2.245z"/>
            </svg>
          </span>
          <span 
            onClick={() => handleLinkClick('https://instagram.com')} 
            className="text-pink-500 hover:text-pink-700 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.004c-5.52 0-10 4.49-10 10.007s4.48 10.007 10 10.007 10-4.49 10-10.007-4.48-10.007-10-10.007zm-1 16v-6h-2v-2h2v-1.5c0-2.56 1.49-3.5 3-3.5.846 0 1.577.062 1.783.09v2.09h-1.223c-1.073 0-1.287.511-1.287 1.233V10h2.573l-.334 2h-2.239v6h-2z"/>
            </svg>
          </span>
        </div>
      </div>
      <div className="container mx-auto text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} ApartmentRental. All rights reserved.</p>
        <p className="text-sm">Designed and developed by Emmanuel</p>
      </div>
    </footer>
  );
};

export default Footer;
