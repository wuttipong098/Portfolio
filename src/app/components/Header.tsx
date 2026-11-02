"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import WK from "@/public/WK.png";

const Header = () => {
  const pathname = usePathname();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const links = [
    { href: "/WK-Website/main", label: "Home" },
    { href: "/WK-Website/project", label: "My Project" },
    { href: "/WK-Website/portfolio", label: "Portfolio" },
    { href: "/WK-Website/education", label: "Education" },
    { href: "/WK-Website/contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 left-0 z-50 w-full px-6 py-4 flex items-center justify-between bg-transparent">
      <div className="flex items-center">
        <Image
          src={WK}
          alt="WK Logo"
          width={150}
          height={150}
          className="object-contain"
          priority
        />
        <span className="text-white text-lg font-medium tracking-wide -ml-10">
          Wuttipong Krachan
        </span>
      </div>

      <nav
        onMouseLeave={() => setHoveredLink(null)}
        className="flex items-center gap-1 bg-white/10 backdrop-blur-xl rounded-full px-2 py-1.5 border border-white/25 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
      >
        {links.map((link) => {
          const isActive =
            pathname === link.href || pathname.startsWith(link.href);

          const isHovered = hoveredLink === link.href;
          const isSelected = hoveredLink
            ? isHovered
            : isActive;

          return (
            <Link
              key={link.href}
              href={link.href}
              onMouseEnter={() => setHoveredLink(link.href)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_6px_12px_rgba(0,0,0,0.25)] hover:scale-105
                ${
                  isSelected
                    ? "bg-white/90 text-[#8D38C9] shadow-sm backdrop-blur-md"
                    : "text-white/90 hover:bg-white/15 hover:text-white"
                }
              `}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
};

export default Header;
