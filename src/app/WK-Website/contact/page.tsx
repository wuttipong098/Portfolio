"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from '@/styles/contact.module.css';

const CTPage = () => {
  const router = useRouter();
  
  return (
    <div className={`${styles.container} relative h-screen w-full overflow-hidden flex items-center justify-center px-8`}>
      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
          Let's Connect
        </p>

        <h2 className="mt-4 text-4xl font-bold text-white md:text-7xl">
          Contact Me
        </h2>

        <p className="mx-auto mt-6 max-w-xl leading-8 text-white/80">
          Interested in working together or learning more about my
          projects? Feel free to get in touch.
        </p>

        <a
          href="mailto:"
          className="mt-8 inline-block rounded-full bg-white px-8 py-4 font-semibold text-[#8D00AD] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-2xl"
        >
          Get In Touch
        </a>

        <p className="mt-16 text-sm text-white/60">
          © {new Date().getFullYear()} Wuttipong Krachan
        </p>
      </div>
    </div>
  );
};

export default CTPage;