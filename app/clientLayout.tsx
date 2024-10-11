// app/components/ClientLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from './components/Navbar/page'; // Adjust the path as necessary
import Footer from './components/Footer/page'; // Adjust the path as necessary
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Define pages to exclude Navbar and Footer
  const excludedPaths = ['/login', '/register', '/forgot', '/dashboard', '/reset', "not-found"];

  const isExcluded = excludedPaths.includes(pathname);

  return (
    <div className="antialiased">
      {!isExcluded && <Navbar />}  {/* Only show Navbar if not excluded */}
      <main className="container mx-auto p-4">{children}</main>
      {!isExcluded && <Footer />}  {/* Only show Footer if not excluded */}
    </div>
  );
}
