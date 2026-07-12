"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValue,
  useMotionTemplate,
  AnimatePresence
} from "framer-motion";
import { 
  FileText, Shield, ArrowRight, CheckCircle2,
  Lock, Clock, Send, Database, FileCheck, Layers, Sparkles, Building, UserCheck,
  Activity, Calendar, CreditCard, FileCode
} from "lucide-react";
import DashboardContent from "@/components/DashboardContent";
import MacbookReveal from "@/components/MacbookReveal";

// Noble Bezier Transition Curve (Apple/Stripe Inspired)
const EASE_ETHEREAL: [number, number, number, number] = [0.76, 0, 0.24, 1];
const TRANSITION_NOBLE = { ease: EASE_ETHEREAL, duration: 1.2 };

// Custom Animated Number Component
const AnimatedNumber = ({ value }: { value: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 45, damping: 18, mass: 1 });
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      setDisplayCount(Math.round(latest));
    });
  }, [springValue]);

  return <span ref={ref}>{displayCount}</span>;
};

interface SpotlightCardProps extends React.ComponentPropsWithoutRef<typeof motion.div> {
  children: React.ReactNode;
}

// Custom Spotlight Card with mouse follow halo effect
const SpotlightCard = ({ children, className = "", ...props }: SpotlightCardProps) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden ${className}`}
      {...props}
    >
      {/* Spotlight layer */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        style={{
          background: useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, rgba(16, 185, 129, 0.04), transparent 80%)`,
        }}
      />
      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between">
        {children}
      </div>
    </motion.div>
  );
};

// Hero entrance animation variants
const heroContainerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
    }
  }
};

const heroChildVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { ease: [0.22, 1, 0.36, 1] as const, duration: 0.8 }
  }
};

const h1ContainerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.12,
    }
  }
};

const h1LineVariants = {
  initial: { y: "100%" },
  animate: {
    y: "0%",
    transition: { ease: [0.22, 1, 0.36, 1] as const, duration: 0.8 }
  }
};

const paragraphContainerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.015,
    }
  }
};

const wordVariants = {
  initial: { y: "100%", opacity: 0 },
  animate: {
    y: "0%",
    opacity: 1,
    transition: { ease: [0.22, 1, 0.36, 1] as const, duration: 0.7 }
  }
};

