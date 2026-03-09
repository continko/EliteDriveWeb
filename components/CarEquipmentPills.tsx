"use client";

import { Bluetooth, Car, Lightbulb, Settings2, Snowflake, Speaker, Camera, Wind, Disc, Music } from "lucide-react";
import type { Car as CarType } from "@/lib/cars";
import { useLang } from "@/context/LanguageContext";

type CarEquipmentPillsProps = {
  car: CarType;
};

const EQUIPMENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  default: Car,
  brzdy: Disc,
  svetlá: Lightbulb,
  harman: Music,
  odvietrané: Snowflake,
  kamera: Camera,
  bluetooth: Bluetooth,
  nastavenia: Settings2,
  audio: Speaker,
  vzduch: Wind,
};

export function CarEquipmentPills({ car }: CarEquipmentPillsProps) {
  const { t = {}, lang } = useLang();
  
  if (!car.equipment?.length) return null;

  const getTranslatedItem = (item: string) => {
    const lowerItem = item.toLowerCase();
    
    if (lang === 'sk') return item;

    const translationKeys = Object.keys(t);
    const foundKey = translationKeys.find(key => lowerItem.includes(key.toLowerCase()));

    return foundKey ? (t as Record<string, string>)[foundKey] : item;
  };

  return (
    <section className="relative overflow-hidden space-y-8 rounded-[3rem] border border-white/10 bg-slate-900/60 p-8 backdrop-blur-xl shadow-2xl">
      <div className="flex items-center gap-4 px-1">
        <div className="h-6 w-1 rounded-full bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.6)]" />
        <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">
          {lang === 'sk' ? 'Prémiová výbava' : lang === 'en' ? 'Premium Equipment' : 'Premium oprema'}
        </h2>
      </div>

      <div className="flex flex-wrap gap-3">
        {car.equipment.map((item) => {
          const lower = item.toLowerCase();
          const iconKey = Object.keys(EQUIPMENT_ICONS).find(k => lower.includes(k)) || "default";
          const Icon = EQUIPMENT_ICONS[iconKey];
          
          return (
            <span
              key={item}
              className="group inline-flex items-center gap-3 rounded-2xl border border-white/5 bg-slate-950/40 px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-300 backdrop-blur-md transition-all duration-300 hover:border-sky-500/40 hover:bg-sky-500/10 hover:text-sky-400"
            >
              <Icon className="h-4 w-4 text-sky-400/80 transition-transform group-hover:scale-110 group-hover:text-sky-400" />
              {getTranslatedItem(item)}
            </span>
          );
        })}
      </div>
    </section>
  );
}