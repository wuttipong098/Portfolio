"use client";

import Header from "@/app/components/Header"; 

import MainPage from "@/app/WK-Website/main/page";
import PJPage from "@/app/WK-Website/project/page";
import PFPage from "@/app/WK-Website/portfolio/page";
import EdPage from "@/app/WK-Website/education/page";
import CTPage from "@/app/WK-Website/contact/page";

export default function Home() {
  return (
    <main className="relative w-full overflow-x-hidden scroll-smooth">
      <Header />

      {/* 1. Home / หน้าหลัก - เอา h-screen ออก */}
      <section id="home" className="w-full">
        <MainPage />
      </section>

      {/* 2. My Project */}
      <section id="project" className="h-screen w-full">
        <PJPage />
      </section>

      {/* 3. Portfolio */}
      <section id="portfolio" className="h-screen w-full">
        <PFPage />
      </section>

      {/* 4. Education */}
      <section id="education" className="h-screen w-full">
        <EdPage />
      </section>

      {/* 5. Contact */}
      <section id="contact" className="h-screen w-full">
        <CTPage />
      </section>
    </main>
  );
}