// app/layout.tsx
import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";
import RootLayoutClient from "@/app/layout-client";

export const metadata: Metadata = {
  title: "EliteDrive - Prémiový prenájom áut",
  description: "Luxusná požičovňa áut pre váš výnimočný zážitok z jazdy.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sk" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#020617] text-slate-50 antialiased font-sans">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}