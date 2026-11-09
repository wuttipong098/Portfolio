"use client";

import styles from "@/styles/contact.module.css";

const contactItems = [
  {
    label: "Email",
    value: "acenpwk@gmail.com",
    href: "mailto:acenpwk@gmail.com",
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

const CTPage = () => {
  return (
    <div className={`${styles.container} relative h-screen w-full overflow-hidden flex items-center justify-center px-8`}>
      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
          Let&apos;s Connect
        </p>

        <h2 className="mt-4 text-4xl font-bold text-white md:text-7xl">
          Contact Me
        </h2>

        <p className="mx-auto mt-6 max-w-xl leading-8 text-white/80">
          Interested in working together or learning more about my
          projects? Feel free to get in touch.
        </p>

        {/* Contact Grid */}
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

        {/* Primary CTA */}
        <a
          href="mailto:acenpwk@gmail.com"
          className="mt-10 inline-block rounded-full bg-white px-8 py-4 font-semibold text-[#8D00AD] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-2xl"
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