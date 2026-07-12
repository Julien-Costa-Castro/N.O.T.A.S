"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import DashboardContent from "./DashboardContent";

/*
 * MACBOOK REVEAL — PREMIUM "SCALE & SLIDE REVEAL" WITH INTERACTIVE ZOOM ONBOARDING
 *
 *   - Monitors scroll to animate entry (scale 1.3 -> 1, y 30vh -> 0px, opacity 0 -> 1).
 *   - Implements a 3-step interactive clerc onboarding tour inside the laptop screen.
 *   - The laptop shifts and scales (zooms & pans) dynamically to focus on the active zone:
 *       * Step 0 (Intro): Centered, scale 1.
 *       * Step 1 (Row Highlight): Zooms in slightly, shifts up to focus on the table (scale 1.25, y -20px).
 *       * Step 2 (Drawer Open): Zooms in further and pans to the left to center the right-hand panel (scale 1.5, x -130px, y -20px).
 *       * Step 3 (Success): Zooms back to centered screen (scale 1.25, x 0px, y -20px).
 *   - Top instructions banner updates at each step.
 */

export default function MacbookReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0); // Onboarding step state (0 to 3)

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

  // Entry slide transforms (Scroll 0% to 40% maps entry, then holds to 100%)
  const y = useTransform(smoothProgress, [0, 0.4, 1.0], ["30vh", "0px", "0px"]);
  const scale = useTransform(smoothProgress, [0, 0.4, 1.0], [1.3, 1, 1]);
  const opacity = useTransform(smoothProgress, [0, 0.2, 1.0], [0, 1, 1]);

  // Step-based Zoom & Pan coordinates:
  const stepScale = step === 0 ? 1 : step === 1 ? 1.22 : step === 2 ? 1.48 : 1.22;
  const stepX = step === 0 ? "0px" : step === 1 ? "0px" : step === 2 ? "-130px" : "0px";
  const stepY = step === 0 ? "0px" : step === 1 ? "-20px" : step === 2 ? "-20px" : "-20px";

  return (
    <section 
      ref={containerRef} 
      id="simulator" 
      className="relative h-[140vh] bg-transparent w-full overflow-visible"
    >
      {/* Sticky viewport container */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden py-12 px-8">
        
        {/* Instruction Banner at the top of the sticky viewport */}
        <div className="h-16 flex items-center justify-center max-w-xl mx-auto mb-6 z-30 text-center px-4 font-sans">
          {step === 0 && (
            <span className="text-xs font-mono text-ash-light uppercase tracking-wider animate-fade-in">
              DÉMONSTRATION INTERACTIVE · CLIQUEZ DANS L&apos;ÉCRAN CI-DESSOUS
            </span>
          )}
          {step === 1 && (
            <div className="flex flex-col items-center gap-1 animate-fade-in">
              <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5 uppercase font-semibold">
                Étape 1/3 : Relance Autonome
              </span>
              <span className="text-xs text-neutral-800 font-light">
                NOTAS a détecté l&apos;État daté manquant. Cliquez sur la ligne verte <strong>&quot;Vente Martin&quot;</strong>.
              </span>
            </div>
          )}
          {step === 2 && (
            <div className="flex flex-col items-center gap-1 animate-fade-in">
              <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5 uppercase font-semibold">
                Étape 2/3 : Prise de contrôle clerc
              </span>
              <span className="text-xs text-neutral-800 font-light">
                L&apos;IA a rédigé le message. Cliquez sur <strong>&quot;Envoyer la relance manuelle&quot;</strong> à droite.
              </span>
            </div>
          )}
          {step === 3 && (
            <div className="flex flex-col items-center gap-1 animate-fade-in">
              <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5 uppercase font-semibold">
                Étape 3/3 : Collecte Active
              </span>
              <span className="text-xs text-emerald-800 font-light">
                Relance transmise ! Le syndic peut déposer sa pièce en 1 clic. Cliquez sur <strong>&quot;Recommencer&quot;</strong> dans le Mac.
              </span>
            </div>
          )}
        </div>

        {/* Outer alignment container */}
        <div className="w-full max-w-5xl relative flex justify-center items-center overflow-visible">
          
          {/* Responsive scaling helper layer */}
          <div className="scale-[0.45] sm:scale-[0.65] md:scale-[0.82] lg:scale-95 origin-center transition-transform duration-300 overflow-visible">
            
            {/* Scroll entry transition div */}
            <motion.div
              style={{
                y,
                scale,
                opacity
              }}
              className="relative w-[800px] aspect-[1972/1282] max-w-4xl flex items-center justify-center overflow-visible"
            >
              {/* Dynamic Camera Zoom & Pan layer */}
              <motion.div
                animate={{
                  scale: stepScale,
                  x: stepX,
                  y: stepY
                }}
                transition={{
                  type: "spring",
                  stiffness: 90,
                  damping: 22
                }}
                className="absolute inset-0 w-full h-full flex items-center justify-center overflow-visible"
              >
                {/* 1. Ambient drop shadow underneath the laptop base */}
                <div className="absolute bottom-[-15px] left-[8%] w-[84%] h-8 bg-black/20 blur-2xl rounded-full pointer-events-none z-0" />

                {/* 2. Interactive dashboard content inside the screen (z-0) */}
                <div className="absolute top-[11.7%] left-[11.71%] w-[76.52%] h-[76.52%] z-0 bg-white overflow-hidden rounded-[6px]">
                  <DashboardContent 
                    step={step} 
                    setStep={setStep} 
                    className="w-full h-full text-[10px]" 
                  />
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
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}
