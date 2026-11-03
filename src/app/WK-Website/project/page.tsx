"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from '@/styles/project.module.css';

const PJPage = () => {
  const router = useRouter();
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  return (
    <div className={`${styles.container} relative h-screen w-full overflow-hidden flex items-center justify-center px-8`}>
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
    </div>
  );
};

export default PJPage;