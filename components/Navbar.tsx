"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { CarFront, Menu, X, Phone, Globe, ChevronDown } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  
  const { lang, changeLang, t } = useLang();

  // Kliknutie mimo dropdownu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Detekcia scrollu
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t.nav_fleet, href: "/flotila" },
    { name: t.nav_process, href: "/ako-to-funguje" },
    { name: t.nav_faq, href: "/faq" },
    { name: t.nav_contact, href: "/kontakt" },
  ];

  // Pridal som emoji vlajky pre lepší vizuál
  const languages = [
    { code: 'sk', label: 'Slovenčina', flag: '🇸🇰' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
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
            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
              ELITE<span className="text-sky-500">Drive</span>
            </span>
          </Link>

          {/* DESKTOP NAVIGÁCIA */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 hover:text-sky-400 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* LANGUAGE SWITCHER */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/10 active:scale-95"
              >
                <Globe size={14} className="text-sky-500" />
                <span className="min-w-[20px]">{lang.toUpperCase()}</span>
                <ChevronDown size={12} className={`transition-transform duration-300 ${isLangOpen ? "rotate-180" : ""}`} />
              </button>

              {/* DROPDOWN MENU */}
              {isLangOpen && (
                <div className="absolute right-0 mt-3 w-44 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f1d] shadow-2xl animate-in fade-in zoom-in duration-200">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        changeLang(l.code as any);
                        setIsLangOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider transition-colors
                        ${lang === l.code ? "bg-sky-500 text-slate-950" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
                    >
                      <span className="text-sm">{l.flag}</span>
                      {l.label}
                      {lang === l.code && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-slate-950" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <a 
              href="tel:+4219XXXXXXXX" 
              className="flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-950 transition-all hover:bg-sky-400 hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] hover:scale-105 active:scale-95"
            >
              <Phone className="h-3 w-3" />
              <span>+421 9XX XXX XXX</span>
            </a>
          </div>

          {/* MOBILE MENU TLAČIDLO */}
          <button 
            className="md:hidden text-white p-2 rounded-xl hover:bg-white/5 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU PANEL */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#020617]/95 border-b border-white/5 p-8 md:hidden flex flex-col gap-8 animate-in slide-in-from-top duration-300 backdrop-blur-2xl">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-lg font-black uppercase tracking-widest text-white hover:text-sky-500 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="h-px bg-white/10 w-full" />
          
          {/* Mobilný výber jazyka - prehľadnejší */}
          <div className="flex items-center gap-6">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => { changeLang(l.code as any); setIsMobileMenuOpen(false); }}
                className={`flex items-center gap-2 text-sm font-black uppercase tracking-widest ${lang === l.code ? 'text-sky-500' : 'text-slate-500'}`}
              >
                <span>{l.flag}</span>
                {l.code}
              </button>
            ))}
          </div>

          <a href="tel:+421910666949" className="flex items-center justify-center gap-3 rounded-2xl bg-white/5 border border-white/10 py-6 text-sky-400 font-black tracking-[0.2em] uppercase text-sm active:bg-sky-500 active:text-slate-950 transition-all">
            <Phone size={18} />
            {t.contact_card_phone || "KONTAKT"}
          </a>
        </div>
      )}
    </nav>
  );
}