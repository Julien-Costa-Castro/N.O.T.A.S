"use client";

import React from "react";
import { 
  FileText, CheckCircle2, Layers, Send, Clock, UserCheck, Database, ArrowRight
} from "lucide-react";

export const toneStyles: Record<string, string> = {
  ok: "text-emerald-700 bg-emerald-50 border-emerald-100",
  warn: "text-amber-700 bg-amber-50 border-amber-200",
  danger: "text-red-600 bg-red-50 border-red-200",
  neutral: "text-neutral-600 bg-neutral-50 border-gray-200",
};

export const dossiersDemo = [
  { dossier: "Vente Martin", lieu: "Appartement — Paris 11ᵉ", etape: "Prêt accordé", etapeTone: "ok", pieces: ["État daté"], relance: "Syndic · il y a 2 h", expiration: "État daté — 21 j", expTone: "ok", client: "À jour", clientTone: "ok", signature: "12 mai" },
  { dossier: "Vente Bernard", lieu: "Maison — Le Mans", etape: "Compromis signé", etapeTone: "neutral", pieces: ["Diagnostic ERP", "CNI acquéreur"], relance: "Acquéreur · hier", expiration: "ERP — expire dans 12 j", expTone: "warn", client: "À jour", clientTone: "ok", signature: "3 juin" },
  { dossier: "Vente SCI Rivoli", lieu: "Local — Tours", etape: "Pièces en collecte", etapeTone: "neutral", pieces: ["État hypothécaire"], relance: "Banque · il y a 3 j", expiration: "Offre de prêt — 8 j", expTone: "warn", client: "En attente", clientTone: "warn", signature: "21 mai" },
  { dossier: "Vente Morel", lieu: "Maison — Nantes", etape: "Signature planifiée", etapeTone: "ok", pieces: [], relance: "—", expiration: "—", expTone: "none", client: "À jour", clientTone: "ok", signature: "29 avr." },
  { dossier: "Vente Dupont", lieu: "Appartement — Angers", etape: "Compromis signé", etapeTone: "neutral", pieces: ["Attestation d'apport"], relance: "Acquéreur · aujourd'hui", expiration: "CNI — expirée", expTone: "danger", client: "À jour", clientTone: "ok", signature: "17 juin" },
  { dossier: "Vente Lefèvre", lieu: "Terrain — Alençon", etape: "Pièces en collecte", etapeTone: "neutral", pieces: ["Certificat d'urbanisme"], relance: "Mairie · il y a 1 j", expiration: "—", expTone: "none", client: "À jour", clientTone: "ok", signature: "8 juil." },
  { dossier: "Vente Garnier", lieu: "Appartement — Rennes", etape: "Financement", etapeTone: "neutral", pieces: ["Offre de prêt signée"], relance: "Acquéreur · il y a 4 h", expiration: "Diagnostics — 30 j", expTone: "ok", client: "À jour", clientTone: "ok", signature: "24 juin" },
];

interface DashboardContentProps {
  className?: string;
  step?: number;
  setStep?: (step: number) => void;
}

