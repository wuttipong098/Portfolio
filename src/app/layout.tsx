"use client";

import '../styles/globals.css';
import Header from '@/app/components/Header';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const shouldShowHeader =
    pathname === '/WK-Website' ||
    pathname.startsWith('/WK-Website/');

  return (
    <html lang="en">
      <body>
        {shouldShowHeader && <Header />}
        <main>{children}</main>
      </body>
    </html>
  );
}