"use client";

import { Gauge, Shield, Info } from "lucide-react";
import type { Car, PricingTier } from "@/lib/cars";
import { useLang } from "@/context/LanguageContext";

type CarPricingTableCardProps = {
  car: Car;
  pricing: PricingTier[];
};

export function CarPricingTableCard({ car, pricing }: CarPricingTableCardProps) {
  const { lang } = useLang();

  // 1. BEZPEČNÁ FUNKCIA NA PREKLAD ŠTÍTKOV (1 deň -> 1 day)
  const translateTierLabel = (label: string) => {
    if (lang === 'sk') return label;
    
    const translations: Record<string, Record<string, string>> = {
      en: { 'deň': 'day', 'dni': 'days', 'dní': 'days', 'viac': 'more' },
      bs: { 'deň': 'dan', 'dni': 'dana', 'dní': 'dana', 'viac': 'više' }
    };

    const currentMap = translations[lang as keyof typeof translations] || {};
    let translated = label;

    Object.entries(currentMap).forEach(([key, val]) => {
      // Bezpečný replace cez split/join
      translated = translated.split(key).join(val);
    });
    
    return translated;
  };

  // 2. TEXTY PRE UI (Oprava TS chýb pomocou Record)
  const uiData: Record<string, Record<string, string>> = {
    sk: {
      title: "Cenník prenájmu",
      subtitle: "Transparentné sadzby",
      thPeriod: "Doba",
      thLimit: "Denný limit",
      thPrice: "Cena / deň",
      deposit: "Vratný depozit",
      overlimit: "Sadzba nad limit",
      perDay: "/ deň"
    },
    en: {
      title: "Rental Pricing",
      subtitle: "Transparent rates",
      thPeriod: "Period",
      thLimit: "Daily limit",
      thPrice: "Price / day",
      deposit: "Refundable deposit",
      overlimit: "Overlimit rate",
      perDay: "/ day"
    },
    bs: {
      title: "Cjenovnik najma",
      subtitle: "Transparentne cijene",
      thPeriod: "Period",
      thLimit: "Dnevni limit",
      thPrice: "Cijena / dan",
      deposit: "Povratni depozit",
      overlimit: "Cijena preko limita",
      perDay: "/ dan"
    }
  };

  const ui = uiData[lang] || uiData.sk;

  return (
    <section className="relative overflow-hidden space-y-8 rounded-[3rem] border border-white/10 bg-slate-900/60 p-8 backdrop-blur-xl shadow-2xl">
      <header className="flex justify-between items-end px-1">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-500">{ui.subtitle}</p>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">{ui.title}</h2>
        </div>
      </header>

      <div className="overflow-hidden rounded-[2rem] border border-white/5 bg-slate-950/40">
        <table className="min-w-full divide-y divide-white/5">
          <thead className="bg-white/[0.02]">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{ui.thPeriod}</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{ui.thLimit}</th>
              <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{ui.thPrice}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {pricing.map((tier, idx) => (
              <tr key={idx} className="group transition-colors hover:bg-sky-500/[0.03]">
                <td className="px-6 py-5 font-bold text-slate-200 uppercase tracking-tight">
                  {translateTierLabel(tier.label)}
                </td>
                <td className="px-6 py-5 text-slate-400 font-medium">
                  {tier.dailyKmLimit} km <span className="text-[10px] text-slate-600 uppercase italic">{ui.perDay}</span>
                </td>
                <td className="px-6 py-5 text-right">
                  <span className="text-lg font-black text-white group-hover:text-amber-400 transition-colors">
                    {tier.pricePerDay} €
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* DEPOZIT */}
        <div className="group flex items-center gap-5 rounded-[2rem] bg-slate-950/60 p-5 border border-white/5 transition-all hover:border-amber-500/30">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
            <Shield size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{ui.deposit}</p>
            <p className="text-xl font-black text-white italic tracking-tight">{car.deposit} €</p>
          </div>
        </div>

        {/* NADLIMIT */}
        <div className="group flex items-center gap-5 rounded-[2rem] bg-slate-950/60 p-5 border border-white/5 transition-all hover:border-sky-500/30">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400">
            <Gauge size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{ui.overlimit}</p>
            <p className="text-xl font-black text-white italic tracking-tight">
              {car.overLimitPerKm.toFixed(2).replace(".", ",")} € <span className="text-[10px] text-slate-500 font-bold uppercase italic">{ui.perDay.replace('/', '')} / km</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}