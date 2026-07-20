import type { Metadata, Viewport } from "next";
import { ReactNode } from "react";
import "./globals.css";
import RootLayoutClient from "@/app/layout-client";

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "EliteDrive | Luxusná a športová požičovňa áut Slovensko",
    template: "%s | EliteDrive"
  },
  description: "Prémiový prenájom športových a luxusných áut na Slovensku. Vozidlá ako BMW M5, Porsche GT3 či Audi RS6. Profesionálny prístup, špičkový stav a zážitok z jazdy.",
  keywords: ["prenájom športových áut", "požičovňa luxusných áut", "prenájom BMW M5", "prenájom Porsche", "EliteDrive", "požičovňa áut Žilina", "luxusné autá na prenájom"],
  authors: [{ name: "EliteDrive" }],
  robots: "index, follow",
  alternates: {
    canonical: "https://elitedrive.sk", // Tu potom doplň svoju reálnu doménu
  },
  openGraph: {
    type: "website",
    locale: "sk_SK",
    url: "https://elitedrive.sk",
    title: "EliteDrive | Prémiový prenájom športových áut",
    description: "Zajazdite si na najlepších autách sveta. M-Power, RS, Porsche a ďalšie v našej exkluzívnej flotile.",
    siteName: "EliteDrive",
    // images: [{ url: "https://elitedrive.sk/og-image.jpg" }], // Odporúčam pridať fotku napr. naloženej odťahovky
  },
  twitter: {
    card: "summary_large_image",
    title: "EliteDrive | Luxusná požičovňa áut",
    description: "Prémiová flotila športových vozidiel pripravená pre váš zážitok.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // ZMENENÉ: Pridané suppressHydrationWarning aj na html
    <html lang="sk" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <link 
          rel="preconnect" 
          href="https://jujmwjyvbxhdjyppvoczv.supabase.co" 
          crossOrigin="anonymous" 
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon a ikony */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      {/* ZMENENÉ: Pridané suppressHydrationWarning aj na body, čo umlčí chyby z browser extensions */}
      <body 
        className="min-h-screen bg-[#020617] text-slate-50 antialiased font-sans selection:bg-blue-500/30"
        suppressHydrationWarning
      >
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}