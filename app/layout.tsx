import { Inter } from 'next/font/google';
import SessionProviderWrapper from '../app/sessionwraper/page'; // Import the new wrapper
import Footer from './components/Footer/page'; // Adjust the path as needed
import Navbar from './components/Navbar/page'; // Adjust the path as needed
import './globals.css'; // Adjust the path as needed

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Apartment Site',
  description: 'This is the apartment site that will help clients and users to create and look for a room.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProviderWrapper>
          <Navbar />
          <main>{children}</main>
         <Footer /> 
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
