import type { Metadata } from "next";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "EliteDrive - Prémiový prenájom áut",
  description: "Luxusná požičovňa áut pre váš výnimočný zážitok z jazdy."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sk" className="dark scroll-smooth">
      {/* ZMENA: bg-[#020617] pre konzistenciu s celým webom */}
      <body className="min-h-screen bg-[#020617] text-slate-50 antialiased font-sans">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#020617",
              color: "rgb(248 250 252)",
              border: "1px solid rgba(255 255 255 / 0.1)",
              borderRadius: "1.25rem",
              backdropFilter: "blur(12px)",
            },
            success: {
              iconTheme: {
                primary: "#0ea5e9", // Sky-500 aby ladilo
                secondary: "#020617"
              }
            }
          }}
        />

        {/* ODSTRÁNENÉ: Staré radial-gradienty a mix-blend švrtny */}

        <div className="relative flex min-h-screen flex-col">
          {/* NAVBAR - Bude na vrchu každej stránky */}
          <Navbar />
          
          {/* OBSAH - flex-1 zabezpečí, že footer bude vždy dole */}
          <main className="flex-1">
            {children}
          </main>

          {/* FOOTER - Na konci každej stránky */}
          <Footer />
        </div>
      </body>
    </html>
  );
}