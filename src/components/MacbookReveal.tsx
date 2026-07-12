"use client";

import React from "react";
import { motion, MotionValue, useTransform } from "framer-motion";
import DashboardContent from "./DashboardContent";

/*
 * MACBOOK REVEAL — ILLUSION 3D EN CSS PUR (Framer Motion)
 *
 * Architecture en 2 couches superposées :
 *   - Couche arrière (z-0)  : <DashboardContent /> en absolute, calé en % à
 *     l'intérieur de la fenêtre d'écran TRANSPARENTE de l'image du MacBook.
 *   - Couche avant  (z-10)  : /macbook-frame.png en pointer-events-none →
 *     on clique "à travers" le cadre, le dashboard reste interactif.
 *
 * Calibrage mesuré au pixel sur l'image (1972×1282, fenêtre écran
 * transparente x 231→1740, y 150→1131, hors encoche caméra) :
 *   left 11.71 % · top 11.70 % · width 76.52 % · height 76.52 %
 *
 * Animation scroll (valeurs du brief) : rotateX 50° → 0°, scale 0.85 → 1,
 * opacity 0 → 1 sur les premiers 20 % — origine bas-centre, perspective
 * 2500 px sur le parent. `smoothProgress` est déjà lissé par useSpring
 * (stiffness 100, damping 30) au niveau de la section.
 */

export default function MacbookReveal({
  smoothProgress
}: {
  smoothProgress: MotionValue<number>;
}) {
  const rotateX = useTransform(smoothProgress, [0, 0.55], [50, 0]);
  const scale = useTransform(smoothProgress, [0, 0.55], [0.85, 1]);
  const opacity = useTransform(smoothProgress, [0, 0.2], [0, 1]);

  return (
    /* Parent : la perspective qui crée l'illusion 3D */
    <div className="w-full max-w-5xl mx-auto" style={{ perspective: "2500px" }}>
      <motion.div
        style={{
          rotateX,
          scale,
          opacity,
          transformOrigin: "bottom center",
          transformStyle: "preserve-3d"
        }}
        className="relative w-full aspect-[1972/1282]"
      >
        {/* Couche arrière (z-0) : le dashboard, interactif, calé dans la
            fenêtre d'écran transparente du cadre */}
        <div className="absolute top-[11.7%] left-[11.71%] w-[76.52%] h-[76.52%] z-0 bg-white overflow-hidden rounded-[6px]">
          <DashboardContent className="w-full h-full" />
        </div>

        {/* Couche avant (z-10) : le cadre MacBook — clics traversants */}
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
  );
}
