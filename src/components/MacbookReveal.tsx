"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import DashboardContent from "./DashboardContent";

/*
 * MACBOOK REVEAL — DE-ZOOM REVEAL ("CAMERA PULLS BACK" EFFECT)
 *
 *   - Starts fully zoomed into the screen (scale ~4.5, dashboard fills viewport).
 *   - On scroll (0% → 40%), the camera pulls back (de-zoom) to reveal the MacBook chassis.
 *   - The MacBook frame PNG and shadows fade in during the pull-back (frameOpacity).
 *   - From 40% → 100%, the MacBook sits static for interactive onboarding.
 *   - transformOrigin is set to '50% 40%' so the zoom centers on the screen,
 *     not the geometric center of the image (which includes the keyboard below).
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

  // De-zoom reveal transforms (0% → 40% = camera pulls back, 40% → 100% = static)
  const y = useTransform(smoothProgress, [0, 0.4, 1], ["3vh", "0px", "0px"]);
  const scale = useTransform(smoothProgress, [0, 0.4, 1], [3, 1, 1]);
  // Frame & shadows fade in smoothly during the pull-back
  const frameOpacity = useTransform(smoothProgress, [0.05, 0.25, 0.4], [0, 0.4, 1]);
  // Title block hidden while zoomed in, fades in as MacBook settles
  const titleOpacity = useTransform(smoothProgress, [0, 0.3, 0.42], [0, 0, 1]);
  const titleY = useTransform(smoothProgress, [0.3, 0.42], ["15px", "0px"]);
  // Full-screen black overlay: solid black at start, fades out as MacBook is revealed
  const overlayOpacity = useTransform(smoothProgress, [0.15, 0.4], [1, 0]);



  return (
    <section 
      ref={containerRef} 
      id="simulator" 
      className="relative h-[250vh] bg-transparent w-full overflow-visible"
    >
      {/* Sticky viewport container */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-28 pb-12 px-8">
        
        {/* Full-screen black backdrop — covers entire viewport for a seamless start */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-black z-[1] pointer-events-none"
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
