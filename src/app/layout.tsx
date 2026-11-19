
"use client";

import "../styles/globals.css";
import Header from "@/app/components/Header";
import Background3D from "@/app/components/Background3D";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const shouldShowHeader =
    pathname === "/WK-Website" ||
    pathname.startsWith("/WK-Website/");

  return (
    <html lang="en">
      <body>
        <Background3D />

        <div className="site-content-layer">
          {shouldShowHeader && <Header />}

          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
