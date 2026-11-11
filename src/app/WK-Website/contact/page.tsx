"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import profile from "@/public/profile1.png";
import styles from "@/styles/contact.module.css";

const contactItems = [
  {
    label: "Email",
    value: "acenpwk@gmail.com",
    href: "#contact-form",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
      </svg>
    ),
  },
  {
    label: "Phone",
    value: "093-546-6494",
    href: "tel:0935466494",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    value: "facebook.com/wutipng",
    href: "https://www.facebook.com/wutipng/",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Line",
    value: "Add Friend",
    href: "https://line.me/ti/p/siqa-eyOhP",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.286.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.27.173-.51.43-.595.063-.022.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
      </svg>
    ),
  },
];

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/wutipng/",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/ace_wuttipong/",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24">
        <defs>
          <linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFDC80" />
            <stop offset="50%" stopColor="#F77737" />
            <stop offset="100%" stopColor="#C13584" />
          </linearGradient>
        </defs>
        <path fill="url(#ig)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: "LINE",
    href: "https://line.me/ti/p/siqa-eyOhP",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#06C755">
        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.286.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.27.173-.51.43-.595.063-.022.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    href: "https://github.com/wuttipong098",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
];

const CTPage = () => {
  const [isSocialOpen, setIsSocialOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const timer = setTimeout(() => {
            setIsSocialOpen(true);
          }, 400);

          return () => clearTimeout(timer);
        } else {
          setIsSocialOpen(false);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  return (
    <div className={`${styles.container} py-16`}>
      <div className="relative z-10 mx-auto w-full max-w-4xl px-8">

        {/* ===== Section 1: Contact Info ===== */}
        <section className="text-center">
          <h2 className={styles.title}>
            Contact Me
          </h2>

          <p className="mx-auto mt-6 max-w-xl leading-8 text-white/80">
            Interested in working together or learning more about my
            projects? Feel free to get in touch.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {contactItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/10"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors group-hover:bg-white group-hover:text-[#8D00AD]">
                  {item.icon}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white/60">{item.label}</p>
                  <p className="mt-0.5 font-semibold text-white">{item.value}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ===== Section 2: Contact Form ===== */}
        <section id="contact-form" className="mt-20 scroll-mt-24">
          <div className={styles.formCard}>
            <h3 className={styles.formTitle}>
              Send a Message
            </h3>

            <form className="space-y-5 text-left">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value="To: acenpwk@gmail.com"
                  readOnly
                  tabIndex={-1}
                  className="pointer-events-none w-full select-none rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white/70 outline-none"
                />
              </div>

              <div>
                <textarea
                  placeholder="Your Message..."
                  rows={5}
                  className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
                />
              </div>

              {/* เพิ่มคลาส cursor-pointer ตรงปุ่ม Send Message */}
              <button
                type="submit"
                className="w-full cursor-pointer rounded-full bg-white px-8 py-3.5 font-semibold text-[#8D00AD] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>
      </div>

      {/* ===== Profile + Social + Footer (รวมกันชิดซ้ายล่างสุด) ===== */}
      <div className={styles.profileWrapper} ref={containerRef}>
        <div className={styles.profileContainer}>

          {/* Social Bar */}
          <div
            className={`${styles.socialBar} ${
              isSocialOpen
                ? styles.socialBarOpen
                : styles.socialBarClosed
            }`}
          >
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className={styles.socialIcon}
                title={item.name}
                tabIndex={isSocialOpen ? 0 : -1}
              >
                {item.icon}
              </a>
            ))}

            {/* Toggle Button at the end of Social Bar */}
            <button
              type="button"
              className={styles.socialToggle}
              onClick={() => setIsSocialOpen((prev) => !prev)}
              aria-label={isSocialOpen ? "Hide social links" : "Show social links"}
              aria-expanded={isSocialOpen}
            >
              {isSocialOpen ? "‹" : "›"}
            </button>

          </div>

          {/* Profile Image */}
          <Image
            src={profile}
            alt="Wuttipong Krachan"
            width={180}
            height={220}
            className={styles.profileImage}
            priority
          />

        </div>

        {/* นำข้อความ Footer มาวางไว้ข้างๆ รูปในระดับเดียวกันแบบ absolute เพื่อไม่ให้ดันโครงสร้างหลัก */}
        <p className={styles.footer}>
          © {new Date().getFullYear()} Wuttipong Krachan
        </p>
      </div>
    </div>
  );
};

export default CTPage;