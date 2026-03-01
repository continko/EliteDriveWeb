import Image from "next/image";
import Link from "next/link";
import { Gauge, Settings2, Zap, Snowflake, ArrowUpRight } from "lucide-react";
import type { Car } from "@/lib/cars";

type CarCardProps = {
  car: Car;
};

export function CarCard({ car }: CarCardProps) {
  // Získame najnižšiu cenu
  const startingPrice = car.pricing?.length 
    ? car.pricing[car.pricing.length - 1].pricePerDay 
    : 0;

  // Pomocná funkcia na vytiahnutie kW
  const powerKw = car.power.split(" ")[0];

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/60 backdrop-blur-xl transition-all duration-500 hover:border-sky-500/50 hover:shadow-[0_0_50px_-12px_rgba(14,165,233,0.3)]">
      
      {/* OBRÁZOK SEKCIA */}
      <div className="relative h-64 w-full p-3">
        <div className="relative h-full w-full overflow-hidden rounded-[2rem]">
          <Image
            src={car.imageUrl}
            alt={`${car.brand} ${car.name}`}
            fill
            priority
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute left-4 top-4 rounded-xl bg-slate-950/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md border border-white/10">
            Model {car.year}
          </div>
        </div>
      </div>

      {/* INFO SEKCIA */}
      <div className="flex flex-1 flex-col gap-6 p-6 pt-2">
        
        {/* Názov a Cena */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-sky-400">{car.brand}</p>
            <h3 className="mt-1 text-2xl font-bold text-white leading-tight tracking-tight">{car.name}</h3>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[12px] font-bold uppercase tracking-widest text-slate-400">od</p>
            <p className="text-xl font-black text-amber-400">
              {startingPrice.toLocaleString("sk-SK")}€
            </p>
            <p className="text-[12px] font-bold uppercase text-slate-400 tracking-tighter">/ DEŇ</p>
          </div>
        </div>

        {/* TECHNICKÉ PARAMETRE - Mierne tmavšie mini-karty pre kontrast */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: Zap, value: `${powerKw} kW` },
            { icon: Gauge, value: car.fuel },
            { icon: Settings2, value: car.transmission },
            { icon: Snowflake, value: car.drive }
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

        {/* AKČNÁ ČASŤ - Výrazné tlačidlo pre lepšiu navigáciu */}
        <div className="mt-auto pt-2">
          <Link
            href={`/cars/${car.id}`}
            className="group/btn relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-sky-500 py-4 text-xs font-bold uppercase tracking-widest text-slate-950 transition-all hover:bg-sky-400 hover:shadow-[0_0_25px_rgba(14,165,233,0.4)] active:scale-[0.98]"
          >
            <span className="relative z-10 text-slate-950">Zobraziť detaily</span>
            <ArrowUpRight className="relative z-10 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}