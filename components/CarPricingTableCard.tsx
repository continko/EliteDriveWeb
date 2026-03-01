"use client";

import { Gauge, Shield } from "lucide-react";
import type { Car, PricingTier } from "@/lib/cars";
import { useLang } from "@/context/LanguageContext";

type CarPricingTableCardProps = {
  car: Car;
  pricing: PricingTier[];
};

export function CarPricingTableCard({ car, pricing }: CarPricingTableCardProps) {
  const { lang, t } = useLang();

  // Pomocná funkcia na formátovanie ceny nad limit
  function formatOverLimit(value: number) {
    const formatted = value.toFixed(2).replace(".", ",");
    return `${formatted} €/km`;
  }

  const translateTierLabel = (label: string) => {
    if (lang === 'sk') return label;
    
    let translated = label;
    if (lang === 'en') {
    return label
      .replace('deň', 'day')   // "1 deň" -> "1 day"
      .replace(/dni|dní/g, 'days') // "1-3 dni" -> "1-3 days"
      .replace('viac', 'more');
  }

  if (lang === 'bs') {
    return label
      .replace('deň', 'dan')
      .replace(/dni|dní/g, 'dana')
      .replace('viac', 'više');
  }
    return translated;
  };

  const ui = {
    sk: {
      title: "Cenník prenájmu",
      subtitle: "Transparentné sadzby",
      thPeriod: "Doba",
      thLimit: "Denný limit",
      thPrice: "Cena / deň",
      deposit: "Vratný depozit",
      overlimit: "Nadlimit"
    },
    en: {
      title: "Rental Pricing",
      subtitle: "Transparent rates",
      thPeriod: "Period",
      thLimit: "Daily limit",
      thPrice: "Price / day",
      deposit: "Refundable deposit",
      overlimit: "Over limit"
    },
    bs: {
      title: "Cjenovnik najma",
      subtitle: "Transparentne cijene",
      thPeriod: "Period",
      thLimit: "Dnevni limit",
      thPrice: "Cijena / dan",
      deposit: "Povratni depozit",
      overlimit: "Preko limita"
    }
  }[lang as 'sk' | 'en' | 'bs'];

  return (
    <section className="relative overflow-hidden space-y-6 rounded-[2.5rem] border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl transition-all hover:border-sky-500/30">
      
      <header className="relative space-y-1">
        <h2 className="text-lg font-bold tracking-tight text-slate-50 sm:text-xl">{ui.title}</h2>
        <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500">
          {ui.subtitle}
        </p>
      </header>

      <div className="overflow-hidden rounded-3xl border border-white/5 bg-slate-950/40">
        <table className="min-w-full divide-y divide-white/5 text-xs text-slate-300 sm:text-sm">
          <thead className="bg-white/[0.05]">
            <tr>
              <th scope="col" className="px-5 py-3 text-left font-bold uppercase tracking-widest text-slate-500 text-[10px]">
                {ui.thPeriod}
              </th>
              <th scope="col" className="px-5 py-3 text-left font-bold uppercase tracking-widest text-slate-500 text-[10px]">
                {ui.thLimit}
              </th>
              <th scope="col" className="px-5 py-3 text-left font-bold uppercase tracking-widest text-slate-500 text-[10px]">
                {ui.thPrice}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {pricing.map((tier) => (
              <tr key={tier.label} className="transition-colors hover:bg-white/[0.03]">
                <td className="px-5 py-4 font-medium text-slate-200">
                  {translateTierLabel(tier.label)}
                </td>
                <td className="px-5 py-4 text-slate-400">
                  {tier.dailyKmLimit.toLocaleString(lang === 'sk' ? "sk-SK" : "en-US")} km
                </td>
                <td className="px-5 py-4 font-bold text-sky-400">
                  {tier.pricePerDay.toLocaleString(lang === 'sk' ? "sk-SK" : "en-US")} €
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="group flex items-center gap-4 rounded-3xl bg-slate-950/60 p-4 ring-1 ring-slate-800/50 transition-all hover:ring-amber-400/30">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all duration-300">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400/80">{ui.deposit}</p>
            <p className="text-base font-bold text-slate-50">
              {car.deposit.toLocaleString(lang === 'sk' ? "sk-SK" : "en-US")} €
            </p>
          </div>
        </div>

        <div className="group flex items-center gap-4 rounded-3xl bg-slate-950/60 p-4 ring-1 ring-slate-800/50 transition-all hover:ring-sky-500/30">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400 group-hover:bg-sky-500 group-hover:text-slate-950 transition-all duration-300">
            <Gauge className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-sky-400/80">{ui.overlimit}</p>
            <p className="text-base font-bold text-slate-50">{formatOverLimit(car.overLimitPerKm)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}