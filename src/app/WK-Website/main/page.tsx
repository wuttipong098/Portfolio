"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import profile from "@/public/profile.png";
import มพ from "@/public/มพ.webp";
import styles from "@/styles/main.module.css";
// import Portfolio3D from "@/app/components/Portfolio3D";

const MainPage = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      {/* <Portfolio3D /> */}

      <section
        id="home"
        className="portfolio-section flex h-screen items-center justify-center px-8"
      >
        <div className="relative z-10 flex w-full max-w-6xl flex-col items-center justify-center gap-8 text-center md:flex-row md:text-left">
          
          <div className="flex flex-1 items-center justify-center">
            <div className={styles.glassBox}>
              <Image
                src={profile}
                alt="My profile"
                width={200}
                height={200}
                priority
                className="h-auto w-40 object-contain md:w-80"
              />
            </div>
          </div>

          <div className="flex-1">
            <h1 className={styles.mainTitle}>Wuttipong Krachan</h1>
            <p className={styles.subtitle}>Full-Stack Developer</p>
            <p className={styles.description}>
              Welcome to my portfolio. Feel free to explore my projects, skills,
              education, and experience. Keep scrolling!
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
              <Image
                src={มพ}
                alt="Logo มพ."
                width={200}
                height={200}
                priority
                className="h-auto w-40 object-contain md:w-52"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainPage;