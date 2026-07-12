"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import DashboardContent from "./DashboardContent";

/*
 * MACBOOK REVEAL — CINEMATIC DE-ZOOM REVEAL (4-PHASE SEQUENCE)
 *
 *   Phase 1 (0% → 5%):   Full-screen blackout fades in, covering navbar.
 *   Phase 2 (6% → 28%):  "Vivez l'expérience NOTAS" text fades in/out on black.
 *   Phase 3 (28% → 55%): Camera pulls back (de-zoom), MacBook frame appears.
 *   Phase 4 (55% → 100%): MacBook sits static for interactive onboarding.
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

  // --- Phase 1: Full-screen cinematic blackout (covers navbar) ---
  // Snaps to 1 almost instantly so navbar is covered the moment the section is in view
  const overlayOpacity = useTransform(smoothProgress, [0, 0.02, 0.30, 0.55], [0, 1, 1, 0]);

  // --- Phase 2: Immersive text on black ---
  const textOpacity = useTransform(smoothProgress, [0.06, 0.12, 0.20, 0.27], [0, 1, 1, 0]);

  // --- Phase 3: MacBook de-zoom ---
  const scale = useTransform(smoothProgress, [0.30, 0.55, 1], [3, 1, 1]);
  const y = useTransform(smoothProgress, [0.30, 0.55, 1], ["3vh", "0px", "0px"]);
  const frameOpacity = useTransform(smoothProgress, [0.32, 0.45, 0.55], [0, 0.5, 1]);

  // --- Background reveal: sticky bg transitions from black to page color ---
  const bgRevealOpacity = useTransform(smoothProgress, [0.30, 0.55], [0, 1]);

  // --- Phase 4: Section title fades in after MacBook is revealed ---
  const titleOpacity = useTransform(smoothProgress, [0.52, 0.60], [0, 1]);
  const titleY = useTransform(smoothProgress, [0.52, 0.60], ["15px", "0px"]);



  return (
    <section 
      ref={containerRef} 
      id="simulator" 
      className="relative h-[300vh] bg-black w-full overflow-visible"
    >
      {/* ═══ Cinematic full-screen black overlay (fixed = covers navbar) ═══ */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="fixed inset-0 bg-black z-[100] pointer-events-none"
      />

      {/* ═══ Centered immersive text on black screen ═══ */}
      <motion.div
        style={{ opacity: textOpacity }}
        className="fixed inset-0 z-[101] pointer-events-none flex items-center justify-center px-8"
      >
        <h2 className="font-serif text-white text-4xl md:text-6xl lg:text-7xl text-center leading-tight">
          Vivez l&apos;expérience<br />
          <span className="italic text-emerald-400 font-light">NOTAS</span>
        </h2>
      </motion.div>

      {/* Sticky viewport container */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-28 pb-12 px-8 bg-black">
        
        {/* Background reveal: transitions the sticky bg from black to page color */}
        <motion.div
          style={{ opacity: bgRevealOpacity }}
          className="absolute inset-0 bg-[#FBFBFA] z-0 pointer-events-none"
        />
        {/* Fixed Title & Description Area — hidden during zoom, fades in during de-zoom */}
        <motion.div style={{ opacity: titleOpacity, y: titleY }} className="text-center max-w-xl mx-auto mb-4 z-20">
          <span className="font-mono text-xs text-ash-light uppercase tracking-widest block mb-3">
            DÉMONSTRATION INTERACTIVE
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-normal">
            Votre fiche de suivi, <span className="italic text-emerald-700 font-light">en version vivante.</span>
          </h2>
          <div className="h-12 mt-4 flex items-center justify-center text-sm font-light text-ash-text font-sans max-w-md mx-auto">
            {step === 0 && (
              <p className="animate-fade-in text-ash-text">
                Découvrez notre copilote en action : cliquez sur le bouton dans l&apos;écran pour démarrer.
              </p>
            )}
            {step === 1 && (
              <p className="animate-fade-in text-neutral-800">
                <span className="font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5 mr-2 text-[10px] font-mono inline-block">Étape 1/3</span>
                NOTAS a détecté l&apos;État daté manquant. Cliquez sur la ligne verte <strong>&quot;Vente Martin&quot;</strong>.
              </p>
            )}
            {step === 2 && (
              <p className="animate-fade-in text-neutral-800">
                <span className="font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5 mr-2 text-[10px] font-mono inline-block">Étape 2/3</span>
                L&apos;IA a préparé le courrier. Cliquez sur <strong>&quot;Envoyer la relance manuelle&quot;</strong> à droite.
              </p>
            )}
            {step === 3 && (
              <p className="animate-fade-in text-emerald-800">
                <span className="font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5 mr-2 text-[10px] font-mono inline-block">Étape 3/3</span>
                Relance envoyée ! Cliquez sur <strong>&quot;Recommencer&quot;</strong> pour rejouer.
              </p>
            )}
          </div>
        </motion.div>

        {/* Outer alignment container */}
        <div className="w-full max-w-5xl relative flex justify-center items-center overflow-visible">
          
          {/* Responsive scaling helper layer */}
          <div className="scale-[0.45] sm:scale-[0.65] md:scale-[0.82] lg:scale-95 origin-center transition-transform duration-300 overflow-visible">
            
            {/* Scroll entry transition div */}
            <motion.div
              style={{
                y,
                scale,
                transformOrigin: '50% 40%',
              }}
              className="relative w-[800px] aspect-[1972/1282] max-w-4xl flex items-center justify-center overflow-visible"
            >
              {/* Shadows fade in with the MacBook frame during de-zoom reveal */}
              <motion.div style={{ opacity: frameOpacity }} className="absolute bottom-[0px] left-[7%] w-[86%] h-[1.5px] bg-black/[0.16] blur-[0.8px] rounded-sm pointer-events-none z-0" />
              <motion.div style={{ opacity: frameOpacity }} className="absolute bottom-[-3px] left-[9%] w-[82%] h-[5px] bg-neutral-950/[0.08] blur-[3.5px] rounded-md pointer-events-none z-0" />

              {/* 2. Interactive dashboard content inside the screen (z-0) */}
              <div className="absolute top-[11.3%] left-[11.3%] w-[77.4%] h-[77.4%] z-0 bg-black overflow-hidden rounded-[4px]">
                <DashboardContent 
                  step={step} 
                  setStep={setStep} 
                  className="w-full h-full text-[10px]" 
                />
              </div>

              {/* 3. Photorealistic MacBook frame image on top (z-10) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <motion.img
                src="/macbook-frame.png"
                alt=""
                style={{ opacity: frameOpacity }}
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
