import React from 'react';
import { Inter } from 'next/font/google';
import Navbar from './components/Navbar/page'; // Adjust the import path as needed
import Footer from './components/Footer/page'; // Adjust the import path as needed
import SessionWrapper from './components/sessionwrapper/page'; // Import the new SessionWrapper
import './globals.css';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Apartment Rental',
  description: 'Find your perfect apartment with ApartmentRental.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode; // Specify the type for children
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionWrapper>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}
