"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import profile from "@/public/profile.png";
import มพ from "@/public/มพ.webp";
// import Portfolio3D from "@/app/components/Portfolio3D";

const MainPage = () => {
  const router = useRouter();

  return (
    <div className="relative isolate h-screen w-full overflow-hidden">
      {/* 3D Background */}
      {/* <Portfolio3D /> */}

      {/* Home / หน้าหลัก */}
      <section
        id="home"
        className="portfolio-section flex h-full items-center justify-center px-8"
      >
        <div className="relative z-10 flex w-full max-w-6xl flex-col items-center justify-center gap-8 text-center md:flex-row md:text-left">
          <div className="flex-1">
            <h1 className="text-5xl font-bold text-white md:text-7xl">
              Wuttipong Krachan
            </h1>

            <p className="mt-5 text-xl text-white/90 md:text-2xl">
              Full-Stack Developer
            </p>

            <p className="mt-4 max-w-xl text-base leading-8 text-white/80">
              Welcome to my portfolio. Explore my projects, skills,
              education, and experience.
            </p>

            <Link
              href="/WK-Website/project"
              className="mt-8 inline-block rounded-full border border-white/40 bg-white/15 px-7 py-3 text-white backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:bg-white/30 hover:shadow-lg"
            >
              Explore My Work ↓
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <div className="rounded-3xl border border-white/30 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
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

          <div className="absolute bottom-6 left-6">
            <Image
              src={profile}
              alt="My profile"
              width={200}
              height={200}
              priority
              className="h-auto w-32 object-contain md:w-48"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainPage;