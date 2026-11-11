"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import profile from "@/public/profile.png";
import profile1 from "@/public/profile1.png";
import มพ from "@/public/มพ.webp";
import styles from "@/styles/main.module.css";

const MainPage = () => {
  const router = useRouter();

  const sequence = [0, 1, 0];
  const [stepIndex, setStepIndex] = useState(0);
  const homeRef = useRef(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStepIndex(0);
          let currentStep = 0;

          if (interval) clearInterval(interval);
          interval = setInterval(() => {
            currentStep++;
            if (currentStep < sequence.length) {
              setStepIndex(currentStep);
            } else {
              if (interval) clearInterval(interval);
            }
          }, 3500);
        } else {
          if (interval) clearInterval(interval);
        }
      },
      { threshold: 0.4 }
    );

    if (homeRef.current) {
      observer.observe(homeRef.current);
    }

    return () => {
      if (homeRef.current) observer.unobserve(homeRef.current);
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <div className={styles.container}>
      <section
        ref={homeRef}
        id="home"
        className="portfolio-section flex h-screen items-center justify-center px-8"
      >
        <div className="relative z-10 flex w-full max-w-6xl flex-col items-center justify-center gap-8 text-center md:flex-row md:text-left">
          
          <div className="flex flex-1 items-center justify-center">
            {/* กรอบใสขนาดตายตัว */}
            <div className={styles.glassBox}>
              {/* รูปที่ 1: profile */}
              <div
                className="absolute inset-0 flex items-center justify-center p-6 transition-opacity duration-700 ease-in-out"
                style={{ opacity: stepIndex === 0 || stepIndex === 2 ? 1 : 0 }}
              >
                <Image
                  src={profile}
                  alt="My profile"
                  width={320}
                  height={320}
                  priority
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* รูปที่ 2: profile1 */}
              <div
                className="absolute inset-0 flex items-center justify-center p-6 transition-opacity duration-700 ease-in-out"
                style={{ opacity: stepIndex === 1 ? 1 : 0 }}
              >
                <Image
                  src={profile1}
                  alt="My profile 1"
                  width={320}
                  height={320}
                  priority
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h1 className={styles.mainTitle}>Wuttipong Krachan</h1>
            <p className={styles.subtitle}>Full-Stack Developer</p>
            <p className={styles.description}>
              Welcome to my portfolio. Feel free to explore my projects, skills,
              education, and experience. You can scroll through to view the content or select a specific section!
            </p>
          </div>
        </div>
      </section>

      <section className="portfolio-section flex items-center justify-center px-8 py-16">
        <div className="relative z-10 flex w-full max-w-6xl flex-col items-center justify-center gap-10 text-center md:flex-row md:text-left">
          
          <div className="flex-1">
            <h2 className={styles.sectionTitle}>
              Inspiration for creating this website
            </h2>

            <p className={styles.aboutText}>
              I'm a recent graduate with a strong passion for software development.
              Through internships and personal projects, I’ve gained experience
              working in teams in a Work From Home environment as a Full-Stack
              Developer — handling both frontend web design and backend development.
            </p>

            <p className={styles.aboutText}>
              I’m now looking for opportunities to start my career as a software
              developer, where I can contribute to real-world projects and
              continuously learn and grow in the developer community.
            </p>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <div className={styles.glassBox}>
              <div className="flex h-full w-full items-center justify-center p-6">
                <Image
                  src={มพ}
                  alt="Logo มพ."
                  width={300}
                  height={300}
                  priority
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainPage;