"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionTemplate
} from "framer-motion";
import DashboardContent from "./DashboardContent";

/*
 * MACBOOK REVEAL — ON ENTRE DANS "VIVEZ L'EXPÉRIENCE NOTAS" (SÉQUENCE 5 PHASES)
 *
 *   Phase A (0% → 15%)  : Le portail (rectangle sombre) s'ouvre en clip-path.
 *                         Le texte émerge à l'intérieur, petit — vu de loin.
 *   Phase B (15% → 28%) : Immersion plein écran (l'overlay fixe couvre la navbar).
 *                         Le texte dérive lentement vers le spectateur (scale 1 → 1.1).
 *   Phase C (28% → 36%) : TRAVERSÉE — le texte accélère vers nous (scale → 2.2),
 *                         se floute et disparaît : on passe à travers.
 *   Phase D (35% → 58%) : Dé-zoom — la caméra recule, le cadre MacBook apparaît :
 *                         on était à l'intérieur de l'écran.
 *   Phase E (58% → 100%): MacBook statique pour l'onboarding interactif.
 *
 * Anti-flicker : le texte existe en 2 exemplaires (portail + overlay) pilotés par
 * les MÊMES MotionValues et centrés dans des conteneurs inset-0 identiques —
 * pendant que le sticky est engagé ils coïncident au pixel près, le handoff
 * portail → overlay est invisible. L'overlay est fixe pour couvrir la navbar.
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

  // --- Phase A : ouverture du portail (ease-out cubic pour un "bloom" naturel) ---
  const portalClip = useTransform(smoothProgress, (v: number) => {
    const t = Math.min(Math.max(v / 0.15, 0), 1);
    const e = 1 - Math.pow(1 - t, 3); // ease-out cubic
    const insetY = 28 * (1 - e); // 28% → 0%
    const insetX = 15 * (1 - e); // 15% → 0%
    const radius = 16 * (1 - e); // 16px → 0px
    return `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${radius}px)`;
  });

  // --- Overlay fixe (couvre la navbar) : opaque dès que le portail remplit
  //     l'écran, se lève pendant le dé-zoom ---
  const overlayOpacity = useTransform(
    smoothProgress,
    [0.13, 0.155, 0.35, 0.55],
    [0, 1, 1, 0]
  );

  // --- Texte immersif (valeurs PARTAGÉES entre portail et overlay) ---
  // Approche (0.72 → 1), dérive lente (1 → 1.1), traversée (1.1 → 2.2)
  const textScale = useTransform(
    smoothProgress,
    [0, 0.15, 0.28, 0.36],
    [0.72, 1, 1.1, 2.2]
  );
  const textOpacity = useTransform(
    smoothProgress,
    [0.01, 0.07, 0.29, 0.35],
    [0, 1, 1, 0]
  );
  const textBlurPx = useTransform(smoothProgress, [0.28, 0.36], [0, 14]);
  const textFilter = useMotionTemplate`blur(${textBlurPx}px)`;

  // --- Phase D : dé-zoom MacBook (on recule, on découvre l'écran) ---
  const scale = useTransform(smoothProgress, [0.36, 0.58, 1], [3, 1, 1]);
  const y = useTransform(smoothProgress, [0.36, 0.58, 1], ["2.5vh", "0px", "0px"]);
  const frameOpacity = useTransform(smoothProgress, [0.38, 0.5, 0.58], [0, 0.5, 1]);
  const macbookOpacity = useTransform(smoothProgress, [0.35, 0.42], [0, 1]);

  // --- Background reveal : le fond repasse du noir à la couleur de page ---
  const bgRevealOpacity = useTransform(smoothProgress, [0.36, 0.56], [0, 1]);

  // --- Titre de section : visible au départ, disparaît, revient après le reveal ---
  const titleOpacity = useTransform(
    smoothProgress,
    [0, 0.06, 0.12, 0.56, 0.63],
    [1, 1, 0, 0, 1]
  );
  const titleY = useTransform(smoothProgress, [0.56, 0.63], ["15px", "0px"]);
  // --- Instructions d'onboarding : seulement après le reveal du MacBook ---
  const instructionsOpacity = useTransform(smoothProgress, [0.62, 0.69], [0, 1]);

  // Texte immersif — même JSX rendu dans le portail ET dans l'overlay,
  // piloté par les mêmes MotionValues (handoff invisible au pixel près).
  const immersiveText = (
    <motion.h2
      style={{ opacity: textOpacity, scale: textScale, filter: textFilter }}
      className="font-serif text-white text-3xl md:text-5xl lg:text-6xl text-center leading-tight px-8 will-change-transform"
    >
      Vivez l&apos;expérience<br />
      <span className="italic text-emerald-400 font-light">NOTAS</span>
    </motion.h2>
  );

  // Halo émeraude discret derrière le texte — profondeur dans le noir
  const immersiveGlow = (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-[65vmin] h-[65vmin] rounded-full bg-emerald-500/[0.07] blur-[90px]" />
    </div>
  );

  return (
    <section
      ref={containerRef}
      id="simulator"
      className="relative h-[300vh] bg-[#FBFBFA] w-full overflow-visible"
    >
      {/* ═══ Overlay d'immersion fixe : noir + halo + texte (couvre la navbar) ═══ */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="fixed inset-0 z-[100] pointer-events-none"
      >
        <div className="absolute inset-0 bg-neutral-950" />
        {immersiveGlow}
        <div className="absolute inset-0 flex items-center justify-center">
          {immersiveText}
        </div>
      </motion.div>

      {/* Sticky viewport container */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-28 pb-12 px-8 bg-[#FBFBFA]">

        {/* Portail : rectangle sombre qui s'ouvre, texte émergeant à l'intérieur */}
        <motion.div
          style={{ clipPath: portalClip }}
          className="absolute inset-0 bg-neutral-950 z-[1] overflow-hidden"
        >
          {immersiveGlow}
          <div className="absolute inset-0 flex items-center justify-center">
            {immersiveText}
          </div>
        </motion.div>

        {/* Background reveal : recouvre le portail avec la couleur de page pendant le dé-zoom */}
        <motion.div
          style={{ opacity: bgRevealOpacity }}
          className="absolute inset-0 bg-[#FBFBFA] z-[2] pointer-events-none"
        />
        <motion.div style={{ opacity: titleOpacity, y: titleY }} className="text-center max-w-xl mx-auto mb-4 z-20">
          <span className="font-mono text-xs text-ash-light uppercase tracking-widest block mb-3">
            DÉMONSTRATION INTERACTIVE
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-normal">
            Votre fiche de suivi, <span className="italic text-emerald-700 font-light">en version vivante.</span>
          </h2>
          <motion.div style={{ opacity: instructionsOpacity }} className="h-12 mt-4 flex items-center justify-center text-sm font-light text-ash-text font-sans max-w-md mx-auto">
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
          </motion.div>
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
