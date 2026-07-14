"use client";

import React, { useState } from "react";
import { signInWithEmail, signInWithOAuth } from "./actions";
import { Lock, Mail, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null); // "email" | "google" | "microsoft" | null
  const [isMounted, setIsMounted] = useState(false);

  // Check URL query parameters for errors and trigger mount transitions
  React.useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("error") === "auth-code-error") {
        setError("Erreur d'échange de code d'authentification. Veuillez réessayer.");
      }
    }
  }, []);

  async function handleEmailLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading("email");

    const formData = new FormData(e.currentTarget);
    const result = await signInWithEmail(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(null);
    }
  }

  async function handleOAuthLogin(provider: "google" | "azure") {
    setError(null);
    setLoading(provider);

    const result = await signInWithOAuth(provider);
    if (result?.error) {
      setError(result.error);
      setLoading(null);
    }
  }

  return (
    <div className="relative min-h-screen bg-[#FBFBFA] flex flex-col justify-between selection:bg-neutral-900/5 selection:text-[#111111] overflow-hidden">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-40"
          style={{
            backgroundImage: "linear-gradient(to right, rgba(0, 0, 0, 0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.02) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage: "radial-gradient(circle at center, black 30%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(circle at center, black 30%, transparent 70%)"
          }}
        />
        <div className="absolute top-[10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-[#EFECE6]/40 filter blur-[100px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-[#E8E6E0]/30 filter blur-[100px]" />
      </div>

      {/* A. HEADER - Subtle Fade-in */}
      <header className={`relative z-30 w-full border-b border-[#EAEAEA] bg-white/70 backdrop-blur-md flex items-center justify-between px-6 md:px-12 h-20 shrink-0 transition-opacity duration-700 ease-out delay-100 ${isMounted ? "opacity-100" : "opacity-0"}`}>
        <a 
          href="http://localhost:3000" 
          className="flex items-center gap-2 text-xs md:text-sm font-sans font-medium text-neutral-500 hover:text-black transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4.5 h-4.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Retour au site
        </a>
        
        <div className="flex items-center gap-0.5 select-none">
          <img 
            src="/logo-notas.png" 
            alt="N" 
            className="h-[26px] w-auto object-contain translate-y-[0.5px]" 
          />
          <span className="text-2xl font-serif font-medium tracking-widest text-black antialiased">
            OTAS
          </span>
        </div>
      </header>

      {/* B. MAIN CONTAINER (The Form) - Smooth Slide-up + Fade-in */}
      <main className={`relative z-10 flex-1 flex items-center justify-center p-6 w-full max-w-[480px] mx-auto my-auto transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <div className="w-full bg-white border border-[#EAEAEA] rounded-lg shadow-sm p-10 md:p-12 flex flex-col">
          {/* Header */}
          <div className="text-center mb-8 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border border-[#EAEAEA] bg-[#FBFBFA] flex items-center justify-center mb-4 select-none shadow-sm overflow-hidden">
              <img 
                src="/logo-notas.png" 
                alt="NOTAS" 
                className="w-10 h-10 object-contain translate-y-[0.5px]" 
              />
            </div>
            <h1 className="text-2xl font-serif font-normal text-neutral-900 tracking-tight">
              Connexion à votre espace
            </h1>
            <p className="text-sm font-sans text-neutral-400 mt-1.5 font-light">
              Études notariales de vente immobilière
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 flex items-start gap-2.5 p-3.5 bg-red-50/50 border border-red-100 rounded-md text-xs text-red-600 font-sans animate-in fade-in duration-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="leading-normal font-medium">{error}</div>
            </div>
          )}

          {/* Email form */}
          <form onSubmit={handleEmailLogin} className="space-y-5 font-sans">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-1.5">
                Adresse e-mail
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  disabled={loading !== null}
                  placeholder="nom@etude.notaires.fr"
                  className="w-full pl-10 pr-4 py-3 bg-[#FDFDFD] border border-[#EAEAEA] rounded-md text-sm text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200/60 transition-all duration-300 ease-in-out font-light disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-widest">
                  Mot de passe
                </label>
                <a 
                  href="/forgot-password" 
                  className="text-xs text-neutral-400 hover:text-neutral-950 transition-colors duration-200 font-normal"
                >
                  Mot de passe oublié ?
                </a>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  name="password"
                  required
                  disabled={loading !== null}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-[#FDFDFD] border border-[#EAEAEA] rounded-md text-sm text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200/60 transition-all duration-300 ease-in-out font-light disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#111111] text-white rounded-md text-sm font-medium hover:bg-neutral-800 transition-colors duration-300 ease-in-out cursor-pointer select-none disabled:opacity-50 font-sans"
            >
              {loading === "email" ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Separator */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-x-0 h-px bg-[#EAEAEA]" />
            <span className="relative z-10 px-3 bg-white text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              ou
            </span>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-2.5 font-sans">
            {/* Microsoft Login */}
            <button
              onClick={() => handleOAuthLogin("azure")}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-3 border border-[#EAEAEA] bg-[#FDFDFD] rounded-md text-xs font-semibold text-neutral-700 hover:bg-neutral-50/50 hover:border-neutral-300 hover:shadow-sm transition-all duration-200 ease-in-out cursor-pointer select-none disabled:opacity-50"
            >
              {loading === "microsoft" ? (
                <span className="inline-block w-4 h-4 border-2 border-neutral-300 border-t-neutral-700 rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 23 23" fill="none">
                    <path d="M0 0H11V11H0V0Z" fill="#F25022" />
                    <path d="M12 0H23V11H12V0Z" fill="#7FBA00" />
                    <path d="M0 12H11V23H0V12Z" fill="#00A4EF" />
                    <path d="M12 12H23V23H12V12Z" fill="#FFB900" />
                  </svg>
                  Continuer avec Microsoft
                </>
              )}
            </button>

            {/* Google Login */}
            <button
              onClick={() => handleOAuthLogin("google")}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-3 border border-[#EAEAEA] bg-[#FDFDFD] rounded-md text-xs font-semibold text-neutral-700 hover:bg-neutral-50/50 hover:border-neutral-300 hover:shadow-sm transition-all duration-200 ease-in-out cursor-pointer select-none disabled:opacity-50"
            >
              {loading === "google" ? (
                <span className="inline-block w-4 h-4 border-2 border-neutral-300 border-t-neutral-700 rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22-.89-.63z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continuer avec Google
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* C. FOOTER - Delayed Fade-in */}
      <footer className={`relative z-30 w-full border-t border-[#EAEAEA] bg-white flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-5 shrink-0 gap-4 text-xs font-sans text-neutral-400 font-light transition-opacity duration-700 ease-out delay-300 ${isMounted ? "opacity-100" : "opacity-0"}`}>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <a href="#" className="hover:text-[#111111] transition-colors duration-200">Mentions légales</a>
          <a href="#" className="hover:text-[#111111] transition-colors duration-200">Politique de confidentialité</a>
          <a href="#" className="hover:text-[#111111] transition-colors duration-200">CGV</a>
          <a href="#" className="hover:text-[#111111] transition-colors duration-200">Contact</a>
        </div>
        <div className="text-center md:text-right select-none">
          © 2026 NOTAS. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}
