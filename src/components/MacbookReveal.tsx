"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import DashboardContent from "./DashboardContent";

/*
 * MACBOOK REVEAL — 3D PERSPECTIVE STICKY SCROLL CLAMSHELL REVEAL
 *
 * This component is self-contained:
 *   - The outer <section> is set to h-[300vh] to act as the scroll target.
 *   - The sticky container keeps the scene locked in the viewport.
 *   - The perspective container sets up the 3D space.
 *   - The <motion.div> rotates from 90deg (lying flat, invisible) to 0deg (facing user)
 *     with pivot origin at the bottom center.
 *   - A black overlay simulates the screen turning on as it opens.
 */

export default function MacbookReveal() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Monitor scroll progress relative to the parent section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth out scroll transition
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Transforms:
  // - 0% -> 40%: Opening (rotateX 90 -> 0, scale 0.7 -> 1, opacity 0 -> 1, y 100 -> 0)
  // - 40% -> 60%: Holding (all values stable)
  // - 60% -> 100%: Closing (rotateX 0 -> 90, scale 1 -> 0.7, opacity 1 -> 0, y 0 -> 0)
  const rotateX = useTransform(smoothProgress, [0, 0.4, 0.6, 1.0], [90, 0, 0, 90]);
  const scale = useTransform(smoothProgress, [0, 0.4, 0.6, 1.0], [0.7, 1, 1, 0.7]);
  const opacity = useTransform(smoothProgress, [0, 0.25, 0.75, 1.0], [0, 1, 1, 0]);
  const y = useTransform(smoothProgress, [0, 0.4, 0.6, 1.0], [100, 0, 0, 0]);

  // Screen Backlight Overlay Opacity (Black screen fades to transparent as lid opens)
  const backlightOpacity = useTransform(smoothProgress, [0, 0.4, 0.6, 1.0], [1, 0, 0, 1]);

  return (
    <section 
      ref={containerRef} 
      id="simulator" 
      className="relative h-[300vh] bg-transparent w-full overflow-visible"
    >
      {/* Sticky viewport container */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden py-16 px-8">
        
        {/* Fixed Title & Description Area */}
        <div className="text-center max-w-xl mx-auto mb-10 z-20">
          <span className="font-mono text-xs text-ash-light uppercase tracking-widest block mb-3">
            DÉMONSTRATION AUTONOME
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-normal">
            Votre fiche de suivi, <span className="italic text-emerald-700 font-light">en version 3D vivante.</span>
          </h2>
          <p className="text-ash-text text-sm font-light leading-relaxed mt-4 font-sans">
            Faites défiler : l&apos;écran s&apos;allume sur votre tableau de suivi.
          </p>
        </div>

        {/* 3D Perspective container */}
        <div 
          style={{ perspective: "2000px" }} 
          className="w-full max-w-5xl relative flex justify-center items-center overflow-visible"
        >
          <motion.div
            style={{
              rotateX,
              scale,
              opacity,
              y,
              transformOrigin: "bottom center",
              transformStyle: "preserve-3d"
            }}
            className="relative w-full aspect-[1972/1282] max-w-4xl"
          >
            {/* Live Dashboard content at the back (z-0) */}
            <div className="absolute top-[11.7%] left-[11.71%] w-[76.52%] h-[76.52%] z-0 bg-white overflow-hidden rounded-[6px]">
              <DashboardContent className="w-full h-full text-[10px]" />
            </div>

            {/* Screen turning on overlay (z-5) */}
            <motion.div 
              style={{ opacity: backlightOpacity }}
              className="absolute top-[11.7%] left-[11.71%] w-[76.52%] h-[76.52%] z-5 bg-black rounded-[6px] pointer-events-none"
            />

            {/* Photorealistic MacBook frame image at the front (z-10) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/macbook-frame.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full z-10 pointer-events-none select-none"
              draggable={false}
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
}
