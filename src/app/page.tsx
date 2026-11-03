"use client";

import Header from "@/app/components/Header"; 

// Import ทั้ง 5 หน้า
import MainPage from "@/app/WK-Website/main/page";
import PJPage from "@/app/WK-Website/project/page";
import PFPage from "@/app/WK-Website/portfolio/page";
import EdPage from "@/app/WK-Website/education/page";
import CTPage from "@/app/WK-Website/contact/page";

export default function Home() {
  return (
    // เพิ่ม scroll-smooth ตรงนี้เพื่อให้เวลาคลิก Header แล้วหน้าจอเลื่อนสมูทๆ
    <main className="relative w-full overflow-x-hidden scroll-smooth">
      {/* แสดง Header ไว้ด้านบนสุด */}
      <Header />

      {/* 1. Home / หน้าหลัก */}
      <section id="home" className="h-screen w-full">
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