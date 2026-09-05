"use client";

import Link from "next/link";
import { Gauge, Settings2, Zap, Snowflake, ArrowUpRight, Clock } from "lucide-react";
import type { Car } from "@/lib/cars";
import { useLang } from "@/context/LanguageContext";

type CarCardProps = {
  car: Car;
};

export function CarCard({ car }: CarCardProps) {
  const { t, lang } = useLang();

  // 1. Zistíme, či je auto Coming Soon (ošetríme rôzne zápisy: false, "false", 0, alebo string)
  const rawActive = (car as any).is_active;
  const isComingSoon = rawActive === false || rawActive === "false" || rawActive === 0;

  const startingPrice = car.pricing?.length 
    ? car.pricing[car.pricing.length - 1].pricePerDay 
    : 0;

  const powerKw = car.power ? car.power.split(" ")[0] : "—";

  const translateSpec = (value: string) => {
    if (!value) return "—";

    const specs: Record<string, Record<string, string>> = {
      "Benzín": { en: "Petrol" },
      "Diesel": { en: "Diesel" },
      "Automat": { en: "Automatic" },
      "Manuál": { en: "Manual" },
      "4x4": { en: "AWD" },
      "Zadný": { en: "RWD" }
    };
    
    return specs[value]?.[lang] || value;
  };

  // Vizuálny obsah karty
  const cardContent = (
    <article className={`group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/60 backdrop-blur-xl transition-all duration-500 ${isComingSoon ? "opacity-75 cursor-not-allowed select-none" : "hover:border-sky-500/50 hover:shadow-[0_0_50px_-12px_rgba(14,165,233,0.3)]"}`}>
      
      {/* ⏳ ŠTÍTOK COMING SOON - Zobrazí sa v pravom hornom rohu */}
      {isComingSoon && (
        <div className="absolute top-4 right-4 z-30 bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-xl flex items-center gap-1.5 border border-amber-300 pointer-events-none">
          <Clock size={12} strokeWidth={3} /> Coming Soon
        </div>
      )}

      {/* OBRÁZOK */}
      <div className="relative h-64 w-full p-3">
        <div className="relative h-full w-full overflow-hidden rounded-[2rem]">
          <img
            src={car.imageUrl && car.imageUrl.trim() !== "" ? car.imageUrl : "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000&auto=format&fit=crop"}
            alt={`${car.brand} ${car.name}`}
            className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out ${!isComingSoon ? "group-hover:scale-110" : ""}`}
          />
          <div className="absolute left-4 top-4 rounded-xl bg-slate-950/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md border border-white/10">
            Model {car.year}
          </div>
        </div>
      </div>

      {/* INFO SEKCIA */}
      <div className="flex flex-1 flex-col gap-6 p-6 pt-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-sky-400">{car.brand}</p>
            <h3 className="mt-1 text-2xl font-bold text-white leading-tight tracking-tight">{car.name}</h3>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[12px] font-bold uppercase tracking-widest text-slate-400">{t.car_price_from || "Od"}</p>
            <p className="text-xl font-black text-amber-400">
              {startingPrice.toLocaleString(lang === 'sk' ? "sk-SK" : "en-US")}€
            </p>
            <p className="text-[12px] font-bold uppercase text-slate-400 tracking-tighter">{t.car_per_day || "/ deň"}</p>
          </div>
        </div>

        {/* PARAMETRE */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: Zap, value: powerKw !== "—" ? `${powerKw} kW` : "—" },
            { icon: Gauge, value: translateSpec(car.fuel) },
            { icon: Settings2, value: translateSpec(car.transmission) },
            { icon: Snowflake, value: translateSpec(car.drive) }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-slate-950/40 p-2.5 transition-colors group-hover:bg-sky-500/10"
            >
              <item.icon className="h-3.5 w-3.5 text-sky-400" />
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* TLAČIDLO / AKCIA */}
        <div className="mt-auto pt-2">
          {isComingSoon ? (
            <div className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/5 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 cursor-not-allowed border border-white/5 select-none">
              <span>V príprave</span>
            </div>
          ) : (
            <div className="group/btn relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-sky-500 py-4 text-xs font-bold uppercase tracking-widest text-slate-950 transition-all">
              <span className="relative z-10 text-slate-950">{t.car_btn_details || "Detail vozidla"}</span>
              <ArrowUpRight className="relative z-10 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </div>
          )}
        </div>
      </div>
    </article>
  );

  // 🚫 AK JE COMING SOON: Vrátime iba obyčajný blok, ktorý sa nedá rozkliknúť (žiadny Link, žiadna navigácia)
  if (isComingSoon) {
    return <div className="relative pointer-events-none">{cardContent}</div>;
  }

  // ✅ AK JE AKTÍVNE: Obalíme celú kartu do štandardného odkazu
  return (
    <Link href={`/cars/${car.id}`} className="block">
      {cardContent}
    </Link>
  );
}