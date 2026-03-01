"use client";

import { Fuel, Gauge, Settings2, Users, Zap, Calendar, Shovel } from "lucide-react";
import type { Car } from "@/lib/cars";
import { useLang } from "@/context/LanguageContext";

type CarSpecsTilesProps = {
  car: Car;
  power: string;
  zeroToHundred: string;
};

export function CarSpecsTiles({ car, power, zeroToHundred }: CarSpecsTilesProps) {
  const { lang } = useLang();

  const SPEC_ITEMS = [
    { 
      key: "power", 
      label: lang === 'sk' ? "Výkon" : lang === 'en' ? "Power" : "Snaga", 
      icon: Zap, 
      getValue: () => power ?? "" 
    },
    { 
      key: "fuel", 
      label: lang === 'sk' ? "Palivo" : lang === 'en' ? "Fuel" : "Gorivo", 
      icon: Fuel, 
      getValue: () => {
        const fuelMap: Record<string, string> = {
          "Benzín": lang === 'en' ? "Petrol" : "Benzin",
          "Diesel": lang === 'en' ? "Diesel" : "Dizel",
          "Hybrid": "Hybrid",
          "Elektro": lang === 'en' ? "Electric" : "Elektro"
        };
        return fuelMap[car.fuel] || car.fuel;
      }
    },
    { 
      key: "transmission", 
      label: lang === 'sk' ? "Prevodovka" : lang === 'en' ? "Transmission" : "Mjenjač", 
      icon: Settings2, 
      getValue: () => lang === 'sk' ? "Automat" : lang === 'en' ? "Automatic" : "Automatik" 
    },
    { 
      key: "drive", 
      label: lang === 'sk' ? "Náhon" : lang === 'en' ? "Drive" : "Pogon", 
      icon: Gauge, 
      getValue: () => car.drive 
    },
    { 
      key: "seats", 
      label: lang === 'sk' ? "Sedadlá" : lang === 'en' ? "Seats" : "Sjedišta", 
      icon: Users, 
      getValue: () => {
        if (lang === 'sk') return `${car.seats} miest`;
        if (lang === 'en') return `${car.seats} seats`;
        return `${car.seats} mjesta`;
      }
    },
    { 
      key: "consumption", 
      label: lang === 'sk' ? "Spotreba" : lang === 'en' ? "Consumption" : "Potrošnja", 
      icon: Fuel, 
      getValue: () => car.consumption 
    },
    { 
      key: "year", 
      label: lang === 'sk' ? "Rok výroby" : lang === 'en' ? "Year" : "Godište", 
      icon: Calendar, 
      getValue: () => String(car.year) 
    },
    { 
      key: "tow", 
      label: lang === 'sk' ? "Ťažné" : lang === 'en' ? "Tow hitch" : "Kuka", 
      icon: Shovel, 
      getValue: () => {
        if (car.tow) return lang === 'sk' ? "Áno" : lang === 'en' ? "Yes" : "Da";
        return lang === 'sk' ? "Nie" : lang === 'en' ? "No" : "Ne";
      }
    }
  ];

  const ui = {
    sk: { tag: "Technické", title: "Parametre vozidla" },
    en: { tag: "Technical", title: "Specifications" },
    bs: { tag: "Tehnički", title: "Specifikacije" }
  }[lang as 'sk' | 'en' | 'bs'];

  return (
    <section className="space-y-8">
      <div className="flex items-center gap-4 px-2">
        <div className="h-8 w-1.5 rounded-full bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.6)]" />
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-400/80 mb-0.5">{ui.tag}</p>
          <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">{ui.title}</h2>
        </div>
      </div>

      <dl className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {SPEC_ITEMS.map((item) => {
          const Icon = item.icon;
          const value = item.getValue();
          
          return (
            <div 
              key={item.key} 
              className="group relative rounded-[2.5rem] p-px overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_-5px_rgba(14,165,233,0.3)]"
              /* Efekt svietiaceho rohu cez inline style pre maximálnu kontrolu */
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 100%)'
              }}
            >
              {/* Vnútorné telo karty */}
              <div className="relative flex h-full flex-col gap-5 rounded-[2.5rem] bg-slate-900/90 p-6 backdrop-blur-xl">
                
                {/* Ikona s vlastným "glow" efektom */}
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950/40 text-sky-400 ring-1 ring-white/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-slate-950 group-hover:ring-sky-500 group-hover:shadow-[0_0_20px_rgba(14,165,233,0.4)]">
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