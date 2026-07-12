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



  return (
    <section 
      ref={containerRef} 
      id="simulator" 
      className="relative h-[140vh] bg-transparent w-full overflow-visible"
    >
      {/* Sticky viewport container */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-28 pb-12 px-8">
        
        {/* Fixed Title & Description Area */}
        <div className="text-center max-w-xl mx-auto mb-4 z-20">
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
              {/* Ultra-subtle Premium MacBook Shadows */}
              {/* 1. Faint contact shadow to ground the very center of the base */}
              <div className="absolute bottom-[0px] left-[12%] w-[76%] h-[2px] bg-black/[0.08] blur-[1.5px] rounded-full pointer-events-none z-0" />
              
              {/* 2. Soft, highly transparent ambient occlusion to blend the metal base into the background */}
              <div className="absolute bottom-[-4px] left-[8%] w-[84%] h-[8px] bg-neutral-950/[0.03] blur-[8px] rounded-full pointer-events-none z-0" />

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
