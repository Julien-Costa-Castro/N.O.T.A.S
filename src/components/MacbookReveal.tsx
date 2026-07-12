"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import DashboardContent from "./DashboardContent";

/*
 * MACBOOK REVEAL — CINEMATIC PORTAL ENTRY + DE-ZOOM REVEAL (5-PHASE SEQUENCE)
 *
 *   Phase 0 (0% → 15%):  A dark rectangle (portal) expands via clip-path to fill the viewport.
 *   Phase 1 (15% → 17%):  Overlay covers navbar.
 *   Phase 2 (17% → 33%):  "Vivez l'expérience NOTAS" text on black.
 *   Phase 3 (35% → 55%):  Camera pulls back (de-zoom), MacBook frame appears.
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

  // --- Phase 0: Portal expansion (dark rectangle grows to fill viewport via clip-path) ---
  const portalClip = useTransform(smoothProgress, (v: number) => {
    const t = Math.min(Math.max(v / 0.15, 0), 1); // map 0→0.15 to 0→1
    const insetY = 28 * (1 - t);   // 28% → 0%
    const insetX = 15 * (1 - t);   // 15% → 0%
    const radius = 16 * (1 - t);   // 16px → 0px
    return `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${radius}px)`;
  });

  // --- Phase 1: Overlay covers navbar once portal has filled the viewport ---
  const overlayOpacity = useTransform(smoothProgress, [0.14, 0.16, 0.35, 0.55], [0, 1, 1, 0]);

  // --- Text inside the portal: visible from start, fades out before de-zoom ---
  const portalTextOpacity = useTransform(smoothProgress, [0, 0.25, 0.28, 0.33], [1, 1, 1, 0]);

  // --- Phase 3: MacBook de-zoom ---
  const scale = useTransform(smoothProgress, [0.35, 0.55, 1], [3, 1, 1]);
  const y = useTransform(smoothProgress, [0.35, 0.55, 1], ["3vh", "0px", "0px"]);
  const frameOpacity = useTransform(smoothProgress, [0.37, 0.48, 0.55], [0, 0.5, 1]);
  const macbookOpacity = useTransform(smoothProgress, [0.33, 0.38], [0, 1]);

  // --- Background reveal: portal bg transitions to page color ---
  const bgRevealOpacity = useTransform(smoothProgress, [0.35, 0.55], [0, 1]);

  // --- Section title: visible at start above portal, fades out, reappears after reveal ---
  const titleOpacity = useTransform(smoothProgress, [0, 0.06, 0.12, 0.53, 0.60], [1, 1, 0, 0, 1]);
  const titleY = useTransform(smoothProgress, [0.53, 0.60], ["15px", "0px"]);



  return (
    <section 
      ref={containerRef} 
      id="simulator" 
      className="relative h-[300vh] bg-[#FBFBFA] w-full overflow-visible"
    >
      {/* ═══ Cinematic full-screen black overlay (fixed = covers navbar) ═══ */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="fixed inset-0 bg-black z-[100] pointer-events-none"
      />

      {/* Sticky viewport container */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-28 pb-12 px-8 bg-[#FBFBFA]">
        
        {/* Portal: expanding dark rectangle with text inside */}
        <motion.div
          style={{ clipPath: portalClip }}
          className="absolute inset-0 bg-neutral-950 z-[1] flex items-center justify-center"
        >
          <motion.h2
            style={{ opacity: portalTextOpacity }}
            className="font-serif text-white text-3xl md:text-5xl lg:text-6xl text-center leading-tight px-8"
          >
            Vivez l&apos;expérience<br />
            <span className="italic text-emerald-400 font-light">NOTAS</span>
          </motion.h2>
        </motion.div>
        
        {/* Background reveal: covers the portal with page color during de-zoom */}
        <motion.div
          style={{ opacity: bgRevealOpacity }}
          className="absolute inset-0 bg-[#FBFBFA] z-[2] pointer-events-none"
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
        <motion.div style={{ opacity: macbookOpacity }} className="w-full max-w-5xl relative flex justify-center items-center overflow-visible z-[5]">
          
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
        </motion.div>

      </div>
    </section>
  );
}