export default function DashboardContent({ className = "", step, setStep }: DashboardContentProps) {
  const isInteractive = step !== undefined && setStep !== undefined;
  const currentStep = step ?? 99; // 99 means fully static mode

  return (
    <div className={`flex w-full h-full bg-white select-none text-left relative overflow-hidden ${className}`}>
      
      {/* Étape 0 : Écran d'accueil sombre d'onboarding */}
      {currentStep === 0 && (
        <div className="absolute inset-0 bg-[#111111] flex flex-col items-center justify-center text-center p-6 z-40 animate-fade-in font-sans">
          <div className="max-w-xs space-y-4">
            <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest block">DÉMONSTRATION INTERACTIVE</span>
            <h3 className="font-serif text-xl md:text-2xl text-white font-light">NOTAS en action.</h3>
            <p className="text-[10px] text-neutral-400 leading-relaxed font-sans">
              Découvrez comment notre copilote relance vos pièces manquantes et met à jour votre suivi en 3 étapes interactives.
            </p>
            <button 
              onClick={() => setStep?.(1)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[10px] font-medium transition-all shadow-md cursor-pointer inline-flex items-center gap-1.5"
            >
              Démarrer la démo <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Sidebar de l'application */}
      <aside className="hidden md:flex w-44 shrink-0 flex-col border-r border-gray-100 bg-[#FBFBFA] p-3">
        <div className="flex items-baseline gap-2 px-2 pb-3 border-b border-gray-100 mb-3">
          <span className="font-serif text-sm tracking-[0.12em] text-[#111111]">NOTAS</span>
          <span className="text-[7px] font-mono text-ash-light uppercase">Étude Dubreuil</span>
        </div>

        <nav className="space-y-0.5 font-sans">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[10px] text-neutral-500">
            <Layers className="w-3 h-3" /> Tableau de bord
          </div>
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[10px] font-medium text-[#111111] bg-black/[0.04]">
            <FileText className="w-3 h-3" /> Dossiers de vente
          </div>
          <div className="flex items-center justify-between px-2 py-1.5 rounded-md text-[10px] text-neutral-500">
            <span className="flex items-center gap-2"><Send className="w-3 h-3" /> Relances</span>
            <span className="text-[7px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-1">12</span>
          </div>
          <div className="flex items-center justify-between px-2 py-1.5 rounded-md text-[10px] text-neutral-500">
            <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> Alertes</span>
            <span className="text-[7px] font-mono text-amber-700 bg-amber-50 border border-amber-200 rounded px-1">3</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[10px] text-neutral-500">
            <UserCheck className="w-3 h-3" /> Clients
          </div>
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[10px] text-neutral-500">
            <Database className="w-3 h-3" /> Rapports
          </div>
        </nav>

        <div className="mt-4 pt-3 border-t border-gray-100">
          <span className="text-[7px] font-mono text-ash-light uppercase tracking-wider px-2 block mb-1">Vues épinglées</span>
          <div className="px-2 py-1 text-[10px] text-neutral-400 font-sans">Signatures du mois</div>
          <div className="px-2 py-1 text-[10px] text-neutral-400 font-sans">Pièces en retard</div>
        </div>
      </aside>

      {/* Zone principale */}
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">

        {/* Barre de titre */}
        <div className="flex items-center justify-between px-4 h-11 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2 font-sans">
            <span className="text-xs font-semibold text-neutral-800">Suivi des ventes</span>
            <span className="text-[7px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-1 py-0.2 uppercase font-semibold">14 actifs</span>
          </div>
          <div className="flex items-center gap-1.5 font-sans">
            <span className="text-[8px] text-neutral-500 border border-gray-200 rounded px-2 py-0.5">Exporter</span>
            <span className="text-[8px] text-white bg-[#111111] rounded px-2 py-0.5 font-medium">+ Nouveau</span>
          </div>
        </div>

        {/* Barre de filtres */}
        <div className="flex items-center gap-1.5 px-4 py-1.5 border-b border-gray-100 font-sans shrink-0">
          <span className="text-[8px] text-neutral-500 border border-gray-100 rounded px-1.5 py-0.2 bg-white">Trié par date</span>
          <span className="text-[8px] text-neutral-500 border border-gray-100 rounded px-1.5 py-0.2 bg-white">Pièces manquantes</span>
          <span className="text-[8px] text-neutral-400 border border-dashed border-gray-200 rounded px-1 py-0.2">+</span>
        </div>

        {/* Tableau des dossiers */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left font-sans min-w-[680px]">
            <thead>
              <tr className="border-b border-gray-100 font-mono text-[7px] text-ash-light uppercase tracking-wider bg-gray-50/50">
                <th className="py-2 px-4 font-normal">Dossier</th>
                <th className="py-2 pr-3 font-normal">Étape</th>
                <th className="py-2 pr-3 font-normal">Pièces manquantes</th>
                <th className="py-2 pr-3 font-normal">Dernière relance</th>
                <th className="py-2 pr-3 font-normal">Expiration</th>
                <th className="py-2 pr-3 font-normal">Client</th>
                <th className="py-2 pr-4 font-normal text-right">Signature</th>
              </tr>
            </thead>
            <tbody className="text-[10px]">
              {dossiersDemo.map((d, idx) => {
                const isTarget = d.dossier === "Vente Martin";
                const highlightRow = isTarget && currentStep === 1;

                return (
                  <tr 
                    key={idx} 
                    onClick={() => {
                      if (isTarget && isInteractive && currentStep === 1) {
                        setStep?.(2);
                      }
                    }}
                    className={`border-b border-gray-50 transition-all ${
                      highlightRow 
                        ? "bg-emerald-50 hover:bg-emerald-100/80 cursor-pointer ring-2 ring-emerald-500/40 ring-inset font-medium shadow-sm animate-pulse" 
                        : "hover:bg-neutral-50/50"
                    }`}
                  >
                    <td className="py-2 px-4">
                      <span className="font-medium text-neutral-800 block leading-tight">{d.dossier}</span>
                      <span className="text-[8px] text-ash-light">{d.lieu}</span>
                    </td>
                    <td className="py-2 pr-3">
                      <span className={`text-[8px] px-1 rounded border ${toneStyles[d.etapeTone]}`}>{d.etape}</span>
                    </td>
                    <td className="py-2 pr-3">
                      {d.pieces.length === 0 ? (
                        <span className="text-[8px] px-1 rounded border text-emerald-700 bg-emerald-50 border-emerald-100 inline-flex items-center gap-0.5">
                          <CheckCircle2 className="w-2 h-2" /> Complet
                        </span>
                      ) : (
                        <span className="flex flex-wrap gap-0.5">
                          {d.pieces.map((p, i) => (
                            <span key={i} className="text-[8px] px-1 rounded border text-neutral-600 bg-neutral-50 border-gray-200 whitespace-nowrap">{p}</span>
                          ))}
                        </span>
                      )}
                    </td>
                    <td className="py-2 pr-3 text-neutral-600 whitespace-nowrap">
                      {d.relance === "—" ? <span className="text-neutral-300">—</span> : (
                        <span className="inline-flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                          {d.relance}
                        </span>
                      )}
                    </td>
                    <td className="py-2 pr-3 whitespace-nowrap">
                      {d.expTone === "none" ? <span className="text-neutral-300">—</span> : (
                        <span className={`text-[8px] px-1 rounded border ${toneStyles[d.expTone]}`}>{d.expiration}</span>
                      )}
                    </td>
                    <td className="py-2 pr-3">
                      <span className={`text-[8px] px-1 rounded border whitespace-nowrap ${toneStyles[d.clientTone]}`}>{d.client}</span>
                    </td>
                    <td className="py-2 pr-4 text-right text-neutral-500 whitespace-nowrap">{d.signature}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Panel Détails Dossier à droite (Étape 2 & 3) */}
      {isInteractive && currentStep >= 2 && (
        <div className="w-64 shrink-0 border-l border-gray-100 bg-white p-3.5 flex flex-col justify-between z-30 font-sans shadow-lg animate-slide-left">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-xs font-semibold text-neutral-800">Détails du dossier</h3>
              <button 
                onClick={() => setStep?.(1)} 
                className="text-neutral-400 hover:text-neutral-600 text-xs px-1"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-2.5">
              <div>
                <span className="text-[7.5px] text-ash-light uppercase font-mono block">Dossier de vente</span>
                <span className="text-xs font-medium text-neutral-800">Vente Martin</span>
                <span className="text-[9px] text-neutral-400 block">Appartement — Paris 11ᵉ</span>
              </div>
              <div>
                <span className="text-[7.5px] text-ash-light uppercase font-mono block">Relance Autonome active</span>
                <span className="text-[10px] text-neutral-700 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Syndic relancé (il y a 2 h)
                </span>
              </div>
              <div>
                <span className="text-[7.5px] text-ash-light uppercase font-mono block">Pièce en attente</span>
                <span className="text-[9.5px] px-1.5 py-0.5 rounded border border-amber-200 text-amber-800 bg-amber-50 inline-block mt-0.5">
                  État daté (Attente Syndic)
                </span>
              </div>

              {currentStep === 2 && (
                <div className="p-2 bg-neutral-50 rounded border border-gray-100 text-[9.5px] text-neutral-500 leading-normal">
                  <strong>Proposition de l&apos;assistant :</strong> L&apos;IA a rédigé le courriel officiel. Cliquez sur le bouton ci-dessous pour valider l&apos;envoi instantané de la relance.
                </div>
              )}

              {currentStep === 3 && (
                <div className="p-2.5 bg-emerald-50 rounded border border-emerald-100 text-[10px] text-emerald-800 leading-relaxed flex flex-col gap-1">
                  <span className="font-semibold flex items-center gap-1 text-emerald-900">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Relance envoyée !
                  </span>
                  Le Syndic a reçu un lien sécurisé par SMS et email pour déposer l&apos;État daté sans mot de passe.
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100">
            {currentStep === 2 ? (
              <button 
                onClick={() => setStep?.(3)}
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[9.5px] font-medium transition-colors shadow-sm flex items-center justify-center gap-1 cursor-pointer"
              >
                ⚡ Envoyer la relance manuelle
              </button>
            ) : (
              <button 
                onClick={() => setStep?.(0)}
                className="w-full py-2 bg-neutral-800 hover:bg-neutral-900 text-white rounded text-[9.5px] font-medium transition-colors cursor-pointer"
              >
                Recommencer la démo
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
