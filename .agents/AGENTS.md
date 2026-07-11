# NOTAS Brand & Coding Guidelines

This document defines the strict brand identity, copywriting rules, target psychology, technological constraints, and design system tokens for the **NOTAS** project.

---

## 1. Brand Identity & Product
- **Name**: NOTAS (Notariat Optimisation & Traitement Automatisé Sécurisé).
- **Core Product**: Elite AI infrastructure for French notary studies.
- **Focus Area**: Real Estate Sales (Ventes Immobilières) exclusively. Do not mention successions or other areas.
- **Pricing Model**: Setup fee of 8,000 € HT + monthly infrastructure subscription.

---

## 2. Target Audience Psychology (French Notaries)
- **Profile**: Public ministerial officers highly sensitive to security, professional secrecy (RGPD), and prestige.
- **Tone**: Authoritative, reassuring, luxury, institutional, silent.
- **Pain Point**: Overwhelming mental workload of notary clerks (clercs) wasting 60% of their time chasing missing documents (diagnostics, states datés) from buyers, sellers, syndics, and agencies before loan offers expire.

---

## 3. Technological Constraints
- **NO Native API/Connection to iNot, Genapi, Fichorga**: Do not state that the system connects native or intrusive APIs to these legacy systems. This raises red flags for their IT admins.
- **OCR Ingestion Model**: Clerks securely drop scanned PDF/JPEG documents into the platform. The computer vision (OCR) engine reads the document like a human, extracts variables, compiles the checklist of missing items, and schedules autonomous follow-ups (SMS, Email, Voice).
- **Dashboard Model**: NOTAS is a "supervision dashboard" (read-only tracking). The AI handles background automation; clerks simply monitor completion bars.

---

## 4. Art Direction & Styling Tokens
- **Background**: Luminous albâtre/lin white (`#FDFDFD` or `#FBFBFA`).
- **Text**: Deep encre-de-chine black (`#111111`).
- **Borders & Lines**: Stone-gray/gris perle (`#EAEAEA`).
- **Typography**: 
  - Serif: `Playfair Display` or `Cormorant Garamond` (noble italic highlights).
  - Sans-Serif: `Geist Sans` or `Inter` (UI and data).
- **Animations (Framer Motion)**:
  - Custom Bézier curve: `ease: [0.76, 0, 0.24, 1]` with long noble durations (0.8s to 1.2s).
  - Spatial UI: elements float, stack in 3D parallax on scroll, and fade in smoothly.
