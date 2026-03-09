"use client";

import { useMemo, useEffect } from "react"; // Pridaný useEffect
import type { PricingTier } from "@/lib/cars";
import { useLang } from "@/context/LanguageContext";

type CarPricingCalculatorProps = {
  pricing: PricingTier[];
  from: string;
  to: string;
  // NOVÉ PROPS
  pickupPrice?: number;
  returnPrice?: number;
  hasSecondDriver?: boolean;
  pickupTime?: string;
  returnTime?: string;
  onTotalChange?: (price: number | null) => void; // Callback pre rodiča
};

function findTier(pricing: PricingTier[], days: number): PricingTier | undefined {
  return pricing.find((tier) => {
    if (days < tier.daysFrom) return false;
    if (tier.daysTo === null) return true;
    return days <= tier.daysTo;
  });
}

function calculateRentalDays(from: string, to: string, pickupTime: string, returnTime: string): number | null {
  if (!from || !to) return null;
  
  const start = new Date(`${from}T${pickupTime || "10:00"}`);
  const end = new Date(`${to}T${returnTime || "10:00"}`);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

  const diffMs = end.getTime() - start.getTime();
  if (diffMs < 0) return null;

  const msPerDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.ceil(diffMs / msPerDay);
  
  return Math.max(1, diffDays);
}

export function CarPricingCalculator({ 
  pricing, from, to, 
  pickupPrice = 0, 
  returnPrice = 0, 
  hasSecondDriver = false,
  pickupTime = "10:00",
  returnTime = "10:00",
  onTotalChange // Destrukcionalizácia novej prop
}: CarPricingCalculatorProps) {
  const { lang } = useLang();

  // 1. Výpočet dní
  const rentalDays = useMemo(() => 
    calculateRentalDays(from, to, pickupTime, returnTime), 
    [from, to, pickupTime, returnTime]
  );

  // 2. Nájdenie cenovej hladiny
  const tier = useMemo(() => 
    (rentalDays != null ? findTier(pricing, rentalDays) : undefined), 
    [pricing, rentalDays]
  );

  // 3. FINÁLNY VÝPOČET CELKOVEJ CENY
  const total = useMemo(() => {
    if (rentalDays == null || !tier) return null;
    
    const basePrice = rentalDays * tier.pricePerDay;
    const extras = pickupPrice + returnPrice + (hasSecondDriver ? 20 : 0);
    
    return basePrice + extras;
  }, [rentalDays, tier, pickupPrice, returnPrice, hasSecondDriver]);

  // NOVÉ: Odoslanie vypočítanej ceny do rodiča (CarDetailGrid)
  useEffect(() => {
    if (onTotalChange) {
      onTotalChange(total);
    }
  }, [total, onTotalChange]);

  const uiTexts = {
    sk: {
      autoCalc: "Automatický výpočet",
      title: "Kalkulačka ceny",
      desc: "Cena zahŕňa prenájom, zvolené lokality a doplnkové služby.",
      duration: "Doba",
      rate: "Sadzba",
      total: "Celkom",
      vatIncl: "Vrátane DPH",
      limit: "Limit",
      kmDay: "km/deň",
      day1: "deň",
      day24: "dni",
      day5plus: "dní",
      selectDates: "Vyberte termín pre výpočet ceny",
      invalidRange: "Neplatný rozsah dátumov"
    },
    en: {
      autoCalc: "Automatic calculation",
      title: "Price Calculator",
      desc: "Price includes rental, locations, and extra services.",
      duration: "Duration",
      rate: "Rate",
      total: "Total",
      vatIncl: "VAT included",
      limit: "Limit",
      kmDay: "km/day",
      day1: "day",
      day24: "days",
      day5plus: "days",
      selectDates: "Select dates for price calculation",
      invalidRange: "Invalid date range"
    }
  }[lang as 'sk' | 'en'] || {};

  const getDayLabel = (days: number) => {
    if (lang === 'en') return days === 1 ? uiTexts.day1 : uiTexts.day5plus;
    if (days === 1) return uiTexts.day1;
    if (days >= 2 && days <= 4) return uiTexts.day24;
    return uiTexts.day5plus;
  };

  if (pricing.length === 0) return null;

  const hasBothDates = Boolean(from && to);
  const showResult = hasBothDates && rentalDays != null && tier && total != null;

  return (
    <section className="">
      <header className="space-y-1">
        <p className="text-[20px] font-black uppercase tracking-[0.3em] text-sky-400">{uiTexts.autoCalc}</p>
        
        <p className="text-[11px] leading-relaxed text-slate-400">{uiTexts.desc}</p>
      </header>

      {!showResult ? (
        <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-4 text-center">
          <p className="text-[13px] text-slate-500 italic">
            {!hasBothDates ? uiTexts.selectDates : uiTexts.invalidRange}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-6 shadow-[0_0_30px_-10px_rgba(14,165,233,0.15)] sm:grid-cols-3">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{uiTexts.duration}</p>
            <p className="text-lg font-black text-white">{rentalDays} {getDayLabel(rentalDays)}</p>
            <p className="text-[10px] font-bold text-sky-400/80 uppercase">{tier.label}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-[30px] font-black uppercase tracking-widest text-slate-500">{uiTexts.rate}</p>
            <p className="text-lg font-black text-white">{tier.pricePerDay} €</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              {uiTexts.limit} {tier.dailyKmLimit} {uiTexts.kmDay}
            </p>
          </div>

          <div className="space-y-1 border-t border-white/10 pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">{uiTexts.total}</p>
            <p className="text-2xl font-black text-amber-400 leading-none">
              {total.toLocaleString(lang === 'sk' ? "sk-SK" : "en-US")} €
            </p>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mt-1">{uiTexts.vatIncl}</p>
          </div>
        </div>
      )}
    </section>
  );
}