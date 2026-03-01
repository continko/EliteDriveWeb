"use client";

import { Fuel, Gauge, Settings2, Users, Zap, Calendar, Shovel } from "lucide-react";
import type { Car } from "@/lib/cars";

type CarSpecsTilesProps = {
  car: Car;
  power: string;
  zeroToHundred: string;
};

const SPEC_ITEMS: Array<{
  key: string;
  label: string;
  icon: any;
  getValue: (car: Car, power?: string) => string;
}> = [
  { key: "power", label: "Výkon", icon: Zap, getValue: (_car, power) => power ?? "" },
  { key: "fuel", label: "Palivo", icon: Fuel, getValue: (car) => car.fuel },
  { key: "transmission", label: "Prevodovka", icon: Settings2, getValue: () => "Automat" },
  { key: "drive", label: "Náhon", icon: Gauge, getValue: (car) => car.drive },
  { key: "seats", label: "Sedadlá", icon: Users, getValue: (car) => `${car.seats} miest` },
  { key: "consumption", label: "Spotreba", icon: Fuel, getValue: (car) => car.consumption },
  { key: "year", label: "Rok výroby", icon: Calendar, getValue: (car) => String(car.year) },
  { key: "tow", label: "Ťažné", icon: Shovel, getValue: (car) => car.tow ? "Áno" : "Nie" }
];

export function CarSpecsTiles({ car, power, zeroToHundred }: CarSpecsTilesProps) {
  return (
    <section className="space-y-8">
      <div className="flex items-center gap-4 px-2">
        <div className="h-8 w-1.5 rounded-full bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.6)]" />
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-400/80 mb-0.5">Technické</p>
          <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">Parametre vozidla</h2>
        </div>
      </div>

      <dl className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {SPEC_ITEMS.map((item) => {
          const Icon = item.icon;
          const value = item.getValue(car, power);
          
          return (
            <div 
              key={item.key} 
              /* ZMENA: bg-slate-900/60 a backdrop-blur-xl pre zjednotenie Glass štýlu */
              className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl transition-all duration-300 hover:border-sky-500/50 hover:bg-slate-900/80 hover:shadow-2xl"
            >
              {/* Jemný vnútorný odlesk */}
              <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-white/5 pointer-events-none" />
              
              <div className="relative flex flex-col gap-5">
                {/* Ikona v tmavšom skle pre lepší kontrast */}
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950/40 text-sky-400 ring-1 ring-white/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-slate-950 group-hover:ring-sky-500">
                  <Icon className="h-5 w-5" />
                </div>
                
                <div>
                  <dt className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-base font-black text-white">
                    {value}
                  </dd>
                  {item.key === "power" && (
                    <dd className="mt-1.5 text-[11px] font-bold text-sky-400">
                      0–100 km/h: <span className="text-white">{zeroToHundred}</span>
                    </dd>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </dl>
    </section>
  );
}