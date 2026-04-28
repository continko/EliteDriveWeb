"use client";

import { 
  Bluetooth, Car, Lightbulb, Settings2, Snowflake, Speaker, 
  Camera, Wind, Disc, Music, ShieldCheck, Eye, Sun
} from "lucide-react";
import type { Car as CarType } from "@/lib/cars";
import { useLang } from "@/context/LanguageContext";

type CarEquipmentPillsProps = {
  car: CarType;
};

// Rozšírené mapovanie pre lepšiu presnosť
const EQUIPMENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  default: Car,
  brzdy: Disc,
  svetlá: Lightbulb,
  led: Lightbulb,
  harman: Music,
  audio: Speaker,
  odvietrané: Wind,
  vyhrievané: Snowflake,
  klima: Snowflake,
  kamera: Camera,
  parkovacie: Eye,
  bluetooth: Bluetooth,
  nastavenia: Settings2,
  vzduch: Wind,
  podvozok: Settings2,
  bezpečno: ShieldCheck,
  panoráma: Sun,
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
      {/* Nadpis s dekoráciou */}
      <div className="flex items-center gap-4 px-1">
        <div className="h-6 w-1 rounded-full bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.6)]" />
        <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl uppercase italic">
          {lang === 'sk' ? 'Prémiová výbava' : lang === 'en' ? 'Premium Equipment' : 'Premium oprema'}
        </h2>
      </div>

      <div className="flex flex-wrap gap-3">
        {car.equipment.map((item, index) => {
          const lower = item.toLowerCase();
          const iconKey = Object.keys(EQUIPMENT_ICONS).find(k => lower.includes(k)) || "default";
          const Icon = EQUIPMENT_ICONS[iconKey];
          
          return (
            <div
              key={item}
              style={{ animationDelay: `${index * 50}ms` }}
              className="animate-in fade-in zoom-in duration-500 fill-mode-both"
            >
              <span
                className="group relative inline-flex items-center gap-3 rounded-2xl border border-white/5 bg-slate-950/40 px-5 py-3 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 backdrop-blur-md transition-all duration-300 
                hover:border-sky-500/50 hover:bg-sky-500/10 hover:text-white hover:shadow-[0_0_20px_rgba(14,165,233,0.15)] cursor-default"
              >
                {/* Malý glow efekt v pozadí ikony pri hoveri */}
                <div className="absolute inset-0 rounded-2xl bg-sky-500/0 transition-all duration-300 group-hover:bg-sky-500/5" />
                
                <Icon className="relative h-4 w-4 text-sky-500/60 transition-all duration-300 group-hover:scale-110 group-hover:text-sky-400" />
                
                <span className="relative">
                  {getTranslatedItem(item)}
                </span>
              </span>
            </div>
          );
        })}
      </div>

      {/* Abstraktné pozadie pre extra šmrnc */}
      <div className="absolute -right-10 -top-10 h-40 w-40 bg-sky-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 h-40 w-40 bg-indigo-500/5 blur-[100px] pointer-events-none" />
    </section>
  );
}