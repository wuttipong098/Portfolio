"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import WK from "@/public/WK.png";

const links = [
  { href: "#home", label: "Home" },
  { href: "#project", label: "My Project" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];

const Header = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 z-50 w-full px-4 sm:px-6 py-3 sm:py-4 bg-transparent">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo & Brand Name */}
        <a
          href="#home"
          onClick={() => setIsMobileMenuOpen(false)}
          className="flex items-center group"
        >
          <Image
            src={WK}
            alt="WK Logo"
            width={150}
            height={150}
            className="w-24 sm:w-32 md:w-[150px] h-auto object-contain transition-transform duration-300 group-hover:scale-105"
            priority
          />
          <span className="text-white text-sm sm:text-base md:text-lg font-medium tracking-wide -ml-6 sm:-ml-8 md:-ml-10 whitespace-nowrap">
            Wuttipong Krachan
          </span>
        </a>

        {/* Desktop Navigation (ซ่อนบนมือถือ แสดงตั้งแต่จอ md ขึ้นไป) */}
        <nav
          onMouseLeave={() => setHoveredLink(null)}
          className="hidden md:flex items-center gap-1 bg-white/15 backdrop-blur-xl rounded-full px-2 py-1.5 border border-white/25 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
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
                className={`px-4 lg:px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_6px_12px_rgba(0,0,0,0.25)]
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

        {/* Mobile Hamburger Button (แสดงเฉพาะบนมือถือ/แท็บเล็ตเล็ก) */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/15 backdrop-blur-xl border border-white/25 text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all duration-200 active:scale-95 hover:bg-white/25"
        >
          {isMobileMenuOpen ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <nav className="md:hidden mt-3 mx-auto max-w-sm rounded-3xl bg-white/15 backdrop-blur-2xl border border-white/25 p-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.25)] flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          {links.map((link) => {
            const sectionId = link.href.substring(1);
            const isActive = activeSection === sectionId;

            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => {
                  setActiveSection(sectionId);
                  setIsMobileMenuOpen(false);
                }}
                className={`px-4 py-2.5 rounded-2xl text-sm font-medium text-center transition-all duration-200
                  ${
                    isActive
                      ? "bg-white/90 text-[#8D38C9] shadow-sm"
                      : "text-white/90 hover:bg-white/15 hover:text-white"
                  }
                `}
              >
                {link.label}
              </a>
            );
          })}
        </nav>
      )}
    </header>
  );
};

export default Header;