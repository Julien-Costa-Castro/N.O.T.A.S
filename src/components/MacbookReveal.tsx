"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import DashboardContent from "./DashboardContent";

/*
 * MACBOOK REVEAL — 3D PERSPECTIVE STICKY SCROLL REVEAL (REVEAL SLIDE & TILT)
 *
 * Architecture in a single unified 3D block:
 *   - The outer <section> is set to h-[300vh] to act as the scroll target.
 *   - The sticky container keeps the scene locked in the viewport.
 *   - The perspective container sets up the 3D space.
 *   - The <motion.div> rotates slightly, slides vertically, and scales up/down.
 *   - An overlay black screen simulates the screen backlight ignition as it tilts up.
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

  // Transforms mapping for the 3 stages of scroll:
  // - Phase 1: APPARITION (Scroll 0% to 35%)
  //     * rotateX: 25deg (slightly tilted backward) -> 0deg (facing user)
  //     * y: 250px (slides up) -> 0px
  //     * scale: 0.85 -> 1
  //     * opacity: 0 -> 1
  // - Phase 2: LECTURE (Scroll 35% to 65%)
  //     * rotateX: 0deg, y: 0px, scale: 1, opacity: 1 (stable)
  // - Phase 3: DISPARITION (Scroll 65% to 100%)
  //     * rotateX: 0deg -> -15deg (tilts slightly forward)
  //     * y: 0px -> -200px (slides up off screen)
  //     * scale: 1 -> 0.85
  //     * opacity: 1 -> 0
  const rotateX = useTransform(smoothProgress, [0, 0.35, 0.65, 1.0], [25, 0, 0, -15]);
  const scale = useTransform(smoothProgress, [0, 0.35, 0.65, 1.0], [0.85, 1, 1, 0.85]);
  const opacity = useTransform(smoothProgress, [0, 0.35, 0.65, 1.0], [0, 1, 1, 0]);
  const y = useTransform(smoothProgress, [0, 0.35, 0.65, 1.0], [250, 0, 0, -200]);

  // Screen Backlight Overlay Opacity (Black screen fades to transparent as lid opens)
  const backlightOpacity = useTransform(smoothProgress, [0, 0.35, 0.65, 1.0], [1, 0, 0, 1]);

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
          style={{ perspective: "2500px" }} 
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
