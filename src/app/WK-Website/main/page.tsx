"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import profile from "@/public/profile.png";
import มพ from "@/public/มพ.webp";
import Portfolio3D from "@/app/components/Portfolio3D";

export default function MainPage() {
  const router = useRouter();

  useEffect(() => {
    const portfolioSection = document.getElementById("portfolio");
    if (!portfolioSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // เมื่อผู้ใช้งานเลื่อนหน้าจอมาเห็นส่วน portfolio เกิน 50% จะเปลี่ยนไปหน้า portfolio ทันที
          if (entry.isIntersecting) {
            router.push("/WK-Website/portfolio");
          }
        });
      },
      { threshold: 0.5 } // สามารถปรับความไวได้ตั้งแต่ 0.1 ถึง 1.0
    );

    observer.observe(portfolioSection);

    return () => {
      if (portfolioSection) observer.unobserve(portfolioSection);
    };
  }, [router]);

  return (
    <div className="relative isolate">
      {/* 3D Background */}
      <Portfolio3D />

      {/* Home */}
      <section
        id="home"
        className="portfolio-section flex items-center justify-center px-8"
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
              href="#projects"
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

          <div className="absolute bottom-0 left-0">
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

      {/* My Projects */}
      <section
        id="projects"
        className="portfolio-section flex items-center justify-center px-8"
      >
        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
            What I Have Built
          </p>

          <h2 className="mt-4 text-4xl font-bold text-white md:text-6xl">
            My Projects
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Web Development",
                description:
                  "Web applications built with modern frontend technologies.",
              },
              {
                title: "Full-Stack Development",
                description:
                  "Projects combining frontend interfaces and backend services.",
              },
              {
                title: "Interactive Applications",
                description:
                  "Applications with interactive interfaces and user experiences.",
              },
            ].map((project) => (
              <div
                key={project.title}
                className="rounded-3xl border border-white/25 bg-white/10 p-7 text-white shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/20"
              >
                <h3 className="text-xl font-semibold">
                  {project.title}
                </h3>

                <p className="mt-4 leading-7 text-white/75">
                  {project.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio (จุดที่เมื่อเลื่อนลงมาถึง จะทำการเปลี่ยนหน้าไป /WK-Website/portfolio อัตโนมัติ) */}
      <section
        id="portfolio"
        className="portfolio-section flex items-center justify-center px-8"
      >
        <div className="relative z-10 mx-auto w-full max-w-5xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
            Skills & Experience
          </p>

          <h2 className="mt-4 text-4xl font-bold text-white md:text-6xl">
            My Portfolio
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-white/85">
            I enjoy creating websites and applications that combine
            thoughtful design, reliable functionality, and a great
            user experience.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {[
              "HTML",
              "CSS",
              "JavaScript",
              "TypeScript",
              "React",
              "Next.js",
              "Tailwind CSS",
              "Node.js",
            ].map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-white/30 bg-white/10 px-5 py-3 text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/25"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section
        id="education"
        className="portfolio-section flex items-center justify-center px-8"
      >
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
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="portfolio-section flex items-center justify-center px-8"
      >
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
      </section>
    </div>
  );
}

// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import profile from "@/public/profile.png";
// import มพ from "@/public/มพ.webp";
// import Portfolio3D from "@/app/components/Portfolio3D";

// export default function MainPage() {
//   return (
//     <div className="relative isolate">
//       {/* 3D Background */}
//       <Portfolio3D />

//       {/* Home */}
//       <section
//         id="home"
//         className="portfolio-section flex items-center justify-center px-8"
//       >
//         <div className="relative z-10 flex w-full max-w-6xl flex-col items-center justify-center gap-8 text-center md:flex-row md:text-left">
//           <div className="flex-1">
//             <h1 className="text-5xl font-bold text-white md:text-7xl">
//               Wuttipong Krachan
//             </h1>

//             <p className="mt-5 text-xl text-white/90 md:text-2xl">
//               Full-Stack Developer
//             </p>

//             <p className="mt-4 max-w-xl text-base leading-8 text-white/80">
//               Welcome to my portfolio. Explore my projects, skills,
//               education, and experience.
//             </p>

//             <Link
//               href="#projects"
//               className="mt-8 inline-block rounded-full border border-white/40 bg-white/15 px-7 py-3 text-white backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:bg-white/30 hover:shadow-lg"
//             >
//               Explore My Work ↓
//             </Link>
//           </div>

//           <div className="flex flex-1 items-center justify-center">
//             <div className="rounded-3xl border border-white/30 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
//               <Image
//                 src={มพ}
//                 alt="Logo มพ."
//                 width={200}
//                 height={200}
//                 priority
//                 className="h-auto w-40 object-contain md:w-52"
//               />
//             </div>
//           </div>

//           <div className="absolute bottom-0 left-0">
//             <Image
//               src={profile}
//               alt="My profile"
//               width={200}
//               height={200}
//               priority
//               className="h-auto w-32 object-contain md:w-48"
//             />
//           </div>
//         </div>
//       </section>

//       {/* My Projects */}
//       <section
//         id="projects"
//         className="portfolio-section flex items-center justify-center px-8"
//       >
//         <div className="relative z-10 mx-auto w-full max-w-6xl">
//           <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
//             What I Have Built
//           </p>

//           <h2 className="mt-4 text-4xl font-bold text-white md:text-6xl">
//             My Projects
//           </h2>

//           <div className="mt-10 grid gap-6 md:grid-cols-3">
//             {[
//               {
//                 title: "Web Development",
//                 description:
//                   "Web applications built with modern frontend technologies.",
//               },
//               {
//                 title: "Full-Stack Development",
//                 description:
//                   "Projects combining frontend interfaces and backend services.",
//               },
//               {
//                 title: "Interactive Applications",
//                 description:
//                   "Applications with interactive interfaces and user experiences.",
//               },
//             ].map((project) => (
//               <div
//                 key={project.title}
//                 className="rounded-3xl border border-white/25 bg-white/10 p-7 text-white shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/20"
//               >
//                 <h3 className="text-xl font-semibold">
//                   {project.title}
//                 </h3>

//                 <p className="mt-4 leading-7 text-white/75">
//                   {project.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Portfolio */}
//       <section
//         id="portfolio"
//         className="portfolio-section flex items-center justify-center px-8"
//       >
//         <div className="relative z-10 mx-auto w-full max-w-5xl text-center">
//           <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
//             Skills & Experience
//           </p>

//           <h2 className="mt-4 text-4xl font-bold text-white md:text-6xl">
//             My Portfolio
//           </h2>

//           <p className="mx-auto mt-6 max-w-2xl leading-8 text-white/85">
//             I enjoy creating websites and applications that combine
//             thoughtful design, reliable functionality, and a great
//             user experience.
//           </p>

//           <div className="mt-10 flex flex-wrap justify-center gap-3">
//             {[
//               "HTML",
//               "CSS",
//               "JavaScript",
//               "TypeScript",
//               "React",
//               "Next.js",
//               "Tailwind CSS",
//               "Node.js",
//             ].map((skill) => (
//               <span
//                 key={skill}
//                 className="rounded-full border border-white/30 bg-white/10 px-5 py-3 text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/25"
//               >
//                 {skill}
//               </span>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Education */}
//       <section
//         id="education"
//         className="portfolio-section flex items-center justify-center px-8"
//       >
//         <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
//           <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
//             My Learning Journey
//           </p>

//           <h2 className="mt-4 text-4xl font-bold text-white md:text-6xl">
//             Education
//           </h2>

//           <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-white/25 bg-white/10 p-8 text-white shadow-2xl backdrop-blur-xl">
//             <h3 className="text-2xl font-semibold">
//               Computer Science
//             </h3>

//             <p className="mt-4 leading-7 text-white/80">
//               My academic background has helped me develop
//               programming skills and an understanding of software
//               development.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Contact */}
//       <section
//         id="contact"
//         className="portfolio-section flex items-center justify-center px-8"
//       >
//         <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
//           <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
//             Let's Connect
//           </p>

//           <h2 className="mt-4 text-4xl font-bold text-white md:text-7xl">
//             Contact Me
//           </h2>

//           <p className="mx-auto mt-6 max-w-xl leading-8 text-white/80">
//             Interested in working together or learning more about my
//             projects? Feel free to get in touch.
//           </p>

//           <a
//             href="mailto:"
//             className="mt-8 inline-block rounded-full bg-white px-8 py-4 font-semibold text-[#8D00AD] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-2xl"
//           >
//             Get In Touch
//           </a>

//           <p className="mt-16 text-sm text-white/60">
//             © {new Date().getFullYear()} Wuttipong Krachan
//           </p>
//         </div>
//       </section>
//     </div>
//   );
// }