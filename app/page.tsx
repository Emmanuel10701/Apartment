"use client"
import React from 'react';
import Testimony from "../app/components/testimony/page";
import { FaUser, FaSearch, FaFileAlt, FaBriefcase, FaHome, FaKey } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image'; // Import Next.js Image component
import stepsBg from'./../public/assets/bg1.png';
import heroImage from './../public/assets/bg1.png';
import icon from'./../public/assets/bg2.webp';
// Offers
import Offer1 from './../public/assets/bed11.jpeg';
import Offer2 from './../public/assets/ling.jpeg';
import Offer3 from './../public/assets/kitchen1.jpeg';


const MyPage: React.FC = () => {
  const stepsData = [
    {
      title: 'Find Your Ideal Home',
      description: 'Browse our extensive listings to discover your next rental or purchase.',
      colorClass: 'bg-orange-100 text-orange-500',
      icon: <FaHome className="w-12 h-12 text-orange-500" />,
    },
    {
      title: 'Schedule a Viewing',
      description: 'Contact landlords or agents to set up viewings at your convenience.',
      colorClass: 'bg-purple-100 text-purple-600',
      icon: <FaSearch className="w-12 h-12 text-purple-600" />,
    },
    {
      title: 'Submit an Application',
      description: 'Fill out the necessary paperwork to apply for your chosen property.',
      colorClass: 'bg-green-100 text-green-600',
      icon: <FaFileAlt className="w-12 h-12 text-green-600" />,
    },
    {
      title: 'Get the Keys!',
      description: 'Complete your agreement and get ready to move into your new home.',
      colorClass: 'bg-red-100 text-red-600',
      icon: <FaKey className="w-12 h-12 text-red-600" />,
    },
  ];

  const Offers = [
    {
      id: '1',
      title: 'Expert Advice',
      description: 'Get professional insights on the best neighborhoods and properties.',
      image: Offer1,
    },
    {
      id: '2',
      title: 'Exclusive Listings',
      description: 'Access listings before they hit the market.',
      image: Offer2,
    },
    {
      id: '3',
      title: 'Negotiation Support',
      description: 'Let us help you negotiate the best deal possible.',
      image: Offer3,
    },
  ];

  return (
    <div className="font-poppins">
      {/* Navigation */}
      <header className="relative text-center py-16 bg-purple-50">
        <div className="mx-4 md:mx-40 mt-20 flex flex-col-reverse md:flex-row items-center">
          <div className="md:w-1/2">
            <h2 className="inline-flex items-center justify-center gap-2 px-4 py-2 mb-4 text-orange-500 bg-orange-100 rounded-full">
              <Image src={icon} alt="icon" width={24} height={24} />
              Find Your Dream Home Today!
            </h2>

            <h1 className="mb-4 text-5xl font-bold text-gray-900">
              Discover Your Perfect <span className="text-purple-600">Rental</span> Match
            </h1>

            <p className="mb-8 max-w-xl mx-auto text-gray-500 leading-relaxed">
              Join thousands of renters finding their ideal homes. Our platform connects you with top listings across the country.
            </p>

            <div className="flex justify-center gap-4">
              <Link href="/post-listing">
                <button className="px-8 py-3 font-medium text-white bg-purple-600 rounded-full hover:bg-purple-700 transition duration-300">
                  Post a Listing
                </button>
              </Link>
              <Link href="/find-home">
                <button className="px-8 py-3 font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition duration-300">
                  Find a Home
                </button>
              </Link>
            </div>
          </div>

          <div className="md:w-1/2">
            <Image src={heroImage} alt="hero image" layout="responsive" width={700} height={400} />
          </div>
        </div>
      </header>

      <section
        className="bg-cover bg-center px-2 mx-4 md:px-12 py-16"
        style={{ backgroundImage: `url(${stepsBg})` }}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
            How to Secure Your <span className='text-green-700'>New Home</span>
          </h2>
          <p className='text-center w-1/2 text-md text-slate-500 my-10 mx-auto'>Follow these steps to ensure a smooth rental process.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stepsData.map((step, index) => (
              <div
                key={index}
                className={`p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-transform duration-500 transform hover:scale-103 relative`}
              >
                <span className={`mb-4 text-center rounded-full px-2 flex items-center justify-center py-2 w-10 h-10 text-xl ${step.colorClass}`}>
                  {step.icon}
                </span>
                <h4 className="mb-2 text-lg font-bold text-slate-800">{step.title}</h4>
                <p className="text-gray-500 text-md">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section className="py-16 mb-30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
            Our Offers for Your Next <span className='text-slate-700'>Home</span>
          </h2>
          <p className="text-center w-1/2 text-md text-slate-500 font-semibold my-10 mx-auto">
            We provide various services to ensure you find the perfect home for you.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            {Offers.map((offer, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-transform duration-500 transform hover:scale-103 w-full sm:w-1/2 lg:w-1/4"
              >
                <Image
                  src={offer.image}
                  alt="Offer image"
                  className="bg-slate-200 w-3/4 h-auto mb-4 rounded-md"
                  width={300}
                  height={200}
                />
                <div className="text-center">
                  <h1 className="text-3xl text-green-700 mb-2">{index + 1}.</h1>
                  <h4 className="mb-2 text-xl font-bold text-slate-800">{offer.title}</h4>
                  <p className="text-gray-500 text-md font-semibold">{offer.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className='mt-10 flex items-center justify-center'>
        <Testimony />
      </div>
    </div>
  );
};

export default MyPage;
