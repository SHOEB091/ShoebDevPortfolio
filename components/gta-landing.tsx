"use client";

import React, { useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// GTA VI style landing animation ported from GTAVI-main/src/App.jsx
// Notes:
// - Assets are referenced from Next.js public/ root (e.g. "/bg.png").
// - This is a client component due to direct DOM/GSAP usage.
// - We guard DOM calls and clean up event listeners.

export function GTALanding() {
  const [showContent, setShowContent] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.to(".vi-mask-group", {
      rotate: 10,
      duration: 2,
      ease: "Power4.easeInOut",
      transformOrigin: "50% 50%",
    }).to(".vi-mask-group", {
      scale: 10,
      duration: 2,
      delay: -1.8,
      ease: "Expo.easeInOut",
      transformOrigin: "50% 50%",
      opacity: 0,
      onUpdate: function () {
        // safeguard in case the element is already gone
        const gate = document.querySelector(".gta-svg");
        if (this.progress() >= 0.9 && gate) {
          gate.remove();
          setShowContent(true);
          this.kill();
        }
      },
    });
  });

  useGSAP(() => {
    if (!showContent) return;

    // Keep transforms anchored to bottom-center so the character rises cleanly
    gsap.set(".gta-character", { transformOrigin: "50% 100%" });

    gsap.to(".gta-main", {
      scale: 1,
      rotate: 0,
      duration: 2,
      delay: "-1",
      ease: "Expo.easeInOut",
    });

    gsap.to(".gta-sky", {
      scale: 1.1,
      rotate: 0,
      duration: 2,
      delay: "-.8",
      ease: "Expo.easeInOut",
    });

    gsap.to(".gta-bg", {
      scale: 1.1,
      rotate: 0,
      duration: 2,
      delay: "-.8",
      ease: "Expo.easeInOut",
    });

    // Responsive final pose for the character image so it's nicely framed
  const w = window.innerWidth;
  const isMobile = w < 768;
  const isTablet = w >= 768 && w < 1200;
  // Make character even shorter and lower for a more compact fit
  const finalScale = isMobile ? 0.6 : isTablet ? 0.7 : 0.65;
  // Lower the image further for desktop/laptop
  const finalBottom = isMobile ? "-48%" : isTablet ? "-46%" : "-44%";

    gsap.to(".gta-character", {
      scale: finalScale,
      x: "-50%",
      bottom: finalBottom,
      rotate: 0,
      duration: 2,
      delay: "-.8",
      ease: "Expo.easeInOut",
    });

    gsap.to(".gta-text", {
      scale: 1,
      rotate: 0,
      duration: 2,
      delay: "-.8",
      ease: "Expo.easeInOut",
    });

    const main = document.querySelector<HTMLElement>(".gta-main");
    const handler = (e: MouseEvent) => {
      const xMove = (e.clientX / window.innerWidth - 0.5) * 40;
      gsap.to(".gta-main .gta-text", { x: `${xMove * 0.4}%` });
      gsap.to(".gta-sky", { x: xMove });
      gsap.to(".gta-bg", { x: xMove * 1.7 });
    };
    main?.addEventListener("mousemove", handler);
    return () => main?.removeEventListener("mousemove", handler);
  }, [showContent]);

  // Close on Escape and toggle body scroll lock when menu is open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNavOpen(false);
    };
    if (navOpen) {
      document.addEventListener("keydown", onKey);
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("overflow-hidden");
    };
  }, [navOpen]);

  return (
    <>
      {/* Gate / mask intro */}
      <div className="gta-svg flex items-center justify-center fixed top-0 left-0 z-[100] w-full h-dvh overflow-hidden bg-[#000]">
        <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <mask id="viMask">
              <rect width="100%" height="100%" fill="black" />
              <g className="vi-mask-group">
                <text
                  x="50%"
                  y="50%"
                  fontSize="250"
                  textAnchor="middle"
                  fill="white"
                  dominantBaseline="middle"
                  fontFamily="pricedown"
                >
                  SI
                </text>
              </g>
            </mask>
          </defs>
          <image
            href="/bg.png"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            mask="url(#viMask)"
          />
        </svg>
      </div>

      {showContent && (
        <div className="gta-main gta-pricedown w-full rotate-[-10deg] scale-[1.7]">
          <div className="overflow-hidden relative w-full h-dvh bg-black">
            {/* Navbar */}
            <div className="absolute top-0 left-0 z-[10] w-full py-10 px-10">
              <div className="flex gap-7 items-center">
                <button
                  aria-label={navOpen ? "Close menu" : "Open menu"}
                  onClick={() => setNavOpen((v) => !v)}
                  className="relative w-10 h-10 flex items-center justify-center focus:outline-none"
                >
                  {navOpen ? (
                    <div className="relative w-8 h-8">
                      <div className="absolute inset-0 rotate-45">
                        <div className="absolute top-1/2 -translate-y-1/2 w-8 h-2 bg-white" />
                      </div>
                      <div className="absolute inset-0 -rotate-45">
                        <div className="absolute top-1/2 -translate-y-1/2 w-8 h-2 bg-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-[5px]">
                      <div className="w-15 h-2 bg-white" />
                      <div className="w-8 h-2 bg-white" />
                      <div className="w-5 h-2 bg-white" />
                    </div>
                  )}
                </button>
                <h3 className="text-4xl -mt-[8px] leading-none text-white">shoeb iqbal</h3>
              </div>
            </div>

            {/* Fullscreen Nav Overlay */}
            <div
              className={`fixed inset-0 z-[60] transition-opacity duration-300 ${
                navOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
            >
              <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => setNavOpen(false)}
              />
              <nav className="relative z-[1] w-full h-full flex">
                <div className="mt-28 ml-10 md:ml-16 flex flex-col gap-6 text-white">
                  <a href="#about" onClick={() => setNavOpen(false)} className="text-4xl md:text-6xl hover:text-[var(--miami-sun)]">About</a>
                  <a href="#skills" onClick={() => setNavOpen(false)} className="text-4xl md:text-6xl hover:text-[var(--miami-sun)]">Skills</a>
                  <a href="#projects" onClick={() => setNavOpen(false)} className="text-4xl md:text-6xl hover:text-[var(--miami-sun)]">Projects</a>
                  <a href="#certificates" onClick={() => setNavOpen(false)} className="text-4xl md:text-6xl hover:text-[var(--miami-sun)]">Certificates</a>
                  <a href="#experience" onClick={() => setNavOpen(false)} className="text-4xl md:text-6xl hover:text-[var(--miami-sun)]">Experience</a>
                  <a href="#contact" onClick={() => setNavOpen(false)} className="text-4xl md:text-6xl hover:text-[var(--miami-sun)]">Contact</a>
                </div>
              </nav>
            </div>

            {/* Images */}
            <div className="relative overflow-hidden w-full h-dvh">
              <img
                className="absolute gta-sky scale-[1.5] rotate-[-20deg] top-0 left-0 w-full h-full object-cover"
                src="/sky.png"
                alt="sky"
              />
              <img
                className="absolute scale-[1.8] rotate-[-3deg] gta-bg top-0 left-0 w-full h-full object-cover"
                src="/bg.png"
                alt="background"
              />
              <div className="gta-text text-white flex flex-col gap-3 absolute top-20 left-1/2 -translate-x-1/2 scale-[1.4] rotate-[-10deg]">
                <h1 className="text-[12rem] leading-none -ml-40">soft</h1>
                <h1 className="text-[12rem] leading-none ml-20">ware</h1>
                <h1 className="text-[12rem] leading-none -ml-40">engineer</h1>
              </div>
              <img
                className="absolute gta-character bottom-[-140%] left-1/2 -translate-x-1/2 scale-[1.1] rotate-[-10deg] pointer-events-none select-none"
                src="/girlbg.png"
                alt="character"
              />
            </div>

            {/* Bottom bar */}
            <div className="text-white absolute bottom-0 left-0 w-full py-15 px-10 bg-gradient-to-t from-black to-transparent">
              <div className="flex gap-4 items-center">
                <i className="text-4xl ri-arrow-down-line" />
                <h3 className="text-xl">Scroll Down</h3>
              </div>
              {/* <img
                className="absolute h-[55px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                src="/ps5.png"
                alt="ps5"
              /> */}
            </div>
          </div>

          {/* Content section below hero */}
          <div className="w-full min-h-dvh flex items-center justify-center bg-black">
            <div className="flex text-white w-full max-w-7xl h-auto py-20 px-6 gap-10">
              <div className="relative w-1/2 hidden md:block">
                <img
                  className="absolute scale-[1.1] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  src="/imag2.png"
                  alt="feature"
                />
              </div>
              <div className="md:w-[30%] w-full">
                <h1 className="text-6xl md:text-8xl">Still Searching For Developer,</h1>
                <h1 className="text-6xl md:text-8xl">Here I am</h1>
                <p className="mt-10 text-xl text-zinc-300">
                  A playful, animated portfolio inspired by GTA VI visuals, integrated into this portfolio.
                </p>
                <p className="mt-3 text-xl text-zinc-300">
                  Built with Next.js, GSAP, and Tailwind, with parallax motion and an SVG mask intro.
                </p>
                <a href="#about" className="inline-block">
                  <button className="bg-yellow-500 px-8 py-4 text-black mt-10 text-2xl">Explore</button>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GTALanding;
