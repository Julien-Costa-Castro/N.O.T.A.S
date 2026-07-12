"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import DashboardContent from "./DashboardContent";

/*
 * MACBOOK REVEAL — "CSS SURGERY" VIRTUAL CLAMSHELL REVEAL (CORRECTED HINGE ALIGNMENT)
 *
 * This component achieves a realistic mechanical clamshell open/close using a single image:
 *   - The parent wrapper sets up the 3D perspective space (perspective: 2500px).
 *   - Both the Base (Keyboard) and Capot (Screen) are styled with absolute inset-0 to overlay
 *     perfectly at the pixel level before the clip-path is applied.
 *   - Keyboard Base: bottom 15% of the image (clip-path: inset(85% 0 0 0)).
 *   - Screen Lid: top 85% of the image (clip-path: inset(0 0 15% 0)).
 *   - The hinge is at exactly 85% height. Thus, we set transformOrigin: "center 85%" on the Capot
 *     so it pivots precisely along the cut line without detaching or floating.
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

  // 1. Lid rotation:
  // - Closed (0% to 30%): -95deg (lying closed on base) -> 0deg (vertical facing user)
  // - Open (30% to 70%): remains at 0deg (user reads dashboard)
  // - Closing (70% to 100%): 0deg -> -95deg
  const rotateX = useTransform(
    smoothProgress,
    [0, 0.3, 0.7, 1.0],
    [-95, 0, 0, -95]
  );

  // 2. Global container scale:
  // - 0% to 30%: 0.7 -> 1
  // - 30% to 70%: 1 (stable)
  // - 70% to 100%: 1 -> 0.7
  const parentScale = useTransform(
    smoothProgress,
    [0, 0.3, 0.7, 1.0],
    [0.7, 1, 1, 0.7]
  );

  // 3. Global translation Y:
  // - 0% to 30%: 100px (comes from bottom) -> 0px
  // - 30% to 70%: 0px
  // - 70% to 100%: 0px -> -100px (slides up)
  const y = useTransform(
    smoothProgress,
    [0, 0.3, 0.7, 1.0],
    [100, 0, 0, -100]
  );

  // 4. Global opacity:
  // - 0% to 30%: 0 -> 1
  // - 30% to 70%: 1 (stable)
  // - 70% to 100%: 1 -> 0
  const opacity = useTransform(
    smoothProgress,
    [0, 0.25, 0.75, 1.0],
    [0, 1, 1, 0]
  );

  // Screen Backlight Overlay Opacity (Black screen fades to transparent as lid opens)
  const backlightOpacity = useTransform(
    smoothProgress,
    [0, 0.3, 0.7, 1.0],
    [1, 0, 0, 1]
  );

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
          {/* Global scaling & sliding parent wrapper */}
          <motion.div
            style={{
              scale: parentScale,
              opacity,
              y,
              transformStyle: "preserve-3d"
            }}
            className="relative w-full aspect-[1972/1282] max-w-4xl flex items-center justify-center overflow-visible"
          >
            {/* A. LA BASE (Le Clavier - Fixe, z-index: 5) */}
            <div 
              className="absolute inset-0 w-full h-full z-10"
              style={{
                clipPath: "inset(85% 0 0 0)",
                WebkitClipPath: "inset(85% 0 0 0)",
                transformStyle: "preserve-3d"
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/macbook-frame.png" 
                alt="" 
                className="w-full h-full object-contain select-none pointer-events-none" 
              />
            </div>

            {/* B. LE CAPOT (L'Écran - Animé, z-index: 20) */}
            <motion.div
              style={{
                rotateX,
                transformOrigin: "center 85%",
                transformStyle: "preserve-3d",
                clipPath: "inset(0 0 15% 0)",
                WebkitClipPath: "inset(0 0 15% 0)"
              }}
              className="absolute inset-0 w-full h-full z-20"
            >
              {/* Live Dashboard content at the back of the screen (z-0) */}
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
                className="absolute inset-0 w-full h-full z-10 object-contain select-none pointer-events-none"
                draggable={false}
              />
            </motion.div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
