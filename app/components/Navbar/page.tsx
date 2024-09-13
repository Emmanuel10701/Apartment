"use client";

import React, { useState, useEffect, useRef } from 'react';
import { CiMenuBurger } from "react-icons/ci"; 
import { FaHome, FaList, FaInfoCircle, FaPhone, FaTachometerAlt } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
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
  const menuRef = useRef<HTMLDivElement>(null);
  const path = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const savedProfileImage = localStorage.getItem('profileImage');
    if (savedProfileImage) setProfileImage(savedProfileImage);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="relative flex w-full items-center justify-between bg-zinc-50 py-2 shadow-dark-mild dark:bg-neutral-700 lg:flex-wrap lg:justify-start lg:py-4">
      <div className="flex w-full flex-wrap items-center justify-between px-3">
        <button
          className="block border-0 bg-transparent px-2 text-black/50 hover:no-underline hover:shadow-none focus:no-underline focus:shadow-none focus:outline-none focus:ring-0 dark:text-neutral-200 lg:hidden"
          type="button"
          onClick={toggleMenu}
          aria-controls="navbarSupportedContent1"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          <CiMenuBurger className="w-7 stroke-black/50 dark:stroke-neutral-200" />
        </button>

        <div
          className={`!visible ${isMenuOpen ? 'flex' : 'hidden'} flex-grow basis-[100%] items-center lg:!flex lg:basis-auto`}
          id="navbarSupportedContent1"
          ref={menuRef}
        >
          <div className="mb-4 me-5 ms-2 mt-3 flex items-center text-neutral-900 hover:text-neutral-900 focus:text-neutral-900 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400 lg:mb-0 lg:mt-0">
            <Image
              src="https://tecdn.b-cdn.net/img/logo/te-transparent-noshadows.webp"
              height={15}
              width={100}
              alt="Logo"
              loading="lazy"
            />
          </div>
          <ul className="list-style-none me-auto flex flex-col ps-0 lg:flex-row">
            {LINKS.map((link) => (
              <li key={link.href} className="mb-4 lg:mb-0 lg:pe-2">
                <Link href={link.href}>
                  <div
                    className={`text-black/60 transition duration-200 hover:text-black/80 hover:ease-in-out focus:text-black/80 active:text-black/80 motion-reduce:transition-none dark:text-white/60 dark:hover:text-white/80 dark:focus:text-white/80 dark:active:text-white/80 lg:px-2 ${link.href === path ? 'text-blue-500 font-bold' : ''}`}
                  >
                    {link.icon}
                    {link.name}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex items-center">
          <div className="me-4 text-neutral-600 dark:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5"
            >
              <path
                d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
              />
            </svg>
          </div>

          <div className="relative">
            <div
              className="me-4 flex items-center text-neutral-600 dark:text-white"
              id="dropdownMenuButton1"
              role="button"
              aria-expanded="false"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="absolute -mt-4 ms-2.5 rounded-full bg-danger px-[0.35em] py-[0.15em] text-[0.6rem] font-bold leading-none text-white">1</span>
            </div>
            <ul
              className="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg dark:bg-surface-dark"
              aria-labelledby="dropdownMenuButton1"
            >
              <li>
                <Link href="#">
                  <div
                    className="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-zinc-200/60 focus:bg-zinc-200/60 focus:outline-none active:bg-zinc-200/60 dark:bg-surface-dark dark:text-white dark:hover:bg-neutral-800/25"
                  >
                    Action
                  </div>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <div
                    className="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-zinc-200/60 focus:bg-zinc-200/60 focus:outline-none active:bg-zinc-200/60 dark:bg-surface-dark dark:text-white dark:hover:bg-neutral-800/25"
                  >
                    Another action
                  </div>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <div
                    className="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-zinc-200/60 focus:bg-zinc-200/60 focus:outline-none active:bg-zinc-200/60 dark:bg-surface-dark dark:text-white dark:hover:bg-neutral-800/25"
                  >
                    Something else here
                  </div>
                </Link>
              </li>
            </ul>
          </div>

          <div className="relative">
            <a
              className="flex items-center whitespace-nowrap transition duration-150 ease-in-out"
              id="dropdownMenuButton2"
              role="button"
              aria-expanded="false"
            >
              <Image
                src={profileImage || 'https://tecdn.b-cdn.net/img/new/avatars/2.jpg'}
                className="rounded-full"
                height={25}
                width={25}
                alt="User avatar"
                loading="lazy"
              />
            </a>
            <ul
              className="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg dark:bg-surface-dark"
              aria-labelledby="dropdownMenuButton2"
            >
              <li>
                <Link href="#">
                  <div
                    className="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-zinc-200/60 focus:bg-zinc-200/60 focus:outline-none active:bg-zinc-200/60 dark:bg-surface-dark dark:text-white dark:hover:bg-neutral-800/25"
                  >
                    Action
                  </div>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <div
                    className="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-zinc-200/60 focus:bg-zinc-200/60 focus:outline-none active:bg-zinc-200/60 dark:bg-surface-dark dark:text-white dark:hover:bg-neutral-800/25"
                  >
                    Another action
                  </div>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <div
                    className="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-zinc-200/60 focus:bg-zinc-200/60 focus:outline-none active:bg-zinc-200/60 dark:bg-surface-dark dark:text-white dark:hover:bg-neutral-800/25"
                  >
                    Something else here
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
