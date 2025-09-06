import "./globals.css";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RideGuard - Safety First',
  description: 'RideGuard is a safety app that tracks your rides and provides emergency assistance when needed. Stay safe on every journey.',
  keywords: 'ride safety, emergency, tracking, rideguard, safety app, ride sharing',
  authors: [{ name: 'RideGuard App' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#10B981',
  openGraph: {
    title: 'RideGuard - Safety First',
    description: 'RideGuard is a safety app that tracks your rides and provides emergency assistance when needed.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RideGuard - Safety First',
    description: 'RideGuard is a safety app that tracks your rides and provides emergency assistance when needed.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛡️</text></svg>" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
