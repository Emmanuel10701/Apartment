// Navbar.tsx

"use client";

import React, { useState } from 'react';
import { CiMenuBurger } from "react-icons/ci";
import { useRouter } from 'next/navigation'; // Import useRouter
import Sidebar from './../sidebar/page'; // Import the Sidebar component

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const router = useRouter(); // Get the router instance

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-slate-100 shadow-md mb-20">
      <nav className="flex w-full items-center fixed top-0 z-10 right-0 justify-between bg-zinc-50 py-2 shadow-dark-mild dark:bg-neutral-700 lg:py-4">
        <div className="flex w-full items-center justify-between px-3">
          {/* Hamburger Menu Button */}
          <button
            className="block border-0 bg-transparent px-3 text-black/50 hover:no-underline hover:shadow-none focus:no-underline focus:shadow-none focus:ring-0 dark:text-neutral-200"
            type="button"
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            <CiMenuBurger className="w-10 h-10 bg-slate-200 hover:bg-slate-300 p-1 font-extrabold stroke-black/100 focus:outline-2 dark:stroke-neutral-700" />
          </button>

          {/* Sidebar */}
          <Sidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />

          {/* Button Group */}
          <div className="hidden lg:flex lg:items-center lg:ml-auto lg:space-x-4">
            <span
              className="px-4 py-2 border border-transparent text-purple-700 font-semibold rounded-lg hover:border-black hover:bg-purple-50 transition cursor-pointer"
              onClick={() => router.push('/login')}
            >
              Sign In
            </span>
            <span
              className="px-4 py-2 border border-transparent text-purple-700 font-semibold rounded-lg hover:border-black hover:bg-purple-50 transition cursor-pointer"
              onClick={() => router.push('/register')}
            >
              Sign Up
            </span>
            <span
              className="relative px-4 py-2 border border-transparent text-purple-700 font-semibold rounded-lg hover:border-black hover:bg-purple-50 transition cursor-pointer"
              onClick={() => router.push('/fillingform')}
            >
              Add Property
            </span>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
