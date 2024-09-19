// app/layout.tsx
import { Inter } from 'next/font/google';
import Navbar from './components/Navbar/page'; // Adjust the path as needed
import Footer from './components/Footer/page'; // Adjust the path as needed
import './globals.css'; // Adjust the path as needed

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Portfolio',
  description: 'My portfolio website',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
