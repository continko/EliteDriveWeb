"use client";

import { useMemo } from "react";
import type { PricingTier } from "@/lib/cars";
import { useLang } from "@/context/LanguageContext";

type CarPricingCalculatorProps = {
  pricing: PricingTier[];
  from: string;
  to: string;
};

function findTier(pricing: PricingTier[], days: number): PricingTier | undefined {
  return pricing.find((tier) => {
    if (days < tier.daysFrom) return false;
    if (tier.daysTo === null) return true;
    return days <= tier.daysTo;
  });
}

function calculateRentalDays(from: string, to: string): number | null {
  if (!from || !to) return null;
  const fromDate = new Date(from);
  const toDate = new Date(to);
  if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) return null;

  const diffMs = toDate.getTime() - fromDate.getTime();
  if (diffMs < 0) return null;

  const msPerDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.ceil(diffMs / msPerDay);
  return Math.max(1, diffDays);
}

export function CarPricingCalculator({ pricing, from, to }: CarPricingCalculatorProps) {
  const { lang } = useLang();
  const rentalDays = useMemo(() => calculateRentalDays(from, to), [from, to]);
  const tier = useMemo(() => (rentalDays != null ? findTier(pricing, rentalDays) : undefined), [pricing, rentalDays]);

  const total = useMemo(() => {
    if (rentalDays == null || !tier) return null;
    return rentalDays * tier.pricePerDay;
  }, [rentalDays, tier]);

  const uiTexts = {
    sk: {
      autoCalc: "Automatický výpočet",
      title: "Kalkulačka ceny",
      desc: "Cena sa prepočíta podľa zvoleného termínu (bez doplnkových služieb).",
      selectDates: "Vyberte oba dátumy v kalendári vyššie pre okamžitý výpočet ceny.",
      invalidRange: "Neplatný rozsah: Dátum \"DO\" musí byť neskôr ako \"OD\".",
      duration: "Doba",
      rate: "Sadzba",
      total: "Celkom",
      vatIncl: "Vrátane DPH",
      limit: "Limit",
      kmDay: "km/deň",
      day1: "deň",
      day24: "dni",
      day5plus: "dní"
    },
    en: {
      autoCalc: "Automatic calculation",
      title: "Price Calculator",
      desc: "Price is calculated based on selected dates (excluding extra services).",
      selectDates: "Select both dates in the calendar above for instant price calculation.",
      invalidRange: "Invalid range: \"TO\" date must be later than \"FROM\" date.",
      duration: "Duration",
      rate: "Rate",
      total: "Total",
      vatIncl: "VAT included",
      limit: "Limit",
      kmDay: "km/day",
      day1: "day",
      day24: "days",
      day5plus: "days"
    },
    bs: {
      autoCalc: "Automatski proračun",
      title: "Kalkulator cijene",
      desc: "Cijena se obračunava prema odabranom terminu (bez dodatnih usluga).",
      selectDates: "Odaberite oba datuma u kalendaru iznad za trenutni obračun cijene.",
      invalidRange: "Nevažeći raspon: Datum \"DO\" mora biti kasniji od datuma \"OD\".",
      duration: "Trajanje",
      rate: "Stopa",
      total: "Ukupno",
      vatIncl: "Sa PDV-om",
      limit: "Limit",
      kmDay: "km/dan",
      day1: "dan",
      day24: "dana",
      day5plus: "dana"
    }
  }[lang as 'sk' | 'en' | 'bs'] || {};

  // Funkcia na skloňovanie slova "deň"
  const getDayLabel = (days: number) => {
    if (lang === 'en') return days === 1 ? uiTexts.day1 : uiTexts.day5plus;
    if (lang === 'bs') return days === 1 ? uiTexts.day1 : uiTexts.day5plus;
    // Slovenčina
    if (days === 1) return uiTexts.day1;
    if (days >= 2 && days <= 4) return uiTexts.day24;
    return uiTexts.day5plus;
  };

  if (pricing.length === 0) return null;

  const hasBothDates = Boolean(from && to);
  const isInvalidRange = hasBothDates && rentalDays == null;
  const showResult = hasBothDates && rentalDays != null && tier && total != null;

  return (
    <section className="relative overflow-hidden space-y-6 rounded-[3rem] border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-2xl sm:p-8">
      <div className="absolute inset-0 rounded-[3rem] ring-1 ring-inset ring-white/5 pointer-events-none" />

      <header className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-400">{uiTexts.autoCalc}</p>
        <h2 className="text-xl font-black text-white sm:text-2xl tracking-tight">{uiTexts.title}</h2>
        <p className="text-[11px] leading-relaxed text-slate-400">{uiTexts.desc}</p>
      </header>

      {!hasBothDates && (
        <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-4">
          <p className="text-[11px] text-slate-400">{uiTexts.selectDates}</p>
        </div>
      )}

      {isInvalidRange && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
          <p className="text-[11px] font-bold text-amber-400">{uiTexts.invalidRange}</p>
        </div>
      )}

      {showResult && (
        <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 shadow-[0_0_30px_-10px_rgba(14,165,233,0.15)] sm:grid-cols-3">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{uiTexts.duration}</p>
            <p className="text-lg font-black text-white">{rentalDays} {getDayLabel(rentalDays)}</p>
            <p className="text-[10px] font-bold text-sky-400/80">{tier.label}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{uiTexts.rate}</p>
            <p className="text-lg font-black text-white">{tier.pricePerDay.toLocaleString(lang === 'sk' ? "sk-SK" : "en-US")} €</p>
            <p className="text-[10px] font-bold text-slate-400">
              {uiTexts.limit} {tier.dailyKmLimit.toLocaleString(lang === 'sk' ? "sk-SK" : "en-US")} {uiTexts.kmDay}
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