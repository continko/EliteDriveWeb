"use client";

import { useState } from "react";
import Image from "next/image";
import { CarFront, Zap } from "lucide-react";
import type { Car } from "@/lib/cars";
import { CarSpecsTiles } from "@/components/CarSpecsTiles";
import { CarPricingTableCard } from "@/components/CarPricingTableCard";
import { CarIncludedSection } from "@/components/CarIncludedSection";
import { CarEquipmentPills } from "@/components/CarEquipmentPills";
import { CarPricingCalculator } from "@/components/CarPricingCalculator";
import { CarDetailReservationForm } from "@/components/CarDetailReservationForm";
import { CarRentalConditionsCard } from "@/components/CarRentalConditionsCard";

type CarDetailGridProps = {
  car: Car;
  power: string;
  zeroToHundred: string;
};

export function CarDetailGrid({ car, power, zeroToHundred }: CarDetailGridProps) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  return (
    <section className="relative grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start pb-24">
      
      {/* 1. ODSTRÁNENÉ: Ambientné svetlo (Ice Blue efekt) preč */}

      <div className="space-y-16">
        {/* HERO OBRÁZOK - Čisté pozadie bez vonkajšieho tieňa a žiary */}
        <div className="group relative overflow-hidden rounded-[3.5rem] border border-white/5 bg-[#020617]">
          <div className="relative h-[450px] w-full sm:h-[550px] lg:h-[650px]">
            <Image
              src={car.imageUrl}
              alt={`${car.brand} ${car.name}`}
              fill
              priority
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            
            {/* Gradient prechádza do čistej Navy Blue #020617 */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-90" />
            
            {/* Plávajúce tagy - Neutrálne sklo */}
            <div className="absolute left-8 top-8 flex gap-4">
              <div className="inline-flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-xl">
                <CarFront className="h-4 w-4 text-sky-500" />
                <span>{car.brand}</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-xl">
                <Zap className="h-4 w-4 text-sky-500" />
                <span>Model {car.year}</span>
              </div>
            </div>

            {/* Titulok v obrázku */}
            <div className="absolute bottom-12 left-8 right-8 sm:left-14">
              <h3 className="text-2xl font-black text-white sm:text-5xl tracking-tighter">
                {car.name}
              </h3>
            </div>
          </div>
        </div>

        {/* ĽAVÝ STĹPEC */}
        <div className="space-y-20">
          <CarSpecsTiles car={car} power={power} zeroToHundred={zeroToHundred} />
          <CarPricingTableCard car={car} pricing={car.pricing} />
          <CarIncludedSection />
          
          <div className="pt-4">
            <h2 className="mb-8 px-2 text-sm font-black uppercase tracking-[0.3em] text-slate-500">Prémiová výbava</h2>
            <CarEquipmentPills car={car} />
          </div>
        </div>
      </div>

      {/* PRAVÝ PANEL (Sticky) */}
      <div className="space-y-10 lg:sticky lg:top-14">
        {/* Rezervačný formulár - Čisté sklo bez farebného glow efektu */}
        <div className="relative">
          {/* ODSTRÁNENÉ: Gradientný glow efekt (absolute -inset-1) preč */}
          <div className="relative rounded-[3rem] bg-white/5 backdrop-blur-3xl border border-white/10 overflow-hidden">
            <CarDetailReservationForm
              car={car}
              from={from}
              to={to}
              onChangeFrom={setFrom}
              onChangeTo={setTo}
            />
          </div>
        </div>
        
        <CarPricingCalculator pricing={car.pricing} from={from} to={to} />
        <CarRentalConditionsCard car={car} />
      </div>
    </section>
  );
}