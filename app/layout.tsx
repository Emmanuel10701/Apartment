import React from 'react';
import { Inter } from "next/font/google";
import Navbar from './components/Navbar/page'; // Adjust the import path as needed
import Footer from './components/Footer/page'; // Adjust the import path as needed
import "./globals.css";
import type { Metadata } from 'next'; // Import Metadata type

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Apartment Rental",
  description: "Find your perfect apartment with ApartmentRental.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
