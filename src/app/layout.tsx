import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NOTAS — Le copilote des études notariales",
  description: "NOTAS relance les pièces manquantes, alerte avant l'expiration des documents et tient vos clients informés — dans le tableau de suivi que vos clercs connaissent déjà.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
