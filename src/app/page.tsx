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
  Lock, Clock, Send, Database, FileCheck, Layers, Sparkles, Building, UserCheck,
  Activity, Calendar, CreditCard, FileCode
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
  const footerSectionRef = useRef<HTMLDivElement>(null);

  // Scroll calculations
  const { scrollY } = useScroll();
  const [isNavbarScrolled, setIsNavbarScrolled] = useState(false);

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

  // Données de démonstration du dashboard (hero)
  const toneStyles: Record<string, string> = {
    ok: "text-emerald-700 bg-emerald-50 border-emerald-100",
    warn: "text-amber-700 bg-amber-50 border-amber-200",
    danger: "text-red-600 bg-red-50 border-red-200",
    neutral: "text-neutral-600 bg-neutral-50 border-gray-200",
  };

  const dossiersDemo = [
    { dossier: "Vente Martin", lieu: "Appartement — Paris 11ᵉ", etape: "Prêt accordé", etapeTone: "ok", pieces: ["État daté"], relance: "Syndic · il y a 2 h", expiration: "État daté — 21 j", expTone: "ok", client: "À jour", clientTone: "ok", signature: "12 mai" },
    { dossier: "Vente Bernard", lieu: "Maison — Le Mans", etape: "Compromis signé", etapeTone: "neutral", pieces: ["Diagnostic ERP", "CNI acquéreur"], relance: "Acquéreur · hier", expiration: "ERP — expire dans 12 j", expTone: "warn", client: "À jour", clientTone: "ok", signature: "3 juin" },
    { dossier: "Vente SCI Rivoli", lieu: "Local — Tours", etape: "Pièces en collecte", etapeTone: "neutral", pieces: ["État hypothécaire"], relance: "Banque · il y a 3 j", expiration: "Offre de prêt — 8 j", expTone: "warn", client: "En attente", clientTone: "warn", signature: "21 mai" },
    { dossier: "Vente Morel", lieu: "Maison — Nantes", etape: "Signature planifiée", etapeTone: "ok", pieces: [], relance: "—", expiration: "—", expTone: "none", client: "À jour", clientTone: "ok", signature: "29 avr." },
    { dossier: "Vente Dupont", lieu: "Appartement — Angers", etape: "Compromis signé", etapeTone: "neutral", pieces: ["Attestation d'apport"], relance: "Acquéreur · aujourd'hui", expiration: "CNI — expirée", expTone: "danger", client: "À jour", clientTone: "ok", signature: "17 juin" },
    { dossier: "Vente Lefèvre", lieu: "Terrain — Alençon", etape: "Pièces en collecte", etapeTone: "neutral", pieces: ["Certificat d'urbanisme"], relance: "Mairie · il y a 1 j", expiration: "—", expTone: "none", client: "À jour", clientTone: "ok", signature: "8 juil." },
    { dossier: "Vente Garnier", lieu: "Appartement — Rennes", etape: "Financement", etapeTone: "neutral", pieces: ["Offre de prêt signée"], relance: "Acquéreur · il y a 4 h", expiration: "Diagnostics — 30 j", expTone: "ok", client: "À jour", clientTone: "ok", signature: "24 juin" },
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
          backgroundColor: isNavbarScrolled ? "rgba(255, 255, 255, 0.2)" : "rgba(251, 251, 250, 0)",
          borderColor: isNavbarScrolled ? "rgba(229, 231, 235, 0.3)" : "rgba(229, 231, 235, 0)",
          backdropFilter: isNavbarScrolled ? "blur(20px)" : "blur(0px)",
          WebkitBackdropFilter: isNavbarScrolled ? "blur(20px)" : "blur(0px)",
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
        <div className="flex items-center shrink-0">
          <span className="font-serif text-2xl md:text-3xl font-normal tracking-[0.12em] text-[#111111]">
            NOTAS
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-sans shrink-0">
          <a href="#probleme" className="text-sm text-gray-500 hover:text-black transition-colors duration-300">Le coût</a>
          <a href="#simulator" className="text-sm text-gray-500 hover:text-black transition-colors duration-300">Démonstration</a>
          <a href="#bento" className="text-sm text-gray-500 hover:text-black transition-colors duration-300">Garanties</a>
          <a href="#footer" className="text-sm text-gray-500 hover:text-black transition-colors duration-300">Éligibilité</a>
        </nav>

        <motion.a 
          href="#footer"
          className="px-5 py-2 rounded-lg bg-[#111111] text-white text-xs md:text-sm font-medium hover:bg-neutral-800 transition-colors duration-300 font-sans shrink-0"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Demander une démo
        </motion.a>
      </motion.header>

      {/* 2. Hero Section — texte centré + aperçu du dashboard NOTAS */}
      <section className="relative pt-44 pb-16 px-8 w-full overflow-hidden flex flex-col items-center">
        
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={TRANSITION_NOBLE}
            className="text-center max-w-4xl mx-auto flex flex-col items-center relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 text-xs text-gray-500 mb-6 shadow-sm font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>Suivi autonome des dossiers de vente</span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl font-normal text-[#111111] tracking-tight leading-[1.08] max-w-4xl">
              Le copilote qui relance, <br />
              <span className="italic font-light text-emerald-700 font-light">alerte et informe à votre place.</span>
            </h1>

            <p className="text-base md:text-lg text-ash-text max-w-2xl mx-auto leading-relaxed font-sans font-light mt-6">
              Le tableau de suivi que vos clercs connaissent déjà — mais qui travaille tout seul. Relances automatiques, alertes avant expiration, clients informés. Zéro saisie en double, zéro apprentissage.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <motion.a
                href="#footer"
                className="px-7 py-3 rounded-lg bg-[#111111] text-white text-sm font-medium hover:bg-neutral-800 transition-colors duration-300 font-sans"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Prendre rendez-vous
              </motion.a>
              <a
                href="#simulator"
                className="px-7 py-3 rounded-lg bg-white border border-gray-200 text-[#111111] text-sm font-medium hover:bg-neutral-50/50 transition-colors duration-300 font-sans"
              >
                Voir la démonstration
              </a>
            </div>
          </motion.div>

          {/* Aperçu du dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...TRANSITION_NOBLE, delay: 0.25 }}
            className="relative w-full max-w-5xl mt-16 rounded-2xl border border-gray-200 bg-white shadow-[0_30px_100px_-15px_rgba(0,0,0,0.08)] overflow-hidden text-left"
            style={{
              maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)"
            }}
          >
            <div className="flex">

              {/* Sidebar de l'application */}
              <aside className="hidden md:flex w-52 shrink-0 flex-col border-r border-gray-100 bg-[#FBFBFA] p-3.5">
                <div className="flex items-baseline gap-2 px-2 pb-3 border-b border-gray-100 mb-3">
                  <span className="font-serif text-base tracking-[0.12em] text-[#111111]">NOTAS</span>
                  <span className="text-[8px] font-mono text-ash-light uppercase">Étude Dubreuil</span>
                </div>

                <nav className="space-y-0.5 font-sans">
                  <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[11px] text-neutral-500">
                    <Layers className="w-3.5 h-3.5" /> Tableau de bord
                  </div>
                  <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[11px] font-medium text-[#111111] bg-black/[0.04]">
                    <FileText className="w-3.5 h-3.5" /> Dossiers de vente
                  </div>
                  <div className="flex items-center justify-between px-2 py-1.5 rounded-md text-[11px] text-neutral-500">
                    <span className="flex items-center gap-2.5"><Send className="w-3.5 h-3.5" /> Relances</span>
                    <span className="text-[8px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-1">12</span>
                  </div>
                  <div className="flex items-center justify-between px-2 py-1.5 rounded-md text-[11px] text-neutral-500">
                    <span className="flex items-center gap-2.5"><Clock className="w-3.5 h-3.5" /> Alertes d&apos;expiration</span>
                    <span className="text-[8px] font-mono text-amber-700 bg-amber-50 border border-amber-200 rounded px-1">3</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[11px] text-neutral-500">
                    <UserCheck className="w-3.5 h-3.5" /> Clients
                  </div>
                  <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[11px] text-neutral-500">
                    <Database className="w-3.5 h-3.5" /> Rapports
                  </div>
                </nav>

                <div className="mt-5 pt-3 border-t border-gray-100">
                  <span className="text-[8px] font-mono text-ash-light uppercase tracking-wider px-2 block mb-1.5">Vues épinglées</span>
                  <div className="px-2 py-1 text-[11px] text-neutral-500 font-sans">Signatures du mois</div>
                  <div className="px-2 py-1 text-[11px] text-neutral-500 font-sans">Pièces en retard</div>
                </div>
              </aside>

              {/* Zone principale */}
              <div className="flex-1 min-w-0">

                {/* Barre de titre */}
                <div className="flex items-center justify-between px-5 h-12 border-b border-gray-100">
                  <div className="flex items-center gap-2.5 font-sans">
                    <span className="text-sm font-medium text-neutral-800">Suivi des ventes</span>
                    <span className="text-[8px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5 uppercase font-semibold">14 dossiers actifs</span>
                  </div>
                  <div className="flex items-center gap-2 font-sans">
                    <span className="text-[10px] text-neutral-500 border border-gray-200 rounded-md px-2.5 py-1">Exporter</span>
                    <span className="text-[10px] text-white bg-[#111111] rounded-md px-2.5 py-1">+ Nouveau dossier</span>
                  </div>
                </div>

                {/* Barre de filtres */}
                <div className="flex items-center gap-2 px-5 py-2.5 border-b border-gray-100 font-sans">
                  <span className="text-[9px] text-neutral-500 border border-gray-200 rounded px-2 py-0.5 bg-white">Trié par date de signature</span>
                  <span className="text-[9px] text-neutral-500 border border-gray-200 rounded px-2 py-0.5 bg-white">Filtre : pièces manquantes</span>
                  <span className="text-[9px] text-neutral-400 border border-dashed border-gray-200 rounded px-1.5 py-0.5">+</span>
                </div>

                {/* Tableau des dossiers */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans min-w-[780px]">
                    <thead>
                      <tr className="border-b border-gray-100 font-mono text-[8px] text-ash-light uppercase tracking-wider">
                        <th className="py-2.5 px-5 font-normal">Dossier</th>
                        <th className="py-2.5 pr-4 font-normal">Étape</th>
                        <th className="py-2.5 pr-4 font-normal">Pièces manquantes</th>
                        <th className="py-2.5 pr-4 font-normal">Dernière relance</th>
                        <th className="py-2.5 pr-4 font-normal">Expiration</th>
                        <th className="py-2.5 pr-4 font-normal">Client</th>
                        <th className="py-2.5 pr-5 font-normal text-right">Signature</th>
                      </tr>
                    </thead>
                    <tbody className="text-[11px]">
                      {dossiersDemo.map((d, idx) => (
                        <tr key={idx} className="border-b border-gray-50 hover:bg-neutral-50/50 transition-colors">
                          <td className="py-2.5 px-5">
                            <span className="font-medium text-neutral-800 block leading-tight">{d.dossier}</span>
                            <span className="text-[9px] text-ash-light">{d.lieu}</span>
                          </td>
                          <td className="py-2.5 pr-4">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded border ${toneStyles[d.etapeTone]}`}>{d.etape}</span>
                          </td>
                          <td className="py-2.5 pr-4">
                            {d.pieces.length === 0 ? (
                              <span className="text-[9px] px-1.5 py-0.5 rounded border text-emerald-700 bg-emerald-50 border-emerald-100 inline-flex items-center gap-1">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Complet
                              </span>
                            ) : (
                              <span className="flex flex-wrap gap-1">
                                {d.pieces.map((p, i) => (
                                  <span key={i} className="text-[9px] px-1.5 py-0.5 rounded border text-neutral-600 bg-neutral-50 border-gray-200 whitespace-nowrap">{p}</span>
                                ))}
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 pr-4 text-neutral-600 whitespace-nowrap">
                            {d.relance === "—" ? <span className="text-neutral-300">—</span> : (
                              <span className="inline-flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                {d.relance}
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 pr-4 whitespace-nowrap">
                            {d.expTone === "none" ? <span className="text-neutral-300">—</span> : (
                              <span className={`text-[9px] px-1.5 py-0.5 rounded border ${toneStyles[d.expTone]}`}>{d.expiration}</span>
                            )}
                          </td>
                          <td className="py-2.5 pr-4">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded border whitespace-nowrap ${toneStyles[d.clientTone]}`}>{d.client}</span>
                          </td>
                          <td className="py-2.5 pr-5 text-right text-neutral-600 whitespace-nowrap">{d.signature}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Fondu bas de fenêtre */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
          </motion.div>

        </div>
      </section>

      {/* 3a. Section 1 : La Compatibilité (Logo Cloud de logiciels - Statique & Centré) */}
      <section className="relative w-full pt-12 pb-16 bg-transparent flex flex-col items-center">
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
            <h2 className="font-serif text-3xl md:text-5xl font-normal">
              Chaque dossier qui traîne, <span className="italic text-emerald-700 font-light">c&apos;est votre marge qui attend.</span>
            </h2>
            <p className="text-ash-text text-sm font-light leading-relaxed mt-4 font-sans">
              Les délais s&apos;allongent, les pièces manquantes bloquent les signatures et vos clercs relancent à la main. Pendant ce temps, les émoluments attendent — et les clients s&apos;impatientent.
            </p>
          </div>

          {/* Row 1 : 3 compteurs d'urgence */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Stat 1 : 92 jours */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ ease: EASE_ETHEREAL, duration: 0.9 }}
              className="bg-white/50 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-8 flex flex-col justify-between min-h-[300px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]"
            >
              <span className="font-mono text-[10px] tracking-wider text-ash-light uppercase">
                DÉLAI DE VENTE MOYEN
              </span>
              <div className="my-auto py-4">
                <div className="text-7xl font-light font-serif tracking-tighter text-[#111111] flex items-baseline">
                  <SpringCounter targetValue={92} />
                  <span className="text-2xl font-sans font-light tracking-tight ml-2 text-neutral-500">jours</span>
                </div>
                <p className="text-ash-text text-sm font-light leading-relaxed mt-4 font-sans">
                  entre le compromis et l&apos;acte authentique. Première cause de retard évitable : <strong>une pièce manquante</strong>.
                </p>
              </div>
              <div className="border-t border-gray-100 pt-4 font-sans">
                <span className="text-[9px] font-mono text-ash-light uppercase tracking-wider">Source : Notariat Services</span>
              </div>
            </motion.div>

            {/* Stat 2 : +30 % avec jauge 70 → 90+ jours */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ ease: EASE_ETHEREAL, duration: 0.9, delay: 0.15 }}
              className="bg-white/50 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-8 flex flex-col justify-between min-h-[300px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]"
            >
              <span className="font-mono text-[10px] tracking-wider text-ash-light uppercase">
                DES DÉLAIS QUI S&apos;AGGRAVENT
              </span>
              <div className="my-auto py-4">
                <div className="text-7xl font-light font-serif tracking-tighter text-[#111111] flex items-baseline">
                  +<SpringCounter targetValue={30} />
                  <span className="text-2xl font-sans font-light tracking-tight ml-2 text-neutral-500">%</span>
                </div>
                <p className="text-ash-text text-sm font-light leading-relaxed mt-4 font-sans">
                  de délai en deux ans. Attendre n&apos;arrange rien : chaque année, les dossiers traînent davantage.
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
            </motion.div>

            {/* Stat 3 : 1 jour par semaine perdu */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ ease: EASE_ETHEREAL, duration: 0.9, delay: 0.3 }}
              className="bg-white/50 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-8 flex flex-col justify-between min-h-[300px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]"
            >
              <span className="font-mono text-[10px] tracking-wider text-ash-light uppercase">
                DU TEMPS QUI PART EN FUMÉE
              </span>
              <div className="my-auto py-4">
                <div className="text-7xl font-light font-serif tracking-tighter text-[#111111] flex items-baseline">
                  <SpringCounter targetValue={1} />
                  <span className="text-2xl font-sans font-light tracking-tight ml-2 text-neutral-500">j / semaine</span>
                </div>
                <p className="text-ash-text text-sm font-light leading-relaxed mt-4 font-sans">
                  perdu par clerc à chercher l&apos;information et relancer — comme dans tous les métiers administratifs. Soit <strong>20 % du temps de travail</strong>.
                </p>
              </div>
              <div className="border-t border-gray-100 pt-4 font-sans">
                <span className="text-[9px] font-mono text-ash-light uppercase tracking-wider">Source : McKinsey Global Institute</span>
              </div>
            </motion.div>
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
              <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-gray-200/60 space-y-7">
                <span className="font-mono text-[10px] tracking-wider text-ash-light uppercase font-bold">
                  CE QUE L&apos;ATTENTE VOUS COÛTE
                </span>

                <div className="flex gap-5 items-start">
                  <span className="font-serif text-2xl font-light text-[#111111] w-32 shrink-0 leading-tight">25–30 €</span>
                  <div className="font-sans">
                    <p className="text-ash-text text-sm font-light leading-relaxed">
                      le coût réel d&apos;une heure de clerc — consommée par des relances manuelles sans valeur juridique.
                    </p>
                    <span className="text-[8px] font-mono text-ash-light uppercase tracking-wider block mt-1.5">Sources : IMEB · Indeed</span>
                  </div>
                </div>

                <div className="flex gap-5 items-start">
                  <span className="font-serif text-2xl font-light text-[#111111] w-32 shrink-0 leading-tight">45 000 €<span className="text-sm text-neutral-500 font-sans"> /an</span></span>
                  <div className="font-sans">
                    <p className="text-ash-text text-sm font-light leading-relaxed">
                      le coût chargé d&apos;un clerc supplémentaire embauché pour absorber le volume.
                    </p>
                    <span className="text-[8px] font-mono text-ash-light uppercase tracking-wider block mt-1.5">Source : IMEB</span>
                  </div>
                </div>

                <div className="flex gap-5 items-start">
                  <span className="font-serif text-2xl font-light text-[#111111] w-32 shrink-0 leading-tight">N°1</span>
                  <div className="font-sans">
                    <p className="text-ash-text text-sm font-light leading-relaxed">
                      motif d&apos;insatisfaction des clients : le manque de suivi. Ils attendent une réponse sous 24 h — et le font savoir autour d&apos;eux.
                    </p>
                    <span className="text-[8px] font-mono text-ash-light uppercase tracking-wider block mt-1.5">Source : Orphée</span>
                  </div>
                </div>
              </div>

              {/* Colonne droite : ce que le même temps rapporte */}
              <div className="p-8 md:p-10 space-y-7">
                <span className="font-mono text-[10px] tracking-wider text-emerald-700 uppercase font-bold">
                  CE QUE LE MÊME TEMPS RAPPORTE
                </span>

                <div className="flex gap-5 items-start">
                  <span className="font-serif text-2xl font-light text-emerald-700 w-32 shrink-0 leading-tight">2 500–3 500 €</span>
                  <div className="font-sans">
                    <p className="text-ash-text text-sm font-light leading-relaxed">
                      d&apos;émoluments sur une seule vente à 250 000 €. Chaque dossier accéléré, c&apos;est cette somme qui rentre plus tôt.
                    </p>
                    <span className="text-[8px] font-mono text-ash-light uppercase tracking-wider block mt-1.5">Source : Empruntis</span>
                  </div>
                </div>

                <div className="flex gap-5 items-start">
                  <span className="font-serif text-2xl font-light text-emerald-700 w-32 shrink-0 leading-tight">×2,5 à ×4</span>
                  <div className="font-sans">
                    <p className="text-ash-text text-sm font-light leading-relaxed">
                      dossiers gérés par personne lorsque les relances sont automatisées — sans effectif supplémentaire.
                    </p>
                    <span className="text-[8px] font-mono text-ash-light uppercase tracking-wider block mt-1.5">Source : initiative-CRM</span>
                  </div>
                </div>

                <div className="flex gap-5 items-start">
                  <span className="font-serif text-2xl font-light text-emerald-700 w-32 shrink-0 leading-tight">+27 %</span>
                  <div className="font-sans">
                    <p className="text-ash-text text-sm font-light leading-relaxed">
                      de productivité dans les structures qui automatisent leurs relances — et 15 à 30 % du temps administratif est récupérable.
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
                    ≈ <SpringCounter targetValue={8900} /> €
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

      {/* 5. Section Console de Simulation Interactive & n8n Workflow */}
      <section id="simulator" className="py-32 px-8 border-b border-gray-200/60 bg-transparent max-w-7xl mx-auto">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-xl mx-auto">
            <span className="font-mono text-xs text-ash-light uppercase tracking-widest block mb-3">
              DÉMONSTRATION AUTONOME
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-normal">
              Votre fiche de suivi, <span className="italic text-emerald-700 font-light">en version vivante.</span>
            </h2>
            <p className="text-ash-text text-sm font-light leading-relaxed mt-4 font-sans">
              Dès qu&apos;un dossier entre dans le tableau, NOTAS identifie les pièces manquantes, relance les bons interlocuteurs et vous alerte avant chaque expiration — sans rien changer à vos habitudes.
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
                    Dépôt du dossier de vente
                  </span>
                </div>
                <p className="text-ash-text text-xs font-light mb-6 font-sans">
                  Déposez le compromis : NOTAS crée la fiche de suivi, repère les pièces attendues et prépare les relances.
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
                        <span>LECTURE DU DOSSIER</span>
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
                        <span>FICHE DE SUIVI CRÉÉE</span>
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
                        Dossier sous suivi
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
                  Dès que le dossier est lu, les relances partent automatiquement vers les bons interlocuteurs.
                </p>
              </div>

              {/* Status Display Area */}
              <div className="flex-1 bg-white border border-gray-100 rounded-lg p-5 shadow-inner flex flex-col justify-center gap-3">
                {simPhase === "idle" || simPhase === "moving" || simPhase === "dragging" ? (
                  <div className="text-center py-6 text-ash-light space-y-2 font-sans">
                    <span className="text-xs italic block">Aucun dossier en cours...</span>
                    <span className="text-[8px] font-mono uppercase block">En attente d&apos;un nouveau dossier</span>
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
                        Email
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-white/40 border border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-neutral-800 font-normal">Rappel acquéreur (Attestation d&apos;apport)</span>
                      </div>
                      <span className="text-[8px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase font-semibold">
                        Email
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
                  Circuit des relances par courriel
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
                    <span className="text-[8px] font-mono text-ash-light font-bold text-center leading-none uppercase">DOSSIER DÉPOSÉ</span>
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
                    <span className="text-[8px] font-mono text-[#FF6C37] font-bold text-center leading-none uppercase">MOTEUR NOTAS</span>
                  </div>
                </foreignObject>

                {/* Node 3: Gmail Relance */}
                <foreignObject x="500" y="15" width="160" height="40">
                  <div className="flex items-center gap-2 bg-[#FBFBFA]/90 border border-gray-150 px-3 py-1.5 rounded-lg shadow-sm w-full h-full justify-between font-sans">
                    <div className="flex items-center gap-2">
                      <svg viewBox="0 0 24 24" className={`w-4 h-4 transition-colors ${simPhase === "completed" ? "text-red-500" : "text-neutral-400"}`} fill="currentColor">
                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                      <span className="text-[9px] font-medium">Relance courriel</span>
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
                      <span className="text-[9px] font-medium font-sans">Rappel courriel</span>
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
              LES RÉSULTATS POUR L&apos;ÉTUDE
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-normal">
              Des dossiers qui <span className="italic text-emerald-700 font-light">avancent tout seuls.</span>
            </h2>
            <p className="text-ash-text text-sm font-light leading-relaxed mt-4 font-sans">
              Plus aucune pièce oubliée ni document expiré, des heures de relances économisées chaque semaine — et des clients qui n&apos;appellent plus pour demander où en est leur dossier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Box 0 (col-span-3) : "Le quotidien des études" (texte + tableau comparatif) */}
            <div className="md:col-span-3 bg-white/50 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="font-mono text-xs text-ash-light uppercase tracking-widest block mb-3">
                    LE QUOTIDIEN DES ÉTUDES
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl font-normal leading-tight">
                    Des heures perdues à <span className="italic text-emerald-700 font-light">courir après les pièces.</span>
                  </h3>
                  <p className="text-ash-text text-sm font-light leading-relaxed mt-4 font-sans">
                    Chaque dossier de vente, ce sont <strong>des dizaines de pièces</strong>{" "}à réclamer aux clients, aux banques et aux mairies. Vos clercs passent des heures à relancer, des documents expirent sans que personne ne s&apos;en aperçoive, et les dossiers prennent du retard pendant que les clients s&apos;impatientent.
                  </p>
                </div>

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
                  NOTAS repère les pièces manquantes (diagnostics, états datés) et relance chaque interlocuteur par courriel, au moment où c&apos;est utile.
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
                    [GARANTIE_À_DÉFINIR — insérer ici la garantie exacte : conditions, durée, remboursement]
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
            En 30 minutes, découvrez ce que NOTAS ferait dans votre étude : quelles relances partiraient à votre place, quelles expirations seraient surveillées, et ce que vos clercs cesseraient de faire à la main. Un premier échange simple, sans engagement.
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
