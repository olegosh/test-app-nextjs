import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { BrandProvider } from '@product-portal/ui';
import { projectAConfig } from '../brand/config';
import './globals.css';

export const metadata: Metadata = {
  title: 'ProjectA',
  description: 'ProjectA — Product Portal',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <BrandProvider config={projectAConfig}>{children}</BrandProvider>
      </body>
    </html>
  );
}
