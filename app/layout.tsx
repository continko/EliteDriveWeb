// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { ReactNode } from "react";
import "./globals.css";
import RootLayoutClient from "@/app/layout-client";

// Vyčlenenie viewportu pre lepší výkon a SEO
export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "EliteDrive - Prémiový prenájom áut",
  description: "Luxusná požičovňa áut pre váš výnimočný zážitok z jazdy.",
  // Pridanie základných meta značiek pre lepšie indexovanie
  robots: "index, follow",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sk" className="dark scroll-smooth">
      <head>
        {/* Tu je ten fix pre Critical Request Chains - vymeň URL za tvoju reálnu Supabase URL ak je iná */}
        <link 
          rel="preconnect" 
          href="https://jujmwjyvbxhdjyppvoczv.supabase.co" 
          crossOrigin="anonymous" 
        />
        {/* Ak používaš Google Fonty, pridaj preconnect aj na ne */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[#020617] text-slate-50 antialiased font-sans">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}