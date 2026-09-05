import type { Metadata, Viewport } from "next";
import { ReactNode } from "react";
import "./globals.css";
import RootLayoutClient from "@/app/layout-client";
import CookieBanner from "@/components/CookieConsent"; // <-- Pridaný import

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "UltimateDrive | Luxusná a športová požičovňa áut Slovensko",
    template: "%s | UltimateDrive"
  },
  description: "Prémiový prenájom športových a luxusných áut na Slovensku. Vozidlá ako BMW M5, Porsche GT3 či Audi RS6. Profesionálny prístup, špičkový stav a zážitok z jazdy.",
  keywords: ["prenájom športových áut", "požičovňa luxusných áut", "prenájom BMW M5", "prenájom Porsche", "UltimateDrive", "požičovňa áut Žilina", "luxusné autá na prenájom"],
  authors: [{ name: "UltimateDrive" }],
  robots: "index, follow",
  alternates: {
    canonical: "https://ultimatedrive.sk",
  },
  openGraph: {
    type: "website",
    locale: "sk_SK",
    url: "https://ultimatedrive.sk",
    title: "UltimateDrive | Prémiový prenájom športových áut",
    description: "Zajazdite si na najlepších autách sveta. M-Power, RS, Porsche a ďalšie v našej exkluzívnej flotile.",
    siteName: "UltimateDrive",
  },
  twitter: {
    card: "summary_large_image",
    title: "UltimateDrive | Luxusná požičovňa áut",
    description: "Prémiová flotila športových vozidiel pripravená pre váš zážitok.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sk" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <link 
          rel="preconnect" 
          href="https://jujmwjyvbxhdjyppvoczv.supabase.co" 
          crossOrigin="anonymous" 
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      <body 
        className="min-h-screen bg-[#020617] text-slate-50 antialiased font-sans selection:bg-blue-500/30"
        suppressHydrationWarning
      >
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
        <CookieBanner /> {/* <-- Pridané sem priamo do tela layoutu */}
      </body>
    </html>
  );
}