import './globals.css';
import type { Metadata } from 'next';
import { MemberProvider } from '@/context/MemberContext';
import Navigation from './components/Navigation';
import Toast from './components/Toast';

export const metadata: Metadata = {
  title: 'FitTrack - Gym Membership Management',
  description: 'Manage your gym memberships with FitTrack',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <MemberProvider>
          <div className="min-h-screen bg-gray-50 font-sans">
            <Navigation />
            <main className="lg:ml-64 transition-all duration-300">
              <div className="p-4 lg:p-8">
                {children}
              </div>
            </main>
            <Toast />
          </div>
        </MemberProvider>
      </body>
    </html>
  );
}