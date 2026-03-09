"use client";

import { useState } from "react";
import Image from "next/image";
import { CarFront, Zap } from "lucide-react";
import type { Car } from "@/lib/cars";
import { useLang } from "@/context/LanguageContext";
import { CarSpecsTiles } from "@/components/CarSpecsTiles";
import { CarPricingTableCard } from "@/components/CarPricingTableCard";
import { CarIncludedSection } from "@/components/CarIncludedSection";
//import { CarPricingCalculator } from "@/components/CarPricingCalculator";
import { CarDetailReservationForm } from "@/components/CarDetailReservationForm";
import { CarRentalConditionsCard } from "@/components/CarRentalConditionsCard";

type CarDetailGridProps = {
  car: Car;
  power: string;
  zeroToHundred: string;
};

export function CarDetailGrid({ car, power, zeroToHundred }: CarDetailGridProps) {
  const { lang } = useLang();
  

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [returnTime, setReturnTime] = useState("10:00");
  const [pickupPrice, setPickupPrice] = useState(0);
  const [returnPrice, setReturnPrice] = useState(0);
  const [hasSecondDriver, setHasSecondDriver] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);

  const modelLabel = lang === "sk" ? "Model" : "Model";

  return (
    <section className="relative grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start pb-24">
      
      <div className="space-y-16">
        {/* HERO OBRÁZOK */}
        <div className="group relative overflow-hidden rounded-[3.5rem] border border-white/5 bg-[#020617]">
          <div className="relative h-[450px] w-full sm:h-[550px] lg:h-[650px]">
            <Image
              src={car.imageUrl}
              alt={`${car.brand} ${car.name}`}
              fill
              priority
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-90" />
            
            <div className="absolute left-8 top-8 flex gap-4">
              <div className="inline-flex items-center gap-2 rounded-2xl bg-white/50 border border-white/10 px-4 py-2 text-[12px] font-black uppercase tracking-widest text-sky-500 backdrop-blur-xl">
                <CarFront className="h-4 w-4 text-sky-500" />
                <span>{car.brand}</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl bg-white/50 border border-white/10 px-4 py-2 text-[12px] font-black uppercase tracking-widest text-sky-500 backdrop-blur-xl">
                <Zap className="h-4 w-4 text-sky-500" />
                <span>{modelLabel} {car.year}</span>
              </div>
            </div>

            <div className="absolute bottom-12 left-8 right-8 sm:left-14">
              <h3 className="text-2xl font-black text-white sm:text-5xl tracking-tighter">
                {car.name}
              </h3>
            </div>
          </div>
        </div>

        <div className="space-y-20">
          <CarPricingTableCard car={car} pricing={car.pricing} />
          <CarSpecsTiles car={car} power={power} zeroToHundred={zeroToHundred} />
          <CarIncludedSection />
        </div>
      </div>

      {/* PRAVÝ PANEL */}
      <div className="space-y-10 lg:sticky lg:top-14">
        <div className="relative">
          <div className="relative rounded-[3rem] bg-white/5 backdrop-blur-3xl border border-white/10 overflow-hidden">
            <CarDetailReservationForm
              car={car}
              from={from}
              to={to}
              onChangeFrom={setFrom}
              onChangeTo={setTo}
              onPickupChange={setPickupPrice}
              onReturnChange={setReturnPrice}
              onSecondDriverChange={setHasSecondDriver}
              onPickupTimeChange={setPickupTime}
              onReturnTimeChange={setReturnTime}
              totalPrice={totalPrice}
            />
          </div>
        </div>
        
        {/* PREPOJENIE DÁT DO KALKULAČKY */}
        {/* <CarPricingCalculator 
          pricing={car.pricing} 
          from={from} 
          to={to}
          pickupPrice={pickupPrice}
          returnPrice={returnPrice}
          hasSecondDriver={hasSecondDriver}
          pickupTime={pickupTime}
          returnTime={returnTime}
          onTotalChange={setTotalPrice}
        /> */}

        <CarRentalConditionsCard car={car} />
      </div>
    </section>
  );
}