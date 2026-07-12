"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import DashboardContent from "./DashboardContent";

/*
 * MACBOOK REVEAL — PREMIUM "SCALE & SLIDE REVEAL" (VERCEL / LINEAR STYLE)
 *
 * This component implements a highly polished, flat-perspective scroll reveal:
 *   - The parent section is h-[250vh] to act as the scroll container.
 *   - The sticky container keeps the MacBook locked in the viewport.
 *   - The MacBook (mockup image + live dashboard) acts as a unified element.
 *   - As the user scrolls:
 *       1. 0% -> 40%: The laptop slides up from y="50vh" to 0px, and scales down from 1.4 to 1.
 *       2. 40% -> 70%: Holds at y=0px, scale=1 (fully readable and interactive).
 *       3. 70% -> 100%: Scales down to 0.9 and fades out to opacity 0.
 *   - An ambient drop shadow is added beneath the chassis for realistic depth.
 */

export default function MacbookReveal() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Monitor scroll progress relative to this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Soft spring config for buttery smooth response
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  // Animation values mapping:
  // - Phase 1: APPARITION (Scroll 0% to 40%)
  // - Phase 2: LECTURE (Scroll 40% to 80%)
  // - Phase 3: DISPARITION (Scroll 80% to 100%) - Fades out in-place very quickly
  const y = useTransform(smoothProgress, [0, 0.4, 0.8, 1.0], ["30vh", "0px", "0px", "0px"]);
  const scale = useTransform(smoothProgress, [0, 0.4, 0.8, 1.0], [1.3, 1, 1, 0.95]);
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1.0], [0, 1, 1, 0]);

  return (
    <section 
      ref={containerRef} 
      id="simulator" 
      className="relative h-[140vh] bg-transparent w-full overflow-visible"
    >
      {/* Sticky viewport container */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden py-16 px-8">
        
        {/* Fixed Title & Description Area */}
        <div className="text-center max-w-xl mx-auto mb-10 z-20">
          <span className="font-mono text-xs text-ash-light uppercase tracking-widest block mb-3">
            DÉMONSTRATION AUTONOME
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-normal">
            Votre fiche de suivi, <span className="italic text-emerald-700 font-light">en version vivante.</span>
          </h2>
          <p className="text-ash-text text-sm font-light leading-relaxed mt-4 font-sans">
            Faites défiler : l&apos;écran s&apos;allume sur votre tableau de suivi.
          </p>
        </div>

        {/* Outer alignment container */}
        <div className="w-full max-w-5xl relative flex justify-center items-center overflow-visible">
          
          {/* Responsive scale adjustment layer */}
          <div className="scale-[0.45] sm:scale-[0.65] md:scale-[0.82] lg:scale-95 origin-center transition-transform duration-300 overflow-visible">
            
            {/* Animated laptop frame wrapper */}
            <motion.div
              style={{
                y,
                scale,
                opacity
              }}
              className="relative w-[800px] aspect-[1972/1282] max-w-4xl flex items-center justify-center overflow-visible"
            >
              {/* 1. Ambient drop shadow underneath the laptop base (adds depth against white bg) */}
              <div className="absolute bottom-[-15px] left-[8%] w-[84%] h-8 bg-black/20 blur-2xl rounded-full pointer-events-none z-0" />

              {/* 2. Interactive dashboard content behind the transparent screen (z-0) */}
              <div className="absolute top-[11.7%] left-[11.71%] w-[76.52%] h-[76.52%] z-0 bg-white overflow-hidden rounded-[6px]">
                <DashboardContent className="w-full h-full text-[10px]" />
              </div>

              {/* 3. Photorealistic MacBook frame image on top (z-10) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/macbook-frame.png"
                alt=""
                className="absolute inset-0 w-full h-full z-10 object-contain select-none pointer-events-none"
                draggable={false}
              />
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}
