"use client";

import React, { useState, useEffect, useRef } from 'react';
import { CiMenuBurger } from "react-icons/ci";
import { FaTimes, FaHome, FaList, FaInfoCircle, FaPhone, FaTachometerAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { usePathname, useRouter } from 'next/navigation';

export interface LinkItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const LINKS: LinkItem[] = [
  { name: 'Home', href: '/', icon: <FaHome className="text-blue-500" /> },
  { name: 'Listings', href: '/listings', icon: <FaList className="text-green-500" /> },
  { name: 'About Us', href: '/about', icon: <FaInfoCircle className="text-yellow-500" /> },
  { name: 'Contact', href: '/contact', icon: <FaPhone className="text-red-500" /> },
  { name: 'Dashboard', href: '/dashboard', icon: <FaTachometerAlt className="text-purple-500" /> },
];

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isDashboardDropdownOpen, setIsDashboardDropdownOpen] = useState<boolean>(false);
  const [isListingsDropdownOpen, setIsListingsDropdownOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dashboardDropdownRef = useRef<HTMLDivElement>(null);
  const listingsDropdownRef = useRef<HTMLDivElement>(null);
  const path = usePathname();
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleDashboardDropdown = () => {
    setIsDashboardDropdownOpen(!isDashboardDropdownOpen);
  };

  const toggleListingsDropdown = () => {
    setIsListingsDropdownOpen(!isListingsDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (dashboardDropdownRef.current && !dashboardDropdownRef.current.contains(event.target as Node)) {
        setIsDashboardDropdownOpen(false);
      }
      if (listingsDropdownRef.current && !listingsDropdownRef.current.contains(event.target as Node)) {
        setIsListingsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-slate-100 shadow-md min-h-screen">
      <nav className="flex w-full items-center fixed top-0 right-0 justify-between bg-zinc-50 py-2 shadow-dark-mild dark:bg-neutral-700 lg:py-4">
        <div className="flex w-full items-center justify-between px-3">
          {/* Hamburger Menu Button */}
          <button
            className="block border-0 bg-transparent px-3 text-black/50 hover:no-underline hover:shadow-none focus:no-underline focus:shadow-none focus:ring-0 dark:text-neutral-200"
            type="button"
            onClick={toggleMenu}
            aria-controls="sidebarMenu"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
          >
            <CiMenuBurger className="w-10 h-10 bg-slate-200 hover:bg-slate-300 p-1 font-extrabold stroke-black/100 focus:outline-2 dark:stroke-neutral-700" />
          </button>

          {/* Sidebar Menu */}
          <div
            className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
            ref={menuRef}
            id="sidebarMenu"
          >
            <button
              className="absolute top-4 right-4 text-black"
              onClick={toggleMenu}
              aria-label="Close menu"
            >
              <FaTimes className="w-6 h-6" />
            </button>
            <div className="flex flex-col items-start p-4 mt-10">
              <ul className="flex flex-col space-y-6"> {/* Adjusted spacing */}
                {LINKS.map((link) => {
                  if (link.name === 'Dashboard') {
                    return (
                      <li key={link.href} className="flex flex-col">
                        <button
                          className={`flex items-center w-full text-black transition duration-300 hover:text-gray-700 cursor-pointer ${link.href === path ? 'text-blue-500 font-bold' : ''}`}
                          onClick={toggleDashboardDropdown}
                        >
                          <span className="flex-1 flex items-center">
                            {link.icon}
                            <span className="ml-2">{link.name}</span>
                          </span>
                          {isDashboardDropdownOpen ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
                        </button>
                        <div
                          className={`pl-8 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg ${isDashboardDropdownOpen ? 'block' : 'hidden'}`}
                          ref={dashboardDropdownRef}
                        >
                          <ul className="list-style-none space-y-2"> {/* Adjusted spacing */}
                            <li>
                              <span
                                className="block px-4 py-2 text-purple-500 hover:bg-gray-100 cursor-pointer"
                                onClick={() => router.push('/dashboard/overview')}
                              >
                                Overview
                              </span>
                            </li>
                            <li>
                              <span
                                className="block px-4 py-2 text-purple-500 hover:bg-gray-100 cursor-pointer"
                                onClick={() => router.push('/dashboard/settings')}
                              >
                                Settings
                              </span>
                            </li>
                          </ul>
                        </div>
                      </li>
                    );
                  }

                  if (link.name === 'Listings') {
                    return (
                      <li key={link.href} className="flex flex-col">
                        <button
                          className={`flex items-center w-full text-black transition duration-300 hover:text-gray-700 cursor-pointer ${link.href === path ? 'text-blue-500 font-bold' : ''}`}
                          onClick={toggleListingsDropdown}
                        >
                          <span className="flex-1 flex items-center">
                            {link.icon}
                            <span className="ml-2">{link.name}</span>
                          </span>
                          {isListingsDropdownOpen ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
                        </button>
                        <div
                          className={`pl-8 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg ${isListingsDropdownOpen ? 'block' : 'hidden'}`}
                          ref={listingsDropdownRef}
                        >
                          <ul className="list-style-none space-y-2"> {/* Adjusted spacing */}
                            <li>
                              <span
                                className="block px-4 py-2 text-purple-500 hover:bg-gray-100 cursor-pointer"
                                onClick={() => router.push('/listings/sell')}
                              >
                                Sell Listings
                              </span>
                            </li>
                            <li>
                              <span
                                className="block px-4 py-2 text-purple-500 hover:bg-gray-100 cursor-pointer"
                                onClick={() => router.push('/listings/rent')}
                              >
                                Rent Listings
                              </span>
                            </li>
                          </ul>
                        </div>
                      </li>
                    );
                  }

                  return (
                    <li key={link.href} className="flex items-center">
                      <span
                        className={`text-black transition duration-300 hover:text-gray-700 cursor-pointer flex items-center ${link.href === path ? 'text-blue-500 font-bold' : ''}`}
                        onClick={() => router.push(link.href)}
                      >
                        <span className="flex-1 flex items-center">
                          {link.icon}
                          <span className="ml-2">{link.name}</span>
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Button Group */}
          <div className="hidden lg:flex lg:items-center lg:ml-auto lg:space-x-4">
            <span
              className="px-6 py-3 border border-transparent text-purple-500 font-semibold rounded-lg hover:border-purple-500 hover:bg-purple-50 transition cursor-pointer"
              onClick={() => router.push('/login')}
            >
              Sign In
            </span>
            <span
              className="px-6 py-3 border border-transparent text-purple-500 font-semibold rounded-lg hover:border-purple-500 hover:bg-purple-50 transition cursor-pointer"
              onClick={() => router.push('/register')}
            >
              Sign Up
            </span>
            <span
              className="relative px-6 py-3 border border-transparent text-purple-500 font-semibold rounded-lg hover:border-purple-500 hover:bg-purple-50 transition cursor-pointer"
              onClick={() => router.push('/add-property')}
            >
              Add Property
            </span>
          </div>

          {/* Dropdown for Small Screens */}
          <div className="lg:hidden">
            <button
              className="px-6 py-3 text-purple-500 font-semibold outline-1 border-purple-500 rounded-full hover:bg-purple-50 transition"
              onClick={toggleDropdown}
              aria-controls="dropdownMenu"
              aria-expanded={isDropdownOpen}
            >
              Actions
            </button>
            <div
              className={`absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg ${isDropdownOpen ? 'block' : 'hidden'}`}
              ref={dropdownRef}
              id="dropdownMenu"
            >
              <ul className="list-style-none space-y-2"> {/* Adjusted spacing */}
                <li>
                  <span
                    className="block px-4 py-2 text-purple-500 hover:bg-gray-100 cursor-pointer"
                    onClick={() => router.push('/login')}
                  >
                    Sign In
                  </span>
                </li>
                <li>
                  <span
                    className="block px-4 py-2 text-purple-500 hover:bg-gray-100 cursor-pointer"
                    onClick={() => router.push('/register')}
                  >
                    Sign Up
                  </span>
                </li>
                <li>
                  <span
                    className="block px-4 py-2 text-purple-500 hover:bg-gray-100 cursor-pointer"
                    onClick={() => router.push('/add-property')}
                  >
                    Add Property
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
