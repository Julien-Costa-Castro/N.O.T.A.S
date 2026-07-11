"use client";

import React, { useEffect, useRef, useState } from "react";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useInView, 
  useMotionValue,
  AnimatePresence
} from "framer-motion";
import { 
  FileText, Shield, ArrowRight, CheckCircle2, 
  Cpu, Lock, Clock, Send, Database, FileCheck, Layers, Sparkles, Building, UserCheck
} from "lucide-react";

// Noble Bezier Transition Curve (Apple/Stripe Inspired)
const EASE_ETHEREAL: [number, number, number, number] = [0.76, 0, 0.24, 1];
const TRANSITION_NOBLE = { ease: EASE_ETHEREAL, duration: 1.2 };

// Custom Spring Counter Component
const SpringCounter = ({ targetValue }: { targetValue: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 35, damping: 12 });
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionValue.set(targetValue);
    }
  }, [isInView, motionValue, targetValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      setDisplayCount(Math.round(latest));
    });
  }, [springValue]);

  return <span ref={ref}>{displayCount}</span>;
};

export default function Home() {
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const ocrSectionRef = useRef<HTMLDivElement>(null);
  const footerSectionRef = useRef<HTMLDivElement>(null);

  // Scroll calculations
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroContainerRef,
    offset: ["start start", "end start"]
  });

  const { scrollYProgress: ocrScroll } = useScroll({
    target: ocrSectionRef,
    offset: ["start end", "end start"]
  });

  const { scrollYProgress: footerScroll } = useScroll({
    target: footerSectionRef,
    offset: ["start end", "end start"]
  });

  // Parallax elements
  const heroTextY = useTransform(heroScroll, [0, 1], [0, -40]);
  const heroDescY = useTransform(heroScroll, [0, 1], [0, -20]);
  const heroImageY = useTransform(heroScroll, [0, 1], [0, 80]);
  const heroCardY = useTransform(heroScroll, [0, 1], [0, -30]);
  const footerTextY = useTransform(footerScroll, [0, 1], [0, 80]);
  
  // OCR Schema Line Drawing
  const pathLength = useTransform(ocrScroll, [0.15, 0.55], [0, 1]);
  const heroScrollLength = useTransform(heroScroll, [0, 0.65], [0, 1]);

  // Bento state triggers
  const timelineRef = useRef(null);
  const timelineInView = useInView(timelineRef, { once: true, margin: "-50px" });

  const [eligibilityCode, setEligibilityCode] = useState("");
  const [eligibilityStatus, setEligibilityStatus] = useState<string | null>(null);

  // States for automated simulator loop
  const [simPhase, setSimPhase] = useState<"idle" | "moving" | "dragging" | "scanning" | "completed">("idle");
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (simPhase === "idle") {
      timeout = setTimeout(() => setSimPhase("moving"), 1500);
    } else if (simPhase === "moving") {
      timeout = setTimeout(() => setSimPhase("dragging"), 1300);
    } else if (simPhase === "dragging") {
      timeout = setTimeout(() => setSimPhase("scanning"), 1300);
    } else if (simPhase === "completed") {
      timeout = setTimeout(() => {
        setSimPhase("idle");
        setScanProgress(0);
      }, 6000); // Stays completed for 6 seconds to let user view
    }

    return () => clearTimeout(timeout);
  }, [simPhase]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (simPhase === "scanning") {
      setScanProgress(0);
      interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setSimPhase("completed");
            return 100;
          }
          return prev + 4;
        });
      }, 80);
    }
    return () => clearInterval(interval);
  }, [simPhase]);

  const checkEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eligibilityCode.trim()) return;
    
    const code = parseInt(eligibilityCode, 10);
    if (!isNaN(code) && code > 0) {
      setEligibilityStatus("eligible");
    } else {
      setEligibilityStatus("invalid");
    }
  };

  const marqueeItems = [
    "COMPROMIS DE VENTE",
    "ACTE AUTHENTIQUE",
    "DIAGNOSTICS TECHNIQUES",
    "ÉTATS DATÉS",
    "OFFRES DE PRÊT",
    "COMPROMIS"
  ];
  return (
    <div className="relative min-h-screen bg-[#FBFBFA] text-[#111111] selection:bg-neutral-900/5 selection:text-[#111111] overflow-hidden">
      
      {/* Structural Architectural Background & Noise */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Subtle Matte Paper Noise Overlay */}
        <div className="absolute inset-0 bg-noise opacity-[0.01]" />
        
        {/* Soft Lin/Albâtre Ambient Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#EFECE6]/25 filter blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#E8E6E0]/20 filter blur-[140px]" />
        <div className="absolute top-[40%] left-[50%] w-[40%] h-[40%] rounded-full bg-[#F3F2EE]/30 filter blur-[100px]" />

        {/* 4 Architectural Vertical Grid Lines */}
        <div className="absolute inset-0 flex justify-between max-w-7xl mx-auto px-8">
          <div className="w-px h-full bg-black/[0.02]" />
          <div className="w-px h-full bg-black/[0.02] hidden md:block" />
          <div className="w-px h-full bg-black/[0.02] hidden md:block" />
          <div className="w-px h-full bg-black/[0.02]" />
        </div>
      </div>

      {/* 1. Header / Navbar */}
      <motion.header 
        className="fixed top-0 w-full z-50 bg-[#FBFBFA]/80 backdrop-blur-lg border-b border-gray-200/60"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={TRANSITION_NOBLE}
      >
        <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-3xl md:text-4xl font-normal tracking-[0.12em] text-[#111111] font-serif">
              NOTAS
            </span>
            <span className="text-[10px] text-gray-400 font-sans tracking-widest ml-1 hidden sm:inline">
              | SUPERVISION DES VENTES
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-sans">
            <a href="#ocr" className="text-sm text-gray-500 hover:text-black transition-colors duration-300">Technologie</a>
            <a href="#simulator" className="text-sm text-gray-500 hover:text-black transition-colors duration-300">Simulation</a>
            <a href="#bento" className="text-sm text-gray-500 hover:text-black transition-colors duration-300">Garanties</a>
            <a href="#footer" className="text-sm text-gray-500 hover:text-black transition-colors duration-300">Éligibilité</a>
          </nav>

          <motion.a 
            href="#footer"
            className="px-6 py-2.5 rounded-lg bg-[#111111] text-white text-sm font-medium hover:bg-neutral-800 transition-colors duration-300 font-sans"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Demander une démo
          </motion.a>
        </div>
      </motion.header>

      {/* 1b. Translucent Infinite Marquee Banner (Data Ethereal) */}
      <div className="fixed top-24 w-full z-40 bg-[#FBFBFA]/75 backdrop-blur-md border-b border-gray-100/40 py-3 overflow-hidden flex items-center">
        <div className="marquee-content animate-marquee-slow flex items-center gap-16 text-[9px] tracking-[0.25em] text-[#888888] font-mono whitespace-nowrap">
          {marqueeItems.concat(marqueeItems).concat(marqueeItems).map((item, idx) => (
            <div key={idx} className="flex items-center gap-16 flex-shrink-0">
              <span>{item}</span>
              <span className="text-[10px] text-neutral-300">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Hero Section ("L'Équilibre Spatial") */}
      <section 
        ref={heroContainerRef}
        className="relative min-h-[95vh] flex flex-col justify-center pt-36 px-8 max-w-7xl mx-auto"
      >
        {/* Background SVG OCR Flow (Data Ethereal) */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.18] flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 1200 600" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              d="M 100 300 L 400 300"
              fill="none"
              stroke="#111111"
              strokeWidth="2.5"
              style={{ pathLength: heroScrollLength }}
            />
            <motion.path
              d="M 400 300 C 550 300 550 150 750 150"
              fill="none"
              stroke="#111111"
              strokeWidth="2.5"
              style={{ pathLength: heroScrollLength }}
            />
            <motion.path
              d="M 400 300 L 750 300"
              fill="none"
              stroke="#111111"
              strokeWidth="2.5"
              style={{ pathLength: heroScrollLength }}
            />
            <motion.path
              d="M 400 300 C 550 300 550 450 750 450"
              fill="none"
              stroke="#111111"
              strokeWidth="2.5"
              style={{ pathLength: heroScrollLength }}
            />

            <circle cx="100" cy="300" r="7" fill="#111111" />
            <text x="100" y="325" fontSize="9" fontFamily="monospace" textAnchor="middle" fill="#111111" letterSpacing="2">COMPROMIS BRUT</text>

            <circle cx="400" cy="300" r="11" fill="#111111" />
            <text x="400" y="330" fontSize="9" fontFamily="monospace" textAnchor="middle" fill="#111111" fontWeight="bold" letterSpacing="2">PRISME NOTAS</text>

            <circle cx="750" cy="150" r="6" fill="#111111" />
            <text x="765" y="154" fontSize="9" fontFamily="monospace" fill="#111111" letterSpacing="1">EXTRACTION DATA</text>

            <circle cx="750" cy="300" r="6" fill="#111111" />
            <text x="765" y="304" fontSize="9" fontFamily="monospace" fill="#111111" letterSpacing="1">CHECKLIST PIÈCES</text>

            <circle cx="750" cy="450" r="6" fill="#111111" />
            <text x="765" y="454" fontSize="9" fontFamily="monospace" fill="#111111" letterSpacing="1">RELANCE AUTONOME</text>
          </svg>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Copywriting Left */}
          <div className="lg:col-span-6 space-y-8">
            <motion.div
              style={{ y: heroTextY }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={TRANSITION_NOBLE}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#111111]/5 border border-[#111111]/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
                <span className="text-[9px] font-mono tracking-widest text-[#111111] uppercase font-semibold">
                  Infrastructure de Prestige pour Ventes Immobilières
                </span>
              </div>

              <h1 className="font-serif text-5xl md:text-7xl font-normal text-[#111111] tracking-tight leading-[1.08]">
                La clarté juridique, <br />
                <span className="italic font-light text-neutral-500">portée par l&apos;intelligence.</span>
              </h1>
            </motion.div>

            <motion.div
              style={{ y: heroDescY }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...TRANSITION_NOBLE, delay: 0.2 }}
              className="space-y-6"
            >
              <p className="text-base md:text-lg text-ash-text max-w-lg leading-relaxed font-sans font-light">
                NOTAS décharge vos collaborateurs de la charge mentale des relances. Notre infrastructure examine vos pièces justificatives de vente par vision artificielle autonome, éliminant la double saisie et sécurisant vos signatures d&apos;actes sans aucune connexion réseau intrusive à vos serveurs.
              </p>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold tracking-wider font-sans">8 000 € HT</span>
                  <span className="text-[10px] font-mono text-ash-light uppercase">Setup d&apos;Infrastructure</span>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold tracking-wider font-sans">100% OCR</span>
                  <span className="text-[10px] font-mono text-ash-light uppercase">Ingestion Sécurisée</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Parallax Image & Frosted Glass Card Right */}
          <div className="lg:col-span-6 relative flex items-center justify-center h-[520px] w-full">
            <div className="relative w-[90%] h-[480px]">
              
              {/* Parallax Background Study Image */}
              <motion.div 
                style={{ y: heroImageY }}
                transition={TRANSITION_NOBLE}
                className="w-full h-full rounded-lg overflow-hidden border border-gray-100 shadow-luxe"
              >
                <img 
                  src="/notary_study_hero.png" 
                  alt="Architecture épurée d'une étude notariale moderne" 
                  className="w-full h-full object-cover filter saturate-[0.85] contrast-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FDFDFD]/20 to-transparent pointer-events-none" />
              </motion.div>

              {/* Overlaid Frosted Glass Status Card */}
              <motion.div 
                style={{ y: heroCardY }}
                className="absolute bottom-10 -left-6 glass-card rounded-lg p-6 w-80 shadow-xl z-20 flex flex-col justify-between"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...TRANSITION_NOBLE, delay: 0.3 }}
              >
                <div className="flex items-center justify-between border-b border-black/[0.05] pb-3 mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-ash-light">
                    NOTAS SECURE ENGINE
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-mono text-emerald-600 font-semibold tracking-wider bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                      CONFORME
                    </span>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-ash-text">Dossier</span>
                    <span className="font-medium text-neutral-800">Vente SCI Martin</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-ash-text">Vision Optique</span>
                    <span className="font-mono text-ash-text text-neutral-700">Lecture OCR validée</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-ash-text">Conformité Acte</span>
                    <span className="font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 100% Conforme
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-black/[0.05] flex justify-between items-center text-[9px] font-mono text-ash-light">
                  <span>INGESTION : VALIDÉE</span>
                  <span>SHA-256 SECURED</span>
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Bandeau Défilant Infini (Infinite Marquee) */}
      <section className="relative overflow-hidden w-full py-8 border-y border-stone-gray bg-[#FDFDFD] my-16 flex items-center">
        <div className="marquee-content animate-marquee flex items-center gap-16 text-xs tracking-[0.25em] text-ash-light font-sans whitespace-nowrap">
          {marqueeItems.concat(marqueeItems).map((item, idx) => (
            <div key={idx} className="flex items-center gap-16 flex-shrink-0">
              <span className="uppercase">{item}</span>
              <span className="text-[10px]">•</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Section "Le Schéma Dynamique de l'OCR" */}
      <section 
        id="ocr"
        ref={ocrSectionRef}
        className="py-32 px-8 max-w-7xl mx-auto border-b border-gray-200/60"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Dynamic SVG Schema Left */}
          <div className="lg:col-span-7 bg-white/50 backdrop-blur-md rounded-2xl p-4 h-[480px] flex items-center justify-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100/60 relative">
            <svg className="w-full h-full max-w-4xl" viewBox="0 0 1000 480" xmlns="http://www.w3.org/2000/svg">
              {/* Path 1: Source to Prisme */}
              <motion.path
                d="M 270 240 L 410 240"
                fill="none"
                stroke="rgba(17, 17, 17, 0.4)"
                strokeWidth="1.5"
                strokeDasharray="4,4"
                style={{ pathLength }}
              />

              {/* Path 2: Prisme to Output 1 (Top) */}
              <motion.path
                d="M 590 240 C 660 240 660 90 730 90"
                fill="none"
                stroke="#111111"
                strokeWidth="1.5"
                style={{ pathLength }}
              />

              {/* Path 3: Prisme to Output 2 (Middle) */}
              <motion.path
                d="M 590 240 L 730 240"
                fill="none"
                stroke="#111111"
                strokeWidth="1.5"
                style={{ pathLength }}
              />

              {/* Path 4: Prisme to Output 3 (Bottom) */}
              <motion.path
                d="M 590 240 C 660 240 660 390 730 390"
                fill="none"
                stroke="#111111"
                strokeWidth="1.5"
                style={{ pathLength }}
              />

              {/* Node Left 1: Compromis scanné */}
              <foreignObject x="50" y="60" width="220" height="60">
                <div className="flex items-center gap-3 bg-white/70 border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)] px-4 py-2.5 rounded-xl w-full h-full font-sans">
                  <FileText className="w-5 h-5 text-neutral-500" />
                  <span className="text-sm md:text-base font-semibold text-neutral-800">Compromis scanné</span>
                </div>
              </foreignObject>

              {/* Node Left 2: Diagnostics */}
              <foreignObject x="50" y="210" width="220" height="60">
                <div className="flex items-center gap-3 bg-white/70 border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)] px-4 py-2.5 rounded-xl w-full h-full font-sans">
                  <FileText className="w-5 h-5 text-neutral-500" />
                  <span className="text-sm md:text-base font-semibold text-neutral-800">Diagnostics techniques</span>
                </div>
              </foreignObject>

              {/* Node Left 3: Etats Datés */}
              <foreignObject x="50" y="360" width="220" height="60">
                <div className="flex items-center gap-3 bg-white/70 border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)] px-4 py-2.5 rounded-xl w-full h-full font-sans">
                  <FileText className="w-5 h-5 text-neutral-500" />
                  <span className="text-sm md:text-base font-semibold text-neutral-800">États datés</span>
                </div>
              </foreignObject>

              {/* Central Node (NOTAS Intelligent Parser Engine) */}
              <foreignObject x="410" y="125" width="180" height="230">
                <div className="flex flex-col items-center justify-center w-full h-full relative">
                  
                  {/* Subtle soft glowing back blur */}
                  <div className="absolute w-36 h-36 bg-emerald-500/[0.04] rounded-full blur-lg top-[10px]" />

                  {/* Outer Ring: solid perle-gray, rotating counter-clockwise */}
                  <motion.div 
                    className="absolute w-44 h-44 border border-black/[0.04] rounded-full top-[2px] left-[2px]"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                  />

                  {/* Middle Ring: dashed perle-gray, rotating clockwise */}
                  <motion.div 
                    className="absolute w-36 h-36 border border-dashed border-neutral-300 rounded-full top-[18px] left-[18px]"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  />

                  {/* Center Core: glassmorphic white circle with CPU icon */}
                  <div className="w-24 h-24 bg-white border border-gray-150 rounded-full flex items-center justify-center shadow-md z-10 absolute top-[42px] left-[42px]">
                    <Cpu className="w-8 h-8 text-emerald-700 animate-pulse" />
                  </div>

                  <span className="text-xs md:text-sm font-mono tracking-widest text-[#111111] uppercase font-bold absolute bottom-0 text-center w-full">
                    PRISME OPTIQUE
                  </span>
                </div>
              </foreignObject>

              {/* Node Right 1: Output 1 */}
              <foreignObject x="730" y="55" width="220" height="70">
                <div className="bg-white/70 border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)] px-5 py-3 rounded-xl w-full h-full flex flex-col justify-center font-sans">
                  <span className="text-[11px] md:text-xs font-mono text-ash-light uppercase block mb-1 font-bold">FLUX_01</span>
                  <span className="text-sm md:text-base font-semibold text-neutral-800">Extraction des clauses</span>
                </div>
              </foreignObject>

              {/* Node Right 2: Output 2 */}
              <foreignObject x="730" y="205" width="220" height="70">
                <div className="bg-white/70 border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)] px-5 py-3 rounded-xl w-full h-full flex flex-col justify-center font-sans">
                  <span className="text-[11px] md:text-xs font-mono text-ash-light uppercase block mb-1 font-bold">FLUX_02</span>
                  <span className="text-sm md:text-base font-semibold text-neutral-800">Détection des pièces</span>
                </div>
              </foreignObject>

              {/* Node Right 3: Output 3 */}
              <foreignObject x="730" y="355" width="220" height="70">
                <div className="bg-white/70 border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)] px-5 py-3 rounded-xl w-full h-full flex flex-col justify-center font-sans">
                  <span className="text-[11px] md:text-xs font-mono text-ash-light uppercase block mb-1 font-bold">FLUX_03</span>
                  <span className="text-sm md:text-base font-semibold text-neutral-800">Relances autonomes</span>
                </div>
              </foreignObject>

            </svg>
          </div>

          {/* Copywriting Right (La Preuve) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="font-mono text-xs text-ash-light uppercase tracking-widest block mb-3">
                L&apos;EFFICACITÉ JURIDIQUE
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-normal leading-tight">
                L&apos;excellence par la <span className="italic text-emerald-700 font-light">mesure du temps.</span>
              </h2>
              <p className="text-ash-text text-sm font-light leading-relaxed mt-4 font-sans">
                Les clercs de notaire consacrent en moyenne <strong>60% de leur temps de closing</strong> aux relances manuelles des pièces justificatives. NOTAS automatise cette veille pour éviter la péremption des offres de prêt, en lisant directement les actes bruts scannés.
              </p>
            </div>

            {/* Premium Table */}
            <div className="border-t border-gray-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 font-mono text-[9px] text-ash-light uppercase">
                    <th className="py-3 font-normal">Contrôle de conformité</th>
                    <th className="py-3 font-normal text-right">Temps Humain</th>
                    <th className="py-3 font-normal text-right text-[#111111] font-semibold">Avec NOTAS</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-sans">
                  <tr className="border-b border-gray-100">
                    <td className="py-3 text-ash-text">Extraction des clauses d&apos;actes</td>
                    <td className="py-3 text-right text-ash-light">45 min</td>
                    <td className="py-3 text-right font-medium text-[#111111]">12 sec</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 text-ash-text">Vérification des justificatifs</td>
                    <td className="py-3 text-right text-ash-light">30 min</td>
                    <td className="py-3 text-right font-medium text-[#111111]">8 sec</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 text-ash-text">Relance des syndics et tiers</td>
                    <td className="py-3 text-right text-ash-light">2 heures</td>
                    <td className="py-3 text-right font-medium text-[#111111]">1 min</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 text-ash-text">Contrôle RGPD des pièces</td>
                    <td className="py-3 text-right text-ash-light">1 heure</td>
                    <td className="py-3 text-right font-medium text-[#111111]">15 sec</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>
      {/* 5. Section Console de Simulation Interactive & n8n Workflow */}
      <section id="simulator" className="py-32 px-8 border-b border-gray-200/60 bg-transparent max-w-7xl mx-auto">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-xl mx-auto">
            <span className="font-mono text-xs text-ash-light uppercase tracking-widest block mb-3">
              DÉMONSTRATION AUTONOME
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-normal">
              De l&apos;ingestion <span className="italic text-emerald-700 font-light">aux relances.</span>
            </h2>
            <p className="text-ash-text text-sm font-light leading-relaxed mt-4 font-sans">
              Visualisez le fonctionnement en continu de l&apos;infrastructure NOTAS : du dépôt de l&apos;acte par le clerc de notaire à la transmission automatisée des relances n8n.
            </p>
          </div>

          {/* Grid: Console dropzone & Relances status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left: Drag & Drop Zone */}
            <div className="bg-white/50 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] flex flex-col justify-between h-[380px] relative">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Database className="w-4 h-4 text-neutral-600" />
                  <span className="font-mono text-[9px] tracking-wider text-ash-light uppercase font-bold">
                    Console d&apos;ingestion OCR
                  </span>
                </div>
                <p className="text-ash-text text-xs font-light mb-6 font-sans">
                  Le dépôt sécurisé lit instantanément les PDF d&apos;actes, extrait les métadonnées et prépare les variables pour les relances.
                </p>
              </div>

              {/* Ingestion Simulator Dropzone */}
              <div className="relative w-full h-[220px] bg-white border border-gray-100 rounded-lg p-5 shadow-inner overflow-hidden flex items-center justify-between">
                
                {/* Fake Cursor Pointer */}
                <motion.div
                  variants={{
                    idle: { x: 260, y: 150, scale: 1 },
                    moving: { x: 50, y: 70, scale: 1 },
                    dragging: { x: 235, y: 70, scale: 0.85 },
                    scanning: { x: 300, y: 150, scale: 1 },
                    completed: { x: 300, y: 150, scale: 1 }
                  }}
                  animate={simPhase}
                  transition={{ ease: EASE_ETHEREAL, duration: 1.2 }}
                  className="absolute left-0 top-0 z-40 pointer-events-none w-6 h-6 text-black"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 drop-shadow-md" fill="currentColor">
                     <path d="M7 2v17.586l3.293-3.293 2.707 6.414 2-1-2.707-6.414H19L7 2z" stroke="white" strokeWidth="1.5" />
                  </svg>
                </motion.div>

                {/* Left Area: Local computer reference layout */}
                <div className="flex flex-col items-center gap-1.5 w-[110px] pl-2 z-10 pointer-events-none">
                  <span className="text-[8px] font-mono text-ash-light uppercase tracking-wider">Votre Ordinateur</span>
                  <div className="w-24 h-32 border border-dashed border-gray-200 rounded bg-[#FBFBFA]/50" />
                </div>

                {/* Draggable/Animated Act PDF Card */}
                <motion.div
                  variants={{
                    idle: { x: 0, y: 0, scale: 1, opacity: 1 },
                    moving: { x: 0, y: 0, scale: 1, opacity: 1 },
                    dragging: { x: 195, y: 0, scale: 0.92, opacity: 0.8 },
                    scanning: { x: 195, y: 0, scale: 0.95, opacity: 0 },
                    completed: { x: 195, y: 0, scale: 0.95, opacity: 0 }
                  }}
                  animate={simPhase}
                  transition={{ ease: EASE_ETHEREAL, duration: 1.2 }}
                  className="absolute left-7 top-10 w-24 h-32 bg-white border border-gray-150 shadow-[0_12px_24px_rgba(0,0,0,0.04)] rounded-xl p-2.5 flex flex-col justify-between z-20 pointer-events-none"
                >
                  <div className="flex justify-between items-start">
                    <FileText className="w-7 h-7 text-neutral-500" />
                    <span className="text-[7px] font-mono text-ash-light">PDF</span>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-semibold truncate font-sans">Acte_Martin.pdf</p>
                    <p className="text-[7px] text-ash-light font-mono">4.2 Mo</p>
                  </div>
                </motion.div>

                {/* Center arrow / drag cue */}
                {simPhase === "idle" && (
                  <div className="flex-1 flex flex-col items-center justify-center text-ash-light gap-1.5 pointer-events-none">
                    <ArrowRight className="w-4 h-4 animate-pulse text-neutral-400" />
                    <span className="text-[8px] font-mono tracking-wider uppercase text-center">Transfert en cours</span>
                  </div>
                )}

                {/* Right Area: NOTAS OCR Dropzone */}
                <div className={`w-[180px] h-[160px] rounded border-2 border-dashed flex flex-col items-center justify-center p-3.5 transition-all duration-500 relative ${
                  simPhase === "scanning" ? "border-emerald-500/50 bg-emerald-50/5" :
                  simPhase === "completed" ? "border-emerald-500 bg-emerald-50/10" :
                  "border-gray-200 bg-neutral-50/30"
                }`}>
                  {(simPhase === "idle" || simPhase === "moving" || simPhase === "dragging") && (
                    <div className="text-center space-y-1.5 pointer-events-none">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center mx-auto text-gray-400 border border-gray-100">
                        <Layers className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] text-ash-light block">Zone de dépôt NOTAS</span>
                    </div>
                  )}

                  {/* Analyzing progress state */}
                  {simPhase === "scanning" && (
                    <div className="w-full h-full flex flex-col justify-between relative overflow-hidden pointer-events-none">
                      <div className="flex items-center justify-between text-[8px] font-mono text-emerald-600">
                        <span>PRISME OPTIQUE</span>
                        <span>{scanProgress}%</span>
                      </div>

                      {/* Scan Laser effect */}
                      <motion.div 
                        className="absolute left-0 right-0 h-[1.5px] bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)] z-10"
                        animate={{ top: ["10%", "90%", "10%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      />

                      <div className="my-auto text-center space-y-2">
                        <span className="text-[10px] font-medium block font-sans">Lecture des pièces...</span>
                        <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full transition-all duration-100" style={{ width: `${scanProgress}%` }} />
                        </div>
                      </div>
                      <span className="text-[7px] font-mono text-ash-light text-center">NUMÉRISATION SÉCURISÉE</span>
                    </div>
                  )}

                  {/* Analysis completed state */}
                  {simPhase === "completed" && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full h-full flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between text-[8px] font-mono text-emerald-600">
                        <span>INGESTION COMPLÈTE</span>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-1 py-1 font-sans">
                        <div className="flex justify-between text-[9px] border-b border-gray-100 pb-0.5">
                          <span className="text-ash-light">Vendeur:</span>
                          <span className="font-semibold text-neutral-800">Rivoli Immobilier</span>
                        </div>
                        <div className="flex justify-between text-[9px] border-b border-gray-100 pb-0.5">
                          <span className="text-ash-light">Prix d&apos;Acte:</span>
                          <span className="font-semibold text-neutral-800">840 000 €</span>
                        </div>
                        <div className="flex justify-between text-[9px]">
                          <span className="text-ash-light">Syndic:</span>
                          <span className="font-semibold text-emerald-600">SDC Rivoli</span>
                        </div>
                      </div>
                      <span className="text-[8px] font-mono text-ash-light text-center uppercase tracking-wider border border-gray-100 py-0.5 rounded bg-gray-50/50">
                        Dossier Ingesté
                      </span>
                    </motion.div>
                  )}
                </div>

              </div>
            </div>

            {/* Right: Relances Status Console */}
            <div className="bg-white/50 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] flex flex-col justify-between h-[380px]">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Send className="w-4 h-4 text-neutral-600" />
                  <span className="font-mono text-[9px] tracking-wider text-ash-light uppercase font-bold">
                    Console de relances traitées
                  </span>
                </div>
                <p className="text-ash-text text-xs font-light mb-6 font-sans">
                  Une fois les variables extraites, les flux de notification s&apos;exécutent de manière autonome pour relancer les tiers.
                </p>
              </div>

              {/* Status Display Area */}
              <div className="flex-1 bg-white border border-gray-100 rounded-lg p-5 shadow-inner flex flex-col justify-center gap-3">
                {simPhase === "idle" || simPhase === "moving" || simPhase === "dragging" ? (
                  <div className="text-center py-6 text-ash-light space-y-2 font-sans">
                    <span className="text-xs italic block">En attente d&apos;ingestion du dossier...</span>
                    <span className="text-[8px] font-mono uppercase block">Attente webhook NOTAS</span>
                  </div>
                ) : simPhase === "scanning" ? (
                  <div className="space-y-3 font-sans">
                    <div className="flex items-center justify-between text-[10px] p-2 rounded bg-neutral-50/50">
                      <span className="text-ash-text">Rapport syndic</span>
                      <span className="font-mono text-neutral-400 animate-pulse">Extraction...</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] p-2 rounded bg-neutral-50/50">
                      <span className="text-ash-text">Validation acompte</span>
                      <span className="font-mono text-neutral-400">En attente</span>
                    </div>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-2.5 font-sans"
                  >
                    <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-white/40 border border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-neutral-800">Relance syndic (Attestation non-recours)</span>
                      </div>
                      <span className="text-[8px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase font-semibold">
                        Gmail
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-white/40 border border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-neutral-800 font-normal">Rappel acquéreur (Attestation d&apos;apport)</span>
                      </div>
                      <span className="text-[8px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase font-semibold">
                        SMS
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-white/40 border border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-neutral-400" />
                        <span className="text-neutral-800">Statut du closing étude</span>
                      </div>
                      <span className="text-[8px] font-mono text-neutral-600 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-150 uppercase font-semibold">
                        Sécurisé
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

          </div>

          {/* Row 2: n8n Workflow Connections */}
          <div className="bg-white/50 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 font-sans">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-neutral-600" />
                <span className="font-mono text-[9px] tracking-wider text-ash-light uppercase font-bold">
                  Workflow d&apos;intégration des relances (n8n & Canaux)
                </span>
              </div>
              <span className="text-[9px] font-mono text-ash-light uppercase">Statut : {simPhase === "completed" ? "Actif (Transmissions en cours)" : "Veille"}</span>
            </div>

            {/* SVG Connector & Node Layout */}
            <div className="relative w-full h-[180px] bg-white rounded-lg border border-gray-100 p-2 overflow-hidden shadow-inner flex items-center justify-center">
              
              <svg className="w-full h-full max-w-5xl" viewBox="0 0 1000 150" xmlns="http://www.w3.org/2000/svg">
                {/* SVG Connections with data flow packet animation */}
                <path d="M 140 75 L 260 75" fill="none" stroke="#EAEAEA" strokeWidth="2" />
                <motion.path 
                  d="M 140 75 L 260 75" 
                  fill="none" 
                  stroke={simPhase === "completed" ? "#FF6C37" : "#EAEAEA"} 
                  strokeWidth="2"
                  strokeDasharray="6,6"
                  animate={simPhase === "completed" ? { strokeDashoffset: [0, -24] } : {}}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />

                <path d="M 340 75 C 410 75 430 35 500 35" fill="none" stroke="#EAEAEA" strokeWidth="2" />
                <motion.path 
                  d="M 340 75 C 410 75 430 35 500 35" 
                  fill="none" 
                  stroke={simPhase === "completed" ? "#FF6C37" : "#EAEAEA"} 
                  strokeWidth="2"
                  strokeDasharray="6,6"
                  animate={simPhase === "completed" ? { strokeDashoffset: [0, -24] } : {}}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />

                <path d="M 340 75 C 410 75 430 115 500 115" fill="none" stroke="#EAEAEA" strokeWidth="2" />
                <motion.path 
                  d="M 340 75 C 410 75 430 115 500 115" 
                  fill="none" 
                  stroke={simPhase === "completed" ? "#FF6C37" : "#EAEAEA"} 
                  strokeWidth="2"
                  strokeDasharray="6,6"
                  animate={simPhase === "completed" ? { strokeDashoffset: [0, -24] } : {}}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />

                <path d="M 660 35 C 730 35 770 75 860 75" fill="none" stroke="#EAEAEA" strokeWidth="2" />
                <motion.path 
                  d="M 660 35 C 730 35 770 75 860 75" 
                  fill="none" 
                  stroke={simPhase === "completed" ? "#10b981" : "#EAEAEA"} 
                  strokeWidth="2"
                  strokeDasharray="6,6"
                  animate={simPhase === "completed" ? { strokeDashoffset: [0, -24] } : {}}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />

                <path d="M 660 115 C 730 115 770 75 860 75" fill="none" stroke="#EAEAEA" strokeWidth="2" />
                <motion.path 
                  d="M 660 115 C 730 115 770 75 860 75" 
                  fill="none" 
                  stroke={simPhase === "completed" ? "#10b981" : "#EAEAEA"} 
                  strokeWidth="2"
                  strokeDasharray="6,6"
                  animate={simPhase === "completed" ? { strokeDashoffset: [0, -24] } : {}}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />

                {/* Node 1: Ingestion Vision (NOTAS) */}
                <foreignObject x="60" y="25" width="80" height="100">
                  <div className="flex flex-col items-center gap-1.5 justify-center w-full h-full font-sans">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 ${
                      simPhase === "completed" ? "bg-black text-white border-black" : "bg-neutral-50 text-neutral-400 border-gray-200"
                    }`}>
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <span className="text-[8px] font-mono text-ash-light font-bold text-center leading-none uppercase">NOTAS VISION</span>
                  </div>
                </foreignObject>

                {/* Node 2: n8n Webhook Brain Router */}
                <foreignObject x="260" y="20" width="80" height="110">
                  <div className="flex flex-col items-center gap-1.5 justify-center w-full h-full font-sans">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-500 ${
                      simPhase === "completed" ? "bg-white border-[#FF6C37] shadow-[0_0_12px_rgba(255,108,55,0.2)]" : "bg-neutral-50 border-gray-200 text-neutral-400"
                    }`}>
                      <svg viewBox="0 0 100 100" className="w-6 h-6">
                        <circle cx="30" cy="50" r="12" fill={simPhase === "completed" ? "#FF6C37" : "#888888"} />
                        <circle cx="70" cy="30" r="12" fill={simPhase === "completed" ? "#FF6C37" : "#888888"} />
                        <circle cx="70" cy="70" r="12" fill={simPhase === "completed" ? "#FF6C37" : "#888888"} />
                        <path d="M 30 50 L 70 30 M 30 50 L 70 70" stroke={simPhase === "completed" ? "#FF6C37" : "#888888"} strokeWidth="7" />
                      </svg>
                    </div>
                    <span className="text-[8px] font-mono text-[#FF6C37] font-bold text-center leading-none uppercase">n8n ROUTER</span>
                  </div>
                </foreignObject>

                {/* Node 3: Gmail Relance */}
                <foreignObject x="500" y="15" width="160" height="40">
                  <div className="flex items-center gap-2 bg-[#FBFBFA]/90 border border-gray-150 px-3 py-1.5 rounded-lg shadow-sm w-full h-full justify-between font-sans">
                    <div className="flex items-center gap-2">
                      <svg viewBox="0 0 24 24" className={`w-4 h-4 transition-colors ${simPhase === "completed" ? "text-red-500" : "text-neutral-400"}`} fill="currentColor">
                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                      <span className="text-[9px] font-medium">Relance Gmail</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${simPhase === "completed" ? "bg-emerald-500 animate-pulse" : "bg-neutral-300"}`} />
                      <span className="text-[7px] font-mono text-neutral-500">{simPhase === "completed" ? "OK" : "Veille"}</span>
                    </div>
                  </div>
                </foreignObject>

                {/* Node 4: Twilio Relance */}
                <foreignObject x="500" y="95" width="160" height="40">
                  <div className="flex items-center gap-2 bg-[#FBFBFA]/90 border border-gray-150 px-3 py-1.5 rounded-lg shadow-sm w-full h-full justify-between font-sans">
                    <div className="flex items-center gap-2">
                      <svg viewBox="0 0 24 24" className={`w-4 h-4 transition-colors ${simPhase === "completed" ? "text-red-600" : "text-neutral-400"}`} fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 16H9v-2h2v2zm0-4H9V8h2v6zm4 4h-2v-2h2v2zm0-4h-2V8h2v6z"/>
                      </svg>
                      <span className="text-[9px] font-medium font-sans">Relance Twilio</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${simPhase === "completed" ? "bg-emerald-500 animate-pulse" : "bg-neutral-300"}`} />
                      <span className="text-[7px] font-mono text-neutral-500">{simPhase === "completed" ? "OK" : "Veille"}</span>
                    </div>
                  </div>
                </foreignObject>

                {/* Node 5: Validated Act */}
                <foreignObject x="860" y="25" width="80" height="100">
                  <div className="flex flex-col items-center gap-1.5 justify-center w-full h-full font-sans">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 ${
                      simPhase === "completed" ? "bg-emerald-500 text-white border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]" : "bg-neutral-50 text-neutral-400 border-gray-200"
                    }`}>
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-[8px] font-mono text-emerald-600 font-bold text-center leading-none uppercase">ACTE SÉCURISÉ</span>
                  </div>
                </foreignObject>
              </svg>

            </div>
          </div>

        </div>
      </section>

      {/* 6. Bento Grid des Garanties Notariales */}
      <section 
        id="bento"
        className="py-32 px-8 border-b border-gray-200/60 bg-transparent max-w-7xl mx-auto"
      >
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-xl mx-auto">
            <span className="font-mono text-xs text-ash-light uppercase tracking-widest block mb-3">
              LES GARANTIES DE L&apos;ÉTUDE
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-normal">
              Rigueur <span className="italic text-emerald-700 font-light">institutionnelle.</span>
            </h2>
            <p className="text-ash-text text-sm font-light leading-relaxed mt-4 font-sans">
              L&apos;alliance d&apos;un audit autonome permanent et d&apos;une productivité inégalée pour la signature de vos actes de vente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Box 1 (col-span-2) : "Flux de relances autonomes" */}
            <div 
              ref={timelineRef}
              className="md:col-span-2 bg-white/50 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-8 flex flex-col justify-between min-h-[380px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-neutral-600" />
                  <span className="font-mono text-[10px] tracking-wider text-ash-light uppercase">
                    PROCESSUS DE SÉCURISATION
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-normal text-[#111111] mb-2">
                  Flux de relances autonomes
                </h3>
                <p className="text-ash-text text-sm font-light mb-8 max-w-md font-sans">
                  Le système identifie de manière autonome les pièces manquantes (diagnostics, états datés) et planifie des requêtes par courriels ou SMS auprès des tiers.
                </p>
              </div>

              {/* Vertical timeline */}
              <div className="space-y-6 pl-4 border-l border-gray-200 relative">
                
                {/* Step 1 */}
                <div className="relative pl-6">
                  <motion.div 
                    className="absolute -left-[21px] top-2 w-2 h-2 rounded-full"
                    initial={{ backgroundColor: "#e5e7eb" }}
                    animate={timelineInView ? { 
                      backgroundColor: "#10b981"
                    } : {}}
                    transition={{ ease: EASE_ETHEREAL, duration: 0.8, delay: 0.2 }}
                  />
                  <motion.div
                    initial={{ opacity: 0.3, x: -10 }}
                    animate={timelineInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ ease: EASE_ETHEREAL, duration: 0.8, delay: 0.2 }}
                  >
                    <span className="text-[9px] font-mono text-[#111111] font-semibold tracking-wider bg-black/5 px-2 py-0.5 rounded">ACHETEUR</span>
                    <p className="text-xs font-medium mt-1 font-sans">Vérification d&apos;état civil et attestation d&apos;apport de l&apos;acompte</p>
                  </motion.div>
                </div>

                {/* Step 2 */}
                <div className="relative pl-6">
                  <motion.div 
                    className="absolute -left-[21px] top-2 w-2 h-2 rounded-full"
                    initial={{ backgroundColor: "#e5e7eb" }}
                    animate={timelineInView ? { 
                      backgroundColor: "#10b981"
                    } : {}}
                    transition={{ ease: EASE_ETHEREAL, duration: 0.8, delay: 0.6 }}
                  />
                  <motion.div
                    initial={{ opacity: 0.3, x: -10 }}
                    animate={timelineInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ ease: EASE_ETHEREAL, duration: 0.8, delay: 0.6 }}
                  >
                    <span className="text-[9px] font-mono text-[#111111] font-semibold tracking-wider bg-black/5 px-2 py-0.5 rounded">SYNDIC</span>
                    <p className="text-xs font-medium mt-1 font-sans">Relance pour l&apos;obtention de l&apos;état daté avant la signature</p>
                  </motion.div>
                </div>

              </div>
            </div>

            {/* Box 2 (col-span-1) : "Gain de temps moyen" */}
            <div className="bg-white/50 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-8 flex flex-col justify-between min-h-[380px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="w-4 h-4 text-neutral-600" />
                  <span className="font-mono text-[10px] tracking-wider text-ash-light uppercase">
                    INDICATEUR DE RENDEMENT
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-normal text-[#111111] mb-2">
                  Gain sur le closing
                </h3>
                <p className="text-ash-text text-sm font-light leading-relaxed font-sans">
                  Accélération moyenne observée sur la constitution des dossiers.
                </p>
              </div>

              {/* Day Counter */}
              <div className="my-auto py-6">
                <div className="text-7xl font-light font-serif tracking-tighter text-[#111111] flex items-baseline">
                  -<SpringCounter targetValue={18} />
                  <span className="text-2xl font-sans font-light tracking-tight ml-2 text-neutral-500">jours</span>
                </div>
                <span className="text-[9px] font-mono text-emerald-600 font-semibold tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 inline-block mt-3 uppercase">
                  Délai moyen économisé
                </span>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-2 font-sans">
                <span className="text-[10px] font-mono text-ash-light">
                  Statistiques audits partenaires 2026
                </span>
              </div>
            </div>

            {/* Box 3 (col-span-3) : "Sécurité souveraine & RGPD" */}
            <div className="md:col-span-3 bg-white/50 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-8 flex flex-col justify-between shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-4 font-sans">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-neutral-600" />
                    <span className="font-mono text-[10px] tracking-wider text-ash-light uppercase">
                      NORME JURIDIQUE & SÉCURITÉ
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-normal text-[#111111]">
                    Hébergement souverain et purge RGPD
                  </h3>
                  <p className="text-ash-text text-sm font-light leading-relaxed">
                    Conforme à la stricte réglementation du Conseil Supérieur du Notariat (CSN). Les documents importés pour la lecture OCR sont purgés de manière définitive 30 jours après la validation de l&apos;acte, éliminant tout risque de fuite de données personnelles ou de conservation abusive de pièces d&apos;identité.
                  </p>
                </div>
                
                <div className="flex flex-col justify-center space-y-3.5 border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-8 font-sans">
                  <div className="flex items-center gap-2.5 text-xs">
                    <Lock className="w-4 h-4 text-neutral-500" />
                    <span className="font-medium">Chiffrement AES-256</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs">
                    <Database className="w-4 h-4 text-neutral-500" />
                    <span className="font-medium">Hébergement en France</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs">
                    <FileCheck className="w-4 h-4 text-neutral-500" />
                    <span className="font-medium">Audit RGPD 30 jours (Purge)</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

        <footer 
        id="footer"
        ref={footerSectionRef}
        className="relative min-h-[90vh] flex flex-col justify-between items-center py-20 px-8 bg-transparent border-t border-gray-200/60 overflow-hidden"
      >
        <div className="w-full flex justify-between items-center max-w-7xl mx-auto border-b border-gray-100 pb-6 z-20">
          <span className="text-xs font-mono tracking-widest text-ash-light">INFRASTRUCTURE NOTAS // ÉDITION LIMITÉE</span>
          <span className="text-xs font-mono text-ash-light font-sans">© 2026 NOTAS. Tous droits réservés.</span>
        </div>

        {/* Huge Fading Background Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <motion.h2 
            style={{ 
              y: footerTextY,
              maskImage: "linear-gradient(to bottom, black 40%, transparent 95%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 95%)" 
            }}
            className="text-[26vw] font-serif font-normal text-neutral-900/[0.095] leading-none tracking-[0.08em] pl-[0.08em] select-none"
          >
            NOTAS
          </motion.h2>
        </div>

        {/* Foreground Territorial Eligibility Form */}
        <div className="w-full max-w-xl bg-white/50 backdrop-blur-2xl border border-gray-200/60 rounded-2xl p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] text-center z-10">
          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-5 h-5 text-neutral-700" />
          </div>

          <h3 className="font-serif text-3xl font-normal tracking-tight mb-3">
            Vérifier la <span className="italic text-emerald-700 font-light">disponibilité.</span>
          </h3>
          <p className="text-ash-text text-sm font-light mb-8 max-w-sm mx-auto leading-relaxed font-sans">
            Pour maintenir une qualité d&apos;ingestion supérieure, le déploiement de NOTAS est limité à 5 nouvelles études par département.
          </p>

          <form onSubmit={checkEligibility} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Numéro de département (ex: 75, 92)"
                value={eligibilityCode}
                onChange={(e) => setEligibilityCode(e.target.value)}
                className="flex-1 px-4 py-3 rounded border border-gray-200 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-black focus:border-black bg-white/50"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded bg-[#111111] text-[#FBFBFA] text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors duration-300 shadow-sm"
              >
                Vérifier l&apos;éligibilité
              </button>
            </div>

            <AnimatePresence mode="wait">
              {eligibilityStatus === "eligible" && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded font-sans flex items-center gap-2 justify-center"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  L&apos;étude de votre département est éligible au programme NOTAS.
                </motion.div>
              )}
              {eligibilityStatus === "invalid" && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3.5 bg-red-50 border border-red-100 text-red-800 text-xs rounded font-sans justify-center"
                >
                  Veuillez saisir un code postal ou numéro de département valide.
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
        <div className="w-full flex justify-between items-center max-w-7xl mx-auto text-[10px] font-mono text-ash-light z-20">
          <span>HÉBERGÉ EN FRANCE</span>
          <span>CONFORMITÉ CSN / RGPD</span>
        </div>
      </footer>

    </div>
  );
}
