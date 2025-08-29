import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Layout/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'BlogApp - Share Your Stories',
    template: '%s | BlogApp'
  },
  description: 'A modern full-stack blog application where writers can share their stories, thoughts, and insights with a community of readers.',
  keywords: ['blog', 'writing', 'stories', 'community', 'articles', 'publishing'],
  authors: [{ name: 'BlogApp Team' }],
  creator: 'BlogApp',
  publisher: 'BlogApp',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    title: 'BlogApp - Share Your Stories',
    description: 'A modern full-stack blog application where writers can share their stories, thoughts, and insights.',
    siteName: 'BlogApp',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlogApp - Share Your Stories',
    description: 'A modern full-stack blog application where writers can share their stories, thoughts, and insights.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <footer className="bg-white border-t mt-auto">
              <div className="container mx-auto px-4 py-6">
                <div className="text-center text-gray-600 text-sm">
                  <p>&copy; 2025 BlogApp. Built with Next.js and Express.</p>
                </div>
              </div>
            </footer>
          </div>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}