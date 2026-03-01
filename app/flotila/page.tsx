"use client";

import { cars } from "@/lib/cars";
import { CarCard } from "@/components/CarCard";
import { CarFront, Filter } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

export default function FlotilaPage() {
  const { t } = useLang();

  return (
    <main className="relative min-h-screen bg-[#020617] pt-40 pb-24 overflow-hidden">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-full bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.08),transparent_70%)] blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* HEADER SEKCOA */}
        <div className="mb-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-sky-400">
            <CarFront className="h-4 w-4" />
            <span>{t.fleet_badge}</span>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter sm:text-8xl">
            {t.fleet_title}<span className="text-sky-500">{t.fleet_title_span}</span>
          </h1>
          <p className="mt-8 text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic">
            {t.fleet_subtitle}
          </p>
        </div>

        {/* FILTRE (Vizuálne) */}
        <div className="mb-16 flex flex-wrap justify-center gap-3">
          {t.fleet_filters.map((filter: string, idx: number) => (
            <button 
              key={idx}
              className={`px-6 py-3 rounded-2xl border text-[11px] font-black uppercase tracking-widest transition-all
                ${idx === 0 
                  ? "border-sky-500 bg-sky-500 text-slate-950" 
                  : "border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-white"
                }`}
            >
              {filter}
            </button>
          ))}
          <button className="px-6 py-3 rounded-2xl border border-white/5 bg-white/[0.02] text-sky-500 flex items-center gap-2">
            <Filter className="h-3 w-3" />
            <span className="text-[11px] font-black uppercase tracking-widest">{t.fleet_filter_more}</span>
          </button>
        </div>

        {/* GRID SO VŠETKÝMI AUTAMI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {cars.map((car) => (
            <div key={car.id} className="group transition-all duration-500 hover:-translate-y-2">
               <CarCard car={car} />
            </div>
          ))}
        </div>

        {/* EXTRA INFO - FAQ LINK */}
        <div className="mt-32 rounded-[3.5rem] border border-white/5 bg-white/[0.01] p-12 text-center backdrop-blur-sm">
          <h3 className="text-2xl font-black text-white mb-4">{t.fleet_not_found_title}</h3>
          <p className="text-slate-500 mb-8 max-w-lg mx-auto text-sm italic">
            {t.fleet_not_found_text}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a 
              href="tel:+421910666949" 
              className="text-sky-400 font-black uppercase tracking-widest text-xs border-b border-sky-500/30 pb-1 hover:border-sky-500 transition-all"
            >
              {t.fleet_call_us}
            </a>
            <a 
              href="/faq" 
              className="text-white font-black uppercase tracking-widest text-xs border-b border-white/10 pb-1 hover:border-white/40 transition-all"
            >
              {t.fleet_terms}
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}