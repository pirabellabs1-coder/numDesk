import type { Metadata } from "next";
import { Providers } from "@/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Callpme — L'Architecture Sonore de votre Relation Client",
  description:
    "Transformez chaque interaction téléphonique en une expérience cinématographique. Agents IA vocaux avec latence ultra-faible et voix naturelles françaises.",
  openGraph: {
    title: "Callpme — L'Architecture Sonore de votre Relation Client",
    description:
      "Plateforme SaaS d'appels IA pour le marché français. Latence < 800ms, voix naturelles, interface en français.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-on-surface antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