export default function Home() {
  const footerSectionRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);

  // Scroll calculations
  const { scrollY } = useScroll();
  const [isNavbarScrolled, setIsNavbarScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Follow scroll progress of hero section:
  const { scrollY: heroScrollY } = useScroll({
    target: heroSectionRef,
    offset: ["start start", "end start"]
  });

  // Apply spring filter on scrollY for buttery smoothness:
  const smoothHeroScrollY = useSpring(heroScrollY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Transform values for 3D perspective scroll reveal:
  const dashboardRotateX = useTransform(smoothHeroScrollY, [0, 300], [15, 0]);
  const dashboardScale = useTransform(smoothHeroScrollY, [0, 300], [0.95, 1]);
  const dashboardY = useTransform(smoothHeroScrollY, [0, 300], [0, -15]);



  const [logoSrc, setLogoSrc] = useState("/ChatGPT_Image_12_juil._2026_00_46_38.png");

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/ChatGPT_Image_12_juil._2026_00_46_38.png";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      
      let minX = canvas.width;
      let maxX = 0;
      let minY = canvas.height;
      let maxY = 0;
      let hasPixels = false;

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const index = (y * canvas.width + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          
          if (r > 240 && g > 240 && b > 240) {
            data[index + 3] = 0; // Make transparent
          } else {
            hasPixels = true;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      if (hasPixels) {
        const cropWidth = maxX - minX + 1;
        const cropHeight = maxY - minY + 1;
        
        const cropCanvas = document.createElement("canvas");
        cropCanvas.width = cropWidth;
        cropCanvas.height = cropHeight;
        const cropCtx = cropCanvas.getContext("2d");
        
        if (cropCtx) {
          ctx.putImageData(imgData, 0, 0);
          cropCtx.drawImage(canvas, minX, minY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
          setLogoSrc(cropCanvas.toDataURL("image/png"));
        } else {
          ctx.putImageData(imgData, 0, 0);
          setLogoSrc(canvas.toDataURL("image/png"));
        }
      } else {
        ctx.putImageData(imgData, 0, 0);
        setLogoSrc(canvas.toDataURL("image/png"));
      }
    };
  }, []);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsNavbarScrolled(latest > 50);
    });
  }, [scrollY]);

  const { scrollYProgress: footerScroll } = useScroll({
    target: footerSectionRef,
    offset: ["start end", "end start"]
  });

  // Parallax elements
  const footerTextY = useTransform(footerScroll, [0, 1], [0, 80]);

  // Bento state triggers
  const timelineRef = useRef(null);
  const timelineInView = useInView(timelineRef, { once: true, margin: "-50px" });

  const [eligibilityCode, setEligibilityCode] = useState("");
  const [eligibilityStatus, setEligibilityStatus] = useState<string | null>(null);



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



  const documentTypesRow1 = [
    { text: "Compromis", Icon: FileText, className: "font-sans font-bold tracking-tight text-lg uppercase" },
    { text: "Diagnostics", Icon: Activity, className: "font-sans font-black tracking-tighter text-lg" },
    { text: "États Datés", Icon: Calendar, className: "font-serif font-light italic text-xl" },
    { text: "Acte", Icon: FileCheck, className: "font-mono font-semibold tracking-wider text-base uppercase" },
    { text: "Prêts", Icon: CreditCard, className: "font-serif font-normal text-lg tracking-widest" },
    { text: "SCI", Icon: Building, className: "font-mono font-black text-xl" },
    { text: "Urbanisme", Icon: Layers, className: "font-sans font-medium tracking-widest text-base uppercase" },
    { text: "Attestation", Icon: UserCheck, className: "font-serif font-light tracking-wide text-xl" },
    { text: "Patrimoine", Icon: Sparkles, className: "font-sans font-bold italic tracking-tight text-lg" },
  ];

  const documentTypesRow2 = [
    { text: "Mandat", Icon: UserCheck, className: "font-serif font-light tracking-wide text-xl" },
    { text: "Bail", Icon: FileText, className: "font-sans font-bold tracking-tight text-lg uppercase" },
    { text: "Règlement", Icon: FileCheck, className: "font-mono font-semibold tracking-wider text-base uppercase" },
    { text: "Statuts", Icon: Building, className: "font-mono font-black text-xl" },
    { text: "Donation", Icon: Sparkles, className: "font-sans font-bold italic tracking-tight text-lg" },
    { text: "Succession", Icon: Shield, className: "font-serif font-light tracking-wide text-xl" },
    { text: "Cadastre", Icon: Layers, className: "font-sans font-medium tracking-widest text-base uppercase" },
    { text: "Hypothèque", Icon: Lock, className: "font-mono font-semibold tracking-wider text-base uppercase" },
    { text: "Procuration", Icon: UserCheck, className: "font-serif font-normal text-lg tracking-widest" },
    { text: "Copropriété", Icon: Building, className: "font-sans font-black tracking-tighter text-lg" },
  ];

  const handleDemoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById("simulator");
    if (element) {
      const scrollRange = element.offsetHeight - window.innerHeight;
      // Scroll to 50% of the sticky range where the MacBook is fully sticky and centered
      const targetScroll = element.offsetTop + scrollRange * 0.5;
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FBFBFA] text-neutral-600 font-sans antialiased selection:bg-neutral-900/5 selection:text-[#111111] overflow-x-clip">
      
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

      <motion.header 
        className="fixed left-1/2 z-50 border flex items-center justify-between font-sans overflow-hidden"
        style={{
          x: "-50%",
          maxWidth: "calc(100% - 2rem)"
        }}
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: isNavbarScrolled ? 16 : 0,
          opacity: 1,
          width: isNavbarScrolled ? 800 : 1280,
          height: isNavbarScrolled ? 64 : 96,
          borderRadius: isNavbarScrolled ? 16 : 0,
          backgroundColor: isNavbarScrolled ? "rgba(255, 255, 255, 0.7)" : "rgba(251, 251, 250, 0)",
          borderColor: isNavbarScrolled ? "rgba(229, 231, 235, 0.5)" : "rgba(229, 231, 235, 0)",
          backdropFilter: isNavbarScrolled ? "blur(12px)" : "blur(0px)",
          WebkitBackdropFilter: isNavbarScrolled ? "blur(12px)" : "blur(0px)",
          boxShadow: isNavbarScrolled ? "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)" : "0 0 0 0 rgba(0,0,0,0)",
          paddingLeft: isNavbarScrolled ? 24 : 32,
          paddingRight: isNavbarScrolled ? 24 : 32,
        } as any}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 26,
          mass: 1
        }}
      >
        <a href="#" className="flex items-center gap-0.5 cursor-pointer select-none group shrink-0">
          <img 
            src={logoSrc} 
            alt="N" 
            className="h-[21px] w-auto object-contain transition-transform duration-300 group-hover:scale-105 translate-y-[2px]" 
          />
          <span className="text-2xl font-serif font-medium tracking-widest text-black antialiased translate-y-[1px]">
            OTAS
          </span>
        </a>

        <nav 
          onMouseLeave={() => setHoveredIndex(null)}
          className="hidden md:flex items-center gap-5 font-sans shrink-0 relative"
        >
          {[
            { name: "Le coût", href: "#probleme" },
            { name: "Démonstration", href: "#simulator", onClick: handleDemoClick },
            { name: "Garanties", href: "#bento" },
            { name: "Éligibilité", href: "#footer" }
          ].map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              onClick={item.onClick}
              onMouseEnter={() => setHoveredIndex(idx)}
              className="relative px-1 py-1 !font-sans font-sans font-medium text-[15px] tracking-tight text-neutral-600 transition-colors duration-200 hover:text-black z-10 select-none cursor-pointer"
            >
              <AnimatePresence>
                {hoveredIndex === idx && (
                  <motion.div
                    layoutId="navIndicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute -bottom-[4px] left-0 right-0 h-[1.5px] bg-neutral-900"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                  />
                )}
              </AnimatePresence>
              {item.name}
            </a>
          ))}
        </nav>

        <motion.a 
          href="#footer"
          className="relative overflow-hidden px-5 py-2 rounded-lg bg-[#111111] text-white text-sm font-medium hover:bg-neutral-800 !font-sans font-sans shrink-0"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Shimmer effect */}
          <span className="absolute inset-0 block -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
          <span className="relative z-10 !font-sans font-sans font-medium text-sm tracking-tight text-white">Demander une démo</span>
        </motion.a>
      </motion.header>

      {/* 2. Hero Section — texte centré + aperçu du dashboard NOTAS */}
      <section ref={heroSectionRef} className="relative pt-44 pb-16 px-8 w-full overflow-hidden flex flex-col items-center">
        
        {/* Background container covering full width */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#FBFBFA] pointer-events-none">
          {/* Ledger Grid */}
          <div 
            className="absolute inset-0 z-0 opacity-100"
            style={{
              backgroundImage: "linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              maskImage: "radial-gradient(circle at center, black 40%, transparent 80%)",
              WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 80%)"
            }}
          />

          {/* Halos Lumineux */}
          <motion.div 
            className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px]"
            animate={{
              x: [0, 30, -15, 0],
              y: [0, -20, 15, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <motion.div 
            className="absolute top-[10%] right-[10%] w-[600px] h-[600px] rounded-full bg-amber-100/40 blur-[120px]"
            animate={{
              x: [0, -25, 25, 0],
              y: [0, 30, -15, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Bottom linear gradient to transition smoothly into next section */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#FBFBFA]" />
        </div>

        {/* Content Container (max-w-7xl to constrain contents) */}
        <div className="max-w-7xl w-full mx-auto flex flex-col items-center relative z-10">

          {/* Copywriting centré */}
          <motion.div
            variants={heroContainerVariants}
            initial="initial"
            animate="animate"
            className="text-center max-w-4xl mx-auto flex flex-col items-center relative z-10"
          >
            <motion.div 
              variants={heroChildVariants}
              className="relative inline-flex items-center justify-center p-[1px] overflow-hidden rounded-full mb-6 shadow-sm font-sans"
            >
              {/* Rotating border sweep */}
              <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,rgba(0,0,0,0.08)_80%,#059669_95%,rgba(0,0,0,0.08)_100%)]" />
              
              {/* Inner container to mask and display content */}
              <div className="relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-xs text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>Suivi autonome des dossiers de vente</span>
              </div>
            </motion.div>

            <motion.h1 
              variants={h1ContainerVariants}
              className="font-serif text-5xl md:text-7xl font-normal text-black tracking-tight leading-[1.08] max-w-4xl"
            >
              <span className="block overflow-hidden pb-1.5">
                <motion.span 
                  variants={h1LineVariants}
                  className="block"
                >
                  Le copilote qui relance,
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-1.5">
                <motion.span 
                  variants={h1LineVariants}
                  className="block"
                >
                  <span className="italic font-light text-emerald-700 font-light">alerte et informe à votre place.</span>
                </motion.span>
              </span>
            </motion.h1>

            <motion.p 
              variants={paragraphContainerVariants}
              className="text-base md:text-lg text-ash-text max-w-2xl mx-auto leading-relaxed font-sans font-light mt-6 flex flex-wrap justify-center gap-x-1 gap-y-0.5"
            >
              {"Le tableau de suivi que vos clercs connaissent déjà — mais qui relance, surveille les expirations et informe vos clients tout seul.".split(" ").map((word, i) => (
                <span key={i} className="inline-block overflow-hidden py-0.5">
                  <motion.span
                    variants={wordVariants}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </motion.p>

            <motion.div 
              variants={heroChildVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
            >
              <motion.a
                href="#footer"
                className="relative overflow-hidden px-7 py-3 rounded-lg bg-[#111111] text-white text-sm font-medium hover:bg-neutral-800 !font-sans font-sans"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Shimmer effect */}
                <span className="absolute inset-0 block -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                <span className="relative z-10 !font-sans font-sans font-medium text-sm tracking-tight text-white">Prendre rendez-vous</span>
              </motion.a>
              <a
                href="#simulator"
                onClick={handleDemoClick}
                className="px-7 py-3 rounded-lg bg-white border border-gray-200 text-[#111111] text-sm font-medium hover:bg-neutral-50/50 transition-colors duration-300 font-sans cursor-pointer"
              >
                Voir la démonstration
              </a>
            </motion.div>
          </motion.div>

          {/* Aperçu du dashboard avec effet de Parallax 3D / Scroll Reveal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...TRANSITION_NOBLE, delay: 0.25 }}
            className="w-full max-w-5xl mt-16"
            style={{ perspective: "2000px" }}
          >
            <motion.div
              style={{
                rotateX: dashboardRotateX,
                scale: dashboardScale,
                y: dashboardY,
                maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)"
              }}
              className="relative w-full rounded-2xl border border-gray-200 bg-white shadow-[0_30px_100px_-15px_rgba(0,0,0,0.08)] overflow-hidden text-left"
            >
              <DashboardContent />
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* 3a. Section 1 : La Compatibilité (Logo Cloud de logiciels - Statique & Centré) */}
      <section className="relative w-full pt-32 pb-16 bg-gradient-to-b from-white via-[#FBFBFA] to-[#FBFBFA] flex flex-col items-center">
        <span className="text-[10px] tracking-[0.25em] text-gray-400 uppercase font-sans font-semibold text-center mb-8">
          COMPATIBLE AVEC LES OUTILS DE VOTRE ÉTUDE
        </span>
        <div 
          className="flex justify-center items-center gap-12 md:gap-20 flex-wrap"
        >
          <img 
            src="/logo-inot.webp" 
            alt="iNot" 
            className="h-10 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer mix-blend-multiply"
          />
          <img 
            src="/logo-genapi.png" 
            alt="Genapi" 
            className="h-16 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer mix-blend-multiply scale-[1.3]"
          />
          <img 
            src="/logo-signature.webp" 
            alt="Signature" 
            className="h-10 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer"
          />
          <img 
            src="/logo-fichorga-regorus.webp" 
            alt="Fichorga Regorus" 
            className="h-10 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer"
          />
        </div>
      </section>

      {/* 4. Section "Le Coût de l'Inaction" (Le Problème) */}
      <section id="probleme" className="pt-16 pb-32 px-8 border-b border-gray-200/60 bg-transparent max-w-7xl mx-auto flex flex-col items-center justify-center">
        <div className="max-w-6xl mx-auto space-y-16">

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <span className="font-mono text-xs text-ash-light uppercase tracking-widest block mb-3">
              LE COÛT DE L&apos;INACTION
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-normal text-black">
              Chaque dossier qui traîne, <span className="italic text-emerald-700 font-light">c&apos;est votre marge qui attend.</span>
            </h2>
            <p className="text-ash-text text-sm font-light leading-relaxed mt-4 font-sans">
              Pièces manquantes, relances manuelles, documents qui expirent : pendant que les dossiers traînent, les émoluments attendent.
            </p>
          </div>

          {/* Row 1 : 3 compteurs d'urgence */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Stat 1 : 92 jours */}
            <SpotlightCard
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ ease: EASE_ETHEREAL, duration: 0.9 }}
              className="bg-white border border-neutral-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-2xl p-8 min-h-[300px]"
            >
              <span className="font-mono text-[10px] tracking-wider text-ash-light uppercase">
                DÉLAI DE VENTE MOYEN
              </span>
              <div className="my-auto py-4">
                <div className="text-7xl font-light font-serif tracking-tighter text-[#111111] flex items-baseline">
                  <AnimatedNumber value={92} />
                  <span className="text-2xl font-sans font-light tracking-tight ml-2 text-neutral-500">jours</span>
                </div>
                <p className="text-ash-text text-sm font-light leading-relaxed mt-4 font-sans">
                  entre compromis et acte. Première cause évitable : <strong>une pièce manquante</strong>.
                </p>
              </div>
              <div className="border-t border-gray-100 pt-4 font-sans">
                <span className="text-[9px] font-mono text-ash-light uppercase tracking-wider">Source : Notariat Services</span>
              </div>
            </SpotlightCard>

            {/* Stat 2 : +30 % avec jauge 70 → 90+ jours */}
            <SpotlightCard
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ ease: EASE_ETHEREAL, duration: 0.9, delay: 0.15 }}
              className="bg-white border border-neutral-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-2xl p-8 min-h-[300px]"
            >
              <span className="font-mono text-[10px] tracking-wider text-ash-light uppercase">
                DES DÉLAIS QUI S&apos;AGGRAVENT
              </span>
              <div className="my-auto py-4">
                <div className="text-7xl font-light font-serif tracking-tighter text-[#111111] flex items-baseline">
                  +<AnimatedNumber value={30} />
                  <span className="text-2xl font-sans font-light tracking-tight ml-2 text-neutral-500">%</span>
                </div>
                <p className="text-ash-text text-sm font-light leading-relaxed mt-4 font-sans">
                  de délai en 2 ans sur les ventes immobilières.
                </p>
                <div className="mt-5 space-y-2.5">
                  <div className="flex items-center gap-3">
                    <span className="text-[8px] font-mono text-ash-light uppercase w-20 shrink-0">Il y a 2 ans</span>
                    <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-neutral-300 origin-left"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 0.74 }}
                        viewport={{ once: true }}
                        transition={{ ease: EASE_ETHEREAL, duration: 1.2, delay: 0.3 }}
                      />
                    </div>
                    <span className="text-[9px] font-mono text-ash-light w-10 text-right shrink-0">70 j</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[8px] font-mono text-[#111111] font-semibold uppercase w-20 shrink-0">Aujourd&apos;hui</span>
                    <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-emerald-600 origin-left"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ ease: EASE_ETHEREAL, duration: 1.2, delay: 0.5 }}
                      />
                    </div>
                    <span className="text-[9px] font-mono text-emerald-700 font-semibold w-10 text-right shrink-0">90+ j</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 font-sans">
                <span className="text-[9px] font-mono text-ash-light uppercase tracking-wider">Source : Notariat Services</span>
              </div>
            </SpotlightCard>

            {/* Stat 3 : 1 jour par semaine perdu */}
            <SpotlightCard
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ ease: EASE_ETHEREAL, duration: 0.9, delay: 0.3 }}
              className="bg-white border border-neutral-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-2xl p-8 min-h-[300px]"
            >
              <span className="font-mono text-[10px] tracking-wider text-ash-light uppercase">
                DU TEMPS QUI PART EN FUMÉE
              </span>
              <div className="my-auto py-4">
                <div className="text-7xl font-light font-serif tracking-tighter text-[#111111] flex items-baseline">
                  <AnimatedNumber value={1} />
                  <span className="text-2xl font-sans font-light tracking-tight ml-2 text-neutral-500">j / semaine</span>
                </div>
                <p className="text-ash-text text-sm font-light leading-relaxed mt-4 font-sans">
                  perdu par clerc à chercher l&apos;info et relancer — <strong>20 % du temps de travail</strong>.
                </p>
              </div>
              <div className="border-t border-gray-100 pt-4 font-sans">
                <span className="text-[9px] font-mono text-ash-light uppercase tracking-wider">Source : McKinsey — métiers administratifs</span>
              </div>
            </SpotlightCard>
          </div>

          {/* Row 2 : Le grand livre — ce que ça coûte vs ce que ça rapporte */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ ease: EASE_ETHEREAL, duration: 0.9 }}
            className="bg-white/50 backdrop-blur-sm border border-gray-200/60 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">

              {/* Colonne gauche : ce que l'attente coûte */}
              <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-gray-200/60 space-y-10">
                <span className="font-mono text-[10px] tracking-wider text-ash-light uppercase font-bold">
                  CE QUE L&apos;ATTENTE VOUS COÛTE
                </span>

                <div className="flex gap-5 items-start">
                  <span className="font-serif text-2xl font-light text-[#111111] w-32 shrink-0 leading-tight">25–30 €</span>
                  <div className="font-sans">
                    <p className="text-ash-text text-sm font-light leading-relaxed">
                      l&apos;heure de clerc brûlée en relances manuelles.
                    </p>
                    <span className="text-[8px] font-mono text-ash-light uppercase tracking-wider block mt-1.5">Sources : IMEB · Indeed</span>
                  </div>
                </div>

                <div className="flex gap-5 items-start">
                  <span className="font-serif text-2xl font-light text-[#111111] w-32 shrink-0 leading-tight">45 000 €<span className="text-sm text-neutral-500 font-sans"> /an</span></span>
                  <div className="font-sans">
                    <p className="text-ash-text text-sm font-light leading-relaxed">
                      l&apos;embauche nécessaire pour absorber le volume.
                    </p>
                    <span className="text-[8px] font-mono text-ash-light uppercase tracking-wider block mt-1.5">Source : IMEB</span>
                  </div>
                </div>

                <div className="flex gap-5 items-start">
                  <span className="font-serif text-2xl font-light text-[#111111] w-32 shrink-0 leading-tight">N°1</span>
                  <div className="font-sans">
                    <p className="text-ash-text text-sm font-light leading-relaxed">
                      des insatisfactions clients : le manque de suivi. Réponse attendue sous 24 h.
                    </p>
                    <span className="text-[8px] font-mono text-ash-light uppercase tracking-wider block mt-1.5">Source : Orphée</span>
                  </div>
                </div>
              </div>

              {/* Colonne droite : ce que le même temps rapporte */}
              <div className="p-8 md:p-10 space-y-10">
                <span className="font-mono text-[10px] tracking-wider text-emerald-700 uppercase font-bold">
                  CE QUE LE MÊME TEMPS RAPPORTE
                </span>

                <div className="flex gap-5 items-start">
                  <span className="font-serif text-2xl font-light text-emerald-700 w-32 shrink-0 leading-tight">2 500–3 500 €</span>
                  <div className="font-sans">
                    <p className="text-ash-text text-sm font-light leading-relaxed">
                      d&apos;émoluments sur une seule vente à 250 000 €.
                    </p>
                    <span className="text-[8px] font-mono text-ash-light uppercase tracking-wider block mt-1.5">Source : Empruntis</span>
                  </div>
                </div>

                <div className="flex gap-5 items-start">
                  <span className="font-serif text-2xl font-light text-emerald-700 w-32 shrink-0 leading-tight">×2,5 à ×4</span>
                  <div className="font-sans">
                    <p className="text-ash-text text-sm font-light leading-relaxed">
                      dossiers gérés par personne, sans effectif supplémentaire.
                    </p>
                    <span className="text-[8px] font-mono text-ash-light uppercase tracking-wider block mt-1.5">Source : initiative-CRM</span>
                  </div>
                </div>

                <div className="flex gap-5 items-start">
                  <span className="font-serif text-2xl font-light text-emerald-700 w-32 shrink-0 leading-tight">+27 %</span>
                  <div className="font-sans">
                    <p className="text-ash-text text-sm font-light leading-relaxed">
                      de productivité quand les relances sont automatisées.
                    </p>
                    <span className="text-[8px] font-mono text-ash-light uppercase tracking-wider block mt-1.5">Sources : Gartner · France Num</span>
                  </div>
                </div>
              </div>
            </div>

            {/* L'équation : le poids des chiffres en euros */}
            <div className="border-t border-gray-200/60 px-8 py-10 text-center bg-white/40">
              <span className="font-mono text-[10px] tracking-widest text-ash-light uppercase block mb-6">
                FAITES LE CALCUL — POUR UN SEUL CLERC
              </span>

              <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6">
                <div className="flex flex-col items-center">
                  <span className="font-serif text-3xl font-light text-[#111111]">1 j</span>
                  <span className="text-[8px] font-mono text-ash-light uppercase tracking-wider mt-1">perdu / semaine</span>
                </div>
                <span className="font-serif text-2xl text-neutral-300">×</span>
                <div className="flex flex-col items-center">
                  <span className="font-serif text-3xl font-light text-[#111111]">27 €</span>
                  <span className="text-[8px] font-mono text-ash-light uppercase tracking-wider mt-1">l&apos;heure de clerc</span>
                </div>
                <span className="font-serif text-2xl text-neutral-300">×</span>
                <div className="flex flex-col items-center">
                  <span className="font-serif text-3xl font-light text-[#111111]">47</span>
                  <span className="text-[8px] font-mono text-ash-light uppercase tracking-wider mt-1">semaines / an</span>
                </div>
                <span className="font-serif text-2xl text-neutral-300">=</span>
                <div className="flex flex-col items-center">
                  <span className="font-serif text-5xl md:text-6xl font-light tracking-tighter text-emerald-700">
                    ≈ <AnimatedNumber value={8900} /> €
                  </span>
                  <span className="text-[8px] font-mono text-emerald-700 uppercase tracking-wider mt-1 font-semibold">par an, partis en relances manuelles</span>
                </div>
              </div>

              <p className="text-ash-text text-sm font-light mt-7 font-sans">
                Et c&apos;est pour <em>un seul</em> clerc. Multipliez par la taille de votre équipe.
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 3b. Section 2 : Le Double Bandeau Défilant (Flux de Documents - Animé) */}
      <section className="relative overflow-hidden w-full py-20 border-b border-gray-200/60 bg-transparent flex flex-col items-center">
        <div 
          className="relative w-full overflow-hidden flex flex-col gap-6"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 25%, black 75%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 25%, black 75%, transparent)"
          }}
        >
          {/* Ligne 1 (Défilement vers la gauche) */}
          <div className="marquee-content animate-marquee flex items-center whitespace-nowrap">
            {/* Loop 1 */}
            <div className="flex items-center">
              {documentTypesRow1.map((item, idx) => {
                const Icon = item.Icon;
                return (
                  <div key={idx} className={`flex items-center gap-3 text-neutral-600/70 hover:text-black hover:scale-105 transition-all duration-300 ease-out select-none cursor-default shrink-0 px-10 ${item.className}`}>
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </div>
            {/* Loop 2 */}
            <div className="flex items-center">
              {documentTypesRow1.map((item, idx) => {
                const Icon = item.Icon;
                return (
                  <div key={`loop2-${idx}`} className={`flex items-center gap-3 text-neutral-600/70 hover:text-black hover:scale-105 transition-all duration-300 ease-out select-none cursor-default shrink-0 px-10 ${item.className}`}>
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ligne 2 (Défilement vers la droite) */}
          <div className="marquee-content animate-marquee-reverse flex items-center whitespace-nowrap">
            {/* Loop 1 */}
            <div className="flex items-center">
              {documentTypesRow2.map((item, idx) => {
                const Icon = item.Icon;
                return (
                  <div key={idx} className={`flex items-center gap-3 text-neutral-600/70 hover:text-black hover:scale-105 transition-all duration-300 ease-out select-none cursor-default shrink-0 px-10 ${item.className}`}>
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </div>
            {/* Loop 2 */}
            <div className="flex items-center">
              {documentTypesRow2.map((item, idx) => {
                const Icon = item.Icon;
                return (
                  <div key={`loop2-${idx}`} className={`flex items-center gap-3 text-neutral-600/70 hover:text-black hover:scale-105 transition-all duration-300 ease-out select-none cursor-default shrink-0 px-10 ${item.className}`}>
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Section Démonstration 3D Immersive (MacBook Scroll-Reveal) */}
      <MacbookReveal />

      {/* 6. Bento Grid des Garanties Notariales */}
      <section 
        id="bento"
        className="py-32 px-8 border-b border-gray-200/60 bg-transparent max-w-7xl mx-auto"
      >
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-xl mx-auto">
            <span className="font-mono text-xs text-ash-light uppercase tracking-widest block mb-3">
              LES RÉSULTATS POUR L&apos;ÉTUDE
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-normal text-black">
              Des dossiers qui <span className="italic text-emerald-700 font-light">avancent tout seuls.</span>
            </h2>
            <p className="text-ash-text text-sm font-light leading-relaxed mt-4 font-sans">
              Zéro pièce oubliée. Des heures de relances économisées. Des clients qui n&apos;appellent plus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Box 0 (col-span-3) : tableau comparatif Aujourd'hui / Avec NOTAS */}
            <div className="md:col-span-3 bg-white/50 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
              <div className="max-w-3xl mx-auto">
                <span className="font-mono text-xs text-ash-light uppercase tracking-widest block mb-4 text-center">
                  LE QUOTIDIEN, AVANT / APRÈS
                </span>

                {/* Premium Table */}
                <div className="border-t border-gray-200">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 font-mono text-[9px] text-ash-light uppercase">
                        <th className="py-3 font-normal">Tâche de suivi</th>
                        <th className="py-3 font-normal text-right">Aujourd&apos;hui</th>
                        <th className="py-3 font-normal text-right text-[#111111] font-semibold">Avec NOTAS</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs font-sans">
                      <tr className="border-b border-gray-100">
                        <td className="py-3 text-ash-text">Relance des pièces manquantes</td>
                        <td className="py-3 text-right text-ash-light">2 h par dossier</td>
                        <td className="py-3 text-right font-medium text-[#111111]">Automatique</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 text-ash-text">Surveillance des expirations</td>
                        <td className="py-3 text-right text-ash-light">Au cas par cas</td>
                        <td className="py-3 text-right font-medium text-[#111111]">Alerte anticipée</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 text-ash-text">Information des clients</td>
                        <td className="py-3 text-right text-ash-light">15 appels / semaine</td>
                        <td className="py-3 text-right font-medium text-[#111111]">Proactive</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 text-ash-text">Mise à jour de la fiche de suivi</td>
                        <td className="py-3 text-right text-ash-light">Double saisie</td>
                        <td className="py-3 text-right font-medium text-[#111111]">Zéro saisie</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Box 1 (col-span-3) : "Flux de relances autonomes" */}
            <div
              ref={timelineRef}
              className="md:col-span-3 bg-white/50 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-8 flex flex-col justify-between shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-neutral-600" />
                  <span className="font-mono text-[10px] tracking-wider text-ash-light uppercase">
                    PROCESSUS DE SÉCURISATION
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-normal text-[#111111] mb-2">
                  Les bons interlocuteurs, au bon moment
                </h3>
                <p className="text-ash-text text-sm font-light mb-8 max-w-md font-sans">
                  Diagnostics, états datés… chaque interlocuteur est relancé par courriel, au bon moment.
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
                    <p className="text-xs font-medium mt-1 font-sans">L&apos;acquéreur reçoit sa relance pour l&apos;attestation d&apos;apport — sans qu&apos;un clerc y pense</p>
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
                    <p className="text-xs font-medium mt-1 font-sans">Le syndic est relancé pour l&apos;état daté, bien avant la date de signature</p>
                  </motion.div>
                </div>

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
                    Notre garantie
                  </h3>
                  <p className="text-ash-text text-sm font-light leading-relaxed">
                    Essai sans engagement de 30 jours. Si le copilote ne vous fait pas gagner de temps dès le premier mois, vous êtes intégralement remboursé. Vos données sont chiffrées de bout en bout et hébergées sur des serveurs souverains en France.
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
          <span className="text-xs font-mono tracking-widest text-ash-light">NOTAS // LE COPILOTE DES ÉTUDES NOTARIALES</span>
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
            Et si vos dossiers <span className="italic text-emerald-700 font-light">avançaient tout seuls ?</span>
          </h3>
          <p className="text-ash-text text-sm font-light mb-8 max-w-sm mx-auto leading-relaxed font-sans">
            30 minutes pour voir ce que NOTAS ferait dans votre étude. Un premier échange simple, sans engagement.
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
                className="relative overflow-hidden px-6 py-3 rounded bg-[#111111] text-white text-sm font-medium hover:bg-neutral-800 hover:scale-105 transition-all duration-300 shadow-sm cursor-pointer !font-sans font-sans"
              >
                {/* Shimmer effect */}
                <span className="absolute inset-0 block -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                <span className="relative z-10 !font-sans font-sans font-medium text-sm tracking-tight text-white">Vérifier l&apos;éligibilité</span>
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
                  Votre département est ouvert — planifions votre rendez-vous de découverte.
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
