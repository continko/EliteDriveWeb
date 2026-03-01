"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CarFront, Menu, X, Phone } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Definícia linkov pre ľahšiu správu
  const navLinks = [
    { name: "Flotila", href: "/flotila" },
    { name: "Ako to funguje", href: "/ako-to-funguje" },
    { name: "FAQ", href: "/faq" }, // Smeruje na tvoju veľkú FAQ sekciu
    { name: "Kontakt", href: "/kontakt" },
  ];

  return (
    <nav 
      className={`fixed top-0 z-[100] w-full transition-all duration-500 ${
        isScrolled 
          ? "border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl py-4" 
          : "bg-transparent py-8"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* LOGO */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500 shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-transform group-hover:rotate-12">
              <CarFront className="h-6 w-6 text-slate-950" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">
              ELITE<span className="text-sky-500">Drive</span>
            </span>
          </Link>

          {/* DESKTOP NAVIGÁCIA */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 hover:text-sky-400 transition-colors"
              >
                {link.name}
              </a>
            ))}
            
            <a 
              href="tel:+421910666949" 
              className="group relative flex items-center gap-2 overflow-hidden rounded-2xl bg-white/5 border border-white/10 px-6 py-3 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-sky-500 hover:text-slate-950 hover:border-sky-500 hover:shadow-[0_0_30px_rgba(14,165,233,0.3)]"
            >
              <Phone className="h-3.5 w-3.5 text-sky-500 group-hover:text-slate-950 transition-colors" />
              <span>+421 9XX XXX XXX</span>
            </a>
          </div>

          {/* MOBILE MENU TLAČIDLO */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU PANEL */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#020617] border-b border-white/5 p-8 md:hidden flex flex-col gap-6 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-black uppercase tracking-widest text-slate-400"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <div className="h-px bg-white/5 w-full" />
          <a href="tel:+421910666949" className="text-sky-400 font-black tracking-widest uppercase text-sm">
            Zavolať non-stop linku
          </a>
        </div>
      )}
    </nav>
  );
}