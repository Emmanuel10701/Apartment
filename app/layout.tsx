// app/layout.tsx
import { Inter } from 'next/font/google';
import SessionProviderWrapper from '../app/sessionwraper/page'; // Import the session wrapper
import ClientLayout from './clientLayout'; // Import the ClientLayout
import './globals.css'; // Import global styles

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
          <ClientLayout>{children}</ClientLayout> {/* Use ClientLayout here */}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
