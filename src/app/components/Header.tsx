"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import WK from "@/public/WK.png";

const Header = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const links = [
    { href: "#home", label: "Home" },
    { href: "#project", label: "My Project" },
    { href: "#portfolio", label: "Portfolio" },
    { href: "#education", label: "Education" },
    { href: "#contact", label: "Contact" },
  ];

  // ใช้ IntersectionObserver ตรวจจับว่าตอนนี้อยู่ Section ไหน
  useEffect(() => {
    const handleScroll = () => {
      const sections = links.map((link) => link.href.substring(1));
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        className="flex items-center gap-1 bg-white/15 backdrop-blur-xl rounded-full px-2 py-1.5 border border-white/25 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
      >
        {links.map((link) => {
          const sectionId = link.href.substring(1);
          const isActive = activeSection === sectionId;
          const isHovered = hoveredLink === link.href;
          const isSelected = hoveredLink ? isHovered : isActive;

          return (
            <a
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
            </a>
          );
        })}
      </nav>
    </header>
  );
};

export default Header;