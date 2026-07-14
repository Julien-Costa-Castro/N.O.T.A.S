import React from "react";
import { FolderOpen, Users, Settings, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { signOutUser } from "./actions";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex h-screen bg-[#FBFBFA] overflow-hidden selection:bg-neutral-900/5 selection:text-[#111111]">
      {/* 1. SIDEBAR (Width: 240px) */}
      <aside className="w-[240px] bg-white border-r border-[#EAEAEA] flex flex-col shrink-0">
        {/* Brand Header */}
        <div className="h-20 border-b border-[#EAEAEA] flex items-center px-6 gap-0.5 select-none shrink-0">
          <img 
            src="/logo-notas.png" 
            alt="N" 
            className="h-[22px] w-auto object-contain translate-y-[0.5px]" 
          />
          <span className="text-xl font-serif font-medium tracking-widest text-black antialiased">
            OTAS
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1 font-sans">
          <a 
            href="#" 
            className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-900 bg-neutral-50 border border-[#EAEAEA] rounded-md transition-all"
          >
            <FolderOpen className="w-4 h-4 text-neutral-800" />
            Dossiers
          </a>
          
          <a 
            href="#" 
            className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium uppercase tracking-wider text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50/50 rounded-md transition-all group"
          >
            <Users className="w-4 h-4 text-neutral-400 group-hover:text-neutral-800 transition-colors" />
            Clients
          </a>
          
          <a 
            href="#" 
            className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium uppercase tracking-wider text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50/50 rounded-md transition-all group"
          >
            <Settings className="w-4 h-4 text-neutral-400 group-hover:text-neutral-800 transition-colors" />
            Paramètres
          </a>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#EAEAEA] shrink-0 text-[10px] font-sans text-neutral-400 text-center font-light select-none">
          Espace Clercs • v1.0
        </div>
      </aside>

      {/* 2. ZONE DE CONTENU (Right column) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Minimalist Header */}
        <header className="h-20 border-b border-[#EAEAEA] bg-white flex items-center justify-between px-8 shrink-0 select-none">
          <div className="text-sm font-sans font-medium text-neutral-800 uppercase tracking-widest">
            Tableau de bord
          </div>

          {/* User profile & Logout */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-sans text-neutral-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-light">{user?.email || "Session active"}</span>
            </div>
            
            <form action={signOutUser}>
              <button 
                type="submit" 
                className="flex items-center gap-2 px-3.5 py-1.5 border border-[#EAEAEA] bg-white rounded-md text-xs font-sans font-semibold text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-900 transition-all cursor-pointer select-none"
              >
                <LogOut className="w-3.5 h-3.5" />
                Déconnexion
              </button>
            </form>
          </div>
        </header>

        {/* Main Content Region */}
        <main className="flex-1 overflow-y-auto p-8 flex items-center justify-center bg-[#FBFBFA]">
          <div className="flex flex-col items-center justify-center text-center select-none font-sans max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-14 h-14 rounded-full border border-[#EAEAEA] bg-white flex items-center justify-center mb-5 shadow-sm text-neutral-400">
              <FolderOpen className="w-5 h-5 text-neutral-500" />
            </div>
            <h2 className="text-xl font-serif font-normal text-neutral-800 tracking-tight">
              Bienvenue sur votre espace NOTAS
            </h2>
            <p className="text-xs font-sans text-neutral-400 mt-2 font-light leading-relaxed">
              Sélectionnez une option de navigation dans le menu latéral pour commencer à gérer et suivre l'instruction de vos ventes immobilières.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
