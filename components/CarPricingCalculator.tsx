"use client";

import { useMemo } from "react";
import type { PricingTier } from "@/lib/cars";

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
  const rentalDays = useMemo(() => calculateRentalDays(from, to), [from, to]);
  const tier = useMemo(() => (rentalDays != null ? findTier(pricing, rentalDays) : undefined), [pricing, rentalDays]);

  const total = useMemo(() => {
    if (rentalDays == null || !tier) return null;
    return rentalDays * tier.pricePerDay;
  }, [rentalDays, tier]);

  if (pricing.length === 0) {
    return null;
  }

  const hasBothDates = Boolean(from && to);
  const isInvalidRange = hasBothDates && rentalDays == null;
  const showResult = hasBothDates && rentalDays != null && tier && total != null;

  return (
    /* HLAVNÝ KONTAJNER: Husté sklo bg-slate-900/60 a silný blur */
    <section className="relative overflow-hidden space-y-6 rounded-[3rem] border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-2xl sm:p-8">
      {/* Vnútorný odlesk */}
      <div className="absolute inset-0 rounded-[3rem] ring-1 ring-inset ring-white/5 pointer-events-none" />

      <header className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-400">Automatický výpočet</p>
        <h2 className="text-xl font-black text-white sm:text-2xl tracking-tight">Kalkulačka ceny</h2>
        <p className="text-[11px] leading-relaxed text-slate-400">
          Cena sa prepočíta podľa zvoleného termínu (bez doplnkových služieb).
        </p>
      </header>

      {!hasBothDates && (
        <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-4">
          <p className="text-[11px] text-slate-400">
            Vyberte oba dátumy v kalendári vyššie pre okamžitý výpočet ceny.
          </p>
        </div>
      )}

      {isInvalidRange && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
          <p className="text-[11px] font-bold text-amber-400">
            Neplatný rozsah: Dátum "DO" musí byť neskôr ako "OD".
          </p>
        </div>
      )}

      {showResult && (
        /* VÝSLEDOK: Výraznejšie "sklo v skle" s jemnou žiarou */
        <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 shadow-[0_0_30px_-10px_rgba(14,165,233,0.15)] sm:grid-cols-3">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Doba</p>
            <p className="text-lg font-black text-white">{rentalDays} {rentalDays === 1 ? 'deň' : rentalDays < 5 ? 'dni' : 'dní'}</p>
            <p className="text-[10px] font-bold text-sky-400/80">{tier.label}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Sadzba</p>
            <p className="text-lg font-black text-white">{tier.pricePerDay.toLocaleString("sk-SK")} €</p>
            <p className="text-[10px] font-bold text-slate-400">
              Limit {tier.dailyKmLimit.toLocaleString("sk-SK")} km/deň
            </p>
          </div>

          <div className="space-y-1 border-t border-white/10 pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">Celkom</p>
            <p className="text-2xl font-black text-amber-400 leading-none">
              {total.toLocaleString("sk-SK")} €
            </p>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mt-1">Vrátane DPH</p>
          </div>
        </div>
      )}
    </section>
  );
}