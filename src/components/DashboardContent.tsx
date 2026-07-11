"use client";

import React from "react";
import { 
  FileText, CheckCircle2, Layers, Send, Clock, UserCheck, Database 
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
}

export default function DashboardContent({ className = "" }: DashboardContentProps) {
  return (
    <div className={`flex w-full h-full bg-white select-none text-left ${className}`}>
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
  );
}
