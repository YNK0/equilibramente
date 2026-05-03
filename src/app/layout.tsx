import type { Metadata, Viewport } from 'next';
import { AppRouterCacheProvider } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'EquilibraMente',
  description: 'Autorregulacion y bienestar para universitarios',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'EquilibraMente',
  },
};

export const viewport: Viewport = {
  themeColor: '#7c3aed',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="antialiased text-gray-900 bg-purple-50/30 min-h-screen">
        <AppRouterCacheProvider>
          {children}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
