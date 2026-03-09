"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LanguageProvider } from '@/context/LanguageContext';

export default function RootLayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <LanguageProvider>
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
              primary: "#0ea5e9",
              secondary: "#020617",
            },
          },
        }}
      />

      <div className="relative flex min-h-screen flex-col">
        {!isAdminPage && <Navbar />}
        
        <main className="flex-1">
          {children}
        </main>

        {!isAdminPage && <Footer />}
      </div>
    </LanguageProvider>
  );
}