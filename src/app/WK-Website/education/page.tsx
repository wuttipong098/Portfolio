"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from '@/styles/education.module.css';

const EdPage = () => {
  const router = useRouter();

  return (
    <div className={`${styles.container} relative h-screen w-full overflow-hidden flex items-center justify-center px-8`}>
      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
          My Learning Journey
        </p>

        <h2 className="mt-4 text-4xl font-bold text-white md:text-6xl">
          Education
        </h2>

        <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-white/25 bg-white/10 p-8 text-white shadow-2xl backdrop-blur-xl">
          <h3 className="text-2xl font-semibold">
            Computer Science
          </h3>

          <p className="mt-4 leading-7 text-white/80">
            My academic background has helped me develop
            programming skills and an understanding of software
            development.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EdPage;